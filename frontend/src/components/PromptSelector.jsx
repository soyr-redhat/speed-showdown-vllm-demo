import { useState, useEffect, useRef } from 'react'

const SAMPLE_PROMPTS = [
  "What is the capital of France?",
  "Explain quantum computing in one sentence.",
  "Write a Python function to implement binary search.",
  "Write a short story about a robot discovering emotions.",
  "Explain how a transformer architecture works in large language models.",
]

function PromptSelector({ selectedPrompt, setSelectedPrompt, onStart, isRacing }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <div className="flex-shrink-0 bg-surface border border-line rounded-lg p-3 flex flex-col lg:flex-row gap-2.5 lg:items-stretch">
      <div className="relative lg:w-56 flex-shrink-0" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          disabled={isRacing}
          className={`w-full flex items-center justify-between gap-2 bg-surface2 text-xs font-mono px-3 py-2.5 rounded-md border transition-all disabled:opacity-50 cursor-pointer ${
            menuOpen ? 'border-accent text-text' : 'border-line text-text-2 hover:border-accent hover:text-text'
          }`}
        >
          <span className="truncate">{selectedPrompt ? 'Change sample…' : 'Sample prompts…'}</span>
          <span className={`text-dim transition-transform ${menuOpen ? 'rotate-180' : ''}`}>▾</span>
        </button>

        {menuOpen && (
          <div className="menu-in absolute bottom-full left-0 right-0 mb-2 bg-surface border border-line rounded-md shadow-card overflow-hidden z-40">
            {SAMPLE_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                onClick={() => { setSelectedPrompt(prompt); setMenuOpen(false) }}
                className={`w-full text-left text-xs font-mono px-3 py-2.5 transition-colors border-l-2 ${
                  selectedPrompt === prompt
                    ? 'bg-accent/15 border-l-accent text-text'
                    : 'border-l-transparent text-text-2 hover:bg-surface2 hover:text-text'
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>

      <input
        type="text"
        value={selectedPrompt}
        onChange={(e) => setSelectedPrompt(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onStart() } }}
        disabled={isRacing}
        className="flex-1 min-w-0 bg-surface2 text-text px-3.5 py-2.5 rounded-md text-sm font-mono border border-line focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent disabled:opacity-50 transition-all"
        placeholder="Type your prompt, or pick a sample…"
      />

      <button
        onClick={onStart}
        disabled={!selectedPrompt.trim() || isRacing}
        className="lg:w-44 flex-shrink-0 bg-accent text-white px-6 py-2.5 rounded-md font-display font-bold text-sm hover:bg-accent-deep active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-wait disabled:active:scale-100"
      >
        {isRacing ? 'Racing…' : 'Start race'}
      </button>
    </div>
  )
}

export default PromptSelector
