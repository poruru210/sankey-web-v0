import { authService, type AuthUser } from '../auth/auth-service'
import { authConfig } from '../auth/auth-config'

// API Response types
interface ApiResponse<T = any> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

interface ApiErrorInfo {
    code: string
    message: string
    details?: any
}

interface RequestConfig {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    headers?: Record<string, string>
    body?: any
    requiresAuth?: boolean
    requiresApiKey?: boolean
    timeout?: number
}

interface ApiClientConfig {
    baseURL: string
    timeout: number
    retries: number
}

// License generation types
interface LicenseGenerationRequest {
    accountNumber: string
    brokerName: string
    eaName: string
    expirationDays?: number
}

interface LicenseGenerationResponse {
    licenseKey: string
    accountNumber: string
    brokerName: string
    eaName: string
    expirationDate: string
    issuedAt: string
}

// User management types
interface CreateUserRequest {
    email: string
    temporaryPassword: string
    plan?: 'free' | 'basic' | 'pro'
}

interface CreateUserResponse {
    userId: string
    email: string
    apiKey: string
    plan: string
}

// Plan management types
interface ChangePlanRequest {
    plan: 'free' | 'basic' | 'pro'
    userId?: string // For admin use
}

interface PlanInfo {
    currentPlan: string
    usageStats: {
        monthlyLicenses: {
            used: number
            limit: number
        }
        activeLicenses: number
        apiCalls: {
            used: number
            limit: number
        }
    }
}

class ApiClient {
    private config: ApiClientConfig
    private abortControllers: Map<string, AbortController> = new Map()

    constructor(config?: Partial<ApiClientConfig>) {
        this.config = {
            baseURL: authConfig.api.endpoint,
            timeout: 30000,
            retries: 3,
            ...config
        }
    }

    // Create request with automatic authentication
    private async createRequest(
        endpoint: string,
        config: RequestConfig
    ): Promise<Request> {
        const url = `${this.config.baseURL}${endpoint}`
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...config.headers
        }

        // Add authentication headers if required
        if (config.requiresAuth !== false) {
            const accessToken = await authService.getValidAccessToken()
            if (accessToken) {
                headers['Authorization'] = `Bearer ${accessToken}`
            } else {
                throw new ApiError('AUTHENTICATION_REQUIRED', 'Authentication required')
            }
        }

        // Add API key if required
        if (config.requiresApiKey) {
            const userInfo = authService.getUserInfoFromIdToken()
            if (userInfo?.apiKey) {
                headers['X-Api-Key'] = userInfo.apiKey
            } else {
                throw new ApiError('API_KEY_REQUIRED', 'API key required')
            }
        }

        const requestInit: RequestInit = {
            method: config.method,
            headers,
            body: config.body ? JSON.stringify(config.body) : undefined,
        }

