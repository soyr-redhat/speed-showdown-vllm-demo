import { useState, useEffect } from 'react'

function ThemeToggle() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      className="bg-rh-elevated border border-white/10 text-rh-text-secondary hover:text-rh-text-primary hover:border-purple-40/60 px-3 py-2 rounded-lg transition-all font-mono text-[11px] flex items-center gap-1.5"
      title="Toggle theme"
    >
      <span>{theme === 'dark' ? '☀' : '☾'}</span>
      <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  )
}

export default ThemeToggle
