import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import ArticleCard from '../components/ArticleCard'
import { ArrowLeft } from 'lucide-react'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!q) return
    setLoading(true)
    axios.get(`/api/search/?q=${encodeURIComponent(q)}`).then(r => setResults(r.data)).finally(() => setLoading(false))
  }, [q])

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', marginBottom: '1.75rem' }}>
        <ArrowLeft size={11} /> BACK
      </Link>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.35rem', marginBottom: '1.75rem' }}>Results for "{q}" - {results.length} found</h1>
      {loading ? <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SEARCHING...</p> :
        results.length === 0 ? <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>No results.</p> :
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.9rem' }}>
          {results.map(a => <ArticleCard key={a.id} article={a} />)}
        </div>
      }
    </div>
  )
}
