"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Mail, Hash } from "lucide-react"
import { PaginationControls } from "./pagination-controls"
import {useI18n} from "@/lib/i18n-context";

interface PendingApplication {
    id: string
    accountNumber: string
    broker: string
    eaName: string
    email: string
    xAccount: string
    appliedAt: string
    status: string
}

interface PendingApplicationsProps {
    applications: PendingApplication[]
    onApprove: (id: string) => void
    onReject: (id: string, eaName: string) => void
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    totalItems: number
    itemsPerPage: number
}

export function PendingApplications({
                                        applications,
                                        onApprove,
                                        onReject,
                                        currentPage,
                                        totalPages,
                                        onPageChange,
                                        totalItems,
                                        itemsPerPage,
                                    }: PendingApplicationsProps) {
    const { t } = useI18n()

    return (
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
                    {applications.map((app) => (
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
                                        onClick={() => onApprove(app.id)}
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white focus:text-white focus:bg-emerald-600 flex-1 sm:flex-none"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        {t("actions.approve")}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onReject(app.id, app.eaName)}
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
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    totalItems={totalItems}
                    itemType="applications"
                    itemsPerPage={itemsPerPage}
                />
            </CardContent>
        </Card>
    )
}