import { useState } from 'react'

const SAMPLE_PROMPTS = [
  "What is the capital of France?",
  "Explain quantum computing in one sentence.",
  "Write a Python function to implement binary search.",
  "Write a short story about a robot discovering emotions.",
  "Explain how a transformer architecture works in large language models.",
]

function PromptSelector({ selectedPrompt, setSelectedPrompt, onStart, isRacing }) {
  const [showAllSamples, setShowAllSamples] = useState(false)
  const visiblePrompts = showAllSamples ? SAMPLE_PROMPTS : SAMPLE_PROMPTS.slice(0, 3)

  return (
    <div className="bg-surface rounded-xl border border-line shadow-card p-4">
      <div className="mb-3">
        <div className="font-mono font-bold text-[10px] uppercase tracking-widest text-accent mb-2.5">Quick samples</div>
        <div className="flex flex-wrap gap-2">
          {visiblePrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => setSelectedPrompt(prompt)}
              disabled={isRacing}
              className={`px-3 py-1.5 rounded-md text-left text-xs border transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer max-w-full truncate ${
                selectedPrompt === prompt
                  ? 'bg-accent/15 border-accent text-text'
                  : 'bg-surface2 border-line text-text-2 hover:border-accent hover:text-text'
              }`}
            >
              {prompt}
            </button>
          ))}
          <button
            onClick={() => setShowAllSamples(!showAllSamples)}
            className="px-3 py-1.5 rounded-md text-xs bg-surface2 border border-line text-dim hover:text-text transition-all cursor-pointer"
          >
            {showAllSamples ? 'Show less' : 'More…'}
          </button>
        </div>
      </div>

      <div className="font-mono font-bold text-[10px] uppercase tracking-widest text-accent mb-2.5">Your prompt</div>
      <textarea
        value={selectedPrompt}
        onChange={(e) => setSelectedPrompt(e.target.value)}
        disabled={isRacing}
        className="w-full bg-surface2 text-text px-4 py-3 rounded-md h-28 mb-4 text-sm font-mono border border-line focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent disabled:opacity-50 transition-all resize-none"
        placeholder="Type your prompt here, or pick a sample above…"
      />

      <div className="flex items-center gap-4">
        <button
          onClick={onStart}
          disabled={!selectedPrompt.trim() || isRacing}
          className="flex-1 bg-accent text-white px-6 py-3 rounded-md font-display font-bold text-base hover:bg-accent-deep transition-all disabled:opacity-50 disabled:cursor-wait"
        >
          {isRacing ? 'Racing…' : 'Start race'}
        </button>
        <div className="hidden sm:block text-[11px] text-dim font-mono leading-relaxed">
          Races 3 vLLM configs<br />in parallel on a shared GPU
        </div>
      </div>
    </div>
  )
}

export default PromptSelector
