"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X, Mail, Hash, Eye, EyeOff, Copy } from "lucide-react"
import { PaginationControls } from "./pagination-controls"
import {useI18n} from "@/lib/i18n-context";

interface ActiveLicense {
    id: string
    accountNumber: string
    broker: string
    eaName: string
    email: string
    xAccount: string
    licenseKey: string
    approvedAt: string
    expiresAt: string
    status: string
}

interface ActiveLicensesProps {
    licenses: ActiveLicense[]
    onDeactivate: (id: string, eaName: string) => void
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    totalItems: number
    itemsPerPage: number
}

export function ActiveLicenses({
                                   licenses,
                                   onDeactivate,
                                   currentPage,
                                   totalPages,
                                   onPageChange,
                                   totalItems,
                                   itemsPerPage,
                               }: ActiveLicensesProps) {
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
                    <CheckCircle className="w-5 h-5 mr-2 text-emerald-400" />
                    {t("tabs.active")}
                </CardTitle>
                <CardDescription className="text-emerald-200/60">Currently active EA licenses</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {licenses.map((license) => (
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
                                        onClick={() => onDeactivate(license.id, license.eaName)}
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
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    totalItems={totalItems}
                    itemType="licenses"
                    itemsPerPage={itemsPerPage}
                />
            </CardContent>
        </Card>
    )
}