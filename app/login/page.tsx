"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, Mail, AlertCircle, Shield, Key, FileKey } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Container, Engine } from "@tsparticles/engine"
import { loadSlim } from "@tsparticles/slim"
import { useTheme } from "@/lib/theme-context"
import { useI18n } from "@/lib/i18n-context"
import {PasswordManagerSafeForm} from "@/app/components/PasswordManagerSafeForm";

export default function LoginPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const { t } = useI18n()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password")
      setIsLoading(false)
      return
    }

    // Mock authentication - simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock validation - accept any email/password for demo
      if (formData.email.includes("@") && formData.password.length >= 4) {
        // Set session flag
        sessionStorage.setItem("isLoggedIn", "true")

        // Redirect to dashboard
        router.push("/")
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start relative overflow-hidden p-6 sm:p-8 pt-20 sm:pt-8">
      {/* Login Card */}
      <div className="w-full max-w-md relative z-10 flex-grow flex flex-col justify-center">
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-400 hover:text-emerald-300 transition-colors"
                    disabled={isLoading}
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
                >
                  {t("login.forgotPassword")}
                </Link>
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

            {/* Demo Info */}
            <div className="text-center space-y-3 pt-4 border-t border-emerald-500/20">
              <p className="text-xs theme-text-emerald">{t("login.demoAccess")}</p>
              <div className="space-y-1">
                <p className="text-xs theme-text-muted">
                  Email: <span className="font-mono theme-text-emerald">admin@sankey.com</span>
                </p>
                <p className="text-xs theme-text-muted">
                  Password: <span className="font-mono theme-text-emerald">demo123</span>
                </p>
              </div>
              <p className="text-xs theme-text-muted">{t("login.demoNote")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer - Always at bottom */}
      <div className="w-full text-center mt-8 relative z-10">
        <div className="text-xs theme-text-muted">{t("footer.copyright")}</div>
      </div>
    </div>
  )
}
