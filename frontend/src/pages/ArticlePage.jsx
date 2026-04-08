import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Clock, Eye, ArrowLeft, Tag, Calendar } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

export default function ArticlePage() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`/api/articles/${slug}`).then(r => setArticle(r.data)).finally(() => setLoading(false))
    window.scrollTo(0, 0)
  }, [slug])

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>LOADING...</div>
  if (!article) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--accent-magenta)', fontFamily: 'var(--font-mono)' }}>NOT FOUND</div>

  return (
    <div className="container" style={{ maxWidth: 820, paddingTop: '1rem', paddingBottom: '4rem' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', marginBottom: '1.75rem' }}>
        <ArrowLeft size={11} /> BACK
      </Link>

      {article.image_url && (
        <div style={{ borderRadius: 8, overflow: 'hidden', marginBottom: '1.75rem', maxHeight: 380, border: '1px solid var(--border)' }}>
          <img src={article.image_url} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      <div style={{ marginBottom: '0.9rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
        {article.category && <span className="tag-chip" style={{ color: 'var(--accent-magenta)', borderColor: 'rgba(255,0,128,0.3)' }}>{article.category.name}</span>}
        {article.featured && <span style={{ background: 'var(--accent-gold)', color: '#000', padding: '2px 7px', fontSize: '0.58rem', fontFamily: 'var(--font-mono)', fontWeight: 700, borderRadius: 2 }}>FEATURED</span>}
      </div>

      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', lineHeight: 1.15, marginBottom: '0.9rem', letterSpacing: '-0.03em' }}>
        {article.title}
      </h1>

      <div style={{ display: 'flex', gap: '1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={10} /> {article.read_time} min read</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Eye size={10} /> {article.views ?? 0} views</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={10} /> {article.published_at ? format(new Date(article.published_at), 'MMM dd, yyyy') : 'Recent'}</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '2.25rem' }}>
        {article.tags.map(t => <span key={t.id} className="tag-chip">{t.name}</span>)}
      </div>

      <div style={{ borderLeft: '3px solid var(--accent-cyan)', paddingLeft: '1.25rem', marginBottom: '2.25rem', color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.88rem' }}>
        {article.summary}
      </div>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({children}) => <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.7rem', marginBottom: '0.7rem', marginTop: '2rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{children}</h1>,
          h2: ({children}) => <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.35rem', marginBottom: '0.65rem', marginTop: '1.75rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{children}</h2>,
          h3: ({children}) => <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.5rem', marginTop: '1.5rem', color: 'var(--text-primary)' }}>{children}</h3>,
          p: ({children}) => <p style={{ marginBottom: '1.1rem', lineHeight: 1.75, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{children}</p>,
          code: ({node, className, children, ...props}) => {
            const isInline = !className && !String(children).includes('\n')
            return isInline
              ? <code style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid var(--border)', padding: '2px 5px', borderRadius: 3, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-cyan)' }} {...props}>{children}</code>
              : <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }} {...props}>{children}</code>
          },
          pre: ({children}) => <pre style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 6, padding: '1.1rem', overflowX: 'auto', marginBottom: '1.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', lineHeight: 1.6, color: 'var(--accent-green)' }}>{children}</pre>,
          strong: ({children}) => <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{children}</strong>,
          ul: ({children}) => <ul style={{ paddingLeft: '1.4rem', marginBottom: '1.1rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{children}</ul>,
          ol: ({children}) => <ol style={{ paddingLeft: '1.4rem', marginBottom: '1.1rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{children}</ol>,
          li: ({children}) => <li style={{ marginBottom: '0.35rem' }}>{children}</li>,
          blockquote: ({children}) => <blockquote style={{ borderLeft: '3px solid var(--accent-magenta)', paddingLeft: '1rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '1.1rem' }}>{children}</blockquote>
        }}
      >
        {article.content}
      </ReactMarkdown>
    </div>
  )
}
