import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import type { CustomExtension } from '../types/extension'

interface Props {
  extensions: CustomExtension[]
  onAdd: (name: string) => void
  onDelete: (id: string) => void
  isLoading?: boolean
  maxCount?: number
}

export function CustomExtensions({
  extensions,
  onAdd,
  onDelete,
  isLoading,
  maxCount = 200,
}: Props) {
  const [inputValue, setInputValue] = useState('')

  const handleAdd = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    
    // 검증은 부모 컴포넌트(App.tsx)에서 처리
    onAdd(trimmed)
    setInputValue('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  return (
    <div className="space-y-5">
      {/* 입력 영역 */}
      <div className="flex gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="확장자 입력 (예: zip, rar)"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          disabled={isLoading}
        />
        <button
          onClick={handleAdd}
          disabled={isLoading || !inputValue.trim()}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            '추가 중...'
          ) : (
            <>
              <Plus size={18} />
              추가
            </>
          )}
        </button>
      </div>

      {/* 등록된 확장자 섹션 */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700">등록된 확장자</h3>
          <span className="text-2xl font-bold text-purple-600">
            {extensions.length} / {maxCount}
          </span>
        </div>

        {/* 확장자 리스트 (Chip 형태) */}
        {extensions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg">추가된 커스텀 확장자가 없습니다.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {extensions.map(ext => (
              <div
                key={ext.id}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-900 rounded-full font-medium border-2 border-purple-300 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-sm">{ext.name}</span>
                <button
                  onClick={() => onDelete(ext.id)}
                  disabled={isLoading}
                  className="hover:bg-purple-200 rounded-full p-0.5 transition-colors disabled:opacity-50 flex items-center justify-center"
                  aria-label={`${ext.name} 삭제`}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
