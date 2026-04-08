import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import ArticleCard from '../components/ArticleCard'
import { ArrowLeft } from 'lucide-react'

export default function CategoryPage() {
  const { slug } = useParams()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`/api/articles/?category=${slug}&limit=30`).then(r => setArticles(r.data)).finally(() => setLoading(false))
  }, [slug])

  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', marginBottom: '1.75rem' }}>
        <ArrowLeft size={11} /> BACK
      </Link>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.7rem', letterSpacing: '-0.03em', marginBottom: '1.75rem' }}>{title}</h1>
      {loading ? <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>LOADING...</p> :
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.9rem' }}>
          {articles.map(a => <ArticleCard key={a.id} article={a} />)}
        </div>
      }
    </div>
  )
}
