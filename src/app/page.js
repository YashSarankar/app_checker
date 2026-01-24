'use client'

import { useState } from 'react'
import axios from 'axios'
import { Search, Plus, TrendingUp, BarChart2, Loader2, Play, Info, Hash } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AppRankChecker() {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [selectedApp, setSelectedApp] = useState(null)
    const [keyword, setKeyword] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [isCheckingRank, setIsCheckingRank] = useState(false)
    const [rankResult, setRankResult] = useState(null)

    const handleSearch = async (e) => {
        const term = e.target.value
        setSearchTerm(term)
        if (term.length < 3) {
            setSearchResults([])
            return
        }

        setIsSearching(true)
        try {
            const { data } = await axios.get(`/api/apps/search?term=${term}`)
            setSearchResults(data)
        } catch (error) {
            console.error('Search failed')
        } finally {
            setIsSearching(false)
        }
    }

    const checkRank = async (e) => {
        if (e) e.preventDefault()
        if (!selectedApp || !keyword.trim()) return

        setIsCheckingRank(true)
        setRankResult(null)
        try {
            const { data } = await axios.post('/api/keywords', {
                appId: selectedApp.appId,
                term: keyword.trim()
            })
            setRankResult(data)
        } catch (error) {
            console.error('Failed to check rank')
        } finally {
            setIsCheckingRank(false)
        }
    }

    return (
        <div className="space-y-12">
            {/* App Selection Section */}
            <section className="space-y-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-extrabold tracking-tight">1. Find your App</h2>
                    <p className="text-slate-400">Search for the app you want to check rankings for.</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search Apple Play Store (e.g. WhatsApp, Instagram)..."
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-3xl py-5 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all text-lg shadow-xl"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    {isSearching && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    )}
                </div>

                {/* Search Results */}
                <AnimatePresence>
                    {searchResults.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                            {searchResults.map((app) => (
                                <motion.div
                                    key={app.appId}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setSelectedApp(app)
                                        setSearchResults([])
                                        setSearchTerm('')
                                    }}
                                    className={`glass-card flex items-center gap-4 cursor-pointer border-2 ${selectedApp?.appId === app.appId ? 'border-primary bg-primary/10' : 'border-transparent'}`}
                                >
                                    <img src={app.icon} alt={app.title} className="w-14 h-14 rounded-2xl shadow-lg" />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold truncate">{app.title}</h3>
                                        <p className="text-sm text-slate-400 truncate">{app.developer}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* Selected App & Keyword Input */}
            {selectedApp && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-primary/5 border border-primary/20 rounded-3xl">
                        <img src={selectedApp.icon} className="w-24 h-24 rounded-3xl shadow-2xl border-4 border-slate-800" />
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold">{selectedApp.title}</h2>
                            <p className="text-slate-400">{selectedApp.developer}</p>
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="text-xs text-primary underline mt-2 hover:text-white"
                            >
                                Change App
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-extrabold tracking-tight">2. Enter Keyword</h2>
                            <p className="text-slate-400">Discover where this app ranks for a specific term.</p>
                        </div>

                        <form onSubmit={checkRank} className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="e.g. food delivery, fitness tracker..."
                                    className="w-full bg-slate-900/80 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-secondary outline-none transition-all text-lg"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isCheckingRank || !keyword.trim()}
                                className="bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] text-white px-8 py-4 rounded-2xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
                            >
                                {isCheckingRank ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Checking Top 250...
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-6 h-6 fill-current" />
                                        Check Rank
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.section>
            )}

            {/* Rank Result Display */}
            <AnimatePresence>
                {rankResult && (
                    <motion.section
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex justify-center pt-8"
                    >
                        <div className="glass-card w-full max-w-sm text-center py-12 space-y-4 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10">
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Keyword: "{rankResult.term}"</p>
                                <div className="text-8xl font-black bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent py-4">
                                    {rankResult.position === '250+' ? 'Oops' : `#${rankResult.position}`}
                                </div>
                                <p className="text-xl font-medium text-slate-300">
                                    {rankResult.position === '250+'
                                        ? "Not found in Top 250"
                                        : "Current Ranking Position"}
                                </p>
                                <div className="flex items-center justify-center gap-2 mt-6 text-slate-500 text-xs">
                                    <Info className="w-4 h-4" />
                                    Live search across Google Play results
                                </div>
                            </div>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </div>
    )
}
