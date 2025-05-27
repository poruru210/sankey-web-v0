"use client"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {
    Key,
    Shield,
    FileKey,
    Settings,
    User,
    Copy,
    Eye,
    EyeOff,
    CheckCircle,
    Clock,
    History,
    Mail,
    Search,
    Filter,
    X,
    AlertTriangle,
    Hash,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    LogOut,
} from "lucide-react"
import {useState, useCallback, useMemo, useEffect} from "react"
import {useRouter} from "next/navigation"
import Image from "next/image"
import Particles from "react-tsparticles"
import type {Container, Engine} from "tsparticles-engine"
import {loadSlim} from "tsparticles-slim"

export default function Component() {
    const router = useRouter()
    const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
    const [accountFilter, setAccountFilter] = useState("")
    const [xAccountFilter, setXAccountFilter] = useState("")
    const [brokerFilter, setBrokerFilter] = useState("")
    const [eaNameFilter, setEaNameFilter] = useState("")
    const [deactivateDialog, setDeactivateDialog] = useState<{
        isOpen: boolean
        licenseId: string
        eaName: string
    }>({
        isOpen: false,
        licenseId: "",
        eaName: "",
    })
    const [rejectDialog, setRejectDialog] = useState<{
        isOpen: boolean
        applicationId: string
        eaName: string
    }>({
        isOpen: false,
        applicationId: "",
        eaName: "",
    })
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [currentView, setCurrentView] = useState("dashboard")

    // Pagination states
    const [pendingCurrentPage, setPendingCurrentPage] = useState(1)
    const [activeCurrentPage, setActiveCurrentPage] = useState(1)
    const [historyCurrentPage, setHistoryCurrentPage] = useState(1)

    // Settings states
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [changePlanOpen, setChangePlanOpen] = useState(false)

    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine)
    }, [])

    const particlesLoaded = useCallback(async (container: Container | undefined) => {
        // Particles loaded callback
    }, [])

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024
            setIsMobile(mobile)
            if (!mobile) {
                setSidebarOpen(true) // PCの場合は常に表示
            } else {
                setSidebarOpen(false) // モバイルの場合は非表示
            }
        }

        checkMobile()
        window.addEventListener("resize", checkMobile)

        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    // Logout function
    const handleLogout = () => {
        sessionStorage.removeItem("isLoggedIn")
        router.push("/login")
    }

    // 申請待ちデータ
    const pendingApplications = [
        {
            id: "APP-001",
            accountNumber: "12345678",
            broker: "XM Trading",
            eaName: "Scalping Master Pro",
            email: "trader1@example.com",
            xAccount: "@trader_pro",
            appliedAt: "2024-01-15",
            status: "Pending",
        },
        {
            id: "APP-002",
            accountNumber: "87654321",
            broker: "FXGT",
            eaName: "Trend Follower Elite",
            email: "trader2@example.com",
            xAccount: "@fx_trader",
            appliedAt: "2024-01-14",
            status: "Pending",
        },
        {
            id: "APP-003",
            accountNumber: "11223344",
            broker: "Exness",
            eaName: "Grid Master AI",
            email: "trader3@example.com",
            xAccount: "@grid_ai",
            appliedAt: "2024-01-13",
            status: "Pending",
        },
        {
            id: "APP-004",
            accountNumber: "55667788",
            broker: "TitanFX",
            eaName: "News Trading Bot",
            email: "trader4@example.com",
            xAccount: "@news_bot",
            appliedAt: "2024-01-12",
            status: "Pending",
        },
        {
            id: "APP-005",
            accountNumber: "99887766",
            broker: "IC Markets",
            eaName: "Martingale Expert",
            email: "trader5@example.com",
            xAccount: "@martingale_pro",
            appliedAt: "2024-01-11",
            status: "Pending",
        },
    ]

    // 承認済み・発行済みデータ
    const approvedLicenses = [
        {
            id: "LIC-001",
            accountNumber: "11111111",
            broker: "Exness",
            eaName: "Grid Trading System",
            email: "trader3@example.com",
            xAccount: "@grid_master",
            licenseKey: "GTS-2024-XXXX-YYYY-ZZZZ",
            approvedAt: "2024-01-10",
            expiresAt: "2024-12-31",
            status: "Active",
        },
        {
            id: "LIC-002",
            accountNumber: "22222222",
            broker: "TitanFX",
            eaName: "Scalping Master Pro",
            email: "trader4@example.com",
            xAccount: "@scalper_king",
            licenseKey: "SMP-2024-AAAA-BBBB-CCCC",
            approvedAt: "2024-01-08",
            expiresAt: "2024-11-15",
            status: "Active",
        },
        {
            id: "LIC-003",
            accountNumber: "33333333",
            broker: "XM Trading",
            eaName: "Trend Follower Elite",
            email: "trader5@example.com",
            xAccount: "@trend_master",
            licenseKey: "TFE-2024-DDDD-EEEE-FFFF",
            approvedAt: "2024-01-07",
            expiresAt: "2024-10-20",
            status: "Active",
        },
    ]

    // ヒストリーデータ
    const licenseHistory = [
        {
            id: "HIS-001",
            accountNumber: "99999999",
            broker: "XM Trading",
            eaName: "Scalping Master Pro",
            email: "oldtrader1@example.com",
            xAccount: "@old_trader1",
            licenseKey: "SMP-2023-XXXX-YYYY-ZZZZ",
            issuedAt: "2023-12-01",
            expiredAt: "2023-12-31",
            status: "Expired",
            action: "Expired",
        },
        {
            id: "HIS-002",
            accountNumber: "88888888",
            broker: "FXGT",
            eaName: "Grid Trading System",
            email: "oldtrader2@example.com",
            xAccount: "@old_trader2",
            licenseKey: "GTS-2023-AAAA-BBBB-CCCC",
            issuedAt: "2023-11-15",
            revokedAt: "2023-12-15",
            status: "Revoked",
            action: "Revoked",
        },
    ]

    // ブローカーの一覧を取得
    const allBrokers = useMemo(() => {
        const brokers = new Set([
            ...pendingApplications.map((app) => app.broker),
            ...approvedLicenses.map((license) => license.broker),
        ])
        return Array.from(brokers).sort()
    }, [pendingApplications, approvedLicenses])

    // フィルタリングされた申請一覧
    const filteredPendingApplications = useMemo(() => {
        return pendingApplications.filter((app) => {
            const matchesAccount =
                accountFilter === "" || app.accountNumber.toLowerCase().includes(accountFilter.toLowerCase())
            const matchesXAccount = xAccountFilter === "" || app.xAccount.toLowerCase().includes(xAccountFilter.toLowerCase())
            const matchesBroker = brokerFilter === "" || app.broker === brokerFilter
            const matchesEaName = eaNameFilter === "" || app.eaName.toLowerCase().includes(eaNameFilter.toLowerCase())
            return matchesAccount && matchesXAccount && matchesBroker && matchesEaName
        })
    }, [pendingApplications, accountFilter, xAccountFilter, brokerFilter, eaNameFilter])

    // フィルタリングされたライセンス一覧
    const filteredApprovedLicenses = useMemo(() => {
        return approvedLicenses.filter((license) => {
            const matchesAccount =
                accountFilter === "" || license.accountNumber.toLowerCase().includes(accountFilter.toLowerCase())
            const matchesXAccount =
                xAccountFilter === "" || license.xAccount.toLowerCase().includes(xAccountFilter.toLowerCase())
            const matchesBroker = brokerFilter === "" || license.broker === brokerFilter
            const matchesEaName = eaNameFilter === "" || license.eaName.toLowerCase().includes(eaNameFilter.toLowerCase())
            return matchesAccount && matchesXAccount && matchesBroker && matchesEaName
        })
    }, [approvedLicenses, accountFilter, xAccountFilter, brokerFilter, eaNameFilter])

    // フィルタリングされたヒストリー一覧
    const filteredLicenseHistory = useMemo(() => {
        return licenseHistory.filter((history) => {
            const matchesAccount =
                accountFilter === "" || history.accountNumber.toLowerCase().includes(accountFilter.toLowerCase())
            const matchesXAccount =
                xAccountFilter === "" || history.xAccount.toLowerCase().includes(xAccountFilter.toLowerCase())
            const matchesBroker = brokerFilter === "" || history.broker === brokerFilter
            const matchesEaName = eaNameFilter === "" || history.eaName.toLowerCase().includes(eaNameFilter.toLowerCase())
            return matchesAccount && matchesXAccount && matchesBroker && matchesEaName
        })
    }, [licenseHistory, accountFilter, xAccountFilter, brokerFilter, eaNameFilter])

    // Pagination calculations
    const getPaginatedData = (data: any[], currentPage: number) => {
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        return data.slice(startIndex, endIndex)
    }

    const getTotalPages = (totalItems: number) => {
        return Math.ceil(totalItems / itemsPerPage)
    }

    // Paginated data
    const paginatedPendingApplications = getPaginatedData(filteredPendingApplications, pendingCurrentPage)
    const paginatedApprovedLicenses = getPaginatedData(filteredApprovedLicenses, activeCurrentPage)
    const paginatedLicenseHistory = getPaginatedData(filteredLicenseHistory, historyCurrentPage)

    // Total pages
    const pendingTotalPages = getTotalPages(filteredPendingApplications.length)
    const activeTotalPages = getTotalPages(filteredApprovedLicenses.length)
    const historyTotalPages = getTotalPages(filteredLicenseHistory.length)

    // Reset pagination when filters change
    useEffect(() => {
        setPendingCurrentPage(1)
        setActiveCurrentPage(1)
        setHistoryCurrentPage(1)
    }, [accountFilter, xAccountFilter, brokerFilter, eaNameFilter])

    // Reset pagination when items per page changes
    useEffect(() => {
        setPendingCurrentPage(1)
        setActiveCurrentPage(1)
        setHistoryCurrentPage(1)
    }, [itemsPerPage])

    // Pagination component
    const PaginationControls = ({
                                    currentPage,
                                    totalPages,
                                    onPageChange,
                                    totalItems,
                                    itemType,
                                }: {
        currentPage: number
        totalPages: number
        onPageChange: (page: number) => void
        totalItems: number
        itemType: string
    }) => {
        const startItem = (currentPage - 1) * itemsPerPage + 1
        const endItem = Math.min(currentPage * itemsPerPage, totalItems)

        return (
            <div className="flex flex-col items-center gap-4 mt-6 pt-4 border-t border-emerald-500/20">
                <div className="text-sm text-emerald-200/70">
                    Showing {startItem} to {endItem} of {totalItems} {itemType}
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-1">
                        <button
                            onClick={() => onPageChange(1)}
                            disabled={currentPage === 1}
                            className="flex items-center justify-center w-8 h-8 text-emerald-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronsLeft className="w-4 h-4"/>
                        </button>

                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex items-center justify-center w-8 h-8 text-emerald-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4"/>
                        </button>

                        <div className="flex items-center space-x-1 mx-2">
                            {Array.from({length: Math.min(7, totalPages)}, (_, i) => {
                                let pageNumber
                                if (totalPages <= 7) {
                                    pageNumber = i + 1
                                } else if (currentPage <= 4) {
                                    pageNumber = i + 1
                                } else if (currentPage >= totalPages - 3) {
                                    pageNumber = totalPages - 6 + i
                                } else {
                                    pageNumber = currentPage - 3 + i
                                }

                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => onPageChange(pageNumber)}
                                        className={`
                    flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-200
                    ${
                                            currentPage === pageNumber
                                                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 scale-110"
                                                : "text-emerald-300 hover:text-white hover:bg-emerald-500/20 hover:scale-105"
                                        }
                  `}
                                    >
                                        {pageNumber}
                                    </button>
                                )
                            })}
                        </div>

                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex items-center justify-center w-8 h-8 text-emerald-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-4 h-4"/>
                        </button>

                        <button
                            onClick={() => onPageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            className="flex items-center justify-center w-8 h-8 text-emerald-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronsRight className="w-4 h-4"/>
                        </button>
                    </div>
                )}
            </div>
        )
    }

    // フィルターをクリアする関数
    const clearFilters = () => {
        setAccountFilter("")
        setXAccountFilter("")
        setBrokerFilter("")
        setEaNameFilter("")
    }

    // フィルターが適用されているかチェック
    const hasActiveFilters = accountFilter !== "" || xAccountFilter !== "" || brokerFilter !== "" || eaNameFilter !== ""

    const handleApprove = (applicationId: string) => {
        console.log(`Approving application: ${applicationId}`)
        // ここで承認処理とライセンス発行を行う
    }

    const handleRejectClick = (applicationId: string, eaName: string) => {
        setRejectDialog({
            isOpen: true,
            applicationId,
            eaName,
        })
    }

    const handleRejectConfirm = () => {
        console.log(`Rejecting application: ${rejectDialog.applicationId}`)
        // ここで申請却下処理を行う
        setRejectDialog({
            isOpen: false,
            applicationId: "",
            eaName: "",
        })
    }

    const handleRejectCancel = () => {
        setRejectDialog({
            isOpen: false,
            applicationId: "",
            eaName: "",
        })
    }

    const handleDeactivateClick = (licenseId: string, eaName: string) => {
        setDeactivateDialog({
            isOpen: true,
            licenseId,
            eaName,
        })
    }

    const handleDeactivateConfirm = () => {
        console.log(`Deactivating license: ${deactivateDialog.licenseId}`)
        // ここでライセンス無効化処理を行う
        setDeactivateDialog({
            isOpen: false,
            licenseId: "",
            eaName: "",
        })
    }

    const handleDeactivateCancel = () => {
        setDeactivateDialog({
            isOpen: false,
            licenseId: "",
            eaName: "",
        })
    }

    const toggleKeyVisibility = (licenseId: string) => {
        setShowKeys((prev) => ({
            ...prev,
            [licenseId]: !prev[licenseId],
        }))
    }

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            console.log("License key copied to clipboard")
            // ここで成功メッセージを表示することもできます
        } catch (err) {
            console.error("Failed to copy license key:", err)
            // フォールバック: 古いブラウザ対応
            const textArea = document.createElement("textarea")
            textArea.value = text
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand("copy")
            document.body.removeChild(textArea)
        }
    }

    const handleLogoClick = () => {
        if (isMobile) {
            setSidebarOpen(!sidebarOpen)
        }
    }

    // Settings画面への遷移はサイドバーから行うため、handleSettingsClickは不要

    const handleSettingsSave = () => {
        setSettingsOpen(false)
        // Settings are automatically saved via state
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex relative">
            {/* Particles Background */}
            <Particles
                id="tsparticles"
                init={particlesInit}
                loaded={particlesLoaded}
                options={{
                    background: {
                        color: {
                            value: "transparent",
                        },
                    },
                    fpsLimit: 120,
                    interactivity: {
                        events: {
                            onClick: {
                                enable: true,
                                mode: "push",
                            },
                            onHover: {
                                enable: true,
                                mode: "repulse",
                            },
                            resize: true,
                        },
                        modes: {
                            push: {
                                quantity: 4,
                            },
                            repulse: {
                                distance: 200,
                                duration: 0.4,
                            },
                        },
                    },
                    particles: {
                        color: {
                            value: "#10b981",
                        },
                        links: {
                            color: "#10b981",
                            distance: 150,
                            enable: true,
                            opacity: 0.1,
                            width: 1,
                        },
                        move: {
                            direction: "none",
                            enable: true,
                            outModes: {
                                default: "bounce",
                            },
                            random: false,
                            speed: 1,
                            straight: false,
                        },
                        number: {
                            density: {
                                enable: true,
                                area: 800,
                            },
                            value: 80,
                        },
                        opacity: {
                            value: 0.3,
                        },
                        shape: {
                            type: "circle",
                        },
                        size: {
                            value: {min: 1, max: 3},
                        },
                    },
                    detectRetina: true,
                }}
                className="absolute inset-0 z-0"
            />

            {/* Sidebar */}
            <div
                className={`${
                    isMobile
                        ? `fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-md border-r border-emerald-500/20 transform transition-transform duration-300 ease-in-out ${
                            sidebarOpen ? "translate-x-0" : "-translate-x-full"
                        }`
                        : `w-64 bg-slate-900/95 backdrop-blur-md border-r border-emerald-500/20 flex-shrink-0 ${
                            sidebarOpen ? "block" : "hidden"
                        }`
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo Section - PC時のみ表示 */}
                    {!isMobile && (
                        <div className="p-4 border-b border-emerald-500/20">
                            <div className="flex items-center space-x-3">
                                <div
                                    className="flex items-center justify-center w-12 h-12 bg-emerald-500/10 rounded-lg border border-emerald-400/20 flex-shrink-0">
                                    <Image src="/sankey-logo.png" alt="SANKEY Logo" width={32} height={32}
                                           className="w-8 h-8"/>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-xl font-bold text-white truncate">SANKEY</h1>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Menu Header - モバイル時のみ表示 */}
                    {isMobile && (
                        <div className="p-4 border-b border-emerald-500/20">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-white">Menu</h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSidebarOpen(false)}
                                    className="text-emerald-100 hover:text-white hover:bg-emerald-500/20"
                                >
                                    <X className="w-4 h-4"/>
                                </Button>
                            </div>
                        </div>
                    )}

                    <nav className="flex-1 p-4 space-y-2">
                        <Button
                            variant={currentView === "dashboard" ? "default" : "ghost"}
                            className={`w-full justify-start ${
                                currentView === "dashboard"
                                    ? "bg-emerald-500/20 text-emerald-100"
                                    : "text-emerald-200 hover:text-white hover:bg-emerald-500/20"
                            }`}
                            onClick={() => {
                                setCurrentView("dashboard")
                                if (isMobile) setSidebarOpen(false)
                            }}
                        >
                            <Shield className="w-4 h-4 mr-2"/>
                            License Dashboard
                        </Button>

                        <Button
                            variant={currentView === "developer" ? "default" : "ghost"}
                            className={`w-full justify-start ${
                                currentView === "developer"
                                    ? "bg-emerald-500/20 text-emerald-100"
                                    : "text-emerald-200 hover:text-white hover:bg-emerald-500/20"
                            }`}
                            onClick={() => {
                                setCurrentView("developer")
                                if (isMobile) setSidebarOpen(false)
                            }}
                        >
                            <FileKey className="w-4 h-4 mr-2"/>
                            Developer Guide
                        </Button>

                        <Button
                            variant={currentView === "settings" ? "default" : "ghost"}
                            className={`w-full justify-start ${
                                currentView === "settings"
                                    ? "bg-emerald-500/20 text-emerald-100"
                                    : "text-emerald-200 hover:text-white hover:bg-emerald-500/20"
                            }`}
                            onClick={() => {
                                setCurrentView("settings")
                                if (isMobile) setSidebarOpen(false)
                            }}
                        >
                            <Settings className="w-4 h-4 mr-2"/>
                            Settings
                        </Button>

                        <Button
                            variant="ghost"
                            className="w-full justify-start text-emerald-200 hover:text-white hover:bg-emerald-500/20"
                        >
                            <FileKey className="w-4 h-4 mr-2"/>
                            Documentation
                        </Button>

                        <Button
                            variant="ghost"
                            className="w-full justify-start text-emerald-200 hover:text-white hover:bg-emerald-500/20"
                        >
                            <Mail className="w-4 h-4 mr-2"/>
                            Support
                        </Button>
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-emerald-500/20">
                        <div className="space-y-2">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-emerald-200 hover:text-white hover:bg-emerald-500/20"
                            >
                                <User className="w-4 h-4 mr-2"/>
                                Profile
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-emerald-200 hover:text-white hover:bg-emerald-500/20"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4 mr-2"/>
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isMobile && sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)}/>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header - モバイル時のみ表示 */}
                {isMobile && (
                    <header className="border-b border-emerald-500/20 bg-slate-900/80 backdrop-blur-md relative z-10">
                        <div className="container mx-auto px-4 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                                    <div
                                        className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500/10 rounded-lg border border-emerald-400/20 flex-shrink-0 cursor-pointer hover:bg-emerald-500/20 transition-colors"
                                        onClick={handleLogoClick}
                                    >
                                        <Image
                                            src="/sankey-logo.png"
                                            alt="SANKEY Logo"
                                            width={32}
                                            height={32}
                                            className="w-6 h-6 sm:w-8 sm:h-8"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h1 className="text-lg sm:text-xl font-bold text-white truncate">SANKEY</h1>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-emerald-100 hover:text-white hover:bg-emerald-500/20 focus:text-white focus:bg-emerald-500/20"
                                    >
                                        <User className="w-4 h-4"/>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSettingsOpen(true)}
                                        className="text-emerald-100 hover:text-white hover:bg-emerald-500/20 focus:text-white focus:bg-emerald-500/20"
                                    >
                                        <Settings className="w-4 h-4"/>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </header>
                )}

                {/* Main Content */}
                {currentView === "dashboard" && (
                    <main className="flex-1 container mx-auto px-4 py-8 pb-12 relative z-10">
                        {/* Welcome Section */}
                        <div className="mb-8">
                            <div className="flex items-center space-x-3 mb-4">
                                <Shield className="w-8 h-8 text-emerald-400"/>
                                <div>
                                    <h2 className="text-3xl font-bold text-white">License Management Dashboard</h2>
                                    <p className="text-emerald-200/70">Manage EA license applications and approvals</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <Card className="bg-slate-800/60 border-emerald-500/20 backdrop-blur-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-emerald-100 flex items-center">
                                        <Clock className="w-4 h-4 mr-2 text-yellow-400"/>
                                        Pending Applications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div
                                        className="text-2xl font-bold text-white">{filteredPendingApplications.length}</div>
                                    <p className="text-xs text-emerald-200/60">Awaiting approval</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800/60 border-emerald-500/20 backdrop-blur-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-emerald-100 flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-2 text-emerald-400"/>
                                        Active Licenses
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div
                                        className="text-2xl font-bold text-white">{filteredApprovedLicenses.length}</div>
                                    <p className="text-xs text-emerald-200/60">Currently active</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800/60 border-emerald-500/20 backdrop-blur-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-emerald-100 flex items-center">
                                        <Key className="w-4 h-4 mr-2 text-emerald-400"/>
                                        Total Issued
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">5</div>
                                    <p className="text-xs text-emerald-200/60">All time issued</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800/60 border-emerald-500/20 backdrop-blur-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-emerald-100 flex items-center">
                                        <FileKey className="w-4 h-4 mr-2 text-amber-400"/>
                                        Expiring Soon
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">1</div>
                                    <p className="text-xs text-emerald-200/60">Within 30 days</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Filter Section */}
                        <Card className="bg-slate-800/60 border-emerald-500/20 backdrop-blur-sm mb-6">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-white flex items-center">
                                    <Filter className="w-5 h-5 mr-2 text-emerald-400"/>
                                    Filters
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* モバイル時は Account Number のみ、デスクトップ時は全て表示 */}
                                    <div
                                        className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-5"}`}>
                                        {/* Account Number Filter - 常に表示 */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-emerald-200">Account
                                                Number</label>
                                            <div className="relative">
                                                <Search
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-400"/>
                                                <input
                                                    type="text"
                                                    placeholder="Search account..."
                                                    value={accountFilter}
                                                    onChange={(e) => setAccountFilter(e.target.value)}
                                                    className="w-full pl-10 pr-3 py-2 bg-slate-900/50 border border-emerald-500/20 rounded-md text-white placeholder-emerald-300/50 focus:outline-none focus:border-emerald-400"
                                                />
                                            </div>
                                        </div>

                                        {/* モバイル時の詳細検索ボタン */}
                                        {isMobile && (
                                            <div className="space-y-2">
                                                <label
                                                    className="text-sm font-medium text-emerald-200 opacity-0">Advanced</label>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                                    className="w-full bg-emerald-500/20 border-emerald-400/40 text-emerald-100 hover:bg-emerald-500/30 hover:border-emerald-300 focus:text-emerald-100 focus:bg-emerald-500/30"
                                                >
                                                    <Filter className="w-4 h-4 mr-2"/>
                                                    {showAdvancedFilters ? "Hide Advanced" : "Advanced Search"}
                                                </Button>
                                            </div>
                                        )}

                                        {/* 詳細フィルター項目 - デスクトップ時は常に表示、モバイル時は showAdvancedFilters が true の時のみ */}
                                        {(!isMobile || showAdvancedFilters) && (
                                            <>
                                                {/* EA Name Filter */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-emerald-200">EA
                                                        Name</label>
                                                    <div className="relative">
                                                        <Key
                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-400"/>
                                                        <input
                                                            type="text"
                                                            placeholder="Search EA name..."
                                                            value={eaNameFilter}
                                                            onChange={(e) => setEaNameFilter(e.target.value)}
                                                            className="w-full pl-10 pr-3 py-2 bg-slate-900/50 border border-emerald-500/20 rounded-md text-white placeholder-emerald-300/50 focus:outline-none focus:border-emerald-400"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Broker Filter */}
                                                <div className="space-y-2">
                                                    <label
                                                        className="text-sm font-medium text-emerald-200">Broker</label>
                                                    <select
                                                        value={brokerFilter}
                                                        onChange={(e) => setBrokerFilter(e.target.value)}
                                                        className="w-full px-3 py-2 bg-slate-900/50 border border-emerald-500/20 rounded-md text-white focus:outline-none focus:border-emerald-400"
                                                    >
                                                        <option value="">All Brokers</option>
                                                        {allBrokers.map((broker) => (
                                                            <option key={broker} value={broker}>
                                                                {broker}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* X Account Filter */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-emerald-200">X
                                                        Account</label>
                                                    <div className="relative">
                                                        <Hash
                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-400"/>
                                                        <input
                                                            type="text"
                                                            placeholder="Search X account..."
                                                            value={xAccountFilter}
                                                            onChange={(e) => setXAccountFilter(e.target.value)}
                                                            className="w-full pl-10 pr-3 py-2 bg-slate-900/50 border border-emerald-500/20 rounded-md text-white placeholder-emerald-300/50 focus:outline-none focus:border-emerald-400"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* Clear Filters Button - デスクトップ時は常に表示、モバイル時は詳細検索表示時のみ */}
                                        {(!isMobile || showAdvancedFilters) && (
                                            <div className="space-y-2">
                                                <label
                                                    className="text-sm font-medium text-emerald-200 opacity-0">Clear</label>
                                                <Button
                                                    variant="outline"
                                                    onClick={clearFilters}
                                                    disabled={!hasActiveFilters}
                                                    className="w-full bg-emerald-500/20 border-emerald-400/40 text-emerald-100 hover:bg-emerald-500/30 hover:border-emerald-300 focus:text-emerald-100 focus:bg-emerald-500/30 disabled:opacity-50 disabled:bg-slate-700/50 disabled:border-slate-600/40 disabled:text-slate-400"
                                                >
                                                    <X className="w-4 h-4 mr-2"/>
                                                    Clear Filters
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Filter Results Info */}
                                {hasActiveFilters && (!isMobile || showAdvancedFilters) && (
                                    <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                                        <p className="text-sm text-emerald-200">
                                            Showing {filteredPendingApplications.length} pending applications and{" "}
                                            {filteredApprovedLicenses.length} active licenses
                                            {accountFilter && ` • Account: "${accountFilter}"`}
                                            {xAccountFilter && ` • X Account: "${xAccountFilter}"`}
                                            {brokerFilter && ` • Broker: "${brokerFilter}"`}
                                            {eaNameFilter && ` • EA Name: "${eaNameFilter}"`}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Tabs for different views */}
                        <Tabs defaultValue="pending" className="w-full">
                            <TabsList
                                className="grid w-full grid-cols-3 bg-slate-800/50 border border-emerald-500/20 p-1 rounded-lg overflow-hidden">
                                <TabsTrigger
                                    value="pending"
                                    className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/25 text-emerald-300 hover:text-white hover:bg-emerald-500/20 transition-all duration-200 text-xs sm:text-sm rounded-l-md rounded-r-none m-0"
                                >
                                    <Clock className="w-4 h-4 mr-1 sm:mr-2"/>
                                    <span className="hidden sm:inline">Pending Applications</span>
                                    <span className="sm:hidden">Pending</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="approved"
                                    className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/25 text-emerald-300 hover:text-white hover:bg-emerald-500/20 transition-all duration-200 text-xs sm:text-sm rounded-none m-0"
                                >
                                    <CheckCircle className="w-4 h-4 mr-1 sm:mr-2"/>
                                    <span className="hidden sm:inline">Active Licenses</span>
                                    <span className="sm:hidden">Active</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="history"
                                    className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/25 text-emerald-300 hover:text-white hover:bg-emerald-500/20 transition-all duration-200 text-xs sm:text-sm rounded-r-md rounded-l-none m-0"
                                >
                                    <History className="w-4 h-4 mr-1 sm:mr-2"/>
                                    <span className="hidden sm:inline">Issue History</span>
                                    <span className="sm:hidden">History</span>
                                </TabsTrigger>
                            </TabsList>

                            {/* Pending Applications Tab */}
                            <TabsContent value="pending" className="mt-6">
                                <Card className="bg-slate-800/60 border-emerald-500/20 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-white flex items-center">
                                            <Clock className="w-5 h-5 mr-2 text-yellow-400"/>
                                            Pending Applications
                                        </CardTitle>
                                        <CardDescription className="text-emerald-200/60">
                                            Review and approve EA license applications
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {paginatedPendingApplications.map((app) => (
                                                <div
                                                    key={app.id}
                                                    className="p-4 bg-slate-900/40 rounded-lg border border-emerald-500/10 hover:border-emerald-500/20 transition-colors"
                                                >
                                                    <div
                                                        className="flex flex-col space-y-3 mb-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                                                        <div className="flex items-center space-x-3">
                                                            <h3 className="font-semibold text-white">{app.eaName}</h3>
                                                            <Badge variant="outline"
                                                                   className="border-yellow-500 text-yellow-400">
                                                                {app.status}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleApprove(app.id)}
                                                                className="bg-emerald-500 hover:bg-emerald-600 text-white focus:text-white focus:bg-emerald-600 flex-1 sm:flex-none"
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-1"/>
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleRejectClick(app.id, app.eaName)}
                                                                className="border-red-500 text-red-400 hover:bg-red-500/20 hover:text-red-300 focus:text-red-300 focus:bg-red-500/20 flex-1 sm:flex-none"
                                                            >
                                                                Reject
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-emerald-200/70">
                                                        <div>
                                                            <span
                                                                className="text-emerald-300">Account:</span> {app.accountNumber}
                                                        </div>
                                                        <div>
                                                            <span
                                                                className="text-emerald-300">Broker:</span> {app.broker}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Mail className="w-3 h-3 mr-1"/>
                                                            {app.email}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Hash className="w-3 h-3 mr-1"/>
                                                            {app.xAccount}
                                                        </div>
                                                        <div>
                                                            <span
                                                                className="text-emerald-300">Applied:</span> {app.appliedAt}
                                                        </div>
                                                        <div>
                                                            <span className="text-emerald-300">ID:</span> {app.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <PaginationControls
                                            currentPage={pendingCurrentPage}
                                            totalPages={pendingTotalPages}
                                            onPageChange={setPendingCurrentPage}
                                            totalItems={filteredPendingApplications.length}
                                            itemType="applications"
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Active Licenses Tab */}
                            <TabsContent value="approved" className="mt-6">
                                <Card className="bg-slate-800/60 border-emerald-500/20 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-white flex items-center">
                                            <CheckCircle className="w-5 h-5 mr-2 text-emerald-400"/>
                                            Active Licenses
                                        </CardTitle>
                                        <CardDescription className="text-emerald-200/60">Currently active EA
                                            licenses</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {paginatedApprovedLicenses.map((license) => (
                                                <div
                                                    key={license.id}
                                                    className="p-4 bg-slate-900/40 rounded-lg border border-emerald-500/10 hover:border-emerald-500/20 transition-colors"
                                                >
                                                    <div
                                                        className="flex flex-col space-y-3 mb-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                                                        <div className="flex items-center space-x-3">
                                                            <h3 className="font-semibold text-white">{license.eaName}</h3>
                                                            <Badge
                                                                className="bg-emerald-500 hover:bg-emerald-600 text-white">{license.status}</Badge>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleDeactivateClick(license.id, license.eaName)}
                                                                className="border-red-500 text-red-400 hover:bg-red-500/20 hover:border-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/20 focus:border-red-400 flex-1 sm:flex-none"
                                                            >
                                                                <X className="w-4 h-4 mr-1"/>
                                                                Deactivate
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-emerald-200/70 mb-3">
                                                        <div>
                                                            <span
                                                                className="text-emerald-300">Account:</span> {license.accountNumber}
                                                        </div>
                                                        <div>
                                                            <span
                                                                className="text-emerald-300">Broker:</span> {license.broker}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Mail className="w-3 h-3 mr-1"/>
                                                            {license.email}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Hash className="w-3 h-3 mr-1"/>
                                                            {license.xAccount}
                                                        </div>
                                                        <div>
                                                            <span
                                                                className="text-emerald-300">Approved:</span> {license.approvedAt}
                                                        </div>
                                                        <div>
                                                            <span
                                                                className="text-emerald-300">Expires:</span> {license.expiresAt}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2 mt-3">
                                                        <code
                                                            className="text-xs bg-slate-800/70 px-2 py-1 rounded text-emerald-100 font-mono border border-emerald-500/20 flex-1">
                                                            {showKeys[license.id] ? license.licenseKey : license.licenseKey.replace(/[A-Z0-9]/g, "•")}
                                                        </code>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => toggleKeyVisibility(license.id)}
                                                            className="h-6 w-6 p-0 text-emerald-300 hover:text-white hover:bg-emerald-500/20"
                                                        >
                                                            {showKeys[license.id] ? <EyeOff className="w-3 h-3"/> :
                                                                <Eye className="w-3 h-3"/>}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => copyToClipboard(license.licenseKey)}
                                                            className="h-6 w-6 p-0 text-emerald-300 hover:text-white hover:bg-emerald-500/20"
                                                        >
                                                            <Copy className="w-3 h-3"/>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <PaginationControls
                                            currentPage={activeCurrentPage}
                                            totalPages={activeTotalPages}
                                            onPageChange={setActiveCurrentPage}
                                            totalItems={filteredApprovedLicenses.length}
                                            itemType="licenses"
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Issue History Tab */}
                            <TabsContent value="history" className="mt-6">
                                <Card className="bg-slate-800/60 border-emerald-500/20 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-white flex items-center">
                                            <History className="w-5 h-5 mr-2 text-emerald-400"/>
                                            Issue History
                                        </CardTitle>
                                        <CardDescription className="text-emerald-200/60">
                                            Complete history of license issuance
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {paginatedLicenseHistory.map((history) => (
                                                <div
                                                    key={history.id}
                                                    className="p-4 bg-slate-900/40 rounded-lg border border-emerald-500/10 hover:border-emerald-500/20 transition-colors"
                                                >
                                                    <div
                                                        className="flex flex-col space-y-3 mb-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                                                        <div className="flex items-center space-x-3">
                                                            <h3 className="font-semibold text-white">{history.eaName}</h3>
                                                            <Badge
                                                                variant="outline"
                                                                className={
                                                                    history.status === "Expired"
                                                                        ? "border-gray-500 text-gray-400"
                                                                        : history.status === "Revoked"
                                                                            ? "border-red-500 text-red-400"
                                                                            : "border-orange-500 text-orange-400"
                                                                }
                                                            >
                                                                {history.status}
                                                            </Badge>
                                                        </div>
                                                        <div className="text-sm text-emerald-200/60">
                                                            {history.action}: {history.expiredAt || history.revokedAt}
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-emerald-200/70 mb-3">
                                                        <div>
                                                            <span
                                                                className="text-emerald-300">Account:</span> {history.accountNumber}
                                                        </div>
                                                        <div>
                                                            <span
                                                                className="text-emerald-300">Broker:</span> {history.broker}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Mail className="w-3 h-3 mr-1"/>
                                                            {history.email}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Hash className="w-3 h-3 mr-1"/>
                                                            {history.xAccount}
                                                        </div>
                                                        <div>
                                                            <span
                                                                className="text-emerald-300">Issued:</span> {history.issuedAt}
                                                        </div>
                                                        <div>
                                                            <span className="text-emerald-300">ID:</span> {history.id}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2 mt-3">
                                                        <code
                                                            className="text-xs bg-slate-800/70 px-2 py-1 rounded text-emerald-100 font-mono border border-emerald-500/20 flex-1">
                                                            {history.licenseKey}
                                                        </code>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => copyToClipboard(history.licenseKey)}
                                                            className="h-6 w-6 p-0 text-emerald-300 hover:text-white hover:bg-emerald-500/20"
                                                        >
                                                            <Copy className="w-3 h-3"/>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <PaginationControls
                                            currentPage={historyCurrentPage}
                                            totalPages={historyTotalPages}
                                            onPageChange={setHistoryCurrentPage}
                                            totalItems={filteredLicenseHistory.length}
                                            itemType="history records"
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </main>
                )}

                {currentView === "settings" && (
                    <main className="flex-1 container mx-auto px-4 py-8 pb-12 relative z-10">
                        {/* Welcome Section */}
                        <div className="mb-8">
                            <div className="flex items-center space-x-3 mb-4">
                                <Settings className="w-8 h-8 text-emerald-400"/>
                                <div>
                                    <h2 className="text-3xl font-bold text-white">Settings</h2>
                                    <p className="text-emerald-200/70">Configure your dashboard preferences</p>
                                </div>
                            </div>
                        </div>

                        {/* Current Plan Section */}
                        <div className="space-y-6">
                            <Card className="bg-slate-800/60 border-emerald-500/20 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center">
                                        <Shield className="w-5 h-5 mr-2 text-emerald-400"/>
                                        Current Plan
                                    </CardTitle>
                                    <CardDescription className="text-emerald-200/60">
                                        Manage your subscription and view usage statistics
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {/* Plan Info */}
                                    <div className="p-4 bg-slate-900/40 rounded-lg border border-emerald-500/10 mb-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className="flex items-center justify-center w-10 h-10 bg-emerald-500/10 rounded-lg border border-emerald-400/20">
                                                    <Key className="w-5 h-5 text-emerald-400"/>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">Basic Plan</h3>
                                                    <p className="text-sm text-emerald-200/70">Great for small
                                                        businesses</p>
                                                </div>
                                            </div>
                                            <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Basic</Badge>
                                        </div>
                                    </div>

                                    {/* Usage Statistics */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                        <div className="p-4 bg-slate-900/40 rounded-lg border border-emerald-500/10">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-sm font-medium text-emerald-200">Monthly
                                                    Licenses</h4>
                                                <FileKey className="w-4 h-4 text-emerald-400"/>
                                            </div>
                                            <div className="text-2xl font-bold text-white mb-1">3</div>
                                            <p className="text-xs text-emerald-200/60 mb-3">of 50 used</p>
                                            <div className="w-full bg-slate-700 rounded-full h-2">
                                                <div className="bg-emerald-500 h-2 rounded-full"
                                                     style={{width: '6%'}}></div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-slate-900/40 rounded-lg border border-emerald-500/10">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-sm font-medium text-emerald-200">Active
                                                    Licenses</h4>
                                                <CheckCircle className="w-4 h-4 text-emerald-400"/>
                                            </div>
                                            <div className="text-2xl font-bold text-white mb-1">5</div>
                                            <p className="text-xs text-emerald-200/60 mb-3">of 100 active</p>
                                            <div className="w-full bg-slate-700 rounded-full h-2">
                                                <div className="bg-emerald-500 h-2 rounded-full"
                                                     style={{width: '5%'}}></div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-slate-900/40 rounded-lg border border-emerald-500/10">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-sm font-medium text-emerald-200">API Calls</h4>
                                                <Settings className="w-4 h-4 text-emerald-400"/>
                                            </div>
                                            <div className="text-2xl font-bold text-white mb-1">1250</div>
                                            <p className="text-xs text-emerald-200/60 mb-3">of 10,000 this month</p>
                                            <div className="w-full bg-slate-700 rounded-full h-2">
                                                <div className="bg-emerald-500 h-2 rounded-full"
                                                     style={{width: '12.5%'}}></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Change Plan Button */}
                                    <div className="flex justify-center">
                                        <Button
                                            onClick={() => setChangePlanOpen(true)}
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8"
                                        >
                                            <Key className="w-4 h-4 mr-2"/>
                                            Change Plan
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                )}

                {currentView === "developer" && (
                    <main className="flex-1 container mx-auto px-4 py-8 pb-12 relative z-10">
                        {/* Welcome Section */}
                        <div className="mb-8">
                            <div className="flex items-center space-x-3 mb-4">
                                <FileKey className="w-8 h-8 text-emerald-400"/>
                                <div>
                                    <h2 className="text-3xl font-bold text-white">Developer Integration Guide</h2>
                                    <p className="text-emerald-200/70">
                                        Complete guide for integrating SANKEY license verification into your Expert
                                        Advisors
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Overview Card */}
                            <Card className="bg-slate-800/60 border-emerald-500/20 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center">
                                        <FileKey className="w-5 h-5 mr-2 text-emerald-400"/>
                                        EA License Integration Guide
                                    </CardTitle>
                                    <CardDescription className="text-emerald-200/60">
                                        Complete guide for integrating SANKEY license verification into your Expert
                                        Advisors
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 bg-slate-900/40 rounded-lg border border-emerald-500/10">
                                            <div className="flex items-center mb-2">
                                                <Key className="w-5 h-5 mr-2 text-emerald-400"/>
                                                <h3 className="font-semibold text-white">MQH Library</h3>
                                            </div>
                                            <p className="text-sm text-emerald-200/70 mb-3">
                                                Include our header file for easy license verification
                                            </p>
                                            <Button
                                                size="sm"
                                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white focus:text-white focus:bg-emerald-600"
                                            >
                                                Download MQH
                                            </Button>
                                        </div>

                                        <div className="p-4 bg-slate-900/40 rounded-lg border border-emerald-500/10">
                                            <div className="flex items-center mb-2">
                                                <Settings className="w-5 h-5 mr-2 text-emerald-400"/>
                                                <h3 className="font-semibold text-white">DLL Library</h3>
                                            </div>
                                            <p className="text-sm text-emerald-200/70 mb-3">Windows DLL for license
                                                verification functions</p>
                                            <Button
                                                size="sm"
                                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white focus:text-white focus:bg-emerald-600"
                                            >
                                                Download DLL
                                            </Button>
                                        </div>

                                        <div className="p-4 bg-slate-900/40 rounded-lg border border-emerald-500/10">
                                            <div className="flex items-center mb-2">
                                                <FileKey className="w-5 h-5 mr-2 text-emerald-400"/>
                                                <h3 className="font-semibold text-white">Documentation</h3>
                                            </div>
                                            <p className="text-sm text-emerald-200/70 mb-3">Complete API reference and
                                                examples</p>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-full border-emerald-500/40 text-emerald-200 hover:bg-emerald-500/20 focus:text-emerald-200 focus:bg-emerald-500/20"
                                            >
                                                View Docs
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                )}

                {/* Settings Dialog */}
                <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                    <DialogContent
                        className={`bg-slate-800 border-emerald-500/20 text-white ${
                            isMobile ? "w-[95vw] h-[90vh] max-w-none max-h-none m-2 p-0" : "max-w-md"
                        }`}
                    >
                        {isMobile ? (
                            // Mobile Layout
                            <div className="flex flex-col h-full">
                                {/* Mobile Header */}
                                <div
                                    className="flex items-center justify-between p-4 border-b border-emerald-500/20 flex-shrink-0">
                                    <div className="flex items-center">
                                        <Settings className="w-5 h-5 mr-2 text-emerald-400"/>
                                        <h2 className="text-lg font-semibold">Settings</h2>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSettingsOpen(false)}
                                        className="text-emerald-100 hover:text-white hover:bg-emerald-500/20"
                                    >
                                        <X className="w-4 h-4"/>
                                    </Button>
                                </div>

                                {/* Mobile Content - Scrollable */}
                                <div
                                    className="flex-1 overflow-y-auto overflow-x-hidden p-4 overscroll-behavior-y-contain"
                                    style={{
                                        WebkitOverflowScrolling: 'touch',
                                        height: 'calc(90vh - 120px)',
                                        minHeight: '0',
                                        maxHeight: 'calc(90vh - 120px)'
                                    }}
                                >
                                    <div className="space-y-6 pb-4">
                                        <p className="text-emerald-200/60 text-sm">Configure your dashboard
                                            preferences</p>

                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <label className="text-sm font-medium text-emerald-200">Items per
                                                    page</label>
                                                <Select value={itemsPerPage.toString()}
                                                        onValueChange={(value) => setItemsPerPage(Number(value))}>
                                                    <SelectTrigger
                                                        className="bg-slate-900/50 border-emerald-500/20 text-white h-12">
                                                        <SelectValue/>
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-800 border-emerald-500/20">
                                                        <SelectItem value="10">10 items</SelectItem>
                                                        <SelectItem value="25">25 items</SelectItem>
                                                        <SelectItem value="50">50 items</SelectItem>
                                                        <SelectItem value="100">100 items</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <p className="text-xs text-emerald-200/60">Number of items to display
                                                    per page in tables</p>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-sm font-medium text-emerald-200">Theme
                                                    Preference</label>
                                                <div
                                                    className="p-4 bg-slate-900/40 rounded-lg border border-emerald-500/10">
                                                    <p className="text-xs text-emerald-200/60 mb-2">Theme settings are
                                                        available in the header</p>
                                                    <div className="flex space-x-2">
                                                        <div
                                                            className="w-6 h-6 bg-slate-700 rounded border border-emerald-500/20"></div>
                                                        <div
                                                            className="w-6 h-6 bg-white rounded border border-emerald-500/20"></div>
                                                        <div
                                                            className="w-6 h-6 bg-emerald-500 rounded border border-emerald-500/20"></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-sm font-medium text-emerald-200">Language</label>
                                                <div
                                                    className="p-4 bg-slate-900/40 rounded-lg border border-emerald-500/10">
                                                    <p className="text-xs text-emerald-200/60 mb-2">Language settings
                                                        are available in the header</p>
                                                    <div className="text-sm text-emerald-300">Current: English (US)
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label
                                                    className="text-sm font-medium text-emerald-200">Notifications</label>
                                                <div
                                                    className="p-4 bg-slate-900/40 rounded-lg border border-emerald-500/10 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span
                                                            className="text-sm text-emerald-200">Email notifications</span>
                                                        <div className="w-10 h-6 bg-emerald-500 rounded-full relative">
                                                            <div
                                                                className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span
                                                            className="text-sm text-emerald-200">Push notifications</span>
                                                        <div className="w-10 h-6 bg-slate-600 rounded-full relative">
                                                            <div
                                                                className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-emerald-200/60">Get notified about
                                                        license events and updates</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label
                                                    className="text-sm font-medium text-emerald-200">Auto-refresh</label>
                                                <div
                                                    className="p-4 bg-slate-900/40 rounded-lg border border-emerald-500/10 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span
                                                            className="text-sm text-emerald-200">Enable auto-refresh</span>
                                                        <div className="w-10 h-6 bg-emerald-500 rounded-full relative">
                                                            <div
                                                                className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <span
                                                            className="text-sm text-emerald-200">Refresh interval</span>
                                                        <select
                                                            className="w-full px-3 py-2 bg-slate-800 border border-emerald-500/20 rounded-md text-white text-sm">
                                                            <option>30 seconds</option>
                                                            <option>1 minute</option>
                                                            <option>5 minutes</option>
                                                            <option>10 minutes</option>
                                                        </select>
                                                    </div>
                                                    <p className="text-xs text-emerald-200/60">Automatically refresh
                                                        dashboard data at specified intervals</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-sm font-medium text-emerald-200">Export
                                                    Options</label>
                                                <div
                                                    className="p-4 bg-slate-900/40 rounded-lg border border-emerald-500/10 space-y-3">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <button
                                                            className="p-2 bg-slate-800 border border-emerald-500/20 rounded text-sm text-emerald-200 hover:bg-emerald-500/20">
                                                            Export CSV
                                                        </button>
                                                        <button
                                                            className="p-2 bg-slate-800 border border-emerald-500/20 rounded text-sm text-emerald-200 hover:bg-emerald-500/20">
                                                            Export PDF
                                                        </button>
                                                        <button
                                                            className="p-2 bg-slate-800 border border-emerald-500/20 rounded text-sm text-emerald-200 hover:bg-emerald-500/20">
                                                            Export Excel
                                                        </button>
                                                        <button
                                                            className="p-2 bg-slate-800 border border-emerald-500/20 rounded text-sm text-emerald-200 hover:bg-emerald-500/20">
                                                            Export JSON
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-emerald-200/60">Configure data export
                                                        preferences and formats</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-sm font-medium text-emerald-200">Security
                                                    Settings</label>
                                                <div
                                                    className="p-4 bg-slate-900/40 rounded-lg border border-emerald-500/10 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-emerald-200">Two-factor authentication</span>
                                                        <div className="w-10 h-6 bg-slate-600 rounded-full relative">
                                                            <div
                                                                className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span
                                                            className="text-sm text-emerald-200">Session timeout</span>
                                                        <select
                                                            className="px-2 py-1 bg-slate-800 border border-emerald-500/20 rounded text-white text-sm">
                                                            <option>30 minutes</option>
                                                            <option>1 hour</option>
                                                            <option>4 hours</option>
                                                            <option>8 hours</option>
                                                        </select>
                                                    </div>
                                                    <p className="text-xs text-emerald-200/60">Enhanced security options
                                                        for your account</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-sm font-medium text-emerald-200">Display
                                                    Settings</label>
                                                <div
                                                    className="p-4 bg-slate-900/40 rounded-lg border border-emerald-500/10 space-y-3">
                                                    <div className="space-y-2">
                                                        <span className="text-sm text-emerald-200">Date format</span>
                                                        <select
                                                            className="w-full px-3 py-2 bg-slate-800 border border-emerald-500/20 rounded-md text-white text-sm">
                                                            <option>MM/DD/YYYY</option>
                                                            <option>DD/MM/YYYY</option>
                                                            <option>YYYY-MM-DD</option>
                                                            <option>DD MMM YYYY</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <span className="text-sm text-emerald-200">Time format</span>
                                                        <select
                                                            className="w-full px-3 py-2 bg-slate-800 border border-emerald-500/20 rounded-md text-white text-sm">
                                                            <option>12-hour (AM/PM)</option>
                                                            <option>24-hour</option>
                                                        </select>
                                                    </div>
                                                    <p className="text-xs text-emerald-200/60">Customize how dates and
                                                        times are displayed</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile Footer */}
                                <div className="p-4 border-t border-emerald-500/20 flex-shrink-0">
                                    <div className="flex space-x-3">
                                        <Button
                                            variant="outline"
                                            onClick={() => setSettingsOpen(false)}
                                            className="flex-1 border-emerald-500/40 text-emerald-200 hover:bg-emerald-500/20 h-12"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSettingsSave}
                                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white h-12"
                                        >
                                            Save Settings
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Desktop Layout - 変更なし
                            <>
                                <DialogHeader>
                                    <DialogTitle className="flex items-center">
                                        <Settings className="w-5 h-5 mr-2 text-emerald-400"/>
                                        Settings
                                    </DialogTitle>
                                    <DialogDescription className="text-emerald-200/60">
                                        Configure your dashboard preferences
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-6 py-4">
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-emerald-200">Items per page</label>
                                        <Select value={itemsPerPage.toString()}
                                                onValueChange={(value) => setItemsPerPage(Number(value))}>
                                            <SelectTrigger className="bg-slate-900/50 border-emerald-500/20 text-white">
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-emerald-500/20">
                                                <SelectItem value="10">10 items</SelectItem>
                                                <SelectItem value="25">25 items</SelectItem>
                                                <SelectItem value="50">50 items</SelectItem>
                                                <SelectItem value="100">100 items</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-emerald-200/60">Number of items to display per page
                                            in tables</p>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setSettingsOpen(false)}
                                        className="border-emerald-500/40 text-emerald-200 hover:bg-emerald-500/20"
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSettingsSave}
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white">
                                        Save Settings
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Change Plan Dialog */}
                <Dialog open={changePlanOpen} onOpenChange={setChangePlanOpen}>
                    <DialogContent
                        className={`bg-slate-800 border-emerald-500/20 text-white ${
                            isMobile ? "w-[95vw] h-[90vh] max-w-none max-h-none m-2 p-0" : "max-w-2xl"
                        }`}
                    >
                        {isMobile ? (
                            // Mobile Layout
                            <div className="flex flex-col h-full">
                                {/* Mobile Header */}
                                <div
                                    className="flex items-center justify-between p-4 border-b border-emerald-500/20 flex-shrink-0">
                                    <div className="flex items-center">
                                        <Key className="w-5 h-5 mr-2 text-emerald-400"/>
                                        <h2 className="text-lg font-semibold">Change Plan</h2>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setChangePlanOpen(false)}
                                        className="text-emerald-100 hover:text-white hover:bg-emerald-500/20"
                                    >
                                        <X className="w-4 h-4"/>
                                    </Button>
                                </div>

                                {/* Mobile Content - Scrollable */}
                                <div
                                    className="flex-1 overflow-y-auto overflow-x-hidden p-4 overscroll-behavior-y-contain"
                                    style={{
                                        WebkitOverflowScrolling: 'touch',
                                        height: 'calc(90vh - 120px)',
                                        minHeight: '0',
                                        maxHeight: 'calc(90vh - 120px)'
                                    }}
                                >
                                    <div className="space-y-6 pb-4">
                                        <p className="text-emerald-200/60 text-sm">Choose the plan that best fits your
                                            needs</p>

                                        {/* Plan Options */}
                                        <div className="space-y-4">
                                            {/* Basic Plan */}
                                            <div
                                                className="p-4 bg-slate-900/40 rounded-lg border border-emerald-500/20">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-white">Basic Plan</h3>
                                                        <p className="text-sm text-emerald-200/70">Perfect for small
                                                            businesses</p>
                                                    </div>
                                                    <Badge className="bg-blue-500 text-white">Current</Badge>
                                                </div>
                                                <div className="space-y-2 text-sm text-emerald-200/70">
                                                    <div>• 50 Monthly Licenses</div>
                                                    <div>• 100 Active Licenses</div>
                                                    <div>• 10,000 API Calls/month</div>
                                                    <div>• Email Support</div>
                                                </div>
                                                <div className="mt-4 text-2xl font-bold text-white">$29/month</div>
                                            </div>

                                            {/* Pro Plan */}
                                            <div
                                                className="p-4 bg-slate-900/40 rounded-lg border border-emerald-500/10">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-white">Pro Plan</h3>
                                                        <p className="text-sm text-emerald-200/70">For growing
                                                            businesses</p>
                                                    </div>
                                                    <Badge variant="outline"
                                                           className="border-emerald-500 text-emerald-400">Upgrade</Badge>
                                                </div>
                                                <div className="space-y-2 text-sm text-emerald-200/70">
                                                    <div>• 200 Monthly Licenses</div>
                                                    <div>• 500 Active Licenses</div>
                                                    <div>• 50,000 API Calls/month</div>
                                                    <div>• Priority Support</div>
                                                    <div>• Advanced Analytics</div>
                                                </div>
                                                <div className="mt-4 text-2xl font-bold text-white">$99/month</div>
                                            </div>

                                            {/* Enterprise Plan */}
                                            <div
                                                className="p-4 bg-slate-900/40 rounded-lg border border-emerald-500/10">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-white">Enterprise
                                                            Plan</h3>
                                                        <p className="text-sm text-emerald-200/70">For large
                                                            organizations</p>
                                                    </div>
                                                    <Badge variant="outline"
                                                           className="border-emerald-500 text-emerald-400">Contact</Badge>
                                                </div>
                                                <div className="space-y-2 text-sm text-emerald-200/70">
                                                    <div>• Unlimited Licenses</div>
                                                    <div>• Unlimited API Calls</div>
                                                    <div>• 24/7 Phone Support</div>
                                                    <div>• Custom Integration</div>
                                                    <div>• Dedicated Account Manager</div>
                                                </div>
                                                <div className="mt-4 text-2xl font-bold text-white">Custom Pricing</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile Footer */}
                                <div className="p-4 border-t border-emerald-500/20 flex-shrink-0">
                                    <div className="flex space-x-3">
                                        <Button
                                            variant="outline"
                                            onClick={() => setChangePlanOpen(false)}
                                            className="flex-1 border-emerald-500/40 text-emerald-200 hover:bg-emerald-500/20 h-12"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white h-12"
                                        >
                                            Upgrade Plan
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Desktop Layout
                            <>
                                <DialogHeader>
                                    <DialogTitle className="flex items-center">
                                        <Key className="w-5 h-5 mr-2 text-emerald-400"/>
                                        Change Plan
                                    </DialogTitle>
                                    <DialogDescription className="text-emerald-200/60">
                                        Choose the plan that best fits your needs
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-6 py-4">
                                    {/* Plan Options */}
                                    <div className="space-y-4">
                                        {/* Basic Plan */}
                                        <div className="p-4 bg-slate-900/40 rounded-lg border border-emerald-500/20">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">Basic Plan</h3>
                                                    <p className="text-sm text-emerald-200/70">Perfect for small
                                                        businesses</p>
                                                </div>
                                                <Badge className="bg-blue-500 text-white">Current</Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm text-emerald-200/70">
                                                <div>• 50 Monthly Licenses</div>
                                                <div>• 100 Active Licenses</div>
                                                <div>• 10,000 API Calls/month</div>
                                                <div>• Email Support</div>
                                            </div>
                                            <div className="mt-4 text-2xl font-bold text-white">$29/month</div>
                                        </div>

                                        {/* Pro Plan */}
                                        <div className="p-4 bg-slate-900/40 rounded-lg border border-emerald-500/10">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">Pro Plan</h3>
                                                    <p className="text-sm text-emerald-200/70">For growing
                                                        businesses</p>
                                                </div>
                                                <Badge variant="outline"
                                                       className="border-emerald-500 text-emerald-400">Upgrade</Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm text-emerald-200/70">
                                                <div>• 200 Monthly Licenses</div>
                                                <div>• 500 Active Licenses</div>
                                                <div>• 50,000 API Calls/month</div>
                                                <div>• Priority Support</div>
                                                <div>• Advanced Analytics</div>
                                            </div>
                                            <div className="mt-4 text-2xl font-bold text-white">$99/month</div>
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setChangePlanOpen(false)}
                                        className="border-emerald-500/40 text-emerald-200 hover:bg-emerald-500/20"
                                    >
                                        Cancel
                                    </Button>
                                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                                        Upgrade Plan
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Reject Confirmation Dialog */}
                <AlertDialog open={rejectDialog.isOpen} onOpenChange={handleRejectCancel}>
                    <AlertDialogContent className="bg-slate-800 border-red-500/20">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-white flex items-center">
                                <AlertTriangle className="w-5 h-5 mr-2 text-red-400"/>
                                Confirm Application Rejection
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-emerald-200/70">
                                Are you sure you want to reject the application for
                                <span className="font-semibold text-white">"{rejectDialog.eaName}"</span>?
                                <br/>
                                <br/>
                                <span className="text-red-300">
                This action cannot be undone. The application will be permanently rejected.
              </span>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={handleRejectCancel}
                                className="border-emerald-500/40 text-emerald-200 hover:bg-emerald-500/20"
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleRejectConfirm}
                                               className="bg-red-600 hover:bg-red-700 text-white">
                                <X className="w-4 h-4 mr-2"/>
                                Reject Application
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Deactivate Confirmation Dialog */}
                <AlertDialog open={deactivateDialog.isOpen} onOpenChange={handleDeactivateCancel}>
                    <AlertDialogContent className="bg-slate-800 border-red-500/20">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-white flex items-center">
                                <AlertTriangle className="w-5 h-5 mr-2 text-red-400"/>
                                Confirm License Deactivation
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-emerald-200/70">
                                Are you sure you want to deactivate the license for
                                <span className="font-semibold text-white">"{deactivateDialog.eaName}"</span>?
                                <br/>
                                <br/>
                                <span className="text-red-300">
                This action cannot be undone. The license will be deactivated during the next license check.
              </span>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={handleDeactivateCancel}
                                className="border-emerald-500/40 text-emerald-200 hover:bg-emerald-500/20"
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeactivateConfirm}
                                               className="bg-red-600 hover:bg-red-700 text-white">
                                <X className="w-4 h-4 mr-2"/>
                                Deactivate License
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}
