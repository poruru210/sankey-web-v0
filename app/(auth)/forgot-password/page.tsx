"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Mail, AlertCircle, Shield, Key, FileKey } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { loadSlim } from "@tsparticles/slim"
import type { Container, Engine } from "@tsparticles/engine"
import { useTheme } from "@/lib/theme-context"
import { useI18n } from "@/lib/i18n-context"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const { t } = useI18n()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
  })
  const [error, setError] = useState("")

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // Particles loaded callback
  }, [])

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

    // Simple validation
    if (!formData.email) {
      setError(t("forgotPassword.emailRequired"))
      setIsLoading(false)
      return
    }

    if (!formData.email.includes("@")) {
      setError(t("forgotPassword.emailInvalid"))
      setIsLoading(false)
      return
    }

    // Mock API call - simulate sending reset email
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsSuccess(true)
    } catch (err) {
      setError(t("forgotPassword.sendFailed"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">

      {/* Forgot Password Card */}
      <div className="w-full max-w-md px-4 relative z-10">
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
              <CardTitle className="text-2xl font-bold theme-text-primary">{t("forgotPassword.title")}</CardTitle>
              <CardDescription className="theme-text-secondary">{t("forgotPassword.subtitle")}</CardDescription>
            </div>

            {/* Features Icons */}
            <div className="flex items-center justify-center space-x-6 pt-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <Key className="w-5 h-5 text-emerald-400" />
              <FileKey className="w-5 h-5 text-emerald-400" />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Display */}
            {error && (
              <Alert className="border-red-500/20 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300">{error}</AlertDescription>
              </Alert>
            )}

            {/* Instructions */}
            <div className="text-center space-y-2">
              <p className="text-sm theme-text-secondary">{t("forgotPassword.instructions")}</p>
            </div>

            {/* Reset Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder={t("forgotPassword.emailPlaceholder")}
                    className="pl-10 theme-input focus:border-emerald-400 focus:ring-emerald-400/20"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{t("forgotPassword.sending")}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{t("forgotPassword.sendReset")}</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Back to Login Link */}
            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center text-sm theme-text-emerald hover:theme-text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                {t("forgotPassword.backToLogin")}
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="text-xs theme-text-muted">{t("footer.copyright")}</div>
        </div>
      </div>
    </div>
  )
}
