import { useEffect, useState } from 'react'

const RACERS = {
  standard: {
    name: 'Standard',
    tagline: 'Baseline vLLM',
    icon: '🐢',
    model: 'Mistral-7B-Instruct-v0.3',
    description: 'Baseline vLLM deployment with default configuration',
    barGradient: 'from-gray-60 to-gray-40',
    accentText: 'text-gray-30',
    trackBorder: 'border-gray-50/30',
    features: [
      { name: 'PagedAttention', desc: 'Efficient KV cache memory management' },
      { name: 'Continuous batching', desc: 'Process multiple requests without waiting' },
      { name: 'Eager execution', desc: 'Runs without CUDA graph compilation' },
      { name: 'Standard GPU utilization', desc: '90% GPU memory utilization' },
      { name: 'OpenAI-compatible API', desc: 'Drop-in replacement for OpenAI endpoints' },
    ],
    optimizations: 'Basic vLLM features without advanced optimizations',
  },
  optimized: {
    name: 'Optimized',
    tagline: 'CUDA graphs + tuning',
    icon: '⚡',
    model: 'Mistral-7B-Instruct-v0.3',
    description: 'Enhanced vLLM with CUDA graphs and performance tuning',
    barGradient: 'from-purple-60 to-purple-40',
    accentText: 'text-purple-30',
    trackBorder: 'border-purple-50/40',
    features: [
      { name: 'CUDA graphs', desc: 'Pre-compiled execution graphs for 1.3-2x faster inference' },
      { name: 'Maximum GPU utilization', desc: '98% GPU memory utilization for peak performance' },
      { name: 'Reduced logging overhead', desc: 'Disabled request logging to minimize latency' },
      { name: 'Optimized block size', desc: 'Smaller 16-token blocks for faster memory access' },
      { name: 'Tuned sequence handling', desc: '128 max sequences for optimal batching' },
      { name: 'Same model quality', desc: 'Identical model to Standard, just faster execution' },
    ],
    optimizations: 'CUDA graph optimization + latency tuning for faster inference',
  },
  quantized: {
    name: 'Quantized',
    tagline: 'W4A16 quantization',
    icon: '🚀',
    model: 'RedHatAI/Mistral-7B-Instruct-v0.3-quantized.w4a16',
    description: 'Optimized vLLM with W4A16 quantization for efficiency',
    barGradient: 'from-purple-50 to-purple-30',
    accentText: 'text-purple-40',
    trackBorder: 'border-purple-40/50',
    featured: true,
    features: [
      { name: 'W4A16 quantization', desc: '4-bit weights, 16-bit activations for 4x memory efficiency' },
      { name: 'All core optimizations', desc: 'Chunked prefill, prefix caching, increased batching' },
      { name: 'Maintained accuracy', desc: 'W4A16 preserves model quality vs FP16' },
      { name: 'Maximum efficiency', desc: 'Best tokens/sec per watt and per GB of memory' },
      { name: 'Smaller memory footprint', desc: 'Fit larger batches in same GPU memory' },
      { name: 'Red Hat AI optimized', desc: 'Professionally quantized by the Red Hat AI team' },
    ],
    optimizations: 'Advanced vLLM configuration with W4A16 quantization for maximum efficiency',
  },
}

const CrownIcon = () => (
  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 3l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1 2-4z" />
  </svg>
)

