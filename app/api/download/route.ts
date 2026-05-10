import { NextRequest, NextResponse } from 'next/server'
import YTDlpWrap from 'yt-dlp-wrap'
import { join } from 'path'
import { tmpdir } from 'os'
import { createReadStream, unlink } from 'fs'
import { promisify } from 'util'

const unlinkAsync = promisify(unlink)

export async function POST(req: NextRequest) {
  try {
    const { url, formatId, title, ext } = await req.json()

    if (!url || !formatId) {
      return NextResponse.json(
        { error: 'URL and format are required' },
        { status: 400 }
      )
    }

    const ytDlp = new YTDlpWrap('yt-dlp')
    const outputPath = join(tmpdir(), `iv-${Date.now()}.${ext || 'mp4'}`)

    await ytDlp.execPromise([
      url,
      '-f', formatId,
      '-o', outputPath,
      '--no-playlist',
    ])

    const fileStream = createReadStream(outputPath)
    const filename = `${title || 'download'}.${ext || 'mp4'}`
      .replace(/[^a-zA-Z0-9._-]/g, '_')

    const chunks: Buffer[] = []
    for await (const chunk of fileStream) {
      chunks.push(chunk)
    }
    const fileBuffer = Buffer.concat(chunks)

    await unlinkAsync(outputPath).catch(() => {})

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    })

  } catch (error: any) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Download failed. Please try again.' },
      { status: 500 }
    )
  }
  }
