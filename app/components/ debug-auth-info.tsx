"use client"

import { useAuth } from '@/lib/auth/auth-context'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export function DebugAuthInfo() {
    const { isAuthenticated, isLoading, user } = useAuth()
    const pathname = usePathname()
    const [logs, setLogs] = useState<string[]>([])

    // 重要なログのみキャプチャ
    useEffect(() => {
        const originalLog = console.log
        console.log = (...args) => {
            originalLog(...args)
            const message = args.join(' ')
            if (
                message.includes('Auth initialization') ||
                message.includes('Sign in successful') ||
                message.includes('Sign out') ||
                message.includes('Token refresh') ||
                message.includes('redirect')
            ) {
                setLogs(prev => [...prev.slice(-5), `${new Date().toLocaleTimeString()}: ${message}`])
            }
        }

        return () => {
            console.log = originalLog
        }
    }, [])

    // 開発環境でのみ表示
    if (process.env.NODE_ENV !== 'development') {
        return null
    }

    const hasTokens = !!(localStorage.getItem('accessToken') && localStorage.getItem('refreshToken'))
    const stateSync = isAuthenticated === hasTokens

    return (
        <div className="fixed top-0 left-0 bg-black/95 text-white p-3 text-xs z-50 max-w-sm border border-gray-600 rounded-br-lg">
            <div className="font-bold text-yellow-400 mb-2">🐛 Auth Debug</div>
            <div className="space-y-1">
                <div><span className="text-blue-300">Path:</span> {pathname}</div>
                <div><span className="text-blue-300">Loading:</span> {isLoading.toString()}</div>
                <div><span className="text-blue-300">Authenticated:</span> {isAuthenticated.toString()}</div>
                <div><span className="text-blue-300">User:</span> {user?.email || 'null'}</div>

                <div className="mt-2 pt-2 border-t border-gray-600">
                    <div><span className="text-green-300">Tokens:</span></div>
                    <div className="ml-2 space-y-1">
                        <div>Access: {localStorage.getItem('accessToken') ? '✅' : '❌'}</div>
                        <div>Refresh: {localStorage.getItem('refreshToken') ? '✅' : '❌'}</div>
                        <div>State Sync: {stateSync ? '✅ OK' : '❌ MISMATCH'}</div>
                    </div>
                </div>

                {logs.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-600">
                        <div className="text-yellow-300 text-xs mb-1">Recent Auth Events:</div>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                            {logs.map((log, i) => (
                                <div key={i} className="text-gray-300 text-xs">{log}</div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-2 pt-2 border-t border-gray-600 flex gap-2">
                    <button
                        onClick={() => {
                            localStorage.clear()
                            sessionStorage.clear()
                            window.location.reload()
                        }}
                        className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
                    >
                        🗑️ Reset
                    </button>
                    <button
                        onClick={() => setLogs([])}
                        className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
                    >
                        Clear Logs
                    </button>
                </div>
            </div>
        </div>
    )
}