function RaceTrack({ standardTokens, optimizedTokens, quantizedTokens, raceState, winner }) {
  const [activeInfo, setActiveInfo] = useState(null)
  const [progress, setProgress] = useState({ standard: 0, optimized: 0, quantized: 0 })

  const tokenMap = { standard: standardTokens, optimized: optimizedTokens, quantized: quantizedTokens }

  useEffect(() => {
    // Progress based on TPS (speed) — the fastest racer is at 100%,
    // slower racers trail behind proportionally
    const getTPSValue = (tokens) =>
      tokens.length > 0 ? (tokens[tokens.length - 1]?.tokens_per_sec || 0) : 0

    const maxTPS = Math.max(
      getTPSValue(standardTokens),
      getTPSValue(optimizedTokens),
      getTPSValue(quantizedTokens),
      0.1
    )

    setProgress({
      standard: (getTPSValue(standardTokens) / maxTPS) * 100,
      optimized: (getTPSValue(optimizedTokens) / maxTPS) * 100,
      quantized: (getTPSValue(quantizedTokens) / maxTPS) * 100,
    })
  }, [standardTokens, optimizedTokens, quantizedTokens])

  useEffect(() => {
    if (activeInfo) {
      const onKey = (e) => { if (e.key === 'Escape') setActiveInfo(null) }
      window.addEventListener('keydown', onKey)
      return () => window.removeEventListener('keydown', onKey)
    }
  }, [activeInfo])

  const getTPS = (tokens) => {
    if (tokens.length === 0) return '—'
    return tokens[tokens.length - 1]?.tokens_per_sec?.toFixed(1) ?? '—'
  }

  const InfoModal = ({ racer, onClose }) => {
    const info = RACERS[racer]
    if (!info) return null

    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div
          className={`bg-rh-surface rounded-xl max-w-2xl w-full border ${info.trackBorder} shadow-2xl max-h-[85vh] overflow-y-auto feed`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-white/5 sticky top-0 bg-rh-surface">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{info.icon}</div>
                <div>
                  <h3 className="text-2xl font-display font-bold">{info.name}</h3>
                  <p className="text-rh-text-secondary text-sm mt-0.5">{info.description}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-rh-text-secondary hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center rounded hover:bg-rh-elevated transition-all"
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <div className="text-xs text-rh-text-tertiary font-mono mb-1.5">Model</div>
              <div className="text-sm font-mono bg-rh-elevated px-3 py-2.5 rounded-lg border border-white/5 break-all">
                {info.model}
              </div>
            </div>

            <div>
              <div className="text-xs text-rh-text-tertiary font-mono mb-3">Features and capabilities</div>
              <div className="space-y-3">
                {info.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className={`text-purple-40 mt-0.5 flex-shrink-0 font-bold`}>✓</div>
                    <div>
                      <div className="font-semibold text-sm">{feature.name}</div>
                      <div className="text-sm text-rh-text-secondary">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-rh-elevated rounded-lg p-4 border border-white/5">
              <div className="text-xs text-rh-text-tertiary font-mono mb-1">Optimization level</div>
              <div className="text-sm">{info.optimizations}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-rh-surface rounded-xl border border-white/5 relative overflow-hidden">
      {/* Red brand accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-rh-red"></div>

      {activeInfo && <InfoModal racer={activeInfo} onClose={() => setActiveInfo(null)} />}

      <div className="p-4 pt-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg">Live race</h2>
          <div className="flex items-center gap-2 font-mono text-[11px] text-rh-text-tertiary">
            <span className={`w-1.5 h-1.5 rounded-full ${
              raceState === 'racing' ? 'bg-purple-40 dot-pulse' : raceState === 'finished' ? 'bg-yellow-400' : 'bg-gray-50'
            }`}></span>
            {raceState === 'racing' ? 'Streaming tokens' : raceState === 'finished' ? 'Finished' : 'Idle'}
          </div>
        </div>

        <div className="space-y-3">
          {Object.entries(RACERS).map(([key, info]) => {
            const tokens = tokenMap[key]
            const isWinner = winner === key

            return (
              <div
                key={key}
                className={`rounded-xl bg-rh-elevated border p-4 transition-all ${
                  isWinner ? 'border-yellow-400/60 winner-glow' : 'border-white/5'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl flex-shrink-0">{info.icon}</span>
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <span className="font-display font-bold text-[15px]">{info.name}</span>
                      {info.featured && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-50/30 text-purple-30 border border-purple-40/40">
                          Red Hat AI
                        </span>
                      )}
                      <span className="text-[11px] text-rh-text-tertiary font-mono hidden sm:inline">{info.tagline}</span>
                      <button
                        onClick={() => setActiveInfo(key)}
                        className="w-5 h-5 rounded-full bg-rh-deep text-rh-text-tertiary hover:bg-rh-surface hover:text-white flex items-center justify-center text-[10px] transition-all border border-white/10"
                        title="Learn more"
                      >
                        i
                      </button>
                      {isWinner && <CrownIcon />}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`font-mono font-bold text-lg ${info.accentText}`}>
                      {getTPS(tokens)} <span className="text-[10px] text-rh-text-tertiary font-normal">tok/s</span>
                    </div>
                    <div className="text-[11px] text-rh-text-tertiary font-mono">{tokens.length} tokens</div>
                  </div>
                </div>

                {/* Progress bar with data labels */}
                <div className={`relative h-7 rounded-lg overflow-hidden bg-rh-deep border ${info.trackBorder}`}>
                  <div
                    className={`h-full bg-gradient-to-r ${info.barGradient} transition-all duration-300 relative`}
                    style={{ width: `${progress[key]}%` }}
                  >
                    {raceState === 'racing' && <div className="shimmer"></div>}
                  </div>
                </div>

                {/* Token feed */}
                <div className={`bg-rh-deep rounded-lg p-3 h-24 overflow-y-auto feed text-xs font-mono mt-3 border transition-all ${
                  isWinner ? 'border-yellow-400/60' : 'border-transparent'
                }`}>
                  {tokens.map((token, i) => (
                    <span key={i} className={info.accentText}>{token.token}</span>
                  ))}
                  {tokens.length === 0 && (
                    <span className="text-rh-text-tertiary">Waiting for tokens…</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default RaceTrack
