import { NextRequest, NextResponse } from 'next/server'
import YTDlpWrap from 'yt-dlp-wrap'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    const ytDlp = new YTDlpWrap('yt-dlp')
    const metadata = await ytDlp.getVideoInfo(url)

    const formats = metadata.formats
      ?.filter((f: any) => f.url)
      ?.map((f: any) => ({
        formatId: f.format_id,
        ext: f.ext,
        label: f.vcodec === 'none'
          ? `Audio only — ${f.ext.toUpperCase()}`
          : `${f.height ? f.height + 'p' : 'Unknown'} — ${f.ext.toUpperCase()}`,
        filesize: f.filesize || null,
        hasVideo: f.vcodec !== 'none',
        hasAudio: f.acodec !== 'none',
        tbr: f.tbr || 0,
      }))
      ?.sort((a: any, b: any) => b.tbr - a.tbr)
      ?.slice(0, 8)

    return NextResponse.json({
      title: metadata.title,
      thumbnail: metadata.thumbnail,
      duration: metadata.duration,
      uploader: metadata.uploader,
      formats: formats || [],
    })

  } catch (error: any) {
    console.error('Analyze error:', error)
    return NextResponse.json(
      { error: 'Could not analyze this URL. Make sure it is a public video.' },
      { status: 500 }
    )
  }
        }
