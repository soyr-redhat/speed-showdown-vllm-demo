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
    <div className="bg-rh-surface rounded-xl border border-white/5 p-4">
      <div className="mb-3">
        <label className="block text-sm font-semibold mb-2.5">Quick samples</label>
        <div className="flex flex-wrap gap-2">
          {visiblePrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => setSelectedPrompt(prompt)}
              disabled={isRacing}
              className={`px-3 py-1.5 rounded-lg text-left text-xs border transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer max-w-full truncate ${
                selectedPrompt === prompt
                  ? 'bg-purple-50/20 border-purple-40 text-rh-text-primary'
                  : 'bg-rh-elevated border-white/10 text-rh-text-secondary hover:border-purple-40/60 hover:text-rh-text-primary'
              }`}
            >
              {prompt}
            </button>
          ))}
          <button
            onClick={() => setShowAllSamples(!showAllSamples)}
            className="px-3 py-1.5 rounded-lg text-xs bg-rh-elevated border border-white/10 text-rh-text-tertiary hover:text-rh-text-primary transition-all cursor-pointer"
          >
            {showAllSamples ? 'Show less' : 'More…'}
          </button>
        </div>
      </div>

      <label className="block text-sm font-semibold mb-2.5">Your prompt</label>
      <textarea
        value={selectedPrompt}
        onChange={(e) => setSelectedPrompt(e.target.value)}
        disabled={isRacing}
        className="w-full bg-rh-deep text-rh-text-primary px-4 py-3 rounded-lg h-28 mb-4 text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-50/50 focus:border-purple-50 disabled:opacity-50 transition-all resize-none font-mono"
        placeholder="Type your prompt here, or pick a sample above…"
      />

      <div className="flex items-center gap-4">
        <button
          onClick={onStart}
          disabled={!selectedPrompt.trim() || isRacing}
          className="flex-1 bg-rh-red text-white px-6 py-3 rounded-lg font-display font-bold text-base hover:bg-rh-red-hover transition-all disabled:bg-rh-elevated disabled:text-rh-text-tertiary disabled:cursor-not-allowed"
        >
          {isRacing ? 'Racing…' : 'Start race'}
        </button>
        <div className="hidden sm:block text-[11px] text-rh-text-tertiary font-mono leading-tight">
          Races 3 vLLM configs<br />in parallel on a shared GPU
        </div>
      </div>
    </div>
  )
}

export default PromptSelector
