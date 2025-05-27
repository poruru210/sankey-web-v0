"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {CheckCircle, X, Mail, Hash, Eye, EyeOff, Copy, History} from "lucide-react"
import { PaginationControls } from "./pagination-controls"
import {useI18n} from "@/lib/i18n-context";

interface LicenseHistories {
    id: string
    accountNumber: string
    broker: string
    eaName: string
    email: string
    xAccount: string
    licenseKey: string
    issuedAt: string,
    expiredAt: string,
    revokedAt: string,
    status: string,
    action: string,
}

interface LicenseHistoryProps {
    histories: LicenseHistories[]
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    totalItems: number
    itemsPerPage: number
}

export function LicenseHistories({
                                   histories,
                                   currentPage,
                                   totalPages,
                                   onPageChange,
                                   totalItems,
                                   itemsPerPage,
                               }: LicenseHistoryProps) {
    const { t } = useI18n()
    const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})

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
        } catch (err) {
            console.error("Failed to copy license key:", err)
            const textArea = document.createElement("textarea")
            textArea.value = text
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand("copy")
            document.body.removeChild(textArea)
        }
    }

    return (
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
                    {histories.map((history) => (
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
                     currentPage={currentPage}
                     totalPages={totalPages}
                     onPageChange={onPageChange}
                     totalItems={totalItems}
                     itemType="historyRecords"
                     itemsPerPage={itemsPerPage}
                />
            </CardContent>
        </Card>


    )
}