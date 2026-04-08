import React, { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, Cpu } from 'lucide-react'
import axios from 'axios'

export default function Layout() {
  const [categories, setCategories] = useState([])
  const [searchQ, setSearchQ] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    axios.get('/api/categories').then(r => setCategories(r.data)).catch(() => {})
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQ.trim()) navigate(`/search?q=${encodeURIComponent(searchQ.trim())}`)
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <header style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10,10,15,0.95)',
        backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 1px 0 rgba(0,245,255,0.1)'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0.85rem 2rem', flexWrap: 'wrap' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
            <div style={{
              width: 34, height: 34,
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-magenta))',
              borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--glow-cyan)'
            }}>
              <Cpu size={18} color="#000" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em', color: '#fff' }}>
                ALPHA<span style={{ color: 'var(--accent-cyan)' }}>GAMES</span>
              </div>
              <div style={{ fontSize: '0.5rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-magenta)', letterSpacing: '0.15em' }}>AI GPU RESEARCH</div>
            </div>
          </Link>

          <nav style={{ display: 'flex', gap: '0.1rem', overflowX: 'auto', flex: 1 }}>
            <Link to="/" style={navStyle(location.pathname === '/')}>HOME</Link>
            {categories.map(cat => (
              <Link key={cat.id} to={`/category/${cat.slug}`} style={navStyle(location.pathname === `/category/${cat.slug}`)}>
                {cat.name.toUpperCase()}
              </Link>
            ))}
          </nav>

          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <input
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Search..."
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                color: 'var(--text-primary)', padding: '0.45rem 0.7rem',
                fontFamily: 'var(--font-mono)', fontSize: '0.73rem',
                borderRadius: 4, width: 150, outline: 'none'
              }}
            />
            <button type="submit" style={{
              background: 'var(--accent-cyan)', border: 'none', padding: '0.45rem 0.6rem',
              borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center'
            }}>
              <Search size={13} color="#000" />
            </button>
          </form>
        </div>
      </header>

      <main style={{ padding: '2rem 0', minHeight: 'calc(100vh - 130px)' }}>
        <Outlet />
      </main>

      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '1.75rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem'
      }}>
        <div style={{ marginBottom: '0.4rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '-0.01em' }}>ALPHAGAMES AI NEWS</div>
        <div>© 2026 Anervea.ai — GPU and AI Intelligence — FastAPI + React</div>
      </footer>
    </div>
  )
}

function navStyle(active) {
  return {
    padding: '0.35rem 0.65rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    color: active ? 'var(--accent-cyan)' : 'var(--text-secondary)',
    borderBottom: active ? '2px solid var(--accent-cyan)' : '2px solid transparent',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap'
  }
}
