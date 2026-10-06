import { useEffect, useState, useRef } from 'react'

const RACERS = {
  standard: {
    name: 'Standard',
    tagline: 'Baseline vLLM',
    icon: '🐢',
    model: 'Mistral-7B-Instruct-v0.3',
    description: 'Baseline vLLM deployment with default configuration',
    barGradient: 'from-line to-text-3',
    accentText: 'text-text-2',
    laneTop: 'border-t-dim',
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
    barGradient: 'from-danger to-warning',
    accentText: 'text-warning',
    laneTop: 'border-t-dim',
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
    barGradient: 'from-warning to-proof',
    accentText: 'text-proof',
    laneTop: 'border-t-proof',
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
  <svg className="w-4 h-4 text-proof flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 3l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1 2-4z" />
  </svg>
)

function Lane({ info, tokens, isWinner, raceState, progress, onInfo }) {
  const feedRef = useRef(null)

  // Auto-scroll the feed to the latest tokens as they stream
  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight
  }, [tokens])

  const getTPS = () => {
    if (tokens.length === 0) return '—'
    return tokens[tokens.length - 1]?.tokens_per_sec?.toFixed(1) ?? '—'
  }

  return (
    <div
      className={`min-h-0 flex flex-col rounded-lg bg-surface border border-line border-t-[3px] p-3 transition-all ${info.laneTop} ${
        isWinner ? 'winner-glow' : ''
      }`}
    >
      {/* Lane header */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg flex-shrink-0">{info.icon}</span>
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span className="font-display font-bold text-sm">{info.name}</span>
            {info.featured && (
              <span className="font-mono font-bold text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-proof/15 text-proof border border-proof/40">
                Red Hat AI
              </span>
            )}
            <button
              onClick={() => onInfo(info.key)}
              className="w-4 h-4 rounded-full bg-surface2 text-text-3 hover:bg-line hover:text-text flex items-center justify-center text-[9px] transition-all border border-line"
              title="Learn more"
            >
              i
            </button>
            {isWinner && <CrownIcon />}
          </div>
        </div>
        <div className={`font-mono font-bold text-base ${info.accentText} flex-shrink-0`}>
          {getTPS()} <span className="text-[9px] text-dim font-normal">tok/s</span>
          <span className="text-dim font-normal"> · {tokens.length} tok</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className={`relative h-5 rounded-md overflow-hidden bg-surface2 border border-line`}>
        <div
          className={`h-full bg-gradient-to-r ${info.barGradient} transition-all duration-300 relative`}
          style={{ width: `${progress}%` }}
        >
          {raceState === 'racing' && <div className="shimmer"></div>}
        </div>
      </div>

      {/* Token feed fills remaining lane height */}
      <div ref={feedRef} className={`flex-1 min-h-0 bg-surface2 rounded-md p-3 overflow-y-auto feed text-sm font-mono leading-relaxed mt-2.5 border transition-all ${
        isWinner ? 'border-proof/60' : 'border-transparent'
      }`}>
        {tokens.map((token, i) => (
          <span key={i} className={`token-in ${info.accentText}`}>{token.token}</span>
        ))}
        {tokens.length === 0 && (
          <span className="text-dim">{raceState === 'racing' ? 'Warming up…' : 'Press Start race to begin'}</span>
        )}
      </div>
    </div>
  )
}

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
          className={`bg-surface rounded-xl max-w-2xl w-full border border-line shadow-card max-h-[85vh] overflow-y-auto feed`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-line sticky top-0 bg-surface">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{info.icon}</div>
                <div>
                  <h3 className="text-2xl font-display font-bold">{info.name}</h3>
                  <p className="text-text-2 text-sm mt-0.5">{info.description}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-text-2 hover:text-text text-2xl leading-none w-8 h-8 flex items-center justify-center rounded hover:bg-surface2 transition-all"
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <div className="font-mono font-bold text-[10px] uppercase tracking-widest text-accent mb-1.5">Model</div>
              <div className="text-sm font-mono bg-surface2 px-3 py-2.5 rounded-lg border border-line break-all">
                {info.model}
              </div>
            </div>

            <div>
              <div className="font-mono font-bold text-[10px] uppercase tracking-widest text-accent mb-3">Features and capabilities</div>
              <div className="space-y-3">
                {info.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="text-proof mt-0.5 flex-shrink-0 font-bold">✓</div>
                    <div>
                      <div className="font-semibold text-sm">{feature.name}</div>
                      <div className="text-sm text-text-2">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface2 rounded-lg p-4 border border-line">
              <div className="font-mono font-bold text-[10px] uppercase tracking-widest text-accent mb-1">Optimization level</div>
              <div className="text-sm">{info.optimizations}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {activeInfo && <InfoModal racer={activeInfo} onClose={() => setActiveInfo(null)} />}

      {Object.entries(RACERS).map(([key, info]) => (
        <Lane
          key={key}
          info={{ ...info, key }}
          tokens={tokenMap[key]}
          isWinner={winner === key}
          raceState={raceState}
          progress={progress[key]}
          onInfo={setActiveInfo}
        />
      ))}
    </>
  )
}

export default RaceTrack
