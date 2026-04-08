import React from 'react'
import { Link } from 'react-router-dom'
import { Clock, Eye } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function ArticleCard({ article, featured = false }) {
  const timeAgo = formatDistanceToNow(new Date(article.published_at), { addSuffix: true })

  if (featured) {
    return (
      <Link to={`/article/${article.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
        <article
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            overflow: 'hidden',
            transition: 'all 0.3s',
            cursor: 'pointer',
            position: 'relative'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--accent-cyan)'
            e.currentTarget.style.boxShadow = 'var(--glow-cyan)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.transform = 'none'
          }}
        >
          <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
            <span style={{
              background: 'var(--accent-magenta)', color: '#000',
              padding: '3px 8px', fontSize: '0.58rem',
              fontFamily: 'var(--font-mono)', fontWeight: 700,
              letterSpacing: '0.1em', borderRadius: 2
            }}>FEATURED</span>
          </div>
          <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
            <img src={article.image_url} alt={article.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
              onError={e => { e.target.style.display = 'none' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(10,10,15,0.9) 0%, transparent 60%)'
            }} />
          </div>
          <div style={{ padding: '1.1rem' }}>
            {article.category && <div style={{ marginBottom: '0.5rem' }}><span className="tag-chip">{article.category.name}</span></div>}
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', lineHeight: 1.3, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              {article.title}
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.9rem', lineHeight: 1.5 }}>
              {article.summary.slice(0, 110)}...
            </p>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={9} /> {article.read_time}m</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={9} /> {article.views}</span>
              <span>{timeAgo}</span>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link to={`/article/${article.slug}`} style={{ display: 'block' }}>
      <article
        style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 6, padding: '1rem',
          display: 'flex', gap: '1rem', transition: 'all 0.2s', cursor: 'pointer'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--border-hover)'
          e.currentTarget.style.background = 'var(--bg-card-hover)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.background = 'var(--bg-card)'
        }}
      >
        {article.image_url && (
          <div style={{ width: 85, height: 65, flexShrink: 0, borderRadius: 4, overflow: 'hidden' }}>
            <img src={article.image_url} alt={article.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.style.display = 'none' }}
            />
          </div>
        )}
        <div style={{ flex: 1 }}>
          {article.category && <span className="tag-chip" style={{ marginBottom: 5, display: 'inline-block' }}>{article.category.name}</span>}
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.3, marginBottom: '0.3rem', color: 'var(--text-primary)' }}>
            {article.title}
          </h3>
          <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={8} /> {article.read_time}m</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={8} /> {article.views}</span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
