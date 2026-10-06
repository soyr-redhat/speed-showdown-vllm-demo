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

  return (
    <div className="flex-shrink-0 bg-surface border border-line border-l-[3px] border-l-proof rounded-lg p-3 flex flex-wrap items-center gap-x-4 gap-y-2">
      <div className="flex items-center gap-2">
        <span className="text-xl">🏆</span>
        <span className="font-display font-bold text-sm">
          <span className="text-proof">{results.winner}</span> wins
        </span>
      </div>

      <div className="flex items-center gap-3 font-mono text-[11px]">
        {ranked.map((row, idx) => {
          const style = RACER_STYLES[row.key]
          return (
            <span key={row.key} className="text-text-3">
              {['🥇', '🥈', '🥉'][idx]} {style.name}{' '}
              <b className={style.color}>{(row.tps || 0).toFixed(1)}</b>
              <span className="hidden md:inline text-dim"> ({fmtTime(row.time)})</span>
            </span>
          )
        })}
      </div>

      <div className="flex items-center gap-2">
        <span className="font-mono font-bold text-xs text-proof bg-proof/10 border border-proof/40 rounded px-2 py-1">
          optimized {results.optimizedSpeedup?.toFixed(2)}x
        </span>
        <span className="font-mono font-bold text-xs text-proof bg-proof/10 border border-proof/40 rounded px-2 py-1">
          quantized {results.quantizedSpeedup?.toFixed(2)}x
        </span>
        <span className="text-[10px] text-dim font-mono hidden lg:inline">vs standard</span>
      </div>

      <button
        onClick={onReset}
        className="ml-auto bg-accent text-white px-4 py-1.5 rounded-md font-display font-bold text-xs hover:bg-accent-deep transition-all"
      >
        Race again
      </button>
    </div>
  )
}

export default Results
