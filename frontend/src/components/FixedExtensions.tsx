import type { FixedExtension } from '../types/extension'

interface Props {
  extensions: FixedExtension[]
  onToggle: (name: string, isBlocked: boolean) => void
  onSave: () => void
  isLoading?: boolean
}

export function FixedExtensions({ extensions, onToggle, onSave, isLoading }: Props) {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-5">
        {extensions.map(ext => (
          <label 
            key={ext.name} 
            className={`
              flex items-center gap-3 p-4 rounded-lg cursor-pointer border-2 transition-all
              ${ext.isBlocked 
                ? 'bg-purple-50 border-purple-500' 
                : 'bg-white border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <input
              type="checkbox"
              checked={ext.isBlocked}
              onChange={(e) => onToggle(ext.name, e.target.checked)}
              className={`
                transition-all
                ${ext.isBlocked 
                  ? 'border-purple-600' 
                  : 'border-gray-300'
                }
                focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
              `}
            />
            <span className={`text-sm font-medium ${ext.isBlocked ? 'text-purple-900' : 'text-gray-700'}`}>
              {ext.name}
            </span>
          </label>
        ))}
      </div>
      <button
        onClick={onSave}
        disabled={isLoading}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? '저장 중...' : '저장'}
      </button>
    </div>
  )
}