        return new Request(url, requestInit)
    }

    // Execute request with retry logic and error handling
    private async executeRequest<T>(
        endpoint: string,
        config: RequestConfig,
        requestId?: string
    ): Promise<ApiResponse<T>> {
        let lastError: Error | null = null
        const maxRetries = config.method === 'GET' ? this.config.retries : 1

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                // Create abort controller for this request
                const abortController = new AbortController()
                if (requestId) {
                    this.abortControllers.set(requestId, abortController)
                }

                // Set timeout
                const timeoutId = setTimeout(() => {
                    abortController.abort()
                }, config.timeout || this.config.timeout)

                try {
                    const request = await this.createRequest(endpoint, config)
                    const response = await fetch(request, {
                        signal: abortController.signal
                    })

                    clearTimeout(timeoutId)
                    if (requestId) {
                        this.abortControllers.delete(requestId)
                    }

                    return await this.handleResponse<T>(response, endpoint, config, attempt)

                } catch (fetchError: any) {
                    clearTimeout(timeoutId)
                    if (requestId) {
                        this.abortControllers.delete(requestId)
                    }

                    if (fetchError.name === 'AbortError') {
                        throw new ApiError('TIMEOUT', 'Request timeout')
                    }
                    throw fetchError
                }

            } catch (error: any) {
                lastError = error
                console.warn(`API request attempt ${attempt + 1} failed:`, error)

                // Don't retry on certain errors
                if (
                    error.code === 'AUTHENTICATION_REQUIRED' ||
                    error.code === 'API_KEY_REQUIRED' ||
                    error.code === 'FORBIDDEN' ||
                    attempt === maxRetries
                ) {
                    break
                }

                // Wait before retry (exponential backoff)
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
                }
            }
        }

        // Return error response
        return {
            success: false,
            error: lastError?.message || 'Unknown error occurred'
        }
    }

    // Handle response with automatic token refresh on 401
    private async handleResponse<T>(
        response: Response,
        endpoint: string,
        config: RequestConfig,
        attempt: number
    ): Promise<ApiResponse<T>> {
        // Handle 401 Unauthorized with token refresh
        if (response.status === 401 && attempt === 0 && config.requiresAuth !== false) {
            console.log('Received 401, attempting token refresh...')

            const refreshResult = await authService.refreshAccessToken()
            if (refreshResult.success) {
                console.log('Token refresh successful, retrying request...')
                // Retry with new token
                return this.executeRequest<T>(endpoint, config, undefined)
            } else {
                console.log('Token refresh failed, redirecting to login...')
                // Redirect to login
                if (typeof window !== 'undefined') {
                    window.location.href = '/login'
                }
                throw new ApiError('AUTHENTICATION_FAILED', 'Authentication failed')
            }
        }

        // Handle other HTTP errors
        if (!response.ok) {
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`
            let errorCode = `HTTP_${response.status}`

            try {
                const errorData = await response.json()
                if (errorData.message) {
                    errorMessage = errorData.message
                }
                if (errorData.code) {
                    errorCode = errorData.code
                }
            } catch {
                // Ignore JSON parsing errors for error response
            }

            throw new ApiError(errorCode, errorMessage)
        }

        // Parse successful response
        try {
            const data: T = await response.json()
            return {
                success: true,
                data
            }
        } catch (error) {
            return {
                success: true,
                data: null as T
            }
        }
    }

    // Cancel ongoing requests
    public cancelRequest(requestId: string): void {
        const controller = this.abortControllers.get(requestId)
        if (controller) {
            controller.abort()
            this.abortControllers.delete(requestId)
        }
    }

    public cancelAllRequests(): void {
        this.abortControllers.forEach(controller => controller.abort())
        this.abortControllers.clear()
    }

    // Generic request method
    public async request<T>(
        endpoint: string,
        config: RequestConfig,
        requestId?: string
    ): Promise<ApiResponse<T>> {
        return this.executeRequest<T>(endpoint, config, requestId)
    }

    // Convenience methods for common HTTP verbs
    public async get<T>(
        endpoint: string,
        options?: Partial<RequestConfig>,
        requestId?: string
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'GET', ...options }, requestId)
    }

    public async post<T>(
        endpoint: string,
        body?: any,
        options?: Partial<RequestConfig>,
        requestId?: string
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'POST', body, ...options }, requestId)
    }

    public async put<T>(
        endpoint: string,
        body?: any,
        options?: Partial<RequestConfig>,
        requestId?: string
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'PUT', body, ...options }, requestId)
    }

    public async delete<T>(
        endpoint: string,
        options?: Partial<RequestConfig>,
        requestId?: string
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE', ...options }, requestId)
    }

    // License generation API
    public async generateLicense(
        request: LicenseGenerationRequest,
        requestId?: string
    ): Promise<ApiResponse<LicenseGenerationResponse>> {
        return this.post<LicenseGenerationResponse>(
            '/generate',
            request,
            { requiresAuth: true, requiresApiKey: true },
            requestId
        )
    }

    // User management APIs (Admin only)
    public async createUser(
        request: CreateUserRequest,
        requestId?: string
    ): Promise<ApiResponse<CreateUserResponse>> {
        return this.post<CreateUserResponse>(
            '/admin/users',
            request,
            { requiresAuth: true, requiresApiKey: true },
            requestId
        )
    }

    // Plan management APIs
    public async changePlan(
        request: ChangePlanRequest,
        isAdmin: boolean = false,
        requestId?: string
    ): Promise<ApiResponse<void>> {
        const endpoint = isAdmin ? '/admin/plans/change' : '/user/plan/change'
        return this.post<void>(
            endpoint,
            request,
            { requiresAuth: true, requiresApiKey: true },
            requestId
        )
    }

    public async getCurrentPlan(
        requestId?: string
    ): Promise<ApiResponse<PlanInfo>> {
        return this.get<PlanInfo>(
            '/user/plan',
            { requiresAuth: true, requiresApiKey: true },
            requestId
        )
    }

    // Health check (no auth required)
    public async healthCheck(requestId?: string): Promise<ApiResponse<{ status: string, timestamp: string }>> {
        return this.get<{ status: string, timestamp: string }>(
            '/health',
            { requiresAuth: false },
            requestId
        )
    }
}

// Custom API Error class
class ApiError extends Error {
    readonly code: string
    readonly details?: any

    constructor(code: string, message: string, details?: any) {
        super(message)
        this.name = 'ApiError'
        this.code = code
        this.details = details
    }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export types for external use
export type {
    ApiResponse,
    ApiErrorInfo,
    LicenseGenerationRequest,
    LicenseGenerationResponse,
    CreateUserRequest,
    CreateUserResponse,
    ChangePlanRequest,
    PlanInfo
}

export { ApiError }