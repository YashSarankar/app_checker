'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { ArrowLeft, Loader2, Hash, Trophy, Star, Download } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function TrackerContent() {
    const searchParams = useSearchParams()
    const appId = searchParams.get('appId')
    const initialTitle = searchParams.get('title')
    const initialIcon = searchParams.get('icon')
    const initialDeveloper = searchParams.get('developer')

    const [keyword, setKeyword] = useState('')
    const [isCheckingRank, setIsCheckingRank] = useState(false)
    const [rankResult, setRankResult] = useState(null)
    const [appDetails, setAppDetails] = useState(null)
    const [isLoadingDetails, setIsLoadingDetails] = useState(false)
    const [history, setHistory] = useState([])

    useEffect(() => {
        if (appId) {
            fetchAppDetails()
            loadHistory()
        }
    }, [appId])

    const fetchAppDetails = async (forceRefresh = false) => {
        if (typeof window !== 'undefined' && !forceRefresh) {
            const cached = localStorage.getItem(`details_${appId}`)
            if (cached) {
                const { data, timestamp } = JSON.parse(cached)
                const isFresh = Date.now() - timestamp < 24 * 60 * 60 * 1000 // 24 hours
                if (isFresh) {
                    setAppDetails(data)
                    return
                }
            }
        }

        setIsLoadingDetails(true)
        try {
            const { data } = await axios.get(`/api/apps/details?appId=${appId}`)
            setAppDetails(data)
            if (typeof window !== 'undefined') {
                localStorage.setItem(`details_${appId}`, JSON.stringify({
                    data,
                    timestamp: Date.now()
                }))
            }
        } catch (error) {
            console.error('Failed to fetch details')
        } finally {
            setIsLoadingDetails(false)
        }
    }

    const loadHistory = () => {
        if (typeof window !== 'undefined') {
            const savedHistory = localStorage.getItem(`history_${appId}`)
            if (savedHistory) setHistory(JSON.parse(savedHistory))
        }
    }

    const saveToHistory = (result) => {
        if (typeof window !== 'undefined') {
            const newEntry = { ...result, id: Date.now(), timestamp: new Date().toISOString() }
            const updatedHistory = [newEntry, ...history].slice(0, 10)
            setHistory(updatedHistory)
            localStorage.setItem(`history_${appId}`, JSON.stringify(updatedHistory))
        }
    }

    const checkRank = async (e, customTerm = null, forceRefresh = false) => {
        if (e) e.preventDefault()
        const termToCheck = customTerm || keyword.trim()
        if (!appId || !termToCheck) return

        if (customTerm) setKeyword(termToCheck)

        // Check if we have a fresh result in history (last 1 hour)
        if (!forceRefresh) {
            const existingEntry = history.find(h => h.term.toLowerCase() === termToCheck.toLowerCase())
            if (existingEntry) {
                const isFresh = Date.now() - new Date(existingEntry.timestamp).getTime() < 60 * 60 * 1000 // 1 hour
                if (isFresh) {
                    setRankResult(existingEntry)
                    return
                }
            }
        }

        setIsCheckingRank(true)
        setRankResult(null)
        try {
            const { data } = await axios.post('/api/keywords', { appId, term: termToCheck })
            setRankResult(data)
            saveToHistory(data)
        } catch (error) {
            console.error('Failed to check rank')
        } finally {
            setIsCheckingRank(false)
        }
    }

    if (!appId) return (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
            <p className="font-medium text-sm">No app selected</p>
            <Link href="/" className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">Return Home</Link>
        </div>
    )

    return (
        <div className="min-h-screen bg-[var(--bg)]">
            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Header */}
                <header className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Apps
                    </Link>

                    <div className="flex items-center gap-6 mb-6">
                        <img
                            src={appDetails?.icon || initialIcon}
                            className="w-20 h-20 rounded-2xl shadow-md"
                            alt={appDetails?.title || initialTitle}
                        />
                        <div className="flex-1">
                            <h1 className="text-3xl font-semibold text-[var(--text-main)] mb-1 tracking-tight">
                                {appDetails?.title || initialTitle}
                            </h1>
                            <p className="text-[var(--text-muted)]">{appDetails?.developer || initialDeveloper}</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass-card p-4 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                                <span className="text-sm text-[var(--text-muted)] font-medium truncate">Rating</span>
                            </div>
                            <p className="text-xl md:text-2xl font-semibold text-[var(--text-main)] truncate">
                                {appDetails?.score?.toFixed(1) || '—'}
                            </p>
                        </div>
                        <div className="glass-card p-4 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <Download className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                <span className="text-sm text-[var(--text-muted)] font-medium truncate">Installs</span>
                            </div>
                            <p className="text-xl md:text-2xl font-semibold text-[var(--text-main)] truncate">
                                {appDetails?.installs || '—'}
                            </p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Keyword Tracker */}
                        <div className="glass-card p-6">
                            <h2 className="text-lg font-semibold text-[var(--text-main)] mb-4 flex items-center gap-2">
                                <Hash className="w-5 h-5 text-blue-600" />
                                Keyword Ranking
                            </h2>

                            <form onSubmit={checkRank} className="mb-4">
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="Enter keyword..."
                                        className="pro-input flex-1"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isCheckingRank || !keyword.trim()}
                                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-[var(--input-bg)] disabled:text-[var(--text-muted)] text-white rounded-lg font-medium transition-colors"
                                    >
                                        {isCheckingRank ? <Loader2 className="w-5 h-5 animate-spin" /> : "Check"}
                                    </button>
                                </div>
                            </form>

                            <p className="text-sm text-[var(--text-muted)]">
                                Search top 250 apps for this keyword
                            </p>
                        </div>

                        {/* Rank Result */}
                        <AnimatePresence mode="wait">
                            {rankResult && (
                                <motion.div
                                    key={rankResult.term}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="glass-card p-8 text-center"
                                >
                                    <p className="text-sm font-medium text-[var(--text-muted)] mb-3 uppercase tracking-wide">
                                        Rank for "{rankResult.term}"
                                    </p>
                                    <div className="text-6xl font-bold text-[var(--text-main)] mb-2">
                                        {rankResult.position === '250+' ? '250+' : `#${rankResult.position}`}
                                    </div>
                                    <p className="text-sm text-[var(--text-muted)]">
                                        {rankResult.position === '250+' ? "Not found in top 250" : "Currently ranked"}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sidebar */}
                    <div className="glass-card p-5">
                        <h3 className="text-base font-semibold text-[var(--text-main)] mb-4">Recent Checks</h3>
                        <div className="space-y-2">
                            {history.map((entry) => (
                                <div
                                    key={entry.id}
                                    onClick={() => checkRank(null, entry.term)}
                                    className="p-3 bg-[var(--input-bg)] hover:bg-[var(--card-border)] rounded-lg cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-[var(--text-main)] truncate flex-1">
                                            {entry.term}
                                        </span>
                                        <span className={`text-sm font-semibold ml-2 ${entry.position === '250+' ? 'text-[var(--text-muted)]' : 'text-blue-600'}`}>
                                            {entry.position === '250+' ? '—' : `#${entry.position}`}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {history.length === 0 && (
                                <p className="text-sm text-[var(--text-muted)] text-center py-4">
                                    No checks yet
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function KeywordTrackerPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--text-muted)]" />
            </div>
        }>
            <TrackerContent />
        </Suspense>
    )
}
