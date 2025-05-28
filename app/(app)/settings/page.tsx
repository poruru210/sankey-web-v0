"use client"

import React, {useState} from "react"
import {Button} from "@/components/ui/button";
import {ArrowLeft, CheckCircle, Copy, FileKey, Key, Settings, Shield} from "lucide-react";
import {ThemeToggle} from "@/components/theme-toggle";
import {LanguageToggle} from "@/components/language-toggle";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useI18n} from "@/lib/i18n-context";
import theme from "tailwindcss/defaultTheme";
import {useTheme} from "next-themes";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

export default function SettingsPage() {
    const { t } = useI18n()
    const [currentPlan, setCurrentPlan] = useState<"Free" | "Basic" | "Pro">("Basic")
    const [monthlyLicensesUsed, setMonthlyLicensesUsed] = useState(3)
    const [activeLicensesCount, setActiveLicensesCount] = useState(5)
    const [apiCallsUsed, setApiCallsUsed] = useState(1250)
    const [licenseExpirationType, setLicenseExpirationType] = useState<"unlimited" | "custom">("custom")
    const [customExpirationDays, setCustomExpirationDays] = useState(365)
    const [masterKey, setMasterKey] = useState("SANKEY-MASTER-2024-ABCD-EFGH-IJKL-MNOP-QRST")
    const [planChangeDialog, setPlanChangeDialog] = useState(false)
    const { theme } = useTheme()

    // Settings states
    const [itemsPerPage, setItemsPerPage] = useState(10)

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

    return (
        <main className="flex-1 container mx-auto px-4 py-8 pb-12 relative z-10">
            {/* Settings Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <Settings className="w-8 h-8 text-emerald-400" />
                        <div>
                            <h2 className="text-3xl font-bold theme-text-primary">{t("settings.title")}</h2>
                            <p className="theme-text-secondary">{t("settings.subtitle")}</p>
                        </div>
                    </div>
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
                                  {theme === "dark"
                                      ? t("settings.darkMode")
                                      : theme === "light"
                                          ? t("settings.lightMode")
                                          : t("settings.lightMode") // fallback
                                  }
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
                    <Button onClick={() => alert("dashbord")}
                        // onClick={() => setCurrentView("dashboard")}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-8"
                    >
                        {t("actions.save")}
                    </Button>
                </div>
            </div>

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
        </main>
    )
}
