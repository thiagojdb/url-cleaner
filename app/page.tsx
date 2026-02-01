'use client'

import { useState, useEffect } from 'react'
import { Link2, Copy, Check, Sparkles, Shield, Zap, Trash2, ExternalLink } from 'lucide-react'

const TRACKING_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'utm_id', 'utm_source_platform', 'utm_creative_format', 'utm_marketing_tactic',
  'fbclid', 'gclid', 'ttclid', 'wickedid', 'ef_id', 's_kwcid',
  'msclkid', 'dclid', 'zanpid', 'affiliate', 'referrer', 'ref',
  'source', 'medium', 'campaign', 'term', 'content', 'clickid',
  'mc_cid', 'mc_eid', '_ga', '_gl', 'gclsrc', 'dclid',
  'igshid', 'si', 'feature', 'ab_channel', 'ab_test',
  'yclid', 'li_fat_id', 'wbraid', 'gbraid', 'srsltid',
  'trk', 'trkEmail', 'trkContact', 'originalSubdomain'
]

export default function Home() {
  const [inputUrl, setInputUrl] = useState('')
  const [cleanUrl, setCleanUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [removedCount, setRemovedCount] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const [showSupport, setShowSupport] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowSupport(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const cleanUrlFn = (url: string) => {
    if (!url.trim()) {
      setCleanUrl('')
      setRemovedCount(0)
      return
    }

    try {
      // Handle URLs without protocol
      let processedUrl = url
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        processedUrl = 'https://' + url
      }

      const urlObj = new URL(processedUrl)
      const originalParams = new Set(Array.from(urlObj.searchParams.keys()))
      let removed = 0
      
      TRACKING_PARAMS.forEach(param => {
        if (urlObj.searchParams.has(param)) {
          urlObj.searchParams.delete(param)
          removed++
        }
      })
      
      // Remove empty search params
      if (urlObj.searchParams.toString() === '') {
        urlObj.search = ''
      }
      
      setRemovedCount(removed)
      setCleanUrl(urlObj.toString())
      setCopied(false)
    } catch {
      setCleanUrl('')
      setRemovedCount(0)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputUrl(value)
    cleanUrlFn(value)
  }

  const handleCopy = async () => {
    if (cleanUrl) {
      await navigator.clipboard.writeText(cleanUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClear = () => {
    setInputUrl('')
    setCleanUrl('')
    setRemovedCount(0)
    setCopied(false)
  }

  const hasResult = cleanUrl && inputUrl

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-600/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full border-b border-border/50 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Link2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">URL Cleaner</span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/thiagojdb/url-cleaner" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Hero */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Strip the{' '}
              <span className="gradient-text">Noise</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Remove tracking parameters from URLs instantly. <br className="hidden sm:block" />
              Clean links. Zero tracking. Total privacy.
            </p>
          </div>

          {/* Input Section */}
          <div className="relative animate-slide-up">
            <div className={`
              relative glass rounded-2xl p-2
              transition-all duration-300
              ${isFocused ? 'shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'shadow-none'}
            `}
            onClick={() => document.querySelector('input')?.focus()}>
              <div className="relative flex items-center">
                <Link2 className="absolute left-4 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Paste a messy URL here..."
                  value={inputUrl}
                  onChange={handleInputChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full bg-transparent text-lg py-4 pl-12 pr-12 outline-none placeholder:text-muted-foreground/50"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
                
                {inputUrl && (
                  <button
                    onClick={handleClear}
                    className="absolute right-4 p-1 hover:bg-muted rounded-full transition-colors"
                    title="Clear"
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            {/* Result */}
            {hasResult && (
              <div className="mt-6 animate-slide-up">
                <div className="glass rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-green-400">Clean URL</span>
                    </div>
                    {removedCount > 0 && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
                        <Zap className="w-3 h-3" />
                        Removed {removedCount} tracker{removedCount !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <code className="block text-sm text-muted-foreground break-all font-mono bg-muted/50 rounded-lg px-4 py-3">
                        {cleanUrl}
                      </code>
                    </div>
                    
                    <button
                      onClick={handleCopy}
                      className={`
                        flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200
                        ${copied 
                          ? 'bg-green-500 text-white' 
                          : 'bg-muted hover:bg-muted-foreground/20 text-foreground'
                        }
                      `}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span className="hidden sm:inline">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="hidden sm:inline">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {[
              { icon: Shield, title: 'Privacy First', desc: 'All processing happens in your browser. No data sent anywhere.' },
              { icon: Zap, title: 'Instant', desc: 'Real-time cleaning as you type. No waiting, no loading.' },
              { icon: Trash2, title: '45+ Trackers', desc: 'Removes UTM, Facebook, Google, and many more tracking parameters.' },
            ].map((feature, i) => (
              <div key={i} className="glass rounded-xl p-5 hover:bg-muted/50 transition-colors">
                <feature.icon className="w-5 h-5 text-green-400 mb-3" />
                <h3 className="font-medium mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Support Section */}
          {showSupport && (
            <div className="mt-16 text-center animate-fade-in">
              <div className="inline-flex flex-col items-center">
                <p className="text-muted-foreground mb-4 text-sm">Find this tool useful?</p>
                <a
                  href="https://buy.stripe.com/test_14A14pdq82fr2DJerA2cg00"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
                >
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  Support with $1
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 URL Cleaner. Open source on{' '}
            <a href="https://github.com/thiagojdb/url-cleaner" className="text-green-400 hover:underline">GitHub</a>.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>No tracking</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <span>No cookies</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <span>Client-side only</span>
          </div>
        </div>
      </footer>
    </div>
  )
}