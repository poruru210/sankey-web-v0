"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, Mail, AlertCircle, Shield, Key, FileKey, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "@/lib/theme-context"
import { useI18n } from "@/lib/i18n-context"
import { useAuth } from "@/lib/auth/auth-context"
import { PasswordManagerSafeForm } from "@/app/components/PasswordManagerSafeForm"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { theme } = useTheme()
  const { t } = useI18n()
  const { signIn, isAuthenticated, isLoading: authLoading } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  // リダイレクト用のreturnUrl取得
  const returnUrl = searchParams.get('returnUrl') || '/'

  // 既にログイン済みの場合はリダイレクト
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const decodedReturnUrl = decodeURIComponent(returnUrl)
      console.log('Already authenticated, redirecting to:', decodedReturnUrl)
      router.push(decodedReturnUrl)
    }
  }, [authLoading, isAuthenticated, router, returnUrl])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // バリデーション
    if (!formData.email.trim() || !formData.password.trim()) {
      setError(t("login.enterEmailPassword"))
      setIsLoading(false)
      return
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      setError(t("login.invalidEmail"))
      setIsLoading(false)
      return
    }

    try {
      const result = await signIn(formData.email.trim(), formData.password)

      if (result.success) {
        // 成功時は認証コンテキストがリダイレクトを処理
        const decodedReturnUrl = decodeURIComponent(returnUrl)
        console.log('Login successful, redirecting to:', decodedReturnUrl)
        router.push(decodedReturnUrl)
      } else if (result.challenge) {
        // MFA や新しいパスワード要求などのチャレンジ
        setError(t("login.additionalAuth"))
        console.log("Auth challenge:", result.challenge)
        // TODO: チャレンジハンドリングの実装
      } else {
        // ログイン失敗 - auth-serviceからのエラーはi18nキーなので翻訳
        const errorMessage = result.error?.startsWith('login.') || result.error?.startsWith('forgotPassword.')
            ? t(result.error)
            : result.error || t("login.loginFailed")
        setError(errorMessage)
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError(t("login.loginFailed"))
    } finally {
      setIsLoading(false)
    }
  }

  // 認証チェック中の表示
  if (authLoading) {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-emerald-500/10 rounded-full border border-emerald-400/20">
              <Shield className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="flex items-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              <span className="theme-text-secondary">{t("login.checkingAuth")}</span>
            </div>
            <p className="text-slate-400 text-sm">
              セキュアなアクセスを確保しています
            </p>
          </div>
        </div>
    )
  }

  // 認証済みの場合は何も表示しない（useEffectでリダイレクト処理）
  if (isAuthenticated) {
    return null
  }

  return (
      <div className="flex flex-col items-center justify-center w-full h-full p-6 sm:p-8 relative">
        {/* Return URL の表示（デバッグ用） */}
        {returnUrl !== '/' && (
            <div className="w-full max-w-md mb-4">
              <Alert className="border-blue-500/20 bg-blue-500/10">
                <AlertCircle className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-blue-300 text-sm">
                  ログイン後、元のページに戻ります: {decodeURIComponent(returnUrl)}
                </AlertDescription>
              </Alert>
            </div>
        )}

        {/* Login Card */}
        <div className="w-full max-w-md relative z-10">
          <Card className="theme-card-bg border-emerald-500/20 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center space-y-4 pb-6">
              {/* Logo Section */}
              <div className="flex justify-center">
                <div className="flex items-center justify-center w-16 h-16 bg-emerald-500/10 rounded-xl border border-emerald-400/20">
                  <Image src="/sankey-logo.png" alt="SANKEY Logo" width={40} height={40} className="w-10 h-10" />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold theme-text-primary">{t("login.title")}</CardTitle>
                <CardDescription className="theme-text-secondary">{t("login.subtitle")}</CardDescription>
              </div>

              {/* Features Icons */}
              <div className="flex items-center justify-center space-x-6 pt-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <Key className="w-5 h-5 text-emerald-400" />
                <FileKey className="w-5 h-5 text-emerald-400" />
              </div>
            </CardHeader>

            <CardContent className="space-y-6 px-6">
              {/* Error Display */}
              {error && (
                  <Alert className="border-red-500/20 bg-red-500/10">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-300">{error}</AlertDescription>
                  </Alert>
              )}

              {/* Login Form */}
              <PasswordManagerSafeForm onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="theme-text-secondary text-sm font-medium">
                    {t("login.email")}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 w-4 h-4" />
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={t("login.emailPlaceholder")}
                        className="pl-10 theme-input focus:border-emerald-400 focus:ring-emerald-400/20"
                        disabled={isLoading}
                        autoComplete="email"
                        required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="theme-text-secondary text-sm font-medium">
                    {t("login.password")}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 w-4 h-4" />
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder={t("login.passwordPlaceholder")}
                        className="pl-10 pr-10 theme-input focus:border-emerald-400 focus:ring-emerald-400/20"
                        disabled={isLoading}
                        autoComplete="current-password"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-400 hover:text-emerald-300 transition-colors"
                        disabled={isLoading}
                        aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link
                      href="/forgot-password"
                      className="text-sm theme-text-emerald hover:theme-text-primary transition-colors"
                      tabIndex={isLoading ? -1 : 0}
                  >
                    {t("login.forgotPassword")}
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={isLoading || !formData.email.trim() || !formData.password.trim()}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t("login.signingIn")}</span>
                      </div>
                  ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Shield className="w-4 h-4" />
                        <span>{t("login.signIn")}</span>
                      </div>
                  )}
                </Button>
              </PasswordManagerSafeForm>

              {/* Sign Up Link */}
              <div className="text-center pt-4 border-t border-emerald-500/10">
                <p className="text-sm theme-text-secondary">
                  {t("login.signUpPrompt")}{" "}
                  <Link
                      href="/signup"
                      className="theme-text-emerald hover:theme-text-primary font-medium transition-colors"
                      tabIndex={isLoading ? -1 : 0}
                  >
                    {t("login.signUp")}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <div className="text-xs theme-text-muted">{t("footer.copyright")}</div>
        </div>
      </div>
  )
}