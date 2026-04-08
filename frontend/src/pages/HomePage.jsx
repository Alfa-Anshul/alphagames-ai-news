import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ArticleCard from '../components/ArticleCard'
import HeroSection from '../components/HeroSection'
import { TrendingUp, Layers } from 'lucide-react'

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [latest, setLatest] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get('/api/articles/featured'),
      axios.get('/api/articles/?limit=20')
    ]).then(([f, l]) => {
      setFeatured(f.data)
      setLatest(l.data)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, height: 300 }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
        AlphaGames AI News — GPU & AI Intelligence
      </h1>
      <HeroSection />
      <div className="container" style={{ marginTop: '2.5rem' }}>
        <SectionHeader icon={<TrendingUp size={15} />} title="Featured Stories" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.1rem', marginBottom: '3.5rem' }}>
          {featured.map(a => <ArticleCard key={a.id} article={a} featured={true} />)}
        </div>
        <SectionHeader icon={<Layers size={15} />} title="Latest Intelligence" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.9rem', marginBottom: '3.5rem' }}>
          {latest.map(a => <ArticleCard key={a.id} article={a} />)}
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ icon, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
      <span style={{ color: 'var(--accent-cyan)' }}>{icon}</span>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: 'var(--border)', marginLeft: '0.4rem' }} />
    </div>
  )
}
