const STACK = [
  {
    name: 'vLLM',
    role: 'Serve',
    desc: 'High-throughput, memory-efficient inference engine serving all three racers in parallel',
    url: 'https://github.com/vllm-project/vllm',
  },
  {
    name: 'LLM Compressor',
    role: 'Quantize',
    desc: 'Creates the W4A16 quantized model powering the quantized racer',
    url: 'https://github.com/vllm-project/llm-compressor',
  },
  {
    name: 'GUIDELLm',
    role: 'Benchmark',
    desc: 'Measures throughput and latency across the configs at scale',
    url: 'https://github.com/vllm-project/guidellm',
  },
]

const FlowArrow = () => (
  <div className="hidden md:grid place-items-center min-w-8 font-mono font-bold text-accent text-lg select-none">→</div>
)

function StackPanel() {
  return (
    <div className="bg-surface rounded-xl border border-line shadow-card relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-accent"></div>
      <div className="p-4 pt-5">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display font-bold text-lg">The stack</h2>
          <span className="font-mono text-[11px] text-dim">open source, end to end</span>
        </div>

        <div className="flex items-stretch gap-2 flex-col md:flex-row">
          {STACK.map((tool, idx) => (
            <div key={tool.name} className="contents md:contents">
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex-1 min-w-0 flex flex-col gap-1.5 p-4 bg-surface border border-line border-t-[3px] border-t-accent rounded-lg text-left no-underline hover:border-accent hover:bg-surface2 transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display font-bold text-base text-text">{tool.name}</span>
                  <span className="font-mono font-bold text-[10px] uppercase tracking-widest text-accent">{tool.role}</span>
                </div>
                <span className="text-xs text-text-2 leading-relaxed">{tool.desc}</span>
                <span className="mt-auto pt-1 font-mono text-[10px] text-dim group-hover:text-accent transition-colors break-all">
                  {tool.url.replace('https://', '')} ↗
                </span>
              </a>
              {idx < STACK.length - 1 && <FlowArrow />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StackPanel
