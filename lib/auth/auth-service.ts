import {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
    ForgotPasswordCommand,
    ConfirmForgotPasswordCommand,
    GetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { authConfig } from '@/lib/auth/auth-config'

interface AuthTokens {
    accessToken: string
    idToken: string
    refreshToken: string
}

interface AuthUser {
    sub: string
    email: string
    email_verified: boolean
    apiKey?: string
    [key: string]: any
}

interface SignInResult {
    success: boolean
    tokens?: AuthTokens
    challenge?: string
    session?: string
    error?: string
}

interface RefreshResult {
    success: boolean
    tokens?: Partial<AuthTokens>
    error?: string
}

class AuthService {
    private client: CognitoIdentityProviderClient
    private refreshPromise: Promise<RefreshResult> | null = null

    constructor() {
        this.client = new CognitoIdentityProviderClient({
            region: authConfig.userPool.region,
        })
    }

    // JWTトークンをデコードして有効期限をチェック
    private decodeJWT(token: string): any {
        try {
            const base64Url = token.split('.')[1]
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            )
            return JSON.parse(jsonPayload)
        } catch (error) {
            console.error('JWT decode error:', error)
            return null
        }
    }

    // トークンの有効期限チェック（5分前にexpireとみなす）
    private isTokenExpired(token: string, bufferMinutes: number = 5): boolean {
        const decoded = this.decodeJWT(token)
        if (!decoded || !decoded.exp) {
            return true
        }

        const currentTime = Math.floor(Date.now() / 1000)
        const bufferTime = bufferMinutes * 60
        return decoded.exp <= (currentTime + bufferTime)
    }

    // リフレッシュトークンを使ってアクセストークンを更新
    async refreshAccessToken(): Promise<RefreshResult> {
        // 同時に複数のリフレッシュリクエストを防ぐ
        if (this.refreshPromise) {
            return this.refreshPromise
        }

        this.refreshPromise = this._performRefresh()
        const result = await this.refreshPromise
        this.refreshPromise = null
        return result
    }

    private async _performRefresh(): Promise<RefreshResult> {
        try {
            const refreshToken = localStorage.getItem('refreshToken')
            if (!refreshToken) {
                return {
                    success: false,
                    error: 'login.noRefreshToken'
                }
            }

            const command = new InitiateAuthCommand({
                ClientId: authConfig.userPool.userPoolWebClientId,
                AuthFlow: 'REFRESH_TOKEN_AUTH',
                AuthParameters: {
                    REFRESH_TOKEN: refreshToken,
                },
            })

            const response = await this.client.send(command)

            if (response.AuthenticationResult) {
                const tokens: Partial<AuthTokens> = {
                    accessToken: response.AuthenticationResult.AccessToken!,
                    idToken: response.AuthenticationResult.IdToken!,
                }

                // 新しいリフレッシュトークンが返された場合は更新
                if (response.AuthenticationResult.RefreshToken) {
                    tokens.refreshToken = response.AuthenticationResult.RefreshToken
                }

                // LocalStorageを更新
                localStorage.setItem('accessToken', tokens.accessToken!)
                localStorage.setItem('idToken', tokens.idToken!)
                if (tokens.refreshToken) {
                    localStorage.setItem('refreshToken', tokens.refreshToken)
                }

                console.log('Token refresh successful')
                return {
                    success: true,
                    tokens
                }
            }

            return {
                success: false,
                error: 'login.noAuthResult'
            }

        } catch (error: any) {
            console.error('Token refresh error:', error)

            // リフレッシュに失敗した場合はログアウト
            if (error.name === 'NotAuthorizedException' || error.name === 'UserNotFoundException') {
                await this.signOut()
                return {
                    success: false,
                    error: 'login.sessionExpired'
                }
            }

            return {
                success: false,
                error: this.parseError(error.name)
            }
        }
    }

    // 有効なアクセストークンを取得（必要に応じて自動リフレッシュ）
    async getValidAccessToken(): Promise<string | null> {
        const accessToken = localStorage.getItem('accessToken')
        if (!accessToken) {
            return null
        }

        // トークンの有効期限をチェック
        if (this.isTokenExpired(accessToken)) {
            console.log('Access token expired, attempting refresh...')
            const refreshResult = await this.refreshAccessToken()

            if (refreshResult.success && refreshResult.tokens?.accessToken) {
                return refreshResult.tokens.accessToken
            } else {
                console.log('Token refresh failed:', refreshResult.error)
                return null
            }
        }

        return accessToken
    }

    // 現在のユーザー情報を取得
    async getCurrentUser(): Promise<AuthUser | null> {
        try {
            const accessToken = await this.getValidAccessToken()
            if (!accessToken) {
                return null
            }

            const command = new GetUserCommand({
                AccessToken: accessToken
            })

            const response = await this.client.send(command)

            // ユーザー属性を整理
            const attributes: Record<string, any> = {}
            response.UserAttributes?.forEach(attr => {
                if (attr.Name && attr.Value) {
                    // custom:apiKey -> apiKey に変換
                    const key = attr.Name.startsWith('custom:')
                        ? attr.Name.replace('custom:', '')
                        : attr.Name
                    attributes[key] = attr.Value
                }
            })

            return {
                sub: attributes.sub,
                email: attributes.email,
                email_verified: attributes.email_verified === 'true',
                apiKey: attributes.apiKey,
                ...attributes
            }

        } catch (error: any) {
            console.error('Get current user error:', error)

            // アクセストークンが無効の場合
            if (error.name === 'NotAuthorizedException') {
                await this.signOut()
            }

            return null
        }
    }

    // 認証状態のチェック
    async isAuthenticated(): Promise<boolean> {
        try {
            const accessToken = await this.getValidAccessToken()
            return accessToken !== null
        } catch (error) {
            console.error('Authentication check error:', error)
            return false
        }
    }

    // IDトークンからユーザー情報を取得（軽量版）
    getUserInfoFromIdToken(): AuthUser | null {
        try {
            const idToken = localStorage.getItem('idToken')
            if (!idToken) {
                return null
            }

            const decoded = this.decodeJWT(idToken)
            if (!decoded) {
                return null
            }

            return {
                sub: decoded.sub,
                email: decoded.email,
                email_verified: decoded.email_verified,
                apiKey: decoded['custom:apiKey'],
                ...decoded
            }
        } catch (error) {
            console.error('ID token decode error:', error)
            return null
        }
    }

    // カスタムログイン（既存）
    async signIn(email: string, password: string): Promise<SignInResult> {
        try {
            const command = new InitiateAuthCommand({
                ClientId: authConfig.userPool.userPoolWebClientId,
                AuthFlow: 'USER_PASSWORD_AUTH',
                AuthParameters: {
                    USERNAME: email,
                    PASSWORD: password,
                },
            })

            const response = await this.client.send(command)

            console.log("Cognito response:", response)

            if (response.ChallengeName) {
                return {
                    success: false,
                    challenge: response.ChallengeName,
                    session: response.Session,
                }
            }

            if (response.AuthenticationResult) {
                const tokens: AuthTokens = {
                    accessToken: response.AuthenticationResult.AccessToken!,
                    idToken: response.AuthenticationResult.IdToken!,
                    refreshToken: response.AuthenticationResult.RefreshToken!,
                }

                return {
                    success: true,
                    tokens
                }
            }

            return {
                success: false,
                error: 'login.noAuthResult'
            }

        } catch (error: any) {
            console.error("Auth error:", error)
            return {
                success: false,
                error: this.parseError(error.name),
            }
        }
    }

    private parseError(errorCode: string): string {
        const errorMessages: Record<string, string> = {
            'NotAuthorizedException': 'login.invalidCredentials',
            'UserNotFoundException': 'login.userNotFound',
            'UserNotConfirmedException': 'login.userNotConfirmed',
            'TooManyRequestsException': 'login.tooManyRequests',
            'InvalidParameterException': 'login.authError',
            'CodeMismatchException': 'forgotPassword.codeInvalid',
            'ExpiredCodeException': 'forgotPassword.codeExpired',
            'TokenRefreshException': 'login.sessionExpired',
        }

        return errorMessages[errorCode] || 'login.authError'
    }

    async signOut(): Promise<{ success: boolean }> {
        try {
            // LocalStorageからトークンを削除
            localStorage.removeItem("accessToken")
            localStorage.removeItem("idToken")
            localStorage.removeItem("refreshToken")

            // SessionStorageから認証フラグを削除
            sessionStorage.removeItem("isLoggedIn")

            // その他の認証関連データも削除
            localStorage.removeItem("userInfo")

            console.log('Sign out completed')
            return { success: true }
        } catch (error) {
            console.error("Logout error:", error)
            return { success: false }
        }
    }

    // パスワードリセット関連（既存機能の拡張も可能）
    async forgotPassword(email: string) {
        try {
            const command = new ForgotPasswordCommand({
                ClientId: authConfig.userPool.userPoolWebClientId,
                Username: email,
            })

            await this.client.send(command)
            return { success: true }
        } catch (error: any) {
            console.error("Forgot password error:", error)
            return {
                success: false,
                error: this.parseError(error.name)
            }
        }
    }

    async confirmForgotPassword(email: string, code: string, newPassword: string) {
        try {
            const command = new ConfirmForgotPasswordCommand({
                ClientId: authConfig.userPool.userPoolWebClientId,
                Username: email,
                ConfirmationCode: code,
                Password: newPassword,
            })

            await this.client.send(command)
            return { success: true }
        } catch (error: any) {
            console.error("Confirm forgot password error:", error)
            return {
                success: false,
                error: this.parseError(error.name)
            }
        }
    }
}

export const authService = new AuthService()
export type { AuthTokens, AuthUser, SignInResult, RefreshResult }