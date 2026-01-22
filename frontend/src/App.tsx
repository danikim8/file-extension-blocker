import { useState, useRef } from 'react'
import { FixedExtensions } from './components/FixedExtensions'
import { CustomExtensions } from './components/CustomExtensions'
import type { TestResult } from './types/extension'
import { Toaster, toast } from 'sonner'
import { useExtensions } from './hooks/useExtensions'
import { normalizeExtension, validateExtension } from './utils/extensionValidator'

function App() {
  // useExtensions 훅에서 상태와 함수 가져오기
  const {
    fixedExtensions,
    customExtensions,
    isLoading,
    isSavingFixed,
    isAddingCustom,
    toggleFixedExtension,
    saveFixedExtensions,
    addCustomExtension,
    deleteCustomExtension,
  } = useExtensions()

  // 로컬 상태
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleToggleFixed = (name: string, _isBlocked: boolean) => {
    toggleFixedExtension(name)
  }

  const handleSaveFixed = async () => {
    await saveFixedExtensions()
  }

  const handleAddCustom = async (name: string) => {
    // 정규화
    const normalized = normalizeExtension(name)
    
    // 검증
    const existingNames = [
      ...fixedExtensions.map(ext => ext.name),
      ...customExtensions.map(ext => ext.name),
    ]
    const error = validateExtension(normalized, existingNames, customExtensions.length)
    
    if (error) {
      toast.error(error)
      return
    }
    
    // 추가
    await addCustomExtension(normalized)
  }

  const handleDeleteCustom = async (id: string) => {
    await deleteCustomExtension(id)
  }

  const processFiles = (files: File[]) => {
    if (!files.length) return

    const blockedList = [
      ...fixedExtensions.filter(ext => ext.isBlocked).map(ext => ext.name.toLowerCase()),
      ...customExtensions.map(ext => ext.name.toLowerCase()),
    ]

    const results: TestResult[] = files.map(file => {
      const fileName = file.name
      const ext = fileName.split('.').pop()?.toLowerCase() || ''
      const isBlocked = ext ? blockedList.includes(ext) : false

      if (isBlocked) {
        toast.error(`${fileName} : 차단된 확장자 (${ext || '확장자 없음'})`, { duration: 2500 })
      } else {
        toast.success(`${fileName} : 업로드 가능`, { duration: 2000 })
      }

      return { fileName, extension: ext, isBlocked }
    })

    setTestResults(results)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    processFiles(files)
    e.target.value = ''
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files ?? [])
    processFiles(files)
  }

  // 로딩 상태 체크
  if (isLoading) {
  return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            파일 확장자 차단 설정
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            위험한 파일 확장자를 차단하여 보안을 강화하세요.
          </p>
        </div>

        {/* Fixed Extensions Section */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            고정 확장자
          </h2>
          <FixedExtensions
            extensions={fixedExtensions}
            onToggle={handleToggleFixed}
            onSave={handleSaveFixed}
            isLoading={isSavingFixed}
          />
        </div>

        {/* Custom Extensions Section */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            커스텀 확장자
          </h2>
          <CustomExtensions
            extensions={customExtensions}
            onAdd={handleAddCustom}
            onDelete={handleDeleteCustom}
            isLoading={isAddingCustom}
            maxCount={200}
          />
        </div>

        {/* File Upload Test Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">🔍 파일 업로드 테스트</h2>
          <p className="text-gray-600 mb-6">
            파일을 선택하면 현재 차단 정책에 따라 업로드 가능 여부를 확인할 수 있습니다.
          </p>

          <div className="space-y-5">
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                isDragging
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <div className="flex flex-col items-center gap-3 text-gray-700">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <div className="text-base font-medium text-purple-700">파일 선택 또는 드롭</div>
                <div className="text-sm text-gray-500">여러 파일을 한번에 선택할 수 있습니다.</div>
              </div>
            </div>

            {testResults.length > 0 && (
              <div className="space-y-3">
                {testResults.map((result, idx) => (
                  <div
                    key={`${result.fileName}-${idx}`}
                    className={`flex items-center justify-between rounded-xl border p-4 ${
                      result.isBlocked
                        ? 'bg-red-50 border-red-300'
                        : 'bg-green-50 border-green-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          result.isBlocked ? 'bg-red-200' : 'bg-green-200'
                        }`}
                      >
                        {result.isBlocked ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{result.fileName}</div>
                        <div className="text-sm text-gray-600">.{result.extension || '확장자 없음'}</div>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        result.isBlocked ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                      }`}
                    >
                      {result.isBlocked ? '차단됨' : '허용'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
