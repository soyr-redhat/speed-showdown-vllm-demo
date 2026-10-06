import { useState, useEffect } from 'react'
import RaceTrack from './components/RaceTrack'
import PromptSelector from './components/PromptSelector'
import Results from './components/Results'
import ThemeToggle from './components/ThemeToggle'

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
    ? 'bg-purple-40 dot-pulse'
    : raceState === 'finished'
      ? 'bg-yellow-400'
      : 'bg-gray-50'
  const statusText = raceState === 'racing'
    ? 'Racing'
    : raceState === 'finished'
      ? 'Race complete'
      : 'Ready to race'

  return (
    <div className="min-h-screen bg-rh-bg text-rh-text-primary">
      <div className="grid-background"></div>

      <header className="sticky top-0 z-30 bg-rh-surface/95 backdrop-blur border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rh-red flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 10-2 0v1.5a1 1 0 102 0V3zM4.4 5.6a1 1 0 011.4 0l1.1 1.1a1 1 0 11-1.4 1.4L4.4 7a1 1 0 010-1.4zM15.6 5.6a1 1 0 010 1.4l-1.1 1.1a1 1 0 11-1.4-1.4l1.1-1.1a1 1 0 011.4 0zM10 7a2 2 0 100 4 2 2 0 000-4zM3 10a1 1 0 011-1h1.5a1 1 0 110 2H4a1 1 0 01-1-1zm11.5-1a1 1 0 110 2H16a1 1 0 110-2h-1.5zM10 13a1 1 0 011 1v1.5a1 1 0 11-2 0V14a1 1 0 011-1z" />
              </svg>
            </div>
            <div>
              <h1 className="font-display font-extrabold text-xl leading-tight">
                <span className="text-rh-red">Speed</span> Showdown
              </h1>
              <p className="text-[11px] text-rh-text-tertiary font-mono">vLLM inference performance demo</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-rh-text-secondary bg-rh-elevated border border-white/5 rounded-full px-3 py-1.5">
              <span className={`w-2 h-2 rounded-full ${statusDot}`}></span>
              {statusText}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-5 relative z-10 space-y-4">
        {/* Global win stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'standard', label: 'Standard wins', color: 'text-gray-30' },
            { key: 'optimized', label: 'Optimized wins', color: 'text-purple-30' },
            { key: 'quantized', label: 'Quantized wins', color: 'text-purple-40' },
          ].map(({ key, label, color }) => (
            <div key={key} className="bg-rh-surface rounded-xl border border-white/5 p-4">
              <div className="text-[11px] font-semibold text-rh-text-tertiary mb-1">{label}</div>
              <div className={`font-display font-extrabold text-3xl ${color}`}>{wins[key]}</div>
              <div className="text-[11px] text-rh-text-tertiary mt-1">global all-time count</div>
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

        {/* Prompt input */}
        <PromptSelector
          selectedPrompt={selectedPrompt}
          setSelectedPrompt={setSelectedPrompt}
          onStart={startRace}
          isRacing={raceState === 'racing'}
        />
      </main>

      <footer className="border-t border-white/5 mt-6 py-4 relative z-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-rh-text-tertiary font-mono">
          <p>Built with open source technologies</p>
          <p>Red Hat AI · Four pillars demo</p>
        </div>
      </footer>
    </div>
  )
}

export default App
