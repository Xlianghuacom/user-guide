'use client'

import { ComposerLoader } from '@/components/application/composer-loader/composer-loader'
import { addBasePath } from 'next/dist/client/add-base-path'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Hit = {
  url: string
  title: string
  excerpt: string
}

type PagefindResult = {
  data: () => Promise<{
    url: string
    excerpt?: string
    meta?: { title?: string }
  }>
}

declare global {
  interface Window {
    pagefind?: {
      options: (options: { baseUrl: string }) => Promise<void>
      debouncedSearch: (
        query: string
      ) => Promise<{ results: PagefindResult[] } | null>
    }
  }
}

async function loadPagefind() {
  if (window.pagefind) return window.pagefind
  const pagefind = await import(
    /* webpackIgnore: true */ addBasePath('/_pagefind/pagefind.js')
  )
  await pagefind.options({ baseUrl: '/' })
  window.pagefind = pagefind
  return pagefind
}

export function HelpSearch() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState<Hit[]>([])
  const [status, setStatus] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const value = query.trim()
    if (!value) {
      setHits([])
      setStatus('')
      return
    }

    let cancelled = false
    const timer = window.setTimeout(async () => {
      setStatus('正在搜索…')
      try {
        const pagefind = await loadPagefind()
        const response = await pagefind.debouncedSearch(value)
        if (!response || cancelled) return
        const data = await Promise.all(
          response.results.slice(0, 6).map((result: PagefindResult) => result.data())
        )
        if (cancelled) return
        setHits(
          data.map(item => ({
            url: item.url.replace(/\.html(?=#|$)/, ''),
            title: item.meta?.title || '帮助文档',
            excerpt: item.excerpt || ''
          }))
        )
        setStatus(data.length ? '' : '没有找到相关内容')
      } catch {
        if (!cancelled) {
          setHits([])
          setStatus('搜索暂时不可用')
        }
      }
    }, 180)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [query])

  function openResult(url?: string) {
    const target = url ?? hits[0]?.url
    if (!target) return
    setOpen(false)
    router.push(target)
  }

  return (
    <div className="help-composer-wrap">
      <ComposerLoader
        active
        className="help-composer"
        colors={['#ff8fbf', '#ff8fbf', '#ff8fbf', '#ff8fbf']}
        intensity={0.85}
        bloom={18}
        bloomStrength={0.22}
        line={1.8}
        arc={110}
        speed={4.5}
      >
        <form
          className="help-composer-form"
          onSubmit={event => {
            event.preventDefault()
            openResult()
          }}
        >
          <span className="help-composer-plus" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7.1" cy="7.1" r="4.1" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M10.2 10.2 13.2 13.2"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            value={query}
            placeholder="有什么问题就问我"
            aria-label="搜索帮助"
            onChange={event => {
              setQuery(event.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
          />
          <button className="help-composer-send" type="submit" aria-label="搜索">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 12.5V3.5M8 3.5 4.2 7.3M8 3.5l3.8 3.8"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </ComposerLoader>
      {open && (status || hits.length > 0) && (
        <div className="help-composer-results">
          {status && hits.length === 0 && (
            <p className="help-composer-status">{status}</p>
          )}
          {hits.map(hit => (
            <a
              key={hit.url}
              href={hit.url}
              onClick={event => {
                event.preventDefault()
                openResult(hit.url)
              }}
            >
              {hit.title}
              {hit.excerpt && (
                <small dangerouslySetInnerHTML={{ __html: hit.excerpt }} />
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
