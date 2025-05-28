"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { Shield, Clock, CheckCircle, History, X, AlertTriangle } from "lucide-react"
import type { Container, Engine } from "tsparticles-engine"
import { loadSlim } from "tsparticles-slim"

// Import dashboard components
import { StatsCards } from "./components/stats-cards"
import { FilterSection } from "./components/filter-section"
import { PendingApplications } from "./components/pending-applications"
import { ActiveLicenses } from "./components/active-licenses"
import { LicenseHistories } from "./components/license-histories"
import {useI18n} from "@/lib/i18n-context";


export default function DashboardPage() {
    const router = useRouter()
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

    // Pagination states
    const [pendingCurrentPage, setPendingCurrentPage] = useState(1)
    const [activeCurrentPage, setActiveCurrentPage] = useState(1)
    const [historyCurrentPage, setHistoryCurrentPage] = useState(1)

    const [itemsPerPage, setItemsPerPage] = useState(10)

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024
            setIsMobile(mobile)
        }

        checkMobile()
        window.addEventListener("resize", checkMobile)

        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    // Check authentication
    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true"
        if (!isLoggedIn) {
            router.push("/login")
        }
    }, [router])

    // Sample data - In a real app, this would come from an API
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
            id: "APP-010",
            accountNumber: "99776655",
            broker: "ThinkMarkets",
            eaName: "Volatility Crusher",
            email: "trader10@example.com",
            xAccount: "@vol_crusher",
            appliedAt: "2024-01-06",
            status: "Pending",
        },
    ]

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

    // Get all brokers
    const allBrokers = useMemo(() => {
        const brokers = new Set([
            ...pendingApplications.map((app) => app.broker),
            ...approvedLicenses.map((license) => license.broker),
        ])
        return Array.from(brokers).sort()
    }, [])

    // Filter applications
    const filteredPendingApplications = useMemo(() => {
        return pendingApplications.filter((app) => {
            const matchesAccount =
                accountFilter === "" || app.accountNumber.toLowerCase().includes(accountFilter.toLowerCase())
            const matchesXAccount = xAccountFilter === "" || app.xAccount.toLowerCase().includes(xAccountFilter.toLowerCase())
            const matchesBroker = brokerFilter === "" || app.broker === brokerFilter
            const matchesEaName = eaNameFilter === "" || app.eaName.toLowerCase().includes(eaNameFilter.toLowerCase())
            return matchesAccount && matchesXAccount && matchesBroker && matchesEaName
        })
    }, [accountFilter, xAccountFilter, brokerFilter, eaNameFilter])

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
    }, [accountFilter, xAccountFilter, brokerFilter, eaNameFilter])

    const filteredLicenseHistories = useMemo(() => {
        return licenseHistory.filter((history) => {
            const matchesAccount =
                accountFilter === "" || history.accountNumber.toLowerCase().includes(accountFilter.toLowerCase())
            const matchesXAccount =
                xAccountFilter === "" || history.xAccount.toLowerCase().includes(xAccountFilter.toLowerCase())
            const matchesBroker = brokerFilter === "" || history.broker === brokerFilter
            const matchesEaName = eaNameFilter === "" || history.eaName.toLowerCase().includes(eaNameFilter.toLowerCase())
            return matchesAccount && matchesXAccount && matchesBroker && matchesEaName
        })
    }, [accountFilter, xAccountFilter, brokerFilter, eaNameFilter])

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
    const paginatedLicenseHistories = getPaginatedData(filteredLicenseHistories, historyCurrentPage)

    // Total pages
    const pendingTotalPages = getTotalPages(filteredPendingApplications.length)
    const activeTotalPages = getTotalPages(filteredApprovedLicenses.length)
    const historyTotalPages = getTotalPages(filteredLicenseHistories.length)

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

    // Clear filters
    const clearFilters = () => {
        setAccountFilter("")
        setXAccountFilter("")
        setBrokerFilter("")
        setEaNameFilter("")
    }

    // Check if filters are active
    const hasActiveFilters = accountFilter !== "" || xAccountFilter !== "" || brokerFilter !== "" || eaNameFilter !== ""

    const handleApprove = (applicationId: string) => {
        console.log(`Approving application: ${applicationId}`)
        // Here you would make an API call to approve the application
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
        // Here you would make an API call to reject the application
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
        // Here you would make an API call to deactivate the license
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

    return (
        <div>
            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 container mx-auto px-4 py-8 pb-12 relative z-10">
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <Shield className="w-8 h-8 text-emerald-400" />
                                <div>
                                    <h2 className="text-3xl font-bold theme-text-primary">{t("dashboard.title")}</h2>
                                    <p className="theme-text-secondary">{t("dashboard.subtitle")}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <StatsCards
                        pendingCount={filteredPendingApplications.length}
                        activeCount={filteredApprovedLicenses.length}
                        totalIssued={5}
                        expiringSoon={1}
                    />

                    {/* Filter Section */}
                    <FilterSection
                        accountFilter={accountFilter}
                        setAccountFilter={setAccountFilter}
                        xAccountFilter={xAccountFilter}
                        setXAccountFilter={setXAccountFilter}
                        brokerFilter={brokerFilter}
                        setBrokerFilter={setBrokerFilter}
                        eaNameFilter={eaNameFilter}
                        setEaNameFilter={setEaNameFilter}
                        allBrokers={allBrokers}
                        clearFilters={clearFilters}
                        hasActiveFilters={hasActiveFilters}
                        isMobile={isMobile}
                        showAdvancedFilters={showAdvancedFilters}
                        setShowAdvancedFilters={setShowAdvancedFilters}
                        filteredPendingCount={filteredPendingApplications.length}
                        filteredActiveCount={filteredApprovedLicenses.length}
                    />

                    {/* Tabs */}
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

                        {/* Tab Content */}
                        <TabsContent value="pending" className="mt-6">
                            <PendingApplications
                                applications={paginatedPendingApplications}
                                onApprove={handleApprove}
                                onReject={handleRejectClick}
                                currentPage={pendingCurrentPage}
                                totalPages={pendingTotalPages}
                                onPageChange={setPendingCurrentPage}
                                totalItems={filteredPendingApplications.length}
                                itemsPerPage={itemsPerPage}
                            />
                        </TabsContent>

                        <TabsContent value="approved" className="mt-6">
                            <ActiveLicenses
                                licenses={paginatedApprovedLicenses}
                                onDeactivate={handleDeactivateClick}
                                currentPage={activeCurrentPage}
                                totalPages={activeTotalPages}
                                onPageChange={setActiveCurrentPage}
                                totalItems={filteredApprovedLicenses.length}
                                itemsPerPage={itemsPerPage}
                            />
                        </TabsContent>

                        <TabsContent value="history" className="mt-6">
                            <LicenseHistories
                                histories={paginatedLicenseHistories}
                                currentPage={historyCurrentPage}
                                totalPages={historyTotalPages}
                                onPageChange={setHistoryCurrentPage}
                                totalItems={filteredLicenseHistories.length}
                                itemsPerPage={itemsPerPage}
                            />
                        </TabsContent>
                    </Tabs>
                </main>
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
        </div>
    )
}