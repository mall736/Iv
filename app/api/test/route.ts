import { NextResponse } from 'next/server'
import { execSync } from 'child_process'

export async function GET() {
  const results: any = {}

  try {
    results.ytdlp_version = execSync('yt-dlp --version').toString().trim()
  } catch (e: any) {
    results.ytdlp_error = e.message
  }

  try {
    results.ffmpeg_version = execSync('ffmpeg -version').toString().split('\n')[0]
  } catch (e: any) {
    results.ffmpeg_error = e.message
  }

  try {
    results.path = execSync('echo $PATH').toString().trim()
  } catch (e: any) {
    results.path_error = e.message
  }

  return NextResponse.json(results)
}
