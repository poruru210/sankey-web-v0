"use client"

import React from "react"
import {CheckCircle, FileKey, Key, Settings, Shield} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {CodeBlock} from "@/components/code-block";
import {useI18n} from "@/lib/i18n-context";

export default function DeveloperPage() {
    const { t } = useI18n()

    return (
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
    )
}
