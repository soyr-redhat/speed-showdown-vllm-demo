import { useState } from 'react'

const SAMPLE_PROMPTS = [
  "What is the capital of France?",
  "Explain quantum computing in one sentence.",
  "Write a Python function to implement binary search.",
  "Write a short story about a robot discovering emotions.",
  "Explain how a transformer architecture works in large language models.",
]

function PromptSelector({ selectedPrompt, setSelectedPrompt, onStart, isRacing }) {
  return (
    <div className="flex-shrink-0 bg-surface border border-line rounded-lg p-3 flex flex-col lg:flex-row gap-2.5 lg:items-stretch">
      <select
        value=""
        onChange={(e) => { if (e.target.value) setSelectedPrompt(e.target.value) }}
        disabled={isRacing}
        className="lg:w-56 flex-shrink-0 bg-surface2 text-text-2 text-xs font-mono px-3 py-2.5 rounded-md border border-line focus:outline-none focus:border-accent disabled:opacity-50 transition-all cursor-pointer"
      >
        <option value="">Sample prompts…</option>
        {SAMPLE_PROMPTS.map((prompt, index) => (
          <option key={index} value={prompt}>{prompt}</option>
        ))}
      </select>

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
        className="lg:w-44 flex-shrink-0 bg-accent text-white px-6 py-2.5 rounded-md font-display font-bold text-sm hover:bg-accent-deep transition-all disabled:opacity-50 disabled:cursor-wait"
      >
        {isRacing ? 'Racing…' : 'Start race'}
      </button>
    </div>
  )
}

export default PromptSelector
