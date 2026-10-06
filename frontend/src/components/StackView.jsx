const STACK = [
  {
    name: 'vLLM',
    role: 'Serve',
    desc: 'High-throughput, memory-efficient inference engine serving all three racers in parallel. PagedAttention manages the KV cache, continuous batching keeps the GPU saturated, and the OpenAI-compatible API makes every deployment a drop-in replacement.',
    points: ['PagedAttention KV cache', 'Continuous batching', 'OpenAI-compatible API', 'Tensor and pipeline parallelism'],
    url: 'https://github.com/vllm-project/vllm',
  },
  {
    name: 'LLM Compressor',
    role: 'Quantize',
    desc: 'Creates the quantized model powering the quantized racer. Compresses trained models into efficient formats like W4A16 and FP8 with the compressed-tensors serialization format natively supported by vLLM.',
    points: ['W4A16 and FP8 quantization', 'compressed-tensors format', 'Accuracy recovery workflows', 'Sweep recipes for model families'],
    url: 'https://github.com/vllm-project/llm-compressor',
  },
  {
    name: 'GUIDELLm',
    role: 'Benchmark',
    desc: 'Measures throughput and latency across the configs at scale. Benchmarks generative AI workloads against vLLM endpoints and produces the numbers that decide which deployment wins.',
    points: ['Throughput and latency sweeps', 'Configurable workloads', 'Statistical analysis', 'vLLM endpoint support'],
    url: 'https://github.com/vllm-project/guidellm',
  },
]

function StackView() {
  return (
    <main className="flex-1 min-h-0 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6 space-y-5">
        <div>
          <div className="font-mono font-bold text-[11px] uppercase tracking-widest text-accent mb-1">The stack</div>
          <h2 className="font-display font-extrabold text-3xl tracking-tight">Three tools, one pipeline</h2>
          <p className="text-text-2 mt-2 max-w-2xl">The open source stack behind this demo — serve a model, quantize it, benchmark it. Click any card for its GitHub repo.</p>
        </div>

        <div className="flex items-stretch gap-3 flex-col md:flex-row">
          {STACK.map((tool, idx) => (
            <div key={tool.name} className="contents md:contents">
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex-1 min-w-0 flex flex-col gap-3 p-5 bg-surface border border-line border-t-[3px] border-t-accent rounded-xl shadow-card text-left no-underline hover:border-accent hover:bg-surface2 transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display font-bold text-xl text-text">{tool.name}</span>
                  <span className="font-mono font-bold text-[10px] uppercase tracking-widest text-accent">{tool.role}</span>
                </div>
                <span className="text-sm text-text-2 leading-relaxed">{tool.desc}</span>
                <ul className="space-y-1.5">
                  {tool.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-xs text-text-2">
                      <span className="text-proof mt-0.5 font-bold flex-shrink-0">✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto pt-1 font-mono text-xs text-dim group-hover:text-accent transition-colors break-all">
                  {tool.url.replace('https://', '')} ↗
                </span>
              </a>
              {idx < STACK.length - 1 && (
                <div className="hidden md:grid place-items-center min-w-8 font-mono font-bold text-accent text-xl select-none">→</div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center font-mono text-[10px] uppercase tracking-widest text-dim pt-2">
          Red Hat AI · Four pillars demo
        </div>
      </div>
    </main>
  )
}

export default StackView
