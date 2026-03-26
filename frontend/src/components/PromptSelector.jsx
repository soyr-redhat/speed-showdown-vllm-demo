import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const CATEGORIES = [
  { value: 'short', label: 'Short Answer', icon: '⚡' },
  { value: 'long', label: 'Detailed', icon: '📝' },
  { value: 'code', label: 'Code Generation', icon: '💻' },
  { value: 'creative', label: 'Creative Writing', icon: '✨' },
  { value: 'technical', label: 'Technical Explanation', icon: '🔧' }
]

function PromptSelector({ selectedPrompt, setSelectedPrompt, onStart, isRacing }) {
  const [category, setCategory] = useState('short')
  const [samplePrompts, setSamplePrompts] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/prompts/${category}`)
      .then(res => res.json())
      .then(data => setSamplePrompts(data.prompts))
      .catch(err => console.error('Failed to load prompts:', err))
  }, [category])

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Left: Category Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <div className="grid grid-cols-1 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  disabled={isRacing}
                  className={`p-2 rounded-lg text-left flex items-center gap-2 transition ${
                    category === cat.value
                      ? 'bg-redhat-red text-white'
                      : 'bg-gray-700 hover:bg-gray-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="text-xl">{cat.icon}</div>
                  <div className="text-xs">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Middle: Prompt Input */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Enter Your Prompt</label>
            <textarea
              value={selectedPrompt}
              onChange={(e) => setSelectedPrompt(e.target.value)}
              disabled={isRacing}
              className="w-full bg-gray-900 text-white px-4 py-3 rounded h-40 mb-3 disabled:opacity-50"
              placeholder="Type your prompt here or select a sample below..."
            />

            <button
              onClick={onStart}
              disabled={!selectedPrompt.trim() || isRacing}
              className="w-full bg-redhat-red text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-red-700 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isRacing ? 'Racing... ⏳' : 'Start Race! 🏁'}
            </button>

            {/* Sample Prompts - Compact */}
            {samplePrompts.length > 0 && (
              <div className="mt-3">
                <label className="block text-xs font-medium mb-1 text-gray-400">Quick samples:</label>
                <div className="space-y-1">
                  {samplePrompts.slice(0, 2).map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPrompt(prompt)}
                      disabled={isRacing}
                      className="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition text-xs disabled:opacity-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromptSelector
