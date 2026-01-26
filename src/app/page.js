'use client'

import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Search, Loader2, ArrowRight, ChevronDown, Check, Plus, TrendingUp, BarChart3, AppWindow } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

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

export default function AppSelectionPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [country, setCountry] = useState('us')
    const [trendingApps, setTrendingApps] = useState([])
    const [isLoadingTrending, setIsLoadingTrending] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

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
        const interval = setInterval(updateTheme, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [country]);

    useEffect(() => {
        const detectLocation = async () => {
            try {
                // Try lightweight service first (api.country.is) as it's very reliable for just country code
                // Fallback to ipapi.co if needed
                let detectedCode = null

                try {
                    const { data } = await axios.get('https://api.country.is')
                    detectedCode = data.country
                } catch (e) {
                    const { data } = await axios.get('https://ipapi.co/json/')
                    detectedCode = data.country_code
                }

                if (detectedCode) {
                    const code = detectedCode.toLowerCase()
                    if (countries.some(c => c.code === code)) {
                        setCountry(code)
                    }
                }
            } catch (error) {
                console.error('Location detection failed', error)
            }
        }
        detectLocation()

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        fetchTrending()
    }, [country])

    const fetchTrending = async () => {
        setIsLoadingTrending(true)
        try {
            const { data } = await axios.get(`/api/apps/charts?country=${country}`)
            setTrendingApps(data)
        } catch (error) {
            console.error('Failed to fetch trending')
        } finally {
            setIsLoadingTrending(false)
        }
    }

    const handleSearch = async (e) => {
        const term = e.target.value
        setSearchTerm(term)
        if (term.length < 3) {
            setSearchResults([])
            return
        }

        setIsSearching(true)
        try {
            const { data } = await axios.get(`/api/apps/search?term=${term}&country=${country}`)
            setSearchResults(data)
        } catch (error) {
            console.error('Search failed')
        } finally {
            setIsSearching(false)
        }
    }

    const selectedCountry = countries.find(c => c.code === country)

    return (
        <div className="max-w-4xl mx-auto px-6 py-20 space-y-12">
            {/* Minimalist Hero */}
            <header className="space-y-4 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-[var(--text-main)]">
                    App Tracker
                </h1>
                <p className="text-[var(--text-muted)] text-lg">
                    Monitor market performance and keyword rankings.
                </p>
            </header>

            {/* Search & Inputs */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search apps..."
                        className="pro-input pl-14"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    {isSearching && (
                        <div className="absolute right-5 top-1/2 -translate-y-1/2">
                            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                        </div>
                    )}
                </div>

                <div className="relative w-full md:w-48" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="pro-input flex items-center justify-between cursor-pointer"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-lg">{selectedCountry?.flag}</span>
                            <span className="font-medium">{selectedCountry?.name}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute right-0 mt-2 w-full bg-[var(--bg-main)] border border-[var(--card-border)] rounded-xl shadow-xl z-50 p-2 max-h-[300px] overflow-y-auto no-scrollbar"
                            >
                                {countries.map((c) => (
                                    <button
                                        key={c.code}
                                        onClick={() => {
                                            setCountry(c.code)
                                            setIsDropdownOpen(false)
                                        }}
                                        className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--input-bg)] ${country === c.code ? 'text-blue-600' : 'text-[var(--text-muted)]'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">{c.flag}</span>
                                            <span>{c.name}</span>
                                        </div>
                                        {country === c.code && <Check className="w-4 h-4" />}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Results & Trending */}
            <main>
                <AnimatePresence mode="wait">
                    {searchResults.length > 0 ? (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 gap-3 max-w-2xl mx-auto"
                        >
                            {searchResults.map((app) => (
                                <Link
                                    key={app.appId}
                                    href={`/tracker?appId=${app.appId}&title=${encodeURIComponent(app.title)}&icon=${encodeURIComponent(app.icon)}&developer=${encodeURIComponent(app.developer)}&country=${country}`}
                                >
                                    <div className="glass-card p-4 flex items-center gap-4 group cursor-pointer hover:border-blue-500/50">
                                        <img src={app.icon} className="w-12 h-12 rounded-xl" alt="" />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-[var(--text-main)] truncate">{app.title}</h3>
                                            <p className="text-sm text-[var(--text-muted)] truncate">{app.developer}</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-blue-500 transition-colors" />
                                    </div>
                                </Link>
                            ))}
                        </motion.div>
                    ) : (
                        searchTerm.length < 3 && (
                            <motion.div key="trending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Trending in {selectedCountry?.name}</h2>
                                    {isLoadingTrending && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {trendingApps.slice(0, 10).map((app, index) => (
                                        <Link
                                            key={app.appId}
                                            href={`/tracker?appId=${app.appId}&title=${encodeURIComponent(app.title)}&icon=${encodeURIComponent(app.icon)}&developer=${encodeURIComponent(app.developer)}&country=${country}`}
                                        >
                                            <div className="group flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--input-bg)] transition-colors border border-transparent hover:border-[var(--card-border)]">
                                                <span className="text-xs font-bold text-[var(--text-muted)] w-5 text-center">
                                                    {(index + 1)}
                                                </span>
                                                <img src={app.icon} className="w-8 h-8 rounded-lg shadow-sm bg-[var(--input-bg)]" alt="" />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-[var(--text-main)] truncate text-xs">{app.title}</h3>
                                                    <p className="text-[10px] text-[var(--text-muted)] truncate">{app.developer}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        )
                    )}
                </AnimatePresence>
            </main>
            {/* Empty State Refinement */}
            {searchResults.length === 0 && !isSearching && searchTerm.length >= 3 && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="bg-slate-900/50 p-6 rounded-3xl mb-4 border border-white/5">
                        <AppWindow className="w-10 h-10 text-slate-700" />
                    </div>
                    <h3 className="text-xl font-bold text-white uppercase italic">No Matches Found</h3>
                    <p className="text-slate-500 text-sm max-w-xs mt-1">We couldn't find an app matching your query. Please check the spelling or try the full package name.</p>
                </div>
            )}
        </div>
    )
}
