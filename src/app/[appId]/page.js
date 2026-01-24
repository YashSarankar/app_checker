'use client'

import { useState, useEffect, use } from 'react'
import axios from 'axios'
import { ArrowLeft, Plus, RefreshCw, Star, TrendingDown, TrendingUp, Minus, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function AppDetails({ params: paramsPromise }) {
    const params = use(paramsPromise)
    const [app, setApp] = useState(null)
    const [keywords, setKeywords] = useState([])
    const [newKeyword, setNewKeyword] = useState('')
    const [isAdding, setIsAdding] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [appRes, keywordsRes] = await Promise.all([
                axios.get('/api/apps/track'), // We already have the app info in the track list
                axios.get(`/api/keywords?appId=${params.appId}`)
            ])

            const currentApp = appRes.data.find(a => a.appId === params.appId)
            setApp(currentApp)
            setKeywords(keywordsRes.data)
        } catch (error) {
            console.error('Failed to fetch data')
        } finally {
            setIsLoading(false)
        }
    }

    const addKeyword = async (e) => {
        if (e) e.preventDefault()
        if (!newKeyword.trim()) return

        setIsAdding(true)
        try {
            await axios.post('/api/keywords', {
                appId: params.appId,
                term: newKeyword.trim()
            })
            setNewKeyword('')
            fetchData()
        } catch (error) {
            console.error('Failed to add keyword')
        } finally {
            setIsAdding(false)
        }
    }

    const getStatusIcon = (keyword) => {
        if (keyword.rankings.length < 2) return <Minus className="w-4 h-4 text-slate-500" />
        const current = keyword.rankings[0].position
        const prev = keyword.rankings[1].position

        if (current < prev) return <TrendingUp className="w-4 h-4 text-emerald-500" />
        if (current > prev) return <TrendingDown className="w-4 h-4 text-rose-500" />
        return <Minus className="w-4 h-4 text-slate-500" />
    }

    const getPositionChange = (keyword) => {
        if (keyword.rankings.length < 2) return null
        const change = keyword.rankings[1].position - keyword.rankings[0].position
        if (change === 0) return null
        return (
            <span className={change > 0 ? "text-emerald-500" : "text-rose-500"}>
                {change > 0 ? `+${change}` : change}
            </span>
        )
    }

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>

    return (
        <div className="space-y-8">
            <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>

            {app && (
                <section className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
                    <img src={app.icon} alt={app.title} className="w-32 h-32 rounded-3xl shadow-2xl" />
                    <div className="flex-1 space-y-2 text-center md:text-left">
                        <h1 className="text-4xl font-extrabold">{app.title}</h1>
                        <p className="text-xl text-slate-400 font-medium">{app.developer}</p>
                        <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                            <span className="bg-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-bold border border-primary/20">
                                {app.appId}
                            </span>
                        </div>
                    </div>
                </section>
            )}

            <section className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold">Keyword Rankings</h2>
                    <form onSubmit={addKeyword} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter keyword to track..."
                            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                        />
                        <button
                            disabled={isAdding}
                            className="bg-primary hover:bg-primary/80 text-white p-2 rounded-xl transition-all disabled:opacity-50"
                        >
                            {isAdding ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
                        </button>
                    </form>
                </div>

                <div className="overflow-hidden bg-slate-900/30 rounded-3xl border border-slate-800">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-800/50">
                                <th className="px-6 py-4 font-semibold text-slate-400">Keyword</th>
                                <th className="px-6 py-4 font-semibold text-slate-400">Rank</th>
                                <th className="px-6 py-4 font-semibold text-slate-400 text-right">Trend</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {keywords.map((kw) => (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    key={kw.id}
                                    className="hover:bg-white/5 transition-colors"
                                >
                                    <td className="px-6 py-5 font-medium">{kw.term}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xl font-bold ${kw.rankings[0]?.position <= 10 ? 'text-primary' : ''}`}>
                                                #{kw.rankings[0]?.position || 'N/A'}
                                            </span>
                                            {getPositionChange(kw)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex justify-end">
                                            {getStatusIcon(kw)}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            {keywords.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-6 py-20 text-center text-slate-500 italic">
                                        No keywords tracked yet. Add one above!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}
