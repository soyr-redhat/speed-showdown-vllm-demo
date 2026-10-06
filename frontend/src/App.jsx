import { useState, useEffect } from 'react'
import RaceTrack from './components/RaceTrack'
import PromptSelector from './components/PromptSelector'
import Results from './components/Results'
import StackPanel from './components/StackPanel'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [raceState, setRaceState] = useState('idle') // idle, racing, finished
  const [selectedPrompt, setSelectedPrompt] = useState('')
  const [standardTokens, setStandardTokens] = useState([])
  const [optimizedTokens, setOptimizedTokens] = useState([])
  const [quantizedTokens, setQuantizedTokens] = useState([])
  const [results, setResults] = useState(null)
  const [winner, setWinner] = useState(null)
  const [wins, setWins] = useState({ standard: 0, optimized: 0, quantized: 0 })

  // Load global wins on mount and poll for updates
  useEffect(() => {
    const loadWins = async () => {
      try {
        const response = await fetch(`${API_URL}/wins`)
        const data = await response.json()
        setWins(data)
      } catch (error) {
        console.error('Failed to load wins:', error)
      }
    }

    loadWins()
    // Poll for updates every 5 seconds
    const interval = setInterval(loadWins, 5000)
    return () => clearInterval(interval)
  }, [])

  const startRace = () => {
    if (!selectedPrompt.trim()) {
      alert('Please enter or select a prompt')
      return
    }

    setRaceState('racing')
    setStandardTokens([])
    setOptimizedTokens([])
    setQuantizedTokens([])
    setResults(null)
    setWinner(null)

    // Convert http/https to ws/wss for WebSocket
    const wsUrl = API_URL.replace('https://', 'wss://').replace('http://', 'ws://')
    const ws = new WebSocket(`${wsUrl}/ws/race`)

    ws.onopen = () => {
      ws.send(JSON.stringify({
        prompt: selectedPrompt,
        category: 'short',
        max_tokens: 100
      }))
    }

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)

      if (message.type === 'token') {
        const token = message.data
        if (token.racer === 'standard') {
          setStandardTokens(prev => [...prev, token])
        } else if (token.racer === 'optimized') {
          setOptimizedTokens(prev => [...prev, token])
        } else {
          setQuantizedTokens(prev => [...prev, token])
        }
      } else if (message.type === 'race_complete') {
        setRaceState('finished')
        ws.close()

        // Use a small delay to ensure state updates have completed
        setTimeout(() => {
          setStandardTokens(stdTokens => {
            setOptimizedTokens(optTokens => {
              setQuantizedTokens(qTokens => {
                // Calculate results using current state
                const standardTime = stdTokens.length > 0 ?
                  stdTokens[stdTokens.length - 1].timestamp - stdTokens[0].timestamp : Infinity
                const optimizedTime = optTokens.length > 0 ?
                  optTokens[optTokens.length - 1].timestamp - optTokens[0].timestamp : Infinity
                const quantizedTime = qTokens.length > 0 ?
                  qTokens[qTokens.length - 1].timestamp - qTokens[0].timestamp : Infinity

                // Get tokens per second for each racer
                const standardTPS = stdTokens[stdTokens.length - 1]?.tokens_per_sec || 0
                const optimizedTPS = optTokens[optTokens.length - 1]?.tokens_per_sec || 0
                const quantizedTPS = qTokens[qTokens.length - 1]?.tokens_per_sec || 0

                // Find the winner (highest tokens per second)
                const tpsScores = { standard: standardTPS, optimized: optimizedTPS, quantized: quantizedTPS }
                const raceWinner = Object.keys(tpsScores).reduce((a, b) => tpsScores[a] > tpsScores[b] ? a : b)
                setWinner(raceWinner)

                // Update win counts on backend (persistent across all users)
                fetch(`${API_URL}/wins/${raceWinner}`, { method: 'POST' })
                  .then(response => response.json())
                  .then(updatedWins => setWins(updatedWins))
                  .catch(error => console.error('Failed to update wins:', error))

                setResults({
                  winner: raceWinner.charAt(0).toUpperCase() + raceWinner.slice(1),
                  standardTime,
                  optimizedTime,
                  quantizedTime,
                  optimizedSpeedup: standardTime / optimizedTime || 1,
                  quantizedSpeedup: standardTime / quantizedTime || 1,
                  standardTPS,
                  optimizedTPS,
                  quantizedTPS
                })

                return qTokens
              })
              return optTokens
            })
            return stdTokens
          })
        }, 100)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setRaceState('idle')
      alert('Connection error. Check console for details.')
    }

    ws.onclose = () => {
      console.log('WebSocket closed')
    }
  }

  const reset = () => {
    setRaceState('idle')
    setStandardTokens([])
    setOptimizedTokens([])
    setQuantizedTokens([])
    setResults(null)
    setWinner(null)
  }

  const statusDot = raceState === 'racing'
    ? 'bg-accent dot-pulse'
    : raceState === 'finished'
      ? 'bg-proof'
      : 'bg-dim'
  const statusText = raceState === 'racing'
    ? 'Live'
    : raceState === 'finished'
      ? 'Complete'
      : 'Idle'

  return (
    <div className="min-h-screen bg-bg font-text text-text">
      <div className="accent-glow"></div>

      <header className="sticky top-0 z-30 border-b border-line" style={{ background: 'rgba(31, 31, 31, 0.92)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/redhat.svg" alt="Red Hat" className="h-6 w-auto" />
            <span className="text-dim font-light text-lg select-none">|</span>
            <div>
              <h1 className="font-display font-extrabold text-lg leading-tight tracking-tight">
                Speed <span className="text-accent">Showdown</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono font-bold text-[10px] uppercase tracking-widest text-text-2 bg-surface2 border border-line rounded-full px-3 py-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`}></span>
            {statusText}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-5 relative z-10 space-y-4">
        {/* Global win stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'standard', label: 'Standard wins' },
            { key: 'optimized', label: 'Optimized wins' },
            { key: 'quantized', label: 'Quantized wins' },
          ].map(({ key, label }) => (
            <div key={key} className="bg-surface border border-line rounded-lg p-4 shadow-card">
              <div className="font-mono font-bold text-[10px] uppercase tracking-widest text-text-3 mb-1.5">{label}</div>
              <div className="font-mono font-bold text-3xl text-text">{wins[key]}</div>
            </div>
          ))}
        </div>

        {/* Race track */}
        <RaceTrack
          standardTokens={standardTokens}
          optimizedTokens={optimizedTokens}
          quantizedTokens={quantizedTokens}
          raceState={raceState}
          winner={winner}
          wins={wins}
        />

        {/* Results panel after a race */}
        {raceState === 'finished' && results && (
          <Results results={results} onReset={reset} />
        )}

        {/* Tooling stack */}
        <StackPanel />

        {/* Prompt input */}
        <PromptSelector
          selectedPrompt={selectedPrompt}
          setSelectedPrompt={setSelectedPrompt}
          onStart={startRace}
          isRacing={raceState === 'racing'}
        />
      </main>

      <footer className="border-t border-line mt-6 py-4 relative z-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-widest text-dim">
          <p>Red Hat AI · Four pillars demo</p>
          <p>vLLM · LLM Compressor · GUIDELLm</p>
        </div>
      </footer>
    </div>
  )
}

export default App
