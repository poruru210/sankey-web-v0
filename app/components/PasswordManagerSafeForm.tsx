"use client"

import React from 'react'

interface PasswordManagerSafeFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
}

// パスワード管理ツールの干渉を防ぐFormWrapper
export function PasswordManagerSafeForm({ children, ...props }: PasswordManagerSafeFormProps) {
  return (
      <div suppressHydrationWarning>
        <form {...props}>
          {children}
        </form>
      </div>
  )
}