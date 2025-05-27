"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  CheckCircle,
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowLeft,
} from "lucide-react"
import { useState, useCallback, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
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
import {Sidebar} from "@/app/components/sidebar";
import DashboardPage from "@/app/dashboard/page";
import ParticlesBackground from "@/app/components/ParticlesBackground";

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
      <ParticlesBackground theme={theme} particlesInit={particlesInit}/>


      {/* Sidebar */}
      <Sidebar isMobile={isMobile} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentView={currentView} setCurrentView={setCurrentView} handleLogout={handleLogout} />

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
            <DashboardPage />
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
        <DialogContent className="theme-card-bg border-emerald-500/20 theme-text-primary max-w-4xl max-h-[100vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 pb-4 border-b border-emerald-500/20">
            <DialogTitle className="flex items-center">
              <Key className="w-5 h-5 mr-2 text-emerald-400" />
              {t("settings.changePlan")}
            </DialogTitle>
            <DialogDescription className="theme-text-secondary">{t("settings.choosePlan")}</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 py-4 md:py-6 px-1">
            {(["Free", "Basic", "Pro"] as const).map((plan) => (
                <div
                    key={plan}
                    className={`p-4 md:p-6 rounded-lg border-2 transition-all cursor-pointer ${
                        currentPlan === plan
                            ? "border-emerald-500 bg-emerald-500/10"
                            : "border-emerald-500/20 hover:border-emerald-500/40"
                    }`}
                    onClick={() => setCurrentPlan(plan)}
                >
                  <div className="text-center space-y-3 md:space-y-4">
                    <div
                        className={`inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg ${
                            plan === "Free" ? "bg-gray-500/20" : plan === "Basic" ? "bg-blue-500/20" : "bg-purple-500/20"
                        }`}
                    >
                      {plan === "Free" && <Shield className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />}
                      {plan === "Basic" && <Key className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />}
                      {plan === "Pro" && <FileKey className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />}
                    </div>

                    <div>
                      <h3 className="text-lg md:text-xl font-bold theme-text-primary">{plan}</h3>
                      <div className="text-xl md:text-2xl font-bold theme-text-emerald mt-2">
                        ${planLimits[plan].price}
                        <span className="text-xs md:text-sm theme-text-muted">/month</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs md:text-sm">
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
                        <Badge className="bg-emerald-500 text-white text-xs">{t("settings.currentPlan")}</Badge>
                    )}
                  </div>
                </div>
            ))}
          </div>

          <DialogFooter className="pt-4 border-t border-emerald-500/20 flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
                variant="outline"
                onClick={() => setPlanChangeDialog(false)}
                className="border-emerald-500/40 theme-text-secondary hover:bg-emerald-500/20 w-full sm:w-auto"
            >
              {t("actions.cancel")}
            </Button>
            <Button
                onClick={() => {
                  // Here you would handle the plan change
                  setPlanChangeDialog(false)
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white w-full sm:w-auto"
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
