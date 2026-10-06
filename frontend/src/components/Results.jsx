const MEDALS = ['🥇', '🥈', '🥉']

const RACER_STYLES = {
  standard: { name: 'Standard', color: 'text-text-2' },
  optimized: { name: 'Optimized', color: 'text-warning' },
  quantized: { name: 'Quantized', color: 'text-proof' },
}

function Results({ results, onReset }) {
  const fmtTime = (t) => (!isFinite(t) ? 'DNF' : `${t.toFixed(3)}s`)

  const ranked = [
    { key: 'standard', tps: results.standardTPS, time: results.standardTime },
    { key: 'optimized', tps: results.optimizedTPS, time: results.optimizedTime },
    { key: 'quantized', tps: results.quantizedTPS, time: results.quantizedTime },
  ]
    .sort((a, b) => (b.tps || 0) - (a.tps || 0))

  const speedups = [
    { label: 'Optimized vs standard', value: results.optimizedSpeedup },
    { label: 'Quantized vs standard', value: results.quantizedSpeedup },
  ].filter((s) => isFinite(s.value) && s.value > 0)

  return (
    <div className="bg-surface rounded-xl border border-line shadow-card relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-accent"></div>

      <div className="p-4 pt-5">
        {/* Winner banner */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🏆</span>
          <div>
            <h2 className="font-display font-bold text-xl leading-tight">
              <span className="text-proof">{results.winner}</span> wins this race
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-widest text-dim mt-1">
              Winner determined by highest tokens per second
            </p>
          </div>
        </div>

        {/* Ranked results */}
        <div className="space-y-2 mb-4">
          {ranked.map((row, idx) => {
            const style = RACER_STYLES[row.key]
            return (
              <div
                key={row.key}
                className={`flex items-center justify-between gap-3 rounded-md px-4 py-3 border-l-[3px] transition-all ${
                  idx === 0
                    ? 'bg-proof/10 border-l-proof border border-line border-l-[3px]'
                    : 'bg-surface2 border border-line border-l-[3px] border-l-dim'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{MEDALS[idx]}</span>
                  <div>
                    <div className={`font-semibold text-sm ${style.color}`}>{style.name}</div>
                    <div className="text-[11px] text-dim font-mono">
                      {fmtTime(row.time)} generation time
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-mono font-bold text-xl ${style.color}`}>
                    {(row.tps || 0).toFixed(1)}
                  </div>
                  <div className="text-[10px] text-dim font-mono">tok/s</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Speedup pills */}
        {speedups.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {speedups.map(({ label, value }) => (
              <div
                key={label}
                className="bg-surface2 border border-line rounded-md px-4 py-2"
              >
                <span className="font-mono font-bold text-proof">{value.toFixed(2)}x</span>
                <span className="text-[11px] text-dim ml-2">{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Why it matters */}
        <div className="bg-surface2 rounded-md p-4 border border-line mb-4">
          <div className="font-mono font-bold text-[10px] uppercase tracking-widest text-accent mb-2.5">Why the quantized config is fast</div>
          <ul className="space-y-1.5 text-xs text-text-2">
            <li className="flex items-start gap-2">
              <span className="text-proof mt-0.5 font-bold">✓</span>
              <span><strong className="text-text">Chunked prefill:</strong> splits long prompts into chunks so generation starts sooner</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-proof mt-0.5 font-bold">✓</span>
              <span><strong className="text-text">Prefix caching:</strong> reuses computed KV cache across shared prompt prefixes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-proof mt-0.5 font-bold">✓</span>
              <span><strong className="text-text">W4A16 weights:</strong> 4-bit weights shrink memory traffic and fit larger batches</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-proof mt-0.5 font-bold">✓</span>
              <span><strong className="text-text">High batch concurrency:</strong> 256 max sequences keeps the GPU saturated</span>
            </li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 bg-accent text-white px-6 py-3 rounded-md font-display font-bold hover:bg-accent-deep transition-all"
          >
            Race again
          </button>
        </div>

        <div className="mt-4 text-center text-xs text-dim">
          Learn more about{' '}
          <a href="https://vllm.ai" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
            vLLM
          </a>{' '}
          and{' '}
          <a href="https://www.redhat.com/en/technologies/cloud-computing/openshift/ai" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
            Red Hat OpenShift AI
          </a>
        </div>
      </div>
    </div>
  )
}

export default Results
