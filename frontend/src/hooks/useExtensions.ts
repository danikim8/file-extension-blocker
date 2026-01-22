import { useState, useEffect } from 'react'
import type { FixedExtension, CustomExtension } from '@/types/extension'
import api from '@/services/api'
import { FIXED_EXTENSIONS } from '@/constants/extensions'
import { getUserId } from '@/utils/user'
import { toast } from 'sonner'

export function useExtensions() {
  // 상태 관리
  const [fixedExtensions, setFixedExtensions] = useState<FixedExtension[]>([])
  const [customExtensions, setCustomExtensions] = useState<CustomExtension[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSavingFixed, setIsSavingFixed] = useState(false)
  const [isAddingCustom, setIsAddingCustom] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // 고정 확장자 로드
  const loadFixedExtensions = async (userId: string) => {
    try {
      const response = await api.get('/extensions/fixed', {
        params: { userId },
      })

      const savedStates: { name: string; isBlocked: boolean }[] =
        response.data?.data ?? []

      const combined: FixedExtension[] = FIXED_EXTENSIONS.map((name) => {
        const saved = savedStates.find((s) => s.name === name)
        return {
          name,
          isBlocked: saved?.isBlocked ?? false,
        }
      })

      setFixedExtensions(combined)
    } catch {
      toast.error('고정 확장자 로드 실패')
      
      // API 실패 시에도 FIXED_EXTENSIONS를 기본값으로 사용
      const defaultExtensions: FixedExtension[] = FIXED_EXTENSIONS.map((name) => ({
        name,
        isBlocked: false,
      }))
      setFixedExtensions(defaultExtensions)
    }
  }

  // 커스텀 확장자 로드
  const loadCustomExtensions = async (userId: string) => {
    try {
      const response = await api.get('/extensions/custom', {
        params: { userId },
      })

      const list: CustomExtension[] = response.data?.data ?? []
      setCustomExtensions(list)
    } catch {
      toast.error('커스텀 확장자 로드 실패')
    }
  }

  // 전체 확장자 로드
  const loadExtensions = async () => {
    setIsLoading(true)
    const userId = getUserId()

    try {
      await Promise.all([loadFixedExtensions(userId), loadCustomExtensions(userId)])
    } catch {
      // 개별 로드 함수에서 이미 토스트를 띄우므로 여기서는 아무것도 하지 않음
    } finally {
      setIsLoading(false)
    }
  }

  // 고정 확장자 토글
  const toggleFixedExtension = (name: string) => {
    setFixedExtensions(prev =>
      prev.map(ext =>
        ext.name === name ? { ...ext, isBlocked: !ext.isBlocked } : ext
      )
    )
    setHasUnsavedChanges(true)
  }

  // 고정 확장자 저장
  const saveFixedExtensions = async () => {
    const userId = getUserId()

    setIsSavingFixed(true)
    try {
      await api.put('/extensions/fixed', {
        userId,
        extensions: fixedExtensions,
      })

      toast.success('고정 확장자 설정이 저장되었습니다.')
      setHasUnsavedChanges(false)
    } catch {
      toast.error('고정 확장자 저장에 실패했습니다.')
    } finally {
      setIsSavingFixed(false)
    }
  }

  // 커스텀 확장자 추가
  const addCustomExtension = async (name: string) => {
    const userId = getUserId()

    setIsAddingCustom(true)
    try {
      const response = await api.post('/extensions/custom', {
        userId,
        name,
      })

      const created: CustomExtension = response.data?.data ?? response.data

      setCustomExtensions(prev => [...prev, created])
      toast.success(`확장자 "${name}"이(가) 추가되었습니다.`)
    } catch {
      toast.error('커스텀 확장자 추가에 실패했습니다.')
    } finally {
      setIsAddingCustom(false)
    }
  }

  // 커스텀 확장자 삭제
  const deleteCustomExtension = async (id: string) => {
    const userId = getUserId()
    const extension = customExtensions.find(ext => ext.id === id)
    const extensionName = extension?.name || ''

    try {
      await api.delete(`/extensions/custom/${id}`, {
        params: { userId },
      })

      setCustomExtensions(prev => prev.filter(ext => ext.id !== id))
      toast.success(`확장자 "${extensionName}"이(가) 삭제되었습니다.`)
    } catch {
      toast.error('커스텀 확장자 삭제에 실패했습니다.')
    }
  }

  // 마운트 시 확장자 목록 로드
  useEffect(() => {
    loadExtensions()
  }, [])

  return {
    fixedExtensions,
    customExtensions,
    isLoading,
    isSavingFixed,
    isAddingCustom,
    hasUnsavedChanges,
    toggleFixedExtension,
    saveFixedExtensions,
    addCustomExtension,
    deleteCustomExtension,
    reload: loadExtensions,
  }
}
