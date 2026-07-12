# Capability: Transcribe Video

Extract a plain-text transcript from a YouTube video using `yt-dlp`.

## When to Use

When a research task references a YouTube video URL and you need the spoken content as text for analysis, summarization, or citation.

## Command

```bash
yt-dlp --skip-download --write-auto-sub --write-sub --sub-lang en --convert-subs srt -o - "VIDEO_URL" 2>/dev/null \
  | sed '/^[0-9]/d; /^$/d; /-->/d; s/<[^>]*>//g'
```

**What this does:** Downloads subtitles only (no video), prefers manual captions over auto-generated, converts to SRT, then strips timestamps, blank lines, and HTML tags to produce plain text.

## Parameters

| Flag | Purpose |
|------|---------|
| `--skip-download` | Do not download audio/video |
| `--write-sub` | Fetch manually uploaded subtitles |
| `--write-auto-sub` | Fall back to auto-generated subtitles |
| `--sub-lang en` | Request English. Change code for other languages. |
| `--convert-subs srt` | Normalize subtitle format to SRT before text extraction |
| `-o -` | Write to stdout instead of a file |

## Variations

**List available languages first:**
```bash
yt-dlp --list-subs "VIDEO_URL"
```

**Keep timestamps** (useful when citing specific moments):
```bash
yt-dlp --skip-download --write-auto-sub --write-sub --sub-lang en --convert-subs srt -o - "VIDEO_URL" 2>/dev/null \
  | sed '/^$/d; s/<[^>]*>//g'
```

**Non-English transcript:**
```bash
yt-dlp --skip-download --write-auto-sub --write-sub --sub-lang ja --convert-subs srt -o - "VIDEO_URL" 2>/dev/null \
  | sed '/^[0-9]/d; /^$/d; /-->/d; s/<[^>]*>//g'
```

## Handling Long Videos

Transcripts from long videos (60+ minutes) can be very large. When the output exceeds ~20,000 words:

1. Capture to a temp file: `yt-dlp ... -o "/tmp/transcript" "VIDEO_URL"`
2. Read the resulting `.srt` file in chunks using the Read tool
3. Summarize in sections rather than loading the entire transcript into context at once

## Limitations

- Requires the video to have captions (manual or auto-generated). If `yt-dlp` returns no subtitle output, the video has no available captions.
- Auto-generated captions may contain transcription errors, especially for technical terms, brand names, or non-English speech.
- Age-restricted or private videos may fail without authentication cookies.
