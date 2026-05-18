'use client'

import { useEffect, useRef, useState } from 'react'

export default function HomePage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef(null)

  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('mousemove', handleMouse)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('mousemove', handleMouse)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const platforms = [
    {
      name: 'YouTube',
      color: '#FF0000',
      bg: 'rgba(255,0,0,0.12)',
      border: 'rgba(255,0,0,0.3)',
      icon: (
        <svg viewBox="0 0 24 24" fill="#FF0000" width="32" height="32">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      stat: '2.7B users',
      pos: { top: '8%', left: '4%' },
      delay: '0s',
      rotation: '-8deg'
    },
    {
      name: 'TikTok',
      color: '#00f2ea',
      bg: 'rgba(0,242,234,0.1)',
      border: 'rgba(0,242,234,0.3)',
      icon: (
        <svg viewBox="0 0 24 24" fill="white" width="32" height="32">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z"/>
        </svg>
      ),
      stat: '1.5B users',
      pos: { top: '6%', right: '4%' },
      delay: '-1.5s',
      rotation: '6deg'
    },
    {
      name: 'Instagram',
      color: '#E1306C',
      bg: 'rgba(225,48,108,0.1)',
      border: 'rgba(225,48,108,0.3)',
      icon: (
        <svg viewBox="0 0 24 24" width="32" height="32">
          <defs>
            <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f09433"/>
              <stop offset="25%" stopColor="#e6683c"/>
              <stop offset="50%" stopColor="#dc2743"/>
              <stop offset="75%" stopColor="#cc2366"/>
              <stop offset="100%" stopColor="#bc1888"/>
            </linearGradient>
          </defs>
          <path fill="url(#ig)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      stat: '2B users',
      pos: { bottom: '22%', left: '3%' },
      delay: '-3s',
      rotation: '5deg'
    },
    {
      name: 'Twitch',
      color: '#9146FF',
      bg: 'rgba(145,70,255,0.12)',
      border: 'rgba(145,70,255,0.3)',
      icon: (
        <svg viewBox="0 0 24 24" fill="#9146FF" width="32" height="32">
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
        </svg>
      ),
      stat: '140M users',
      pos: { bottom: '20%', right: '3%' },
      delay: '-2s',
      rotation: '-6deg'
    },
    {
      name: 'Facebook',
      color: '#1877F2',
      bg: 'rgba(24,119,242,0.1)',
      border: 'rgba(24,119,242,0.3)',
      icon: (
        <svg viewBox="0 0 24 24" fill="#1877F2" width="32" height="32">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      stat: '3B users',
      pos: { top: '40%', left: '2%' },
      delay: '-4s',
      rotation: '7deg'
    },
    {
      name: 'Twitter/X',
      color: '#ffffff',
      bg: 'rgba(255,255,255,0.08)',
      border: 'rgba(255,255,255,0.2)',
      icon: (
        <svg viewBox="0 0 24 24" fill="white" width="32" height="32">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      stat: '550M users',
      pos: { top: '40%', right: '2%' },
      delay: '-5s',
      rotation: '-4deg'
    },
  ]

  const features = [
    {
      icon: '🎯',
      title: 'AI Hook Generator',
      desc: 'Generate 10 viral hooks instantly using Claude AI for any topic or platform',
      color: '#FF0000',
      platform: 'YouTube'
    },
    {
      icon: '🖼️',
      title: 'Thumbnail AI',
      desc: 'Get complete visual direction for thumbnails that actually get clicked',
      color: '#E1306C',
      platform: 'Instagram'
    },
    {
      icon: '⚡',
      title: 'Find Top Editors',
      desc: 'AI matches you with verified editors who specialize in your content niche',
      color: '#9146FF',
      platform: 'All Platforms'
    },
    {
      icon: '💬',
      title: 'Live Workspace',
      desc: 'Collaborate with your editor in real time — chat, files, and feedback in one place',
      color: '#00f2ea',
      platform: 'TikTok'
    },
  ]

  const stats = [
    { num: '500+', label: 'Creators', icon: '🎬' },
    { num: '200+', label: 'Top Editors', icon: '✂️' },
    { num: '6', label: 'Platforms', icon: '📱' },
    { num: '48h', label: 'Avg Delivery', icon: '⚡' },
  ]

  return (
    <div style={{
      background: '#080810',
      minHeight: '100vh',
      color: 'white',
      fontFamily: "'DM Sans', system-ui, sans-serif",
      overflowX: 'hidden',
    }}>
      
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(var(--r)); }
          50% { transform: translateY(-18px) rotate(var(--r)); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(var(--r)); }
          50% { transform: translateY(-12px) rotate(var(--r)); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .platform-card {
          position: absolute;
          padding: 16px 20px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          animation: float 6s ease-in-out infinite;
          cursor: default;
          transition: transform 0.3s ease;
          backdrop-filter: blur(10px);
          min-width: 100px;
        }

        .platform-card:hover {
          transform: scale(1.08) translateY(-5px) !important;
          z-index: 10;
        }

        .hero-title {
          animation: fadeUp 0.8s 0.2s ease forwards;
          opacity: 0;
        }

        .hero-sub {
          animation: fadeUp 0.8s 0.4s ease forwards;
          opacity: 0;
        }

        .hero-cta {
          animation: fadeUp 0.8s 0.6s ease forwards;
          opacity: 0;
        }

        .hero-stats {
          animation: fadeUp 0.8s 0.8s ease forwards;
          opacity: 0;
        }

        .feature-card {
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .feature-card:hover {
          transform: translateY(-8px);
          border-color: rgba(255,255,255,0.2) !important;
        }

        .btn-primary {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 60px rgba(123,47,255,0.5);
        }

        .btn-secondary {
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          border-color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.08);
          transform: translateY(-2px);
        }

        .scroll-track {
          animation: scroll-left 25s linear infinite;
        }

        .scroll-track:hover {
          animation-play-state: paused;
        }

        .gradient-text {
          background: linear-gradient(135deg, #FF0000 0%, #E1306C 30%, #9146FF 60%, #00f2ea 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 4s ease infinite;
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 100,
        padding: '20px 60px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(8,8,16,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          fontFamily: "'Syne', sans-serif",
          fontSize: '22px', fontWeight: '800',
        }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #7B2FFF, #E1306C)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px',
          }}>▶</div>
          One Reel
        </div>

        <div style={{ display: 'flex', gap: '40px', listStyle: 'none' }}>
          {['Features', 'Pricing', 'Showcase', 'Editors'].map(item => (
            <a key={item} href="#" style={{
              color: 'rgba(255,255,255,0.5)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = 'white'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
            >{item}</a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="/login" style={{
            color: 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
            padding: '10px 24px',
            borderRadius: '100px',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid rgba(255,255,255,0.15)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.target.style.borderColor = 'rgba(255,255,255,0.4)'; e.target.style.color = 'white'; }}
          onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.color = 'rgba(255,255,255,0.7)'; }}
          >Login</a>
          <a href="/signup" style={{
            background: 'linear-gradient(135deg, #7B2FFF, #E1306C)',
            color: 'white',
            textDecoration: 'none',
            padding: '10px 24px',
            borderRadius: '100px',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s',
          }}
          onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 10px 30px rgba(123,47,255,0.4)'; }}
          onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
          >Get Started Free</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '120px 40px 80px',
        overflow: 'hidden',
      }}>
        
        {/* Background glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 60% 50% at 50% 0%, rgba(123,47,255,0.15) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 20% 60%, rgba(255,0,0,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 80% 60%, rgba(0,242,234,0.06) 0%, transparent 60%)
          `,
          pointerEvents: 'none',
        }}/>

        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)',
          pointerEvents: 'none',
        }}/>

        {/* FLOATING PLATFORM CARDS */}
        {platforms.map((platform, i) => (
          <div
            key={platform.name}
            className="platform-card"
            style={{
              ...platform.pos,
              background: platform.bg,
              border: `1px solid ${platform.border}`,
              '--r': platform.rotation,
              animationDelay: platform.delay,
              animationDuration: `${5 + i * 0.7}s`,
              boxShadow: `0 20px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`,
            }}
          >
            {/* Pulse ring */}
            <div style={{
              position: 'absolute',
              width: '100%', height: '100%',
              borderRadius: '20px',
              border: `1px solid ${platform.border}`,
              animation: `pulse-ring 3s ease-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}/>
            
            {platform.icon}
            <div style={{
              fontSize: '13px',
              fontWeight: '700',
              color: platform.color,
              letterSpacing: '0.3px',
            }}>{platform.name}</div>
            <div style={{
              fontSize: '10px',
              color: 'rgba(255,255,255,0.5)',
              fontWeight: '500',
            }}>{platform.stat}</div>
          </div>
        ))}

        {/* CENTER CONTENT */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, maxWidth: '800px' }}>
          
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '8px 20px',
            borderRadius: '100px',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '32px',
            animation: 'fadeUp 0.8s ease forwards',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00f2ea', display: 'inline-block', animation: 'pulse-ring 2s infinite' }}/>
            The Platform Built for Content Creators
          </div>

          {/* Title */}
          <h1 className="hero-title" style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(48px, 8vw, 88px)',
            fontWeight: '800',
            lineHeight: '1.0',
            letterSpacing: '-3px',
            marginBottom: '28px',
          }}>
            <span style={{ color: 'white' }}>Create Content</span><br/>
            <span className="gradient-text">For Every Platform</span>
          </h1>

          {/* Sub */}
          <p className="hero-sub" style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: '1.7',
            marginBottom: '48px',
            fontWeight: '300',
            maxWidth: '580px',
            margin: '0 auto 48px',
          }}>
            Connect with elite video editors, generate viral hooks with AI,
            and grow your channel across YouTube, TikTok, Instagram and more.
          </p>

          {/* CTAs */}
          <div className="hero-cta" style={{
            display: 'flex', gap: '16px',
            justifyContent: 'center', flexWrap: 'wrap',
          }}>
            <a href="/signup" className="btn-primary" style={{
              background: 'linear-gradient(135deg, #7B2FFF, #E1306C)',
              color: 'white',
              textDecoration: 'none',
              padding: '18px 44px',
              borderRadius: '100px',
              fontSize: '16px',
              fontWeight: '700',
              display: 'inline-block',
            }}>
              Start Creating Free →
            </a>
            <a href="/signup?role=editor" className="btn-secondary" style={{
              color: 'white',
              textDecoration: 'none',
              padding: '18px 44px',
              borderRadius: '100px',
              fontSize: '16px',
              fontWeight: '500',
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'inline-block',
            }}>
              Join as Editor ✂️
            </a>
          </div>
        </div>

        {/* STATS */}
        <div className="hero-stats" style={{
          display: 'flex', gap: '0',
          marginTop: '80px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 2,
        }}>
          {stats.map((stat, i) => (
            <div key={i} style={{
              padding: '24px 40px',
              textAlign: 'center',
              borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>{stat.icon}</div>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '28px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, white, rgba(255,255,255,0.6))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>{stat.num}</div>
              <div style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginTop: '2px',
              }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PLATFORM MARQUEE STRIP */}
      <div style={{
        padding: '20px 0',
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          gap: '0',
        }}>
          <div className="scroll-track" style={{
            display: 'flex',
            gap: '60px',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            padding: '0 30px',
          }}>
            {[...platforms, ...platforms].map((p, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '14px',
                fontWeight: '600',
                letterSpacing: '0.5px',
              }}>
                <span style={{ transform: 'scale(0.7)', display: 'inline-block' }}>{p.icon}</span>
                {p.name.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOR CREATORS AND EDITORS SECTION */}
      <section style={{
        padding: '100px 60px',
        maxWidth: '1300px',
        margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div style={{
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'rgba(123,47,255,0.8)',
            marginBottom: '20px',
          }}>Who Is It For</div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: '800',
            letterSpacing: '-2px',
            lineHeight: '1.1',
          }}>
            Built for <span className="gradient-text">Creators</span> and <span style={{
              background: 'linear-gradient(135deg, #00f2ea, #9146FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Editors</span>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
        }}>
          {/* CREATORS CARD */}
          <div style={{
            background: 'rgba(255,0,0,0.04)',
            border: '1px solid rgba(255,0,0,0.15)',
            borderRadius: '28px',
            padding: '48px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(255,0,0,0.3)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
          onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(255,0,0,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{
              position: 'absolute', top: '-30px', right: '-30px',
              width: '150px', height: '150px',
              background: 'radial-gradient(circle, rgba(255,0,0,0.15) 0%, transparent 70%)',
              borderRadius: '50%',
            }}/>
            
            <div style={{
              fontSize: '48px', marginBottom: '24px',
            }}>🎬</div>
            
            <h3 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '28px', fontWeight: '800',
              marginBottom: '16px',
              letterSpacing: '-1px',
            }}>For Creators</h3>
            
            <p style={{
              fontSize: '15px',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: '1.7',
              marginBottom: '32px',
              fontWeight: '300',
            }}>
              You make the content. We handle the editing. Find the perfect editor 
              for YouTube, TikTok, Instagram Reels, or any platform in minutes.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {[
                '🎯 AI matches you with the right editor',
                '⚡ Get viral hooks generated instantly',
                '🖼️ Thumbnail concepts with AI',
                '📊 Track your channel growth',
                '💬 Collaborate in real time workspace',
              ].map((item, i) => (
                <div key={i} style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.7)',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  {item}
                </div>
              ))}
            </div>

            {/* Platform icons row */}
            <div style={{
              display: 'flex', gap: '8px', flexWrap: 'wrap',
              marginBottom: '32px',
            }}>
              {platforms.slice(0, 4).map(p => (
                <div key={p.name} style={{
                  background: p.bg,
                  border: `1px solid ${p.border}`,
                  borderRadius: '10px',
                  padding: '6px 12px',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: p.color,
                }}>
                  <span style={{ transform: 'scale(0.6)', display: 'inline-block', lineHeight: '1' }}>{p.icon}</span>
                  {p.name}
                </div>
              ))}
            </div>

            <a href="/signup?role=creator" style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #FF0000, #E1306C)',
              color: 'white',
              textDecoration: 'none',
              padding: '14px 32px',
              borderRadius: '100px',
              fontSize: '15px',
              fontWeight: '700',
            }}>Start as Creator →</a>
          </div>

          {/* EDITORS CARD */}
          <div style={{
            background: 'rgba(0,242,234,0.04)',
            border: '1px solid rgba(0,242,234,0.15)',
            borderRadius: '28px',
            padding: '48px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(0,242,234,0.3)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
          onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(0,242,234,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{
              position: 'absolute', top: '-30px', right: '-30px',
              width: '150px', height: '150px',
              background: 'radial-gradient(circle, rgba(0,242,234,0.15) 0%, transparent 70%)',
              borderRadius: '50%',
            }}/>
            
            <div style={{ fontSize: '48px', marginBottom: '24px' }}>✂️</div>
            
            <h3 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '28px', fontWeight: '800',
              marginBottom: '16px',
              letterSpacing: '-1px',
            }}>For Editors</h3>
            
            <p style={{
              fontSize: '15px',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: '1.7',
              marginBottom: '32px',
              fontWeight: '300',
            }}>
              Stop hunting for clients. One Reel brings creators to you. 
              Build your portfolio, get verified, and earn steady income 
              doing what you love.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {[
                '💰 Steady work from top creators',
                '🏆 Get verified with skill badges',
                '📁 Showcase your portfolio videos',
                '⭐ Build reputation with reviews',
                '🌍 Work remotely from anywhere',
              ].map((item, i) => (
                <div key={i} style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.7)',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  {item}
                </div>
              ))}
            </div>

            <div style={{
              background: 'rgba(0,242,234,0.08)',
              border: '1px solid rgba(0,242,234,0.2)',
              borderRadius: '16px',
              padding: '16px 20px',
              marginBottom: '32px',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.6)',
            }}>
              💡 <strong style={{ color: '#00f2ea' }}>Average editor earns $2,500+/month</strong> on One Reel
            </div>

            <a href="/signup?role=editor" style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #00f2ea, #9146FF)',
              color: 'white',
              textDecoration: 'none',
              padding: '14px 32px',
              borderRadius: '100px',
              fontSize: '15px',
              fontWeight: '700',
            }}>Join as Editor →</a>
          </div>
        </div>
      </section>

      {/* AI FEATURES */}
      <section style={{
        padding: '100px 60px',
        background: 'rgba(255,255,255,0.01)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={{
              display: 'inline-block',
              fontSize: '11px', fontWeight: '700',
              letterSpacing: '3px', textTransform: 'uppercase',
              color: 'rgba(123,47,255,0.8)',
              marginBottom: '20px',
            }}>AI Powered Tools</div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: '800',
              letterSpacing: '-2px',
              lineHeight: '1.1',
            }}>
              Grow faster with AI
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
          }}>
            {features.map((f, i) => (
              <div key={i} className="feature-card" style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '24px',
                padding: '40px',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  marginBottom: '20px',
                }}>
                  <div style={{
                    width: '52px', height: '52px',
                    borderRadius: '14px',
                    background: `rgba(${f.color === '#FF0000' ? '255,0,0' : f.color === '#E1306C' ? '225,48,108' : f.color === '#9146FF' ? '145,70,255' : '0,242,234'},0.15)`,
                    border: `1px solid rgba(${f.color === '#FF0000' ? '255,0,0' : f.color === '#E1306C' ? '225,48,108' : f.color === '#9146FF' ? '145,70,255' : '0,242,234'},0.3)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px',
                  }}>{f.icon}</div>
                  <div style={{
                    fontSize: '11px', fontWeight: '700',
                    letterSpacing: '2px', textTransform: 'uppercase',
                    color: f.color,
                  }}>{f.platform}</div>
                </div>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '22px', fontWeight: '700',
                  marginBottom: '12px',
                  letterSpacing: '-0.5px',
                }}>{f.title}</h3>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.5)',
                  lineHeight: '1.7',
                  fontWeight: '300',
                }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '120px 60px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(123,47,255,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>
        
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(36px, 5vw, 64px)',
          fontWeight: '800',
          letterSpacing: '-2px',
          lineHeight: '1.1',
          marginBottom: '20px',
          position: 'relative', zIndex: 2,
        }}>
          Ready to grow on<br/>
          <span className="gradient-text">every platform?</span>
        </h2>
        <p style={{
          fontSize: '18px',
          color: 'rgba(255,255,255,0.5)',
          marginBottom: '48px',
          position: 'relative', zIndex: 2,
          fontWeight: '300',
        }}>
          Join 500+ creators already growing faster with One Reel
        </p>
        <div style={{
          display: 'flex', gap: '16px',
          justifyContent: 'center',
          position: 'relative', zIndex: 2,
        }}>
          <a href="/signup" className="btn-primary" style={{
            background: 'linear-gradient(135deg, #7B2FFF, #E1306C)',
            color: 'white',
            textDecoration: 'none',
            padding: '20px 50px',
            borderRadius: '100px',
            fontSize: '18px',
            fontWeight: '700',
            display: 'inline-block',
          }}>Start Free Today →</a>
          <a href="/signup?role=editor" className="btn-secondary" style={{
            color: 'white',
            textDecoration: 'none',
            padding: '20px 50px',
            borderRadius: '100px',
            fontSize: '18px',
            fontWeight: '500',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'inline-block',
          }}>Join as Editor</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '40px 60px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'rgba(255,255,255,0.3)',
        fontSize: '13px',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          fontFamily: "'Syne', sans-serif",
          fontSize: '18px', fontWeight: '800',
          color: 'white',
        }}>
          <div style={{
            width: '28px', height: '28px',
            background: 'linear-gradient(135deg, #7B2FFF, #E1306C)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px',
          }}>▶</div>
          One Reel
        </div>
        <div>© 2025 One Reel. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['Privacy', 'Terms', 'Contact'].map(item => (
            <a key={item} href="#" style={{
              color: 'rgba(255,255,255,0.3)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = 'white'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
            >{item}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
