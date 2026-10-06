import { useState, useEffect } from 'react'
import RaceTrack from './components/RaceTrack'
import PromptSelector from './components/PromptSelector'
import Results from './components/Results'
import StackView from './components/StackView'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [view, setView] = useState(() => (window.location.hash === '#/stack' ? 'stack' : 'race'))
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

  const showView = (next) => {
    setView(next)
    window.history.pushState(null, '', next === 'stack' ? '#/stack' : '#/race')
  }

  useEffect(() => {
    const onPop = () => setView(window.location.hash === '#/stack' ? 'stack' : 'race')
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
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

  const navTab = (key, label) => (
    <button
      key={key}
      onClick={() => showView(key)}
      className={`px-4 py-1.5 rounded-md font-display font-bold text-sm transition-all ${
        view === key
          ? 'bg-accent text-white'
          : 'text-text-2 hover:text-text hover:bg-surface2'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="h-screen flex flex-col bg-bg font-text text-text overflow-hidden">
      <header className="flex-shrink-0 z-30 border-b border-line" style={{ background: 'rgba(31, 31, 31, 0.92)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/redhat.svg" alt="Red Hat" className="h-6 w-auto" />
            <span className="text-dim font-light text-lg select-none">|</span>
            <h1 className="font-display font-extrabold text-lg leading-tight tracking-tight">
              Speed <span className="text-accent">Showdown</span>
            </h1>
          </div>

          <nav className="flex items-center gap-1.5">
            {navTab('race', 'Race')}
            {navTab('stack', 'Stack')}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 font-mono text-xs">
              <span className="text-text-3">Standard <b className="text-text-2">{wins.standard}</b></span>
              <span className="text-dim">·</span>
              <span className="text-text-3">Optimized <b className="text-warning">{wins.optimized}</b></span>
              <span className="text-dim">·</span>
              <span className="text-text-3">Quantized <b className="text-proof">{wins.quantized}</b></span>
            </div>
            <div className="flex items-center gap-2 font-mono font-bold text-[10px] uppercase tracking-widest text-text-2 bg-surface2 border border-line rounded-full px-3 py-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`}></span>
              {statusText}
            </div>
          </div>
        </div>
      </header>

      {view === 'race' ? (
        <main className="flex-1 min-h-0 flex flex-col gap-3 p-3 overflow-y-auto lg:overflow-hidden">
          {/* Results banner after a race */}
          {raceState === 'finished' && results && (
            <Results results={results} onReset={reset} />
          )}

          {/* Lanes fill the stage */}
          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-3">
            <RaceTrack
              standardTokens={standardTokens}
              optimizedTokens={optimizedTokens}
              quantizedTokens={quantizedTokens}
              raceState={raceState}
              winner={winner}
              wins={wins}
            />
          </div>

          {/* Compact prompt bar */}
          <PromptSelector
            selectedPrompt={selectedPrompt}
            setSelectedPrompt={setSelectedPrompt}
            onStart={startRace}
            isRacing={raceState === 'racing'}
          />
        </main>
      ) : (
        <StackView />
      )}
    </div>
  )
}

export default App
