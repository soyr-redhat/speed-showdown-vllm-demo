import { useEffect, useState } from 'react'

function RaceTrack({ standardTokens, optimizedTokens, quantizedTokens, raceState, winner, wins }) {
  const [standardProgress, setStandardProgress] = useState(0)
  const [optimizedProgress, setOptimizedProgress] = useState(0)
  const [quantizedProgress, setQuantizedProgress] = useState(0)

  useEffect(() => {
    // Update progress based on token count (each token = progress increment)
    const maxTokens = 100 // match the max in App.jsx
    setStandardProgress((standardTokens.length / maxTokens) * 100)
    setOptimizedProgress((optimizedTokens.length / maxTokens) * 100)
    setQuantizedProgress((quantizedTokens.length / maxTokens) * 100)
  }, [standardTokens, optimizedTokens, quantizedTokens])

  const getTokensPerSec = (tokens) => {
    if (tokens.length === 0) return 0
    return tokens[tokens.length - 1]?.tokens_per_sec?.toFixed(2) || 0
  }

  const CrownIcon = () => (
    <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 3l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1 2-4z" />
    </svg>
  )

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-redhat-dark-surface rounded-lg p-4">

        {/* Three-way race */}
        <div className="grid grid-cols-3 gap-4">
          {/* Standard Racer - LEFT */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="text-2xl">🐢</div>
                <div>
                  <div className="font-bold text-orange-400 flex items-center gap-2">
                    Standard
                    {winner === 'standard' && <CrownIcon />}
                  </div>
                  <div className="text-xs text-gray-400">
                    {getTokensPerSec(standardTokens)} tok/s | {standardTokens.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative h-10 bg-redhat-dark-elevated rounded-lg overflow-hidden border-2 border-orange-500 mb-2">
              <div
                className="absolute h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-200"
                style={{ width: `${standardProgress}%` }}
              />
            </div>

            {/* Token output */}
            <div className={`bg-redhat-dark-elevated rounded p-3 h-48 overflow-y-auto text-sm font-mono border-2 transition-all ${
              winner === 'standard'
                ? 'border-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50'
                : 'border-transparent'
            }`}>
              {standardTokens.map((token, i) => (
                <span key={i} className="text-orange-300">{token.token}</span>
              ))}
              {standardTokens.length === 0 && (
                <span className="text-gray-500">Waiting...</span>
              )}
            </div>
          </div>

          {/* Optimized Racer - CENTER */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="text-2xl">⚡</div>
                <div>
                  <div className="font-bold text-blue-400 flex items-center gap-2">
                    Optimized
                    {winner === 'optimized' && <CrownIcon />}
                  </div>
                  <div className="text-xs text-gray-400">
                    {getTokensPerSec(optimizedTokens)} tok/s | {optimizedTokens.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative h-10 bg-redhat-dark-elevated rounded-lg overflow-hidden border-2 border-blue-500 mb-2">
              <div
                className="absolute h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-200"
                style={{ width: `${optimizedProgress}%` }}
              />
            </div>

            {/* Token output */}
            <div className={`bg-redhat-dark-elevated rounded p-3 h-48 overflow-y-auto text-sm font-mono border-2 transition-all ${
              winner === 'optimized'
                ? 'border-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50'
                : 'border-transparent'
            }`}>
              {optimizedTokens.map((token, i) => (
                <span key={i} className="text-blue-300">{token.token}</span>
              ))}
              {optimizedTokens.length === 0 && (
                <span className="text-gray-500">Waiting...</span>
              )}
            </div>
          </div>

          {/* Quantized Racer - RIGHT */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="text-2xl">🚀</div>
                <div>
                  <div className="font-bold text-green-400 flex items-center gap-2">
                    Quantized
                    {winner === 'quantized' && <CrownIcon />}
                  </div>
                  <div className="text-xs text-gray-400">
                    {getTokensPerSec(quantizedTokens)} tok/s | {quantizedTokens.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative h-10 bg-redhat-dark-elevated rounded-lg overflow-hidden border-2 border-green-500 mb-2">
              <div
                className="absolute h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-200"
                style={{ width: `${quantizedProgress}%` }}
              />
            </div>

            {/* Token output */}
            <div className={`bg-redhat-dark-elevated rounded p-3 h-48 overflow-y-auto text-sm font-mono border-2 transition-all ${
              winner === 'quantized'
                ? 'border-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50'
                : 'border-transparent'
            }`}>
              {quantizedTokens.map((token, i) => (
                <span key={i} className="text-green-300">{token.token}</span>
              ))}
              {quantizedTokens.length === 0 && (
                <span className="text-gray-500">Waiting...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RaceTrack
