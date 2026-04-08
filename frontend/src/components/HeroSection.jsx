import React, { useEffect, useState } from 'react'

const TICKERS = [
  "NVIDIA B200 - 20 PFLOPS FP4",
  "DeepSeek R1 - 1/50x Training Cost",
  "Gemma 4 - On-Device Inference",
  "Huawei Ascend 910C - 800 TFLOPS",
  "Apple M4 Ultra - 10x Efficiency",
  "AGI Timeline - 2027 Consensus"
]

export default function HeroSection() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTick(x => (x + 1) % TICKERS.length), 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ borderBottom: '1px solid var(--border)', padding: '2.5rem 0 1.75rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--accent-cyan), var(--accent-magenta), transparent)' }} />
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent-magenta)', letterSpacing: '0.2em', marginBottom: '0.65rem' }}>// INTELLIGENCE_FEED v2.1</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
              THE GPU &amp;
              <span style={{ display: 'block', color: 'var(--accent-cyan)', textShadow: '0 0 30px rgba(0,245,255,0.5)' }}>AI INTEL</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '55%', fontWeight: 400 }}>FOR BUILDERS</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', maxWidth: 460, lineHeight: 1.7 }}>
              Deep-dives into GPU architecture, LLM research, AI hardware, and the race to AGI. No hype. Pure signal.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', minWidth: 200 }}>
            {[['GPU Technology', '#00f5ff'], ['AI Research', '#ff0080'], ['AGI Race', '#ffd700'], ['Mobile AI', '#00ff88']].map(([label, color]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.9rem', background: 'var(--bg-card)', border: `1px solid ${color}22`, borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color }}>
                <span style={{ width: 6, height: 6, background: color, borderRadius: '50%', display: 'inline-block' }} />
                {label}
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: '1.75rem', padding: '0.5rem 0.9rem', background: 'rgba(0,245,255,0.05)', border: '1px solid var(--border)', borderRadius: 4, display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--accent-green)', letterSpacing: '0.1em', flexShrink: 0 }}>LIVE</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-primary)' }}>{TICKERS[tick]}</span>
        </div>
      </div>
    </div>
  )
}
