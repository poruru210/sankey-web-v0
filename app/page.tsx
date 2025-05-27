"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Key,
  Shield,
  Lock,
  FileKey,
  Settings,
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
  ArrowLeft,
} from "lucide-react"
import { useState, useCallback, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Particles from "react-tsparticles"
import type { Container, Engine } from "tsparticles-engine"
import { loadSlim } from "tsparticles-slim"
import { useTheme } from "@/lib/theme-context"
import { useI18n } from "@/lib/i18n-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CodeBlock } from "@/components/code-block"

function Component() {
  const router = useRouter()
  const { theme } = useTheme()
  const { t } = useI18n()
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
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // 新しい状態変数を追加
  const [currentPlan, setCurrentPlan] = useState<"Free" | "Basic" | "Pro">("Basic")
  const [monthlyLicensesUsed, setMonthlyLicensesUsed] = useState(3)
  const [activeLicensesCount, setActiveLicensesCount] = useState(5)
  const [apiCallsUsed, setApiCallsUsed] = useState(1250)
  const [licenseExpirationType, setLicenseExpirationType] = useState<"unlimited" | "custom">("custom")
  const [customExpirationDays, setCustomExpirationDays] = useState(365)
  const [masterKey, setMasterKey] = useState("SANKEY-MASTER-2024-ABCD-EFGH-IJKL-MNOP-QRST")
  const [planChangeDialog, setPlanChangeDialog] = useState(false)

  // プラン制限の定義
  const planLimits = {
    Free: {
      monthlyLicenses: 5,
      activeLicenses: 10,
      apiCalls: 1000,
      price: 0,
    },
    Basic: {
      monthlyLicenses: 50,
      activeLicenses: 100,
      apiCalls: 10000,
      price: 29,
    },
    Pro: {
      monthlyLicenses: -1, // unlimited
      activeLicenses: -1, // unlimited
      apiCalls: -1, // unlimited
      price: 99,
    },
  }

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
    {
      id: "APP-006",
      accountNumber: "44556677",
      broker: "Pepperstone",
      eaName: "Breakout Hunter",
      email: "trader6@example.com",
      xAccount: "@breakout_hunter",
      appliedAt: "2024-01-10",
      status: "Pending",
    },
    {
      id: "APP-007",
      accountNumber: "33445566",
      broker: "AxiTrader",
      eaName: "Swing Master",
      email: "trader7@example.com",
      xAccount: "@swing_master",
      appliedAt: "2024-01-09",
      status: "Pending",
    },
    {
      id: "APP-008",
      accountNumber: "22334455",
      broker: "Admiral Markets",
      eaName: "Momentum Trader",
      email: "trader8@example.com",
      xAccount: "@momentum_trader",
      appliedAt: "2024-01-08",
      status: "Pending",
    },
    {
      id: "APP-009",
      accountNumber: "11224466",
      broker: "FP Markets",
      eaName: "Range Rider",
      email: "trader9@example.com",
      xAccount: "@range_rider",
      appliedAt: "2024-01-07",
      status: "Pending",
    },
    {
      id: "APP-010",
      accountNumber: "99776655",
      broker: "ThinkMarkets",
      eaName: "Volatility Crusher",
      email: "trader10@example.com",
      xAccount: "@vol_crusher",
      appliedAt: "2024-01-06",
      status: "Pending",
    },
    {
      id: "APP-011",
      accountNumber: "88665544",
      broker: "OANDA",
      eaName: "Fibonacci Wizard",
      email: "trader11@example.com",
      xAccount: "@fib_wizard",
      appliedAt: "2024-01-05",
      status: "Pending",
    },
    {
      id: "APP-012",
      accountNumber: "77554433",
      broker: "Plus500",
      eaName: "Channel Surfer",
      email: "trader12@example.com",
      xAccount: "@channel_surfer",
      appliedAt: "2024-01-04",
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
  }, [])

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
        <div className="text-sm theme-text-muted">
          {t("pagination.showing")} {startItem} {t("pagination.to")} {endItem} {t("pagination.of")} {totalItems}{" "}
          {t(`pagination.${itemType}`)}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-1">
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-8 h-8 theme-text-emerald hover:theme-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-8 h-8 theme-text-emerald hover:theme-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-1 mx-2">
              {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
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
                        : "theme-text-emerald hover:theme-text-primary hover:bg-emerald-500/20 hover:scale-105"
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
              className="flex items-center justify-center w-8 h-8 theme-text-emerald hover:theme-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center w-8 h-8 theme-text-emerald hover:theme-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight className="w-4 h-4" />
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

  const handleSettingsClick = () => {
    setCurrentView("settings")
    if (isMobile) setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen theme-bg-gradient flex relative">
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
              value: theme === "dark" ? "#10b981" : "#059669",
            },
            links: {
              color: theme === "dark" ? "#10b981" : "#059669",
              distance: 150,
              enable: true,
              opacity: theme === "dark" ? 0.1 : 0.2,
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
              value: theme === "dark" ? 0.3 : 0.4,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
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
            ? `fixed inset-y-0 left-0 z-50 w-64 theme-card-bg backdrop-blur-md border-r border-emerald-500/20 transform transition-transform duration-300 ease-in-out ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : `w-64 theme-card-bg backdrop-blur-md border-r border-emerald-500/20 flex-shrink-0 ${
                sidebarOpen ? "block" : "hidden"
              }`
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section - PC時のみ表示 */}
          {!isMobile && (
            <div className="p-4 border-b border-emerald-500/20">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 bg-emerald-500/10 rounded-lg border border-emerald-400/20 flex-shrink-0">
                  <Image src="/sankey-logo.png" alt="SANKEY Logo" width={32} height={32} className="w-8 h-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl font-bold theme-text-primary truncate">SANKEY</h1>
                  <p className="text-sm theme-text-secondary truncate">EA License Management System</p>
                </div>
              </div>
            </div>
          )}

          {/* Menu Header - モバイル時のみ表示 */}
          {isMobile && (
            <div className="p-4 border-b border-emerald-500/20">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold theme-text-primary">{t("nav.menu")}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="theme-text-secondary hover:theme-text-primary hover:bg-emerald-500/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <nav className="flex-1 p-4 space-y-2">
            <Button
              variant={currentView === "dashboard" ? "default" : "ghost"}
              className={`w-full justify-start ${
                currentView === "dashboard"
                  ? "bg-emerald-500/20 theme-text-primary"
                  : "theme-text-secondary hover:theme-text-primary hover:bg-emerald-500/20"
              }`}
              onClick={() => {
                setCurrentView("dashboard")
                if (isMobile) setSidebarOpen(false)
              }}
            >
              <Shield className="w-4 h-4 mr-2" />
              {t("nav.dashboard")}
            </Button>

            <Button
              variant={currentView === "developer" ? "default" : "ghost"}
              className={`w-full justify-start ${
                currentView === "developer"
                  ? "bg-emerald-500/20 theme-text-primary"
                  : "theme-text-secondary hover:theme-text-primary hover:bg-emerald-500/20"
              }`}
              onClick={() => {
                setCurrentView("developer")
                if (isMobile) setSidebarOpen(false)
              }}
            >
              <FileKey className="w-4 h-4 mr-2" />
              {t("nav.developer")}
            </Button>

            <Button
              variant={currentView === "settings" ? "default" : "ghost"}
              className={`w-full justify-start ${
                currentView === "settings"
                  ? "bg-emerald-500/20 theme-text-primary"
                  : "theme-text-secondary hover:theme-text-primary hover:bg-emerald-500/20"
              }`}
              onClick={handleSettingsClick}
            >
              <Settings className="w-4 h-4 mr-2" />
              {t("nav.settings")}
            </Button>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-emerald-500/20">
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start theme-text-secondary hover:theme-text-primary hover:bg-emerald-500/20"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t("nav.signOut")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - モバイル時のみ表示 */}
        {isMobile && (
          <header className="border-b border-emerald-500/20 theme-card-bg backdrop-blur-md relative z-10">
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
                    <h1 className="text-lg sm:text-xl font-bold theme-text-primary truncate">SANKEY</h1>
                    <p className="text-xs sm:text-sm theme-text-secondary truncate">EA License Management System</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                  <ThemeToggle />
                  <LanguageToggle />
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-8 h-8 text-emerald-400" />
                  <div>
                    <h2 className="text-3xl font-bold theme-text-primary">{t("dashboard.title")}</h2>
                    <p className="theme-text-secondary">{t("dashboard.subtitle")}</p>
                  </div>
                </div>
                {/* Desktop Theme & Language Controls */}
                {!isMobile && (
                  <div className="flex items-center space-x-2">
                    <ThemeToggle />
                    <LanguageToggle />
                  </div>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="theme-card-bg border-emerald-500/20 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium theme-text-primary flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-yellow-400" />
                    {t("dashboard.pendingApplications")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold theme-text-primary">{filteredPendingApplications.length}</div>
                  <p className="text-xs theme-text-muted">{t("dashboard.awaitingApproval")}</p>
                </CardContent>
              </Card>

              <Card className="theme-card-bg border-emerald-500/20 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium theme-text-primary flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
                    {t("dashboard.activeApplications")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold theme-text-primary">{filteredApprovedLicenses.length}</div>
                  <p className="text-xs theme-text-muted">{t("dashboard.currentlyActive")}</p>
                </CardContent>
              </Card>

              <Card className="theme-card-bg border-emerald-500/20 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium theme-text-primary flex items-center">
                    <Key className="w-4 h-4 mr-2 text-emerald-400" />
                    {t("dashboard.totalIssued")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold theme-text-primary">5</div>
                  <p className="text-xs theme-text-muted">{t("dashboard.allTimeIssued")}</p>
                </CardContent>
              </Card>

              <Card className="theme-card-bg border-emerald-500/20 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium theme-text-primary flex items-center">
                    <FileKey className="w-4 h-4 mr-2 text-amber-400" />
                    {t("dashboard.expiringSoon")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold theme-text-primary">1</div>
                  <p className="text-xs theme-text-muted">{t("dashboard.within30Days")}</p>
                </CardContent>
              </Card>
            </div>

            {/* Filter Section */}
            <Card className="theme-card-bg border-emerald-500/20 backdrop-blur-sm mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="theme-text-primary flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-emerald-400" />
                  {t("filters.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* モバイル時は Account Number のみ、デスクトップ時は全て表示 */}
                  <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-5"}`}>
                    {/* Account Number Filter - 常に表示 */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium theme-text-secondary">{t("filters.accountNumber")}</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-400" />
                        <input
                          type="text"
                          placeholder={t("filters.searchAccount")}
                          value={accountFilter}
                          onChange={(e) => setAccountFilter(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 theme-input rounded-md focus:outline-none focus:border-emerald-400 text-sm"
                        />
                      </div>
                    </div>

                    {/* モバイル時の詳細検索ボタン */}
                    {isMobile && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium theme-text-secondary opacity-0">Advanced</label>
                        <Button
                          variant="outline"
                          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                          className="w-full bg-emerald-500/20 border-emerald-400/40 theme-text-primary hover:bg-emerald-500/30 hover:border-emerald-300 focus:theme-text-primary focus:bg-emerald-500/30"
                        >
                          <Filter className="w-4 h-4 mr-2" />
                          {showAdvancedFilters ? t("filters.hideAdvanced") : t("filters.advancedSearch")}
                        </Button>
                      </div>
                    )}

                    {/* 詳細フィルター項目 - デスクトップ時は常に表示、モバイル時は showAdvancedFilters が true の時のみ */}
                    {(!isMobile || showAdvancedFilters) && (
                      <>
                        {/* EA Name Filter */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium theme-text-secondary">{t("filters.eaName")}</label>
                          <div className="relative">
                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-400" />
                            <input
                              type="text"
                              placeholder={t("filters.searchEaName")}
                              value={eaNameFilter}
                              onChange={(e) => setEaNameFilter(e.target.value)}
                              className="w-full pl-10 pr-3 py-2 theme-input rounded-md focus:outline-none focus:border-emerald-400 text-sm"
                            />
                          </div>
                        </div>

                        {/* Broker Filter */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium theme-text-secondary">{t("filters.broker")}</label>
                          <select
                            value={brokerFilter}
                            onChange={(e) => setBrokerFilter(e.target.value)}
                            className="w-full px-3 py-2 theme-input theme-select rounded-md focus:outline-none focus:border-emerald-400 text-sm"
                          >
                            <option value="">{t("filters.allBrokers")}</option>
                            {allBrokers.map((broker) => (
                              <option key={broker} value={broker}>
                                {broker}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* X Account Filter */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium theme-text-secondary">{t("filters.xAccount")}</label>
                          <div className="relative">
                            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-400" />
                            <input
                              type="text"
                              placeholder={t("filters.searchXAccount")}
                              value={xAccountFilter}
                              onChange={(e) => setXAccountFilter(e.target.value)}
                              className="w-full pl-10 pr-3 py-2 theme-input rounded-md focus:outline-none focus:border-emerald-400 text-sm"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Clear Filters Button - デスクトップ時は常に表示、モバイル時は詳細検索表示時のみ */}
                    {(!isMobile || showAdvancedFilters) && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium theme-text-secondary opacity-0">Clear</label>
                        <Button
                          variant="outline"
                          onClick={clearFilters}
                          disabled={!hasActiveFilters}
                          className={`w-full filter-clear-button disabled:opacity-50 disabled:bg-slate-700/50 disabled:border-slate-600/40 disabled:text-slate-400`}
                        >
                          <X className="w-4 h-4 mr-2" />
                          {t("filters.clearFilters")}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Filter Results Info */}
                {hasActiveFilters && (!isMobile || showAdvancedFilters) && (
                  <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                    <p className="text-sm theme-text-secondary">
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
              <TabsList className="grid w-full grid-cols-3 theme-card-bg border border-emerald-500/20 p-1 rounded-lg overflow-hidden">
                <TabsTrigger
                  value="pending"
                  className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/25 theme-text-emerald hover:theme-text-primary hover:bg-emerald-500/20 transition-all duration-200 text-xs sm:text-sm rounded-l-md rounded-r-none m-0"
                >
                  <Clock className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{t("tabs.pending")}</span>
                  <span className="sm:hidden">{t("tabs.pendingShort")}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="approved"
                  className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/25 theme-text-emerald hover:theme-text-primary hover:bg-emerald-500/20 transition-all duration-200 text-xs sm:text-sm rounded-none m-0"
                >
                  <CheckCircle className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{t("tabs.active")}</span>
                  <span className="sm:hidden">{t("tabs.activeShort")}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/25 theme-text-emerald hover:theme-text-primary hover:bg-emerald-500/20 transition-all duration-200 text-xs sm:text-sm rounded-r-md rounded-l-none m-0"
                >
                  <History className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{t("tabs.history")}</span>
                  <span className="sm:hidden">{t("tabs.historyShort")}</span>
                </TabsTrigger>
              </TabsList>

              {/* Pending Applications Tab */}
              <TabsContent value="pending" className="mt-6">
                <Card className="theme-card-bg border-emerald-500/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="theme-text-primary flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-yellow-400" />
                      {t("tabs.pending")}
                    </CardTitle>
                    <CardDescription className="theme-text-secondary">
                      Review and approve EA license applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {paginatedPendingApplications.map((app) => (
                        <div
                          key={app.id}
                          className="p-4 theme-card-bg rounded-lg border border-emerald-500/10 hover:border-emerald-500/20 transition-colors"
                        >
                          <div className="flex flex-col space-y-3 mb-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold theme-text-primary">{app.eaName}</h3>
                              <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                                {t("status.pending")}
                              </Badge>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleApprove(app.id)}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white focus:text-white focus:bg-emerald-600 flex-1 sm:flex-none"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                {t("actions.approve")}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectClick(app.id, app.eaName)}
                                className="reject-button flex-1 sm:flex-none"
                              >
                                {t("actions.reject")}
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm theme-text-muted">
                            <div>
                              <span className="theme-text-emerald">{t("fields.account")}:</span> {app.accountNumber}
                            </div>
                            <div>
                              <span className="theme-text-emerald">{t("fields.broker")}:</span> {app.broker}
                            </div>
                            <div className="flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {app.email}
                            </div>
                            <div className="flex items-center">
                              <Hash className="w-3 h-3 mr-1" />
                              {app.xAccount}
                            </div>
                            <div>
                              <span className="theme-text-emerald">{t("fields.applied")}:</span> {app.appliedAt}
                            </div>
                            <div>
                              <span className="theme-text-emerald">{t("fields.id")}:</span> {app.id}
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
                <Card className="theme-card-bg border-emerald-500/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="theme-text-primary flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-emerald-400" />
                      {t("tabs.active")}
                    </CardTitle>
                    <CardDescription className="theme-text-secondary">Currently active EA licenses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {paginatedApprovedLicenses.map((license) => (
                        <div
                          key={license.id}
                          className="p-4 theme-card-bg rounded-lg border border-emerald-500/10 hover:border-emerald-500/20 transition-colors"
                        >
                          <div className="flex flex-col space-y-3 mb-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold theme-text-primary">{license.eaName}</h3>
                              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">
                                {t("status.active")}
                              </Badge>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeactivateClick(license.id, license.eaName)}
                                className="deactivate-button flex-1 sm:flex-none"
                              >
                                <X className="w-4 h-4 mr-1" />
                                {t("actions.deactivate")}
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm theme-text-muted mb-3">
                            <div>
                              <span className="theme-text-emerald">{t("fields.account")}:</span> {license.accountNumber}
                            </div>
                            <div>
                              <span className="theme-text-emerald">{t("fields.broker")}:</span> {license.broker}
                            </div>
                            <div className="flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {license.email}
                            </div>
                            <div className="flex items-center">
                              <Hash className="w-3 h-3 mr-1" />
                              {license.xAccount}
                            </div>
                            <div>
                              <span className="theme-text-emerald">{t("fields.approved")}:</span> {license.approvedAt}
                            </div>
                            <div>
                              <span className="theme-text-emerald">{t("fields.expires")}:</span> {license.expiresAt}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-3">
                            <code className="text-xs theme-card-bg px-2 py-1 rounded theme-text-primary font-mono border border-emerald-500/20 flex-1">
                              {showKeys[license.id] ? license.licenseKey : license.licenseKey.replace(/[A-Z0-9]/g, "•")}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleKeyVisibility(license.id)}
                              className="h-6 w-6 p-0 theme-text-emerald hover:theme-text-primary hover:bg-emerald-500/20"
                            >
                              {showKeys[license.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(license.licenseKey)}
                              className="h-6 w-6 p-0 theme-text-emerald hover:theme-text-primary hover:bg-emerald-500/20"
                            >
                              <Copy className="w-3 h-3" />
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
                <Card className="theme-card-bg border-emerald-500/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="theme-text-primary flex items-center">
                      <History className="w-5 h-5 mr-2 text-emerald-400" />
                      {t("tabs.history")}
                    </CardTitle>
                    <CardDescription className="theme-text-secondary">
                      Complete history of license issuance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {paginatedLicenseHistory.map((history) => (
                        <div
                          key={history.id}
                          className="p-4 theme-card-bg rounded-lg border border-emerald-500/10 hover:border-emerald-500/20 transition-colors"
                        >
                          <div className="flex flex-col space-y-3 mb-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold theme-text-primary">{history.eaName}</h3>
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
                                {t(`status.${history.status.toLowerCase()}`)}
                              </Badge>
                            </div>
                            <div className="text-sm theme-text-muted">
                              {history.action}: {history.expiredAt || history.revokedAt}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm theme-text-muted mb-3">
                            <div>
                              <span className="theme-text-emerald">{t("fields.account")}:</span> {history.accountNumber}
                            </div>
                            <div>
                              <span className="theme-text-emerald">{t("fields.broker")}:</span> {history.broker}
                            </div>
                            <div className="flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {history.email}
                            </div>
                            <div className="flex items-center">
                              <Hash className="w-3 h-3 mr-1" />
                              {history.xAccount}
                            </div>
                            <div>
                              <span className="theme-text-emerald">{t("fields.issued")}:</span> {history.issuedAt}
                            </div>
                            <div>
                              <span className="theme-text-emerald">{t("fields.id")}:</span> {history.id}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-3">
                            <code className="text-xs theme-card-bg px-2 py-1 rounded theme-text-primary font-mono border border-emerald-500/20 flex-1">
                              {history.licenseKey}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(history.licenseKey)}
                              className="h-6 w-6 p-0 theme-text-emerald hover:theme-text-primary hover:bg-emerald-500/20"
                            >
                              <Copy className="w-3 h-3" />
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
                      itemType="historyRecords"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        )}

        {currentView === "developer" && (
          <main className="flex-1 container mx-auto px-4 py-8 pb-12 relative z-10">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <FileKey className="w-8 h-8 text-emerald-400" />
                  <div>
                    <h2 className="text-3xl font-bold theme-text-primary">{t("developer.title")}</h2>
                    <p className="theme-text-secondary">{t("developer.subtitle")}</p>
                  </div>
                </div>
                {/* Desktop Theme & Language Controls */}
                {!isMobile && (
                  <div className="flex items-center space-x-2">
                    <ThemeToggle />
                    <LanguageToggle />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* Overview Card */}
              <Card className="theme-card-bg border-emerald-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="theme-text-primary flex items-center">
                    <FileKey className="w-5 h-5 mr-2 text-emerald-400" />
                    EA License Integration Guide
                  </CardTitle>
                  <CardDescription className="theme-text-secondary">
                    Complete guide for integrating SANKEY license verification into your Expert Advisors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 theme-card-bg rounded-lg border border-emerald-500/10">
                      <div className="flex items-center mb-2">
                        <Key className="w-5 h-5 mr-2 text-emerald-400" />
                        <h3 className="font-semibold theme-text-primary">{t("developer.mqhLibrary")}</h3>
                      </div>
                      <p className="text-sm theme-text-secondary mb-3">{t("developer.mqhDesc")}</p>
                      <Button
                        size="sm"
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white focus:text-white focus:bg-emerald-600"
                      >
                        {t("developer.downloadMqh")}
                      </Button>
                    </div>

                    <div className="p-4 theme-card-bg rounded-lg border border-emerald-500/10">
                      <div className="flex items-center mb-2">
                        <Settings className="w-5 h-5 mr-2 text-emerald-400" />
                        <h3 className="font-semibold theme-text-primary">{t("developer.dllLibrary")}</h3>
                      </div>
                      <p className="text-sm theme-text-secondary mb-3">{t("developer.dllDesc")}</p>
                      <Button
                        size="sm"
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white focus:text-white focus:bg-emerald-600"
                      >
                        {t("developer.downloadDll")}
                      </Button>
                    </div>

                    <div className="p-4 theme-card-bg rounded-lg border border-emerald-500/10">
                      <div className="flex items-center mb-2">
                        <FileKey className="w-5 h-5 mr-2 text-emerald-400" />
                        <h3 className="font-semibold theme-text-primary">{t("developer.documentation")}</h3>
                      </div>
                      <p className="text-sm theme-text-secondary mb-3">{t("developer.docDesc")}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-emerald-500/40 theme-text-secondary hover:bg-emerald-500/20 focus:theme-text-secondary focus:bg-emerald-500/20"
                      >
                        {t("developer.viewDocs")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Integration Steps */}
              <Card className="theme-card-bg border-emerald-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="theme-text-primary flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-emerald-400" />
                    Integration Steps
                  </CardTitle>
                  <CardDescription className="theme-text-secondary">
                    Step-by-step guide to integrate SANKEY license verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-emerald-500/20 rounded-full text-emerald-400 font-bold text-sm">
                        1
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold theme-text-primary mb-2">Download Required Files</h4>
                        <p className="text-sm theme-text-secondary mb-3">
                          Download the SANKEY MQH header file and DLL library from the links above.
                        </p>
                        <div className="bg-slate-800/40 p-3 rounded-md">
                          <code className="text-xs theme-text-emerald">
                            // Files needed:
                            <br />
                            // - SANKEY_License.mqh
                            <br />
                            // - SANKEY_License.dll
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-emerald-500/20 rounded-full text-emerald-400 font-bold text-sm">
                        2
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold theme-text-primary mb-2">Include Header File</h4>
                        <p className="text-sm theme-text-secondary mb-3">
                          Add the SANKEY header file to your EA and import the necessary functions.
                        </p>
                        <div className="bg-slate-800/40 p-3 rounded-md">
                          <code className="text-xs theme-text-emerald">
                            {"#include <SANKEY_License.mqh>"}
                            <br />
                            {'#import "SANKEY_License.dll"'}
                            <br />
                            {"  bool VerifyLicense(string licenseKey, string accountNumber);"}
                            <br />
                            {"#import"}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-emerald-500/20 rounded-full text-emerald-400 font-bold text-sm">
                        3
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold theme-text-primary mb-2">Initialize License Check</h4>
                        <p className="text-sm theme-text-secondary mb-3">
                          Add license verification in your EA's OnInit() function.
                        </p>
                        <div className="bg-slate-800/40 p-3 rounded-md">
                          <code className="text-xs theme-text-emerald">
                            {"int OnInit() {"}
                            <br />
                            {'  string licenseKey = "YOUR_LICENSE_KEY";'}
                            <br />
                            {"  string accountNum = IntegerToString(AccountInfoInteger(ACCOUNT_LOGIN));"}
                            <br />
                            {"  "}
                            <br />
                            {"  if(!VerifyLicense(licenseKey, accountNum) {"}
                            <br />
                            {'    Alert("Invalid License! EA will not work.");'}
                            <br />
                            {"    return INIT_FAILED;"}
                            <br />
                            {"  }"}
                            <br />
                            {"  return INIT_SUCCEEDED;"}
                            <br />
                            {"}"}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-emerald-500/20 rounded-full text-emerald-400 font-bold text-sm">
                        4
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold theme-text-primary mb-2">Periodic Verification</h4>
                        <p className="text-sm theme-text-secondary mb-3">
                          Add periodic license checks to prevent unauthorized usage.
                        </p>
                        <div className="bg-slate-800/40 p-3 rounded-md">
                          <code className="text-xs theme-text-emerald">
                            {"void OnTick() {"}
                            <br />
                            {"  static datetime lastCheck = 0;"}
                            <br />
                            {"  "}
                            <br />
                            {"  // Check license every hour"}
                            <br />
                            {"  if(TimeCurrent() - lastCheck > 3600) {"}
                            <br />
                            {"    if(!VerifyLicense(licenseKey, accountNum)) {"}
                            <br />
                            {"      ExpertRemove();"}
                            <br />
                            {"      return;"}
                            <br />
                            {"    }"}
                            <br />
                            {"    lastCheck = TimeCurrent();"}
                            <br />
                            {"  }"}
                            <br />
                            {"  "}
                            <br />
                            {"  // Your EA logic here..."}
                            <br />
                            {"}"}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* API Reference */}
              <Card className="theme-card-bg border-emerald-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="theme-text-primary flex items-center">
                    <FileKey className="w-5 h-5 mr-2 text-emerald-400" />
                    {t("developer.apiReference")}
                  </CardTitle>
                  <CardDescription className="theme-text-secondary">{t("developer.apiReferenceDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-800/40 rounded-lg border border-emerald-500/10">
                      <h4 className="font-semibold theme-text-primary mb-2">VerifyLicense()</h4>
                      <p className="text-sm theme-text-secondary mb-3">{t("developer.verifyLicenseDesc")}</p>
                      <CodeBlock
                        code="bool VerifyLicense(string licenseKey, string accountNumber)"
                        language="cpp"
                        title="Function Signature"
                      />
                      <div className="space-y-2 text-sm mt-4">
                        <div>
                          <span className="theme-text-emerald font-medium">{t("developer.parameters")}</span>
                          <ul className="ml-4 mt-1 space-y-1 theme-text-secondary">
                            <li>
                              • <code>licenseKey</code> - {t("developer.licenseKeyParam")}
                            </li>
                            <li>
                              • <code>accountNumber</code> - {t("developer.accountNumberParam")}
                            </li>
                          </ul>
                        </div>
                        <div>
                          <span className="theme-text-emerald font-medium">{t("developer.returns")}</span>
                          <span className="theme-text-secondary ml-2">{t("developer.verifyLicenseReturn")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-800/40 rounded-lg border border-emerald-500/10">
                      <h4 className="font-semibold theme-text-primary mb-2">GetLicenseInfo()</h4>
                      <p className="text-sm theme-text-secondary mb-3">{t("developer.getLicenseInfoDesc")}</p>
                      <CodeBlock
                        code="string GetLicenseInfo(string licenseKey)"
                        language="cpp"
                        title="Function Signature"
                      />
                      <div className="space-y-2 text-sm mt-4">
                        <div>
                          <span className="theme-text-emerald font-medium">{t("developer.parameters")}</span>
                          <ul className="ml-4 mt-1 space-y-1 theme-text-secondary">
                            <li>
                              • <code>licenseKey</code> - {t("developer.licenseKeyQueryParam")}
                            </li>
                          </ul>
                        </div>
                        <div>
                          <span className="theme-text-emerald font-medium">{t("developer.returns")}</span>
                          <span className="theme-text-secondary ml-2">{t("developer.getLicenseInfoReturn")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Best Practices */}
              <Card className="theme-card-bg border-emerald-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="theme-text-primary flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-emerald-400" />
                    {t("developer.bestPractices")}
                  </CardTitle>
                  <CardDescription className="theme-text-secondary">{t("developer.bestPracticesDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold theme-text-primary">{t("developer.security")}</h4>
                      <ul className="space-y-2 text-sm theme-text-secondary">
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 mr-2 text-emerald-400 mt-0.5 flex-shrink-0" />
                          {t("developer.obfuscateKey")}
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 mr-2 text-emerald-400 mt-0.5 flex-shrink-0" />
                          {t("developer.periodicChecks")}
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 mr-2 text-emerald-400 mt-0.5 flex-shrink-0" />
                          {t("developer.handleFailures")}
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 mr-2 text-emerald-400 mt-0.5 flex-shrink-0" />
                          {t("developer.useEncryption")}
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold theme-text-primary">{t("developer.performance")}</h4>
                      <ul className="space-y-2 text-sm theme-text-secondary">
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 mr-2 text-emerald-400 mt-0.5 flex-shrink-0" />
                          {t("developer.cacheResults")}
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 mr-2 text-emerald-400 mt-0.5 flex-shrink-0" />
                          {t("developer.limitFrequency")}
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 mr-2 text-emerald-400 mt-0.5 flex-shrink-0" />
                          {t("developer.handleTimeouts")}
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 mr-2 text-emerald-400 mt-0.5 flex-shrink-0" />
                          {t("developer.offlineGrace")}
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        )}

        {currentView === "settings" && (
          <main className="flex-1 container mx-auto px-4 py-8 pb-12 relative z-10">
            {/* Settings Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentView("dashboard")}
                    className="theme-text-secondary hover:theme-text-primary hover:bg-emerald-500/20 mr-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <Settings className="w-8 h-8 text-emerald-400" />
                  <div>
                    <h2 className="text-3xl font-bold theme-text-primary">{t("settings.title")}</h2>
                    <p className="theme-text-secondary">{t("settings.subtitle")}</p>
                  </div>
                </div>
                {/* Desktop Theme & Language Controls */}
                {!isMobile && (
                  <div className="flex items-center space-x-2">
                    <ThemeToggle />
                    <LanguageToggle />
                  </div>
                )}
              </div>
            </div>

            {/* Settings Content */}
            <div className="w-full space-y-6">
              {/* Current Plan Card */}
              <Card className="theme-card-bg border-emerald-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="theme-text-primary flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-emerald-400" />
                    {t("settings.currentPlan")}
                  </CardTitle>
                  <CardDescription className="theme-text-secondary">{t("settings.planDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Plan Status */}
                  <div className="flex items-center justify-between p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-12 h-12 bg-emerald-500/20 rounded-lg">
                        <Key className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold theme-text-primary">{currentPlan} Plan</h3>
                        <p className="text-sm theme-text-secondary">{t(`settings.plan${currentPlan}Description`)}</p>
                      </div>
                    </div>
                    <Badge
                      className={`${currentPlan === "Free" ? "bg-gray-500" : currentPlan === "Basic" ? "bg-blue-500" : "bg-purple-500"} text-white`}
                    >
                      {currentPlan}
                    </Badge>
                  </div>

                  {/* Usage Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 theme-card-bg rounded-lg border border-emerald-500/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm theme-text-secondary">{t("settings.monthlyLicenses")}</span>
                        <FileKey className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-2xl font-bold theme-text-primary">{monthlyLicensesUsed}</div>
                      <div className="text-xs theme-text-muted">
                        {t("settings.of")}{" "}
                        {planLimits[currentPlan].monthlyLicenses === -1
                          ? t("settings.unlimited")
                          : planLimits[currentPlan].monthlyLicenses}{" "}
                        {t("settings.used")}
                      </div>
                      {planLimits[currentPlan].monthlyLicenses !== -1 && (
                        <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min((monthlyLicensesUsed / planLimits[currentPlan].monthlyLicenses) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="p-4 theme-card-bg rounded-lg border border-emerald-500/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm theme-text-secondary">{t("settings.activeLicenses")}</span>
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-2xl font-bold theme-text-primary">{activeLicensesCount}</div>
                      <div className="text-xs theme-text-muted">
                        {t("settings.of")}{" "}
                        {planLimits[currentPlan].activeLicenses === -1
                          ? t("settings.unlimited")
                          : planLimits[currentPlan].activeLicenses}{" "}
                        {t("settings.active")}
                      </div>
                      {planLimits[currentPlan].activeLicenses !== -1 && (
                        <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min((activeLicensesCount / planLimits[currentPlan].activeLicenses) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="p-4 theme-card-bg rounded-lg border border-emerald-500/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm theme-text-secondary">{t("settings.apiCalls")}</span>
                        <Settings className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-2xl font-bold theme-text-primary">{apiCallsUsed}</div>
                      <div className="text-xs theme-text-muted">
                        {t("settings.of")}{" "}
                        {planLimits[currentPlan].apiCalls === -1
                          ? t("settings.unlimited")
                          : planLimits[currentPlan].apiCalls.toLocaleString()}{" "}
                        {t("settings.thisMonth")}
                      </div>
                      {planLimits[currentPlan].apiCalls !== -1 && (
                        <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min((apiCallsUsed / planLimits[currentPlan].apiCalls) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Plan Change Button */}
                  <div className="flex justify-center pt-4 border-t border-emerald-500/20">
                    <Button
                      onClick={() => setPlanChangeDialog(true)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      <Key className="w-4 h-4 mr-2" />
                      {t("settings.changePlan")}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* License Settings Card */}
              <Card className="theme-card-bg border-emerald-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="theme-text-primary flex items-center">
                    <FileKey className="w-5 h-5 mr-2 text-emerald-400" />
                    {t("settings.licenseSettings")}
                  </CardTitle>
                  <CardDescription className="theme-text-secondary">
                    {t("settings.licenseSettingsDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* License Expiration Setting */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium theme-text-secondary">
                      {t("settings.licenseExpiration")}
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="unlimited"
                          name="expiration"
                          checked={licenseExpirationType === "unlimited"}
                          onChange={() => setLicenseExpirationType("unlimited")}
                          className="w-4 h-4 text-emerald-500 border-emerald-500/20 focus:ring-emerald-500/20"
                        />
                        <label htmlFor="unlimited" className="text-sm theme-text-secondary">
                          {t("settings.unlimited")}
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="custom"
                          name="expiration"
                          checked={licenseExpirationType === "custom"}
                          onChange={() => setLicenseExpirationType("custom")}
                          className="w-4 h-4 text-emerald-500 border-emerald-500/20 focus:ring-emerald-500/20"
                        />
                        <label htmlFor="custom" className="text-sm theme-text-secondary">
                          {t("settings.customDays")}
                        </label>
                      </div>
                    </div>
                    {licenseExpirationType === "custom" && (
                      <div className="flex items-center space-x-2 mt-2">
                        <Input
                          type="number"
                          min="1"
                          max="3650"
                          value={customExpirationDays}
                          onChange={(e) => setCustomExpirationDays(Number(e.target.value))}
                          className="w-24 theme-input text-sm"
                          placeholder="365"
                        />
                        <span className="text-sm theme-text-secondary">{t("settings.days")}</span>
                      </div>
                    )}
                    <p className="text-xs theme-text-muted">{t("settings.licenseExpirationDesc")}</p>
                  </div>

                  {/* Master Key Display */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium theme-text-secondary">{t("settings.masterKey")}</label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="text"
                        value={masterKey}
                        readOnly
                        tabIndex={-1}
                        className="flex-1 theme-input text-sm font-mono select-none pointer-events-none"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(masterKey)}
                        className="h-10 w-10 p-0 theme-text-emerald hover:theme-text-primary hover:bg-emerald-500/20"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs theme-text-muted">{t("settings.masterKeyDesc")}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Display Settings Card */}
              <Card className="theme-card-bg border-emerald-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="theme-text-primary flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-emerald-400" />
                    {t("settings.displaySettings")}
                  </CardTitle>
                  <CardDescription className="theme-text-secondary">
                    {t("settings.displaySettingsDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Items per page setting */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium theme-text-secondary">{t("settings.itemsPerPage")}</label>
                    <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                      <SelectTrigger className="theme-card-bg border-emerald-500/20 theme-text-primary max-w-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="theme-card-bg border-emerald-500/20">
                        <SelectItem value="10">10 items</SelectItem>
                        <SelectItem value="25">25 items</SelectItem>
                        <SelectItem value="50">50 items</SelectItem>
                        <SelectItem value="100">100 items</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs theme-text-muted">{t("settings.itemsPerPageDesc")}</p>
                  </div>

                  {/* Theme setting */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium theme-text-secondary">{t("settings.theme")}</label>
                    <div className="flex items-center space-x-3">
                      <ThemeToggle />
                      <span className="text-sm theme-text-secondary">
                        {theme === "dark" ? t("settings.darkMode") : t("settings.lightMode")}
                      </span>
                    </div>
                    <p className="text-xs theme-text-muted">{t("settings.themeDesc")}</p>
                  </div>

                  {/* Language setting */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium theme-text-secondary">{t("settings.language")}</label>
                    <LanguageToggle />
                    <p className="text-xs theme-text-muted">{t("settings.languageDesc")}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Save button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => setCurrentView("dashboard")}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8"
                >
                  {t("actions.save")}
                </Button>
              </div>
            </div>
          </main>
        )}

        {/* Footer */}
        <footer className="border-t border-emerald-500/20 theme-card-bg backdrop-blur-md relative z-10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 theme-text-muted">
                <Lock className="w-4 h-4" />
                <span className="text-sm">{t("footer.securedBy")}</span>
              </div>
              <div className="text-sm theme-text-muted">{t("footer.copyright")}</div>
            </div>
          </div>
        </footer>
      </div>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={rejectDialog.isOpen} onOpenChange={handleRejectCancel}>
        <AlertDialogContent className="theme-card-bg border-red-500/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="theme-text-primary flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
              {t("dialog.rejectTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className="theme-text-secondary">
              {t("dialog.rejectMessage")}
              <span className="font-semibold theme-text-primary">"{rejectDialog.eaName}"</span>?
              <br />
              <br />
              <span className="text-red-300">{t("dialog.rejectWarning")}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleRejectCancel}
              className="border-emerald-500/40 theme-text-secondary hover:bg-emerald-500/20"
            >
              {t("actions.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleRejectConfirm} className="bg-red-600 hover:bg-red-700 text-white">
              <X className="w-4 h-4 mr-2" />
              {t("actions.reject")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deactivate Confirmation Dialog */}
      <AlertDialog open={deactivateDialog.isOpen} onOpenChange={handleDeactivateCancel}>
        <AlertDialogContent className="theme-card-bg border-red-500/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="theme-text-primary flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
              {t("dialog.deactivateTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className="theme-text-secondary">
              {t("dialog.deactivateMessage")}
              <span className="font-semibold theme-text-primary">"{deactivateDialog.eaName}"</span>?
              <br />
              <br />
              <span className="text-red-300">{t("dialog.deactivateWarning")}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleDeactivateCancel}
              className="border-emerald-500/40 theme-text-secondary hover:bg-emerald-500/20"
            >
              {t("actions.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivateConfirm} className="bg-red-600 hover:bg-red-700 text-white">
              <X className="w-4 h-4 mr-2" />
              {t("actions.deactivate")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Plan Change Dialog */}
      <Dialog open={planChangeDialog} onOpenChange={setPlanChangeDialog}>
        <DialogContent className="theme-card-bg border-emerald-500/20 theme-text-primary max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Key className="w-5 h-5 mr-2 text-emerald-400" />
              {t("settings.changePlan")}
            </DialogTitle>
            <DialogDescription className="theme-text-secondary">{t("settings.choosePlan")}</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
            {(["Free", "Basic", "Pro"] as const).map((plan) => (
              <div
                key={plan}
                className={`p-6 rounded-lg border-2 transition-all cursor-pointer ${
                  currentPlan === plan
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-emerald-500/20 hover:border-emerald-500/40"
                }`}
                onClick={() => setCurrentPlan(plan)}
              >
                <div className="text-center space-y-4">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${
                      plan === "Free" ? "bg-gray-500/20" : plan === "Basic" ? "bg-blue-500/20" : "bg-purple-500/20"
                    }`}
                  >
                    {plan === "Free" && <Shield className="w-6 h-6 text-gray-400" />}
                    {plan === "Basic" && <Key className="w-6 h-6 text-blue-400" />}
                    {plan === "Pro" && <FileKey className="w-6 h-6 text-purple-400" />}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold theme-text-primary">{plan}</h3>
                    <div className="text-2xl font-bold theme-text-emerald mt-2">
                      ${planLimits[plan].price}
                      <span className="text-sm theme-text-muted">/month</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="theme-text-secondary">{t("settings.monthlyLicenses")}:</span>
                      <span className="theme-text-primary font-medium">
                        {planLimits[plan].monthlyLicenses === -1
                          ? t("settings.unlimited")
                          : planLimits[plan].monthlyLicenses}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="theme-text-secondary">{t("settings.activeLicenses")}:</span>
                      <span className="theme-text-primary font-medium">
                        {planLimits[plan].activeLicenses === -1
                          ? t("settings.unlimited")
                          : planLimits[plan].activeLicenses}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="theme-text-secondary">{t("settings.apiCalls")}:</span>
                      <span className="theme-text-primary font-medium">
                        {planLimits[plan].apiCalls === -1
                          ? t("settings.unlimited")
                          : planLimits[plan].apiCalls.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {currentPlan === plan && (
                    <Badge className="bg-emerald-500 text-white">{t("settings.currentPlan")}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPlanChangeDialog(false)}
              className="border-emerald-500/40 theme-text-secondary hover:bg-emerald-500/20"
            >
              {t("actions.cancel")}
            </Button>
            <Button
              onClick={() => {
                // Here you would handle the plan change
                setPlanChangeDialog(false)
              }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {t("settings.updatePlan")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function HomePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock authentication check
    const checkAuth = () => {
      // For demo purposes, check if user came from login
      // In real app, this would check JWT token, session, etc.
      const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true"

      if (isLoggedIn) {
        setIsAuthenticated(true)
      } else {
        router.push("/login")
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen theme-bg-gradient flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <span className="theme-text-secondary">Loading...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return <Component />
}

export default HomePage
