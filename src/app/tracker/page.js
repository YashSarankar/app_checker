'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { ArrowLeft, Loader2, Play, Hash, TrendingUp, Trophy, Star, Download, Calendar, Sparkles, History, ArrowUpRight, Minus, Users, LayoutGrid, MessageSquare, ShieldCheck, ChevronRight, Check, Info, AppWindow } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const countries = [
    { code: 'us', name: 'United States', flag: '🇺🇸' },
    { code: 'in', name: 'India', flag: '🇮🇳' },
    { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'ca', name: 'Canada', flag: '🇨🇦' },
    { code: 'au', name: 'Australia', flag: '🇦🇺' },
    { code: 'de', name: 'Germany', flag: '🇩🇪' },
    { code: 'fr', name: 'France', flag: '🇫🇷' },
    { code: 'br', name: 'Brazil', flag: '🇧🇷' },
]

import { getTimeBasedTheme } from '@/utils/theme'

function TrackerContent() {
    const searchParams = useSearchParams()
    const appId = searchParams.get('appId')
    const initialTitle = searchParams.get('title')
    const initialIcon = searchParams.get('icon')
    const initialDeveloper = searchParams.get('developer')
    const initialCountry = searchParams.get('country') || 'us'

    const selectedCountry = countries.find(c => c.code === initialCountry)

    const [keyword, setKeyword] = useState('')
    const [isCheckingRank, setIsCheckingRank] = useState(false)
    const [rankResult, setRankResult] = useState(null)
    const [country, setCountry] = useState(initialCountry)

    const [appDetails, setAppDetails] = useState(null)
    const [isLoadingDetails, setIsLoadingDetails] = useState(false)

    const [history, setHistory] = useState([])
    const [suggestions, setSuggestions] = useState([])
    const [similarApps, setSimilarApps] = useState([])
    const [developerApps, setDeveloperApps] = useState([])

    const [isLoadingExtra, setIsLoadingExtra] = useState(false)
    const [activeTab, setActiveTab] = useState('similar')

    // Theme Management
    useEffect(() => {
        const updateTheme = () => {
            const theme = getTimeBasedTheme(country);
            if (theme === 'light') {
                document.body.classList.add('light-mode');
            } else {
                document.body.classList.remove('light-mode');
            }
        };

        updateTheme();
        const interval = setInterval(updateTheme, 60000);
        return () => clearInterval(interval);
    }, [country]);

    useEffect(() => {
        if (appId) {
            fetchAppDetails()
            loadHistory()
            fetchExtraFeatures()
        }
    }, [appId])

    useEffect(() => {
        if (keyword.length > 2) {
            fetchSuggestions()
        } else {
            setSuggestions([])
        }
    }, [keyword])

    const fetchAppDetails = async () => {
        setIsLoadingDetails(true)
        try {
            const { data } = await axios.get(`/api/apps/details?appId=${appId}&country=${country}`)
            setAppDetails(data)
        } catch (error) {
            console.error('Failed to fetch details')
        } finally {
            setIsLoadingDetails(false)
        }
    }

    const fetchExtraFeatures = async () => {
        setIsLoadingExtra(true)
        try {
            const similarRes = await axios.get(`/api/apps/similar?appId=${appId}`)
            setSimilarApps(similarRes.data.slice(0, 8))

            // Dynamic developer lookup
            const devId = appDetails?.developerId || initialDeveloper
            const devRes = await axios.get(`/api/apps/developer?devId=${devId}`)
            setDeveloperApps(devRes.data.slice(0, 8))
        } catch (error) {
            console.error('Failed to fetch extra features')
        } finally {
            setIsLoadingExtra(false)
        }
    }

    const fetchSuggestions = async () => {
        try {
            const { data } = await axios.get(`/api/keywords/suggest?term=${keyword}`)
            setSuggestions(data.slice(0, 5))
        } catch (error) {
            console.error('Failed to fetch suggestions')
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
            const updatedHistory = [newEntry, ...history].slice(0, 8)
            setHistory(updatedHistory)
            localStorage.setItem(`history_${appId}`, JSON.stringify(updatedHistory))
        }
    }

    const checkRank = async (e, customTerm = null) => {
        if (e) e.preventDefault()
        const termToCheck = customTerm || keyword.trim()
        if (!appId || !termToCheck) return

        if (customTerm) setKeyword(customTerm)

        setIsCheckingRank(true)
        setRankResult(null)
        try {
            const { data } = await axios.post('/api/keywords', { appId, term: termToCheck, country })
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
            <Info className="w-10 h-10 mb-4 opacity-50" />
            <p className="font-medium text-sm">Access Denied: No App Selected</p>
            <Link href="/" className="mt-4 pro-button text-xs">Return Home</Link>
        </div>
    )

    return (
        <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
            {/* Minimal Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <img src={appDetails?.icon || initialIcon} className="w-20 h-20 rounded-2xl shadow-sm bg-[var(--input-bg)]" />
                    <div>
                        <Link href="/" className="flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--accent)] text-sm font-medium mb-1 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back
                        </Link>
                        <h1 className="text-3xl font-bold text-[var(--text-main)] mb-1">{appDetails?.title || initialTitle}</h1>
                        <p className="text-[var(--text-muted)] text-sm">{appDetails?.developer || initialDeveloper}</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] px-4 py-2 rounded-xl">
                        <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-1">Rating</div>
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-[var(--text-main)]">{appDetails?.score?.toFixed(1) || '0.0'}</span>
                        </div>
                    </div>
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] px-4 py-2 rounded-xl">
                        <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-1">Installs</div>
                        <div className="flex items-center gap-2">
                            <Download className="w-4 h-4 text-emerald-500" />
                            <span className="font-bold text-[var(--text-main)]">{appDetails?.installs || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-10">

                    {/* Minimal Rank Checker */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
                            <Hash className="w-5 h-5 text-[var(--accent)]" /> Keyword Tracking
                        </h2>

                        <div className="glass-card p-6 space-y-4">
                            <form onSubmit={checkRank} className="flex gap-3">
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
                                    className="pro-button"
                                >
                                    {isCheckingRank ? <Loader2 className="w-5 h-5 animate-spin" /> : "Check"}
                                </button>
                            </form>

                            <AnimatePresence>
                                {suggestions.length > 0 && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2">
                                        <span className="text-xs text-[var(--text-muted)] flex items-center mt-1 mr-2">Suggestions:</span>
                                        {suggestions.map((s, i) => (
                                            <button key={i} onClick={() => checkRank(null, s)} className="text-xs font-medium text-[var(--accent)] hover:underline bg-[var(--input-bg)] px-3 py-1 rounded-full">
                                                {s}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Rank Result */}
                    <AnimatePresence mode="wait">
                        {rankResult && (
                            <motion.div key={rankResult.term} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                <div className="glass-card p-8 text-center border-l-4 border-l-blue-500 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Trophy className="w-32 h-32" />
                                    </div>
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">Rank for "{rankResult.term}"</h3>
                                    <div className="text-6xl font-black text-[var(--text-main)] mb-2">
                                        {typeof rankResult.position === 'string' && rankResult.position.includes('Found') ? 'HIT' : rankResult.position === '1000+' ? '> 1k' : `#${rankResult.position}`}
                                    </div>
                                    <p className="text-sm text-[var(--text-muted)]">
                                        {rankResult.position === '1000+' ? "Not found in top results" : "Currently visible in charts"}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Minimal Tabs */}
                    <div className="space-y-6">
                        <div className="flex gap-6 border-b border-[var(--card-border)] pb-1">
                            {[
                                { id: 'similar', label: 'Competitors' },
                                { id: 'developer', label: 'More by Developer' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`text-sm font-semibold pb-3 border-b-2 transition-all ${activeTab === tab.id ? 'border-[var(--accent)] text-[var(--text-main)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="min-h-[200px]">
                            {isLoadingExtra ? (
                                <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[var(--text-muted)]" /></div>
                            ) : (
                                <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {(activeTab === 'similar' ? similarApps : developerApps).map((app) => (
                                        <Link key={app.appId} href={`/tracker?appId=${app.appId}&title=${encodeURIComponent(app.title)}&icon=${encodeURIComponent(app.icon)}&developer=${encodeURIComponent(app.developer)}&country=${country}`}>
                                            <div className="glass-card p-4 hover:border-blue-500/30 flex gap-3 items-center group">
                                                <img src={app.icon} className="w-10 h-10 rounded-lg bg-[var(--input-bg)]" />
                                                <div className="min-w-0">
                                                    <h4 className="text-sm font-medium text-[var(--text-main)] truncate">{app.title}</h4>
                                                    <p className="text-xs text-[var(--text-muted)] truncate">{app.developer}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                    {(activeTab === 'similar' ? similarApps : developerApps).length === 0 && (
                                        <p className="text-[var(--text-muted)] text-sm col-span-2 text-center py-8">No data available.</p>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar History */}
                <div className="space-y-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--card-border)] pb-2">Recent Checks</h3>
                    <div className="space-y-2">
                        {history.map((entry) => (
                            <div key={entry.id} onClick={() => checkRank(null, entry.term)} className="glass-card p-3 flex justify-between items-center cursor-pointer hover:bg-[var(--input-bg)]">
                                <span className="text-sm font-medium text-[var(--text-main)] truncate max-w-[120px]">{entry.term}</span>
                                <span className={`text-xs font-bold ${entry.position === '1000+' ? 'text-[var(--text-muted)]' : 'text-[var(--accent)]'}`}>
                                    {entry.position}
                                </span>
                            </div>
                        ))}
                        {history.length === 0 && <p className="text-xs text-[var(--text-muted)] italic">No history yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function KeywordTrackerPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-[var(--text-muted)]" /></div>}>
            <TrackerContent />
        </Suspense>
    )
}
