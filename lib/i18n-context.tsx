"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "ja"

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Header & Navigation
    "nav.dashboard": "License Dashboard",
    "nav.developer": "Developer Guide",
    "nav.settings": "Settings",
    "nav.signOut": "Sign Out",
    "nav.menu": "Menu",

    // Dashboard
    "dashboard.title": "License Management Dashboard",
    "dashboard.subtitle": "Manage EA license applications and approvals",
    "dashboard.pendingApplications": "Pending Applications",
    "dashboard.activeApplications": "Active Licenses",
    "dashboard.totalIssued": "Total Issued",
    "dashboard.expiringSoon": "Expiring Soon",
    "dashboard.awaitingApproval": "Awaiting approval",
    "dashboard.currentlyActive": "Currently active",
    "dashboard.allTimeIssued": "All time issued",
    "dashboard.within30Days": "Within 30 days",

    // Filters
    "filters.title": "Filters",
    "filters.accountNumber": "Account Number",
    "filters.eaName": "EA Name",
    "filters.broker": "Broker",
    "filters.xAccount": "X Account",
    "filters.allBrokers": "All Brokers",
    "filters.advancedSearch": "Advanced Search",
    "filters.hideAdvanced": "Hide Advanced",
    "filters.clearFilters": "Clear Filters",
    "filters.searchAccount": "Search account...",
    "filters.searchEaName": "Search EA name...",
    "filters.searchXAccount": "Search X account...",

    // Tabs
    "tabs.pending": "Pending Applications",
    "tabs.active": "Active Licenses",
    "tabs.history": "Issue History",
    "tabs.pendingShort": "Pending",
    "tabs.activeShort": "Active",
    "tabs.historyShort": "History",

    // Actions
    "actions.approve": "Approve",
    "actions.reject": "Reject",
    "actions.deactivate": "Deactivate",
    "actions.copy": "Copy",
    "actions.cancel": "Cancel",
    "actions.save": "Save",

    // Status
    "status.pending": "Pending",
    "status.active": "Active",
    "status.expired": "Expired",
    "status.revoked": "Revoked",
    "status.deactivated": "Deactivated",

    // Fields
    "fields.account": "Account",
    "fields.broker": "Broker",
    "fields.applied": "Applied",
    "fields.approved": "Approved",
    "fields.expires": "Expires",
    "fields.issued": "Issued",
    "fields.id": "ID",

    // Dialogs
    "dialog.rejectTitle": "Confirm Application Rejection",
    "dialog.rejectMessage": "Are you sure you want to reject the application for",
    "dialog.rejectWarning": "This action cannot be undone. The application will be permanently rejected.",
    "dialog.deactivateTitle": "Confirm License Deactivation",
    "dialog.deactivateMessage": "Are you sure you want to deactivate the license for",
    "dialog.deactivateWarning":
      "This action cannot be undone. The license will be deactivated during the next license check.",

    // Settings
    "settings.title": "Settings",
    "settings.subtitle": "Configure your dashboard preferences",
    "settings.itemsPerPage": "Items per page",
    "settings.itemsPerPageDesc": "Number of items to display per page in tables",
    "settings.theme": "Theme",
    "settings.themeDesc": "Choose your preferred theme",
    "settings.language": "Language",
    "settings.languageDesc": "Select your preferred language",
    "settings.darkMode": "Dark Mode",
    "settings.lightMode": "Light Mode",
    "settings.currentPlan": "Current Plan",
    "settings.planDescription": "Manage your subscription and view usage statistics",
    "settings.planFreeDescription": "Perfect for getting started",
    "settings.planBasicDescription": "Great for small businesses",
    "settings.planProDescription": "Unlimited access for enterprises",
    "settings.monthlyLicenses": "Monthly Licenses",
    "settings.activeLicenses": "Active Licenses",
    "settings.apiCalls": "API Calls",
    "settings.of": "of",
    "settings.used": "used",
    "settings.active": "active",
    "settings.thisMonth": "this month",
    "settings.unlimited": "Unlimited",
    "settings.changePlan": "Change Plan",
    "settings.choosePlan": "Choose the plan that best fits your needs",
    "settings.updatePlan": "Update Plan",
    "settings.licenseSettings": "License Settings",
    "settings.licenseSettingsDesc": "Configure default license generation settings",
    "settings.licenseExpiration": "License Expiration",
    "settings.licenseExpirationDesc": "Set the default expiration period for new licenses",
    "settings.customDays": "Custom Days",
    "settings.days": "days",
    "settings.masterKey": "Master Key",
    "settings.masterKeyDesc": "This key is used for license generation and verification",
    "settings.displaySettings": "Display Settings",
    "settings.displaySettingsDesc": "Customize your dashboard appearance and behavior",

    // Developer Guide
    "developer.title": "Developer Integration Guide",
    "developer.subtitle": "Complete guide for integrating SANKEY license verification into your Expert Advisors",
    "developer.integrationGuide": "EA License Integration Guide",
    "developer.integrationGuideDesc":
      "Complete guide for integrating SANKEY license verification into your Expert Advisors",
    "developer.mqhLibrary": "MQH Library",
    "developer.mqhDesc": "Include our header file for easy license verification",
    "developer.dllLibrary": "DLL Library",
    "developer.dllDesc": "Windows DLL for license verification functions",
    "developer.documentation": "Documentation",
    "developer.docDesc": "Complete API reference and examples",
    "developer.downloadMqh": "Download MQH",
    "developer.downloadDll": "Download DLL",
    "developer.viewDocs": "View Docs",
    "developer.integrationSteps": "Integration Steps",
    "developer.integrationStepsDesc": "Step-by-step guide to integrate SANKEY license verification",
    "developer.step1Title": "Download Required Files",
    "developer.step1Desc": "Download the SANKEY MQH header file and DLL library from the links above.",
    "developer.step1Comment": "Files needed:",
    "developer.step2Title": "Include Header File",
    "developer.step2Desc": "Add the SANKEY header file to your EA and import the necessary functions.",
    "developer.step3Title": "Initialize License Check",
    "developer.step3Desc": "Add license verification in your EA's OnInit() function.",
    "developer.step4Title": "Periodic Verification",
    "developer.step4Desc": "Add periodic license checks to prevent unauthorized usage.",
    "developer.step4Comment1": "Check license every hour",
    "developer.step4Comment2": "Your EA logic here...",
    "developer.apiReference": "API Reference",
    "developer.apiReferenceDesc": "Available functions and their usage",
    "developer.verifyLicenseDesc": "Verifies if the provided license key is valid for the given account number.",
    "developer.getLicenseInfoDesc": "Retrieves detailed information about the license.",
    "developer.parameters": "Parameters:",
    "developer.returns": "Returns:",
    "developer.licenseKeyParam": "The license key to verify",
    "developer.accountNumberParam": "The MT4/MT5 account number",
    "developer.licenseKeyQueryParam": "The license key to query",
    "developer.verifyLicenseReturn": "true if license is valid, false otherwise",
    "developer.getLicenseInfoReturn": "JSON string with license details",
    "developer.bestPractices": "Best Practices",
    "developer.bestPracticesDesc": "Recommendations for secure license implementation",
    "developer.security": "Security",
    "developer.performance": "Performance",
    "developer.obfuscateKey": "Obfuscate your license key in the code",
    "developer.periodicChecks": "Perform periodic license checks",
    "developer.handleFailures": "Handle license failures gracefully",
    "developer.useEncryption": "Use encrypted communication",
    "developer.cacheResults": "Cache license verification results",
    "developer.limitFrequency": "Limit verification frequency",
    "developer.handleTimeouts": "Handle network timeouts",
    "developer.offlineGrace": "Implement offline grace period",

    // Login
    "login.title": "SANKEY",
    "login.subtitle": "EA License Management System",
    "login.email": "Email Address",
    "login.password": "Password",
    "login.signIn": "Sign In",
    "login.signingIn": "Signing in...",
    "login.emailPlaceholder": "admin@sankey.com",
    "login.passwordPlaceholder": "Enter your password",
    "login.forgotPassword": "Forgot your password?",
    "login.demoAccess": "Demo Access",
    "login.demoNote": "Any valid email format and 4+ character password will work",
    "login.securedBy": "Secured by advanced encryption",

    // Forgot Password
    "forgotPassword.title": "Reset Password",
    "forgotPassword.subtitle": "Enter your email to receive reset instructions",
    "forgotPassword.instructions": "We'll send you a link to reset your password.",
    "forgotPassword.emailPlaceholder": "Enter your email address",
    "forgotPassword.sendReset": "Send Reset Link",
    "forgotPassword.sending": "Sending...",
    "forgotPassword.backToLogin": "Back to Login",
    "forgotPassword.emailRequired": "Email address is required",
    "forgotPassword.emailInvalid": "Please enter a valid email address",
    "forgotPassword.sendFailed": "Failed to send reset email. Please try again.",
    "forgotPassword.emailSent": "Email Sent!",
    "forgotPassword.checkEmail": "Check your email for reset instructions",
    "forgotPassword.emailSentTo": "We've sent password reset instructions to:",
    "forgotPassword.checkSpam": "If you don't see the email, please check your spam folder.",
    "forgotPassword.nextSteps": "Next Steps:",
    "forgotPassword.step1": "Check your email inbox for a message from SANKEY",
    "forgotPassword.step2": "Click the reset link in the email",
    "forgotPassword.step3": "Follow the instructions to create a new password",
    "forgotPassword.resendEmail": "Didn't receive the email? Send again",

    // Footer
    "footer.copyright": "© 2024 SANKEY. All rights reserved.",
    "footer.securedBy": "Secured by advanced encryption",

    // Pagination
    "pagination.showing": "Showing",
    "pagination.to": "to",
    "pagination.of": "of",
    "pagination.applications": "applications",
    "pagination.licenses": "licenses",
    "pagination.historyRecords": "history records",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
  },
  ja: {
    // Header & Navigation
    "nav.dashboard": "ライセンス管理",
    "nav.developer": "開発者ガイド",
    "nav.settings": "設定",
    "nav.documentation": "ドキュメント",
    "nav.support": "サポート",
    "nav.profile": "プロフィール",
    "nav.signOut": "サインアウト",
    "nav.menu": "メニュー",

    // Dashboard
    "dashboard.title": "ライセンス管理ダッシュボード",
    "dashboard.subtitle": "EAライセンスの申請と承認を管理",
    "dashboard.pendingApplications": "申請待ち",
    "dashboard.activeApplications": "有効なライセンス",
    "dashboard.totalIssued": "発行済み総数",
    "dashboard.expiringSoon": "期限切れ間近",
    "dashboard.awaitingApproval": "承認待ち",
    "dashboard.currentlyActive": "現在有効",
    "dashboard.allTimeIssued": "累計発行数",
    "dashboard.within30Days": "30日以内",

    // Filters
    "filters.title": "フィルター",
    "filters.accountNumber": "アカウント番号",
    "filters.eaName": "EA名",
    "filters.broker": "ブローカー",
    "filters.xAccount": "Xアカウント",
    "filters.allBrokers": "全てのブローカー",
    "filters.advancedSearch": "詳細検索",
    "filters.hideAdvanced": "詳細検索を隠す",
    "filters.clearFilters": "フィルターをクリア",
    "filters.searchAccount": "アカウントを検索...",
    "filters.searchEaName": "EA名を検索...",
    "filters.searchXAccount": "Xアカウントを検索...",

    // Tabs
    "tabs.pending": "申請待ち",
    "tabs.active": "有効なライセンス",
    "tabs.history": "発行履歴",
    "tabs.pendingShort": "申請待ち",
    "tabs.activeShort": "有効",
    "tabs.historyShort": "履歴",

    // Actions
    "actions.approve": "承認",
    "actions.reject": "却下",
    "actions.deactivate": "無効化",
    "actions.copy": "コピー",
    "actions.cancel": "キャンセル",
    "actions.save": "保存",

    // Status
    "status.pending": "申請中",
    "status.active": "有効",
    "status.expired": "期限切れ",
    "status.revoked": "取り消し",
    "status.deactivated": "無効化",

    // Fields
    "fields.account": "アカウント",
    "fields.broker": "ブローカー",
    "fields.applied": "申請日",
    "fields.approved": "承認日",
    "fields.expires": "有効期限",
    "fields.issued": "発行日",
    "fields.id": "ID",

    // Dialogs
    "dialog.rejectTitle": "申請却下の確認",
    "dialog.rejectMessage": "以下の申請を却下してもよろしいですか",
    "dialog.rejectWarning": "この操作は取り消せません。申請は完全に却下されます。",
    "dialog.deactivateTitle": "ライセンス無効化の確認",
    "dialog.deactivateMessage": "以下のライセンスを無効化してもよろしいですか",
    "dialog.deactivateWarning": "この操作は取り消せません。次回のライセンスチェック時に無効化されます。",

    // Settings
    "settings.title": "設定",
    "settings.subtitle": "ダッシュボードの設定を変更",
    "settings.itemsPerPage": "ページあたりの項目数",
    "settings.itemsPerPageDesc": "テーブルに表示する項目数",
    "settings.theme": "テーマ",
    "settings.themeDesc": "お好みのテーマを選択",
    "settings.language": "言語",
    "settings.languageDesc": "お好みの言語を選択",
    "settings.darkMode": "ダークモード",
    "settings.lightMode": "ライトモード",
    "settings.currentPlan": "現在のプラン",
    "settings.planDescription": "サブスクリプションを管理し、使用統計を確認",
    "settings.planFreeDescription": "始めるのに最適",
    "settings.planBasicDescription": "小規模ビジネスに最適",
    "settings.planProDescription": "企業向け無制限アクセス",
    "settings.monthlyLicenses": "月間ライセンス",
    "settings.activeLicenses": "有効ライセンス",
    "settings.apiCalls": "API呼び出し",
    "settings.of": "/",
    "settings.used": "使用済み",
    "settings.active": "有効",
    "settings.thisMonth": "今月",
    "settings.unlimited": "無制限",
    "settings.changePlan": "プラン変更",
    "settings.choosePlan": "ニーズに最適なプランを選択してください",
    "settings.updatePlan": "プラン更新",
    "settings.licenseSettings": "ライセンス設定",
    "settings.licenseSettingsDesc": "デフォルトのライセンス生成設定を構成",
    "settings.licenseExpiration": "ライセンス有効期限",
    "settings.licenseExpirationDesc": "新しいライセンスのデフォルト有効期限を設定",
    "settings.customDays": "カスタム日数",
    "settings.days": "日",
    "settings.masterKey": "マスターキー",
    "settings.masterKeyDesc": "このキーはライセンスの生成と検証に使用されます",
    "settings.displaySettings": "表示設定",
    "settings.displaySettingsDesc": "ダッシュボードの外観と動作をカスタマイズ",

    // Developer Guide
    "developer.title": "開発者統合ガイド",
    "developer.subtitle": "Expert AdvisorにSANKEYライセンス認証を統合するための完全ガイド",
    "developer.integrationGuide": "EAライセンス統合ガイド",
    "developer.integrationGuideDesc": "Expert AdvisorにSANKEYライセンス認証を統合するための完全ガイド",
    "developer.mqhLibrary": "MQHライブラリ",
    "developer.mqhDesc": "簡単なライセンス認証のためのヘッダーファイル",
    "developer.dllLibrary": "DLLライブラリ",
    "developer.dllDesc": "ライセンス認証機能用Windows DLL",
    "developer.documentation": "ドキュメント",
    "developer.docDesc": "完全なAPIリファレンスと例",
    "developer.downloadMqh": "MQHをダウンロード",
    "developer.downloadDll": "DLLをダウンロード",
    "developer.viewDocs": "ドキュメントを見る",
    "developer.integrationSteps": "統合手順",
    "developer.integrationStepsDesc": "SANKEYライセンス認証を統合するためのステップバイステップガイド",
    "developer.step1Title": "必要なファイルをダウンロード",
    "developer.step1Desc": "上記のリンクからSANKEY MQHヘッダーファイルとDLLライブラリをダウンロードします。",
    "developer.step1Comment": "必要なファイル:",
    "developer.step2Title": "ヘッダーファイルをインクルード",
    "developer.step2Desc": "SANKEYヘッダーファイルをEAに追加し、必要な関数をインポートします。",
    "developer.step3Title": "ライセンスチェックを初期化",
    "developer.step3Desc": "EAのOnInit()関数にライセンス認証を追加します。",
    "developer.step4Title": "定期的な認証",
    "developer.step4Desc": "不正使用を防ぐために定期的なライセンスチェックを追加します。",
    "developer.step4Comment1": "1時間ごとにライセンスをチェック",
    "developer.step4Comment2": "ここにEAのロジックを記述...",
    "developer.apiReference": "APIリファレンス",
    "developer.apiReferenceDesc": "利用可能な関数とその使用方法",
    "developer.verifyLicenseDesc":
      "指定されたライセンスキーが指定されたアカウント番号に対して有効かどうかを確認します。",
    "developer.getLicenseInfoDesc": "ライセンスに関する詳細情報を取得します。",
    "developer.parameters": "パラメータ:",
    "developer.returns": "戻り値:",
    "developer.licenseKeyParam": "認証するライセンスキー",
    "developer.accountNumberParam": "MT4/MT5アカウント番号",
    "developer.licenseKeyQueryParam": "クエリするライセンスキー",
    "developer.verifyLicenseReturn": "ライセンスが有効な場合はtrue、そうでなければfalse",
    "developer.getLicenseInfoReturn": "ライセンス詳細を含むJSON文字列",
    "developer.bestPractices": "ベストプラクティス",
    "developer.bestPracticesDesc": "安全なライセンス実装のための推奨事項",
    "developer.security": "セキュリティ",
    "developer.performance": "パフォーマンス",
    "developer.obfuscateKey": "コード内でライセンスキーを難読化する",
    "developer.periodicChecks": "定期的なライセンスチェックを実行する",
    "developer.handleFailures": "ライセンス失敗を適切に処理する",
    "developer.useEncryption": "暗号化通信を使用する",
    "developer.cacheResults": "ライセンス認証結果をキャッシュする",
    "developer.limitFrequency": "認証頻度を制限する",
    "developer.handleTimeouts": "ネットワークタイムアウトを処理する",
    "developer.offlineGrace": "オフライン猶予期間を実装する",

    // Login
    "login.title": "SANKEY",
    "login.subtitle": "EAライセンス管理システム",
    "login.email": "メールアドレス",
    "login.password": "パスワード",
    "login.signIn": "サインイン",
    "login.signingIn": "サインイン中...",
    "login.emailPlaceholder": "admin@sankey.com",
    "login.passwordPlaceholder": "パスワードを入力",
    "login.forgotPassword": "パスワードを忘れましたか？",
    "login.demoAccess": "デモアクセス",
    "login.demoNote": "有効なメール形式と4文字以上のパスワードで動作します",
    "login.securedBy": "高度な暗号化により保護",

    // Forgot Password
    "forgotPassword.title": "パスワードリセット",
    "forgotPassword.subtitle": "リセット手順を受け取るためにメールアドレスを入力してください",
    "forgotPassword.instructions": "パスワードをリセットするためのリンクをお送りします。",
    "forgotPassword.emailPlaceholder": "メールアドレスを入力",
    "forgotPassword.sendReset": "リセットリンクを送信",
    "forgotPassword.sending": "送信中...",
    "forgotPassword.backToLogin": "ログインに戻る",
    "forgotPassword.emailRequired": "メールアドレスが必要です",
    "forgotPassword.emailInvalid": "有効なメールアドレスを入力してください",
    "forgotPassword.sendFailed": "リセットメールの送信に失敗しました。もう一度お試しください。",
    "forgotPassword.emailSent": "メール送信完了！",
    "forgotPassword.checkEmail": "リセット手順についてメールをご確認ください",
    "forgotPassword.emailSentTo": "パスワードリセット手順を以下のアドレスに送信しました：",
    "forgotPassword.checkSpam": "メールが見つからない場合は、迷惑メールフォルダをご確認ください。",
    "forgotPassword.nextSteps": "次のステップ：",
    "forgotPassword.step1": "SANKEYからのメールをメールボックスで確認",
    "forgotPassword.step2": "メール内のリセットリンクをクリック",
    "forgotPassword.step3": "手順に従って新しいパスワードを作成",
    "forgotPassword.resendEmail": "メールが届きませんか？再送信",

    // Footer
    "footer.copyright": "© 2024 SANKEY. All rights reserved.",
    "footer.securedBy": "高度な暗号化により保護",

    // Pagination
    "pagination.showing": "表示中",
    "pagination.to": "〜",
    "pagination.of": "/",
    "pagination.applications": "件の申請",
    "pagination.licenses": "件のライセンス",
    "pagination.historyRecords": "件の履歴",

    // Common
    "common.loading": "読み込み中...",
    "common.error": "エラー",
    "common.success": "成功",
  },
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    // Save language to localStorage
    localStorage.setItem("language", language)
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <I18nContext.Provider value={{ language, setLanguage, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
