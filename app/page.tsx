'use client'

import { useState } from 'react'

interface Format {
  formatId: string
  ext: string
  label: string
  filesize: number | null
  hasVideo: boolean
  hasAudio: boolean
}

interface VideoInfo {
  title: string
  thumbnail: string
  duration: number
  uploader: string
  formats: Format[]
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function formatSize(bytes: number | null) {
  if (!bytes) return '—'
  const mb = bytes / (1024 * 1024)
  return mb > 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(1)} MB`
}

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<Format | null>(null)
  const [downloading, setDownloading] = useState(false)

  async function handleAnalyze() {
    if (!url.trim()) return
    setLoading(true)
    setError('')
    setVideoInfo(null)
    setSelectedFormat(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to analyze')
      setVideoInfo(data)
      if (data.formats.length > 0) setSelectedFormat(data.formats[0])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDownload() {
    if (!selectedFormat || !videoInfo) return
    setDownloading(true)
    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          formatId: selectedFormat.formatId,
          title: videoInfo.title,
          ext: selectedFormat.ext,
        }),
      })
      if (!res.ok) throw new Error('Download failed')
      const blob = await res.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `${videoInfo.title}.${selectedFormat.ext}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-xl mx-auto">

        <div className="mb-12">
          <h1 className="text-8xl font-black tracking-tighter text-black leading-none">Iv</h1>
          <div className="w-16 h-1 bg-red-600 mt-3" />
          <p className="text-sm font-medium tracking-widest uppercase text-black/40 mt-3">
            Paste a URL. Pick a format. Done.
          </p>
        </div>

        <div className="border-2 border-black flex items-center mb-8">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            placeholder="Paste video URL here..."
            className="flex-1 px-5 py-4 text-sm font-medium bg-white outline-none placeholder:text-black/30"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !url.trim()}
            className="bg-black text-white px-6 py-4 text-sm font-bold tracking-widest uppercase hover:bg-red-600 transition-colors duration-200 disabled:opacity-40"
          >
            {loading ? '...' : 'Analyze'}
          </button>
        </div>

        {error && (
          <div className="border-2 border-red-600 px-5 py-4 mb-8">
            <p className="text-sm font-medium text-red-600">{error}</p>
          </div>
        )}

        {videoInfo && (
          <div className="space-y-6">
            <div className="border-2 border-black overflow-hidden">
              {videoInfo.thumbnail && (
                <img src={videoInfo.thumbnail} alt={videoInfo.title}
                  className="w-full aspect-video object-cover" />
              )}
              <div className="p-5 border-t-2 border-black">
                <h2 className="font-black text-lg leading-tight mb-1">{videoInfo.title}</h2>
                <div className="flex gap-4">
                  {videoInfo.uploader && (
                    <p className="text-xs font-medium text-black/50 uppercase tracking-widest">
                      {videoInfo.uploader}
                    </p>
                  )}
                  {videoInfo.duration && (
                    <p className="text-xs font-medium text-black/50 uppercase tracking-widest">
                      {formatDuration(videoInfo.duration)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3 text-black/40">
                Select Format
              </p>
              <div className="space-y-2">
                {videoInfo.formats.map((format) => (
                  <button
                    key={format.formatId}
                    onClick={() => setSelectedFormat(format)}
                    className={`w-full flex items-center justify-between px-5 py-4 border-2 transition-colors duration-150 ${
                      selectedFormat?.formatId === format.formatId
                        ? 'border-red-600 bg-red-600 text-white'
                        : 'border-black bg-white text-black hover:border-red-600'
                    }`}
                  >
                    <span className="text-sm font-bold">{format.label}</span>
                    <span className="text-xs font-medium opacity-70">{formatSize(format.filesize)}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={downloading || !selectedFormat}
              className="w-full bg-black text-white py-5 text-sm font-black tracking-widest uppercase hover:bg-red-600 transition-colors duration-200 disabled:opacity-40"
            >
              {downloading ? 'Downloading...' : 'Download'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
