import { useState, useEffect, useCallback, useRef } from 'react'
import {
    apiClient,
    type ApiResponse,
    type LicenseGenerationRequest,
    type LicenseGenerationResponse,
    type CreateUserRequest,
    type CreateUserResponse,
    type ChangePlanRequest,
    type PlanInfo,
    ApiError
} from '@/lib/api/api-client'

// Generic hook state interface
interface ApiHookState<T> {
    data: T | null
    loading: boolean
    error: string | null
    isSuccess: boolean
    isError: boolean
}

// Hook for manual API calls
interface UseApiCallResult<T, P = any> extends ApiHookState<T> {
    execute: (params?: P) => Promise<ApiResponse<T>>
    reset: () => void
    cancel: () => void
}

// Hook for automatic API calls
interface UseApiQueryResult<T> extends ApiHookState<T> {
    refetch: () => Promise<void>
    cancel: () => void
}

// Generate unique request ID
const generateRequestId = (): string => {
    return `req_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
}

// Generic hook for manual API calls (like mutations)
export function useApiCall<T, P = any>(
    apiFunction: (params: P, requestId: string) => Promise<ApiResponse<T>>
): UseApiCallResult<T, P> {
    const [state, setState] = useState<ApiHookState<T>>({
        data: null,
        loading: false,
        error: null,
        isSuccess: false,
        isError: false
    })

    const requestIdRef = useRef<string | null>(null)
    const mountedRef = useRef(true)

    // Cleanup on unmount
    useEffect(() => {
        mountedRef.current = true
        return () => {
            mountedRef.current = false
            if (requestIdRef.current) {
                apiClient.cancelRequest(requestIdRef.current)
            }
        }
    }, [])

    const execute = useCallback(async (params?: P): Promise<ApiResponse<T>> => {
        if (!mountedRef.current) {
            return { success: false, error: 'Component unmounted' }
        }

        const requestId = generateRequestId()
        requestIdRef.current = requestId

        setState({
            data: null,
            loading: true,
            error: null,
            isSuccess: false,
            isError: false
        })

        try {
            const response = await apiFunction(params as P, requestId)

            if (!mountedRef.current) {
                return response
            }

            if (response.success) {
                setState({
                    data: response.data || null,
                    loading: false,
                    error: null,
                    isSuccess: true,
                    isError: false
                })
            } else {
                setState({
                    data: null,
                    loading: false,
                    error: response.error || 'Unknown error',
                    isSuccess: false,
                    isError: true
                })
            }

            return response
        } catch (error: any) {
            if (!mountedRef.current) {
                return { success: false, error: 'Component unmounted' }
            }

            const errorMessage = error instanceof ApiError ? error.message : error.message || 'Unknown error'
            setState({
                data: null,
                loading: false,
                error: errorMessage,
                isSuccess: false,
                isError: true
            })

            return { success: false, error: errorMessage }
        } finally {
            requestIdRef.current = null
        }
    }, [apiFunction])

    const reset = useCallback(() => {
        setState({
            data: null,
            loading: false,
            error: null,
            isSuccess: false,
            isError: false
        })
    }, [])

    const cancel = useCallback(() => {
        if (requestIdRef.current) {
            apiClient.cancelRequest(requestIdRef.current)
            requestIdRef.current = null
        }
        if (mountedRef.current) {
            setState(prev => ({
                ...prev,
                loading: false
            }))
        }
    }, [])

    return {
        ...state,
        execute,
        reset,
        cancel
    }
}

// Generic hook for automatic API calls (like queries)
export function useApiQuery<T>(
    apiFunction: (requestId: string) => Promise<ApiResponse<T>>,
    options: {
        immediate?: boolean
        refetchInterval?: number
    } = {}
): UseApiQueryResult<T> {
    const { immediate = true, refetchInterval } = options

    const [state, setState] = useState<ApiHookState<T>>({
        data: null,
        loading: immediate,
        error: null,
        isSuccess: false,
        isError: false
    })

    const requestIdRef = useRef<string | null>(null)
    const mountedRef = useRef(true)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    // Cleanup on unmount
    useEffect(() => {
        mountedRef.current = true
        return () => {
            mountedRef.current = false
            if (requestIdRef.current) {
                apiClient.cancelRequest(requestIdRef.current)
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [])

    const fetchData = useCallback(async (showLoading = true) => {
        if (!mountedRef.current) return

        const requestId = generateRequestId()
        requestIdRef.current = requestId

        if (showLoading) {
            setState(prev => ({
                ...prev,
                loading: true,
                error: null
            }))
        }

        try {
            const response = await apiFunction(requestId)

            if (!mountedRef.current) return

            if (response.success) {
                setState({
                    data: response.data || null,
                    loading: false,
                    error: null,
                    isSuccess: true,
                    isError: false
                })
            } else {
                setState({
                    data: null,
                    loading: false,
                    error: response.error || 'Unknown error',
                    isSuccess: false,
                    isError: true
                })
            }
        } catch (error: any) {
            if (!mountedRef.current) return

            const errorMessage = error instanceof ApiError ? error.message : error.message || 'Unknown error'
            setState({
                data: null,
                loading: false,
                error: errorMessage,
                isSuccess: false,
                isError: true
            })
        } finally {
            requestIdRef.current = null
        }
    }, [apiFunction])

    // Initial fetch
    useEffect(() => {
        if (immediate) {
            fetchData()
        }
    }, [immediate, fetchData])

    // Set up refetch interval
    useEffect(() => {
        if (refetchInterval && refetchInterval > 0) {
            intervalRef.current = setInterval(() => {
                fetchData(false) // Don't show loading for background refetch
            }, refetchInterval)

            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current)
                }
            }
        }
    }, [refetchInterval, fetchData])

    const refetch = useCallback(async () => {
        await fetchData(true)
    }, [fetchData])

    const cancel = useCallback(() => {
        if (requestIdRef.current) {
            apiClient.cancelRequest(requestIdRef.current)
            requestIdRef.current = null
        }
        if (mountedRef.current) {
            setState(prev => ({
                ...prev,
                loading: false
            }))
        }
    }, [])

    return {
        ...state,
        refetch,
        cancel
    }
}

// Specific hooks for different API endpoints

// License generation hook
export function useLicenseGeneration() {
    return useApiCall<LicenseGenerationResponse, LicenseGenerationRequest>(
        (params, requestId) => apiClient.generateLicense(params, requestId)
    )
}

// User creation hook (Admin)
export function useCreateUser() {
    return useApiCall<CreateUserResponse, CreateUserRequest>(
        (params, requestId) => apiClient.createUser(params, requestId)
    )
}

// Plan change hook
export function usePlanChange(isAdmin: boolean = false) {
    return useApiCall<void, ChangePlanRequest>(
        (params, requestId) => apiClient.changePlan(params, isAdmin, requestId)
    )
}

// Current plan query hook
export function useCurrentPlan(options?: {
    immediate?: boolean
    refetchInterval?: number
}) {
    return useApiQuery<PlanInfo>(
        (requestId) => apiClient.getCurrentPlan(requestId),
        options
    )
}

// Health check hook
export function useHealthCheck(options?: {
    immediate?: boolean
    refetchInterval?: number
}) {
    return useApiQuery<{ status: string, timestamp: string }>(
        (requestId) => apiClient.healthCheck(requestId),
        options
    )
}

// Custom hook for handling form submissions with API calls
export function useApiForm<T, P = any>(
    apiFunction: (params: P, requestId: string) => Promise<ApiResponse<T>>,
    options?: {
        onSuccess?: (data: T) => void
        onError?: (error: string) => void
        resetOnSuccess?: boolean
    }
) {
    const { execute, ...state } = useApiCall<T, P>(apiFunction)

    const handleSubmit = useCallback(async (params: P) => {
        const response = await execute(params)

        if (response.success && response.data) {
            options?.onSuccess?.(response.data)
            if (options?.resetOnSuccess) {
                // Reset form or perform cleanup
            }
        } else if (response.error) {
            options?.onError?.(response.error)
        }

        return response
    }, [execute, options])

    return {
        ...state,
        handleSubmit
    }
}

// Hook for managing multiple concurrent API calls
export function useApiMultiCall() {
    const [calls, setCalls] = useState<Map<string, ApiHookState<any>>>(new Map())

    const addCall = useCallback(<T>(
        key: string,
        apiFunction: (requestId: string) => Promise<ApiResponse<T>>
    ) => {
        setCalls(prev => {
            const newCalls = new Map(prev)
            newCalls.set(key, {
                data: null,
                loading: true,
                error: null,
                isSuccess: false,
                isError: false
            })
            return newCalls
        })

        const requestId = generateRequestId()

        apiFunction(requestId).then(response => {
            setCalls(prev => {
                const newCalls = new Map(prev)
                if (response.success) {
                    newCalls.set(key, {
                        data: response.data || null,
                        loading: false,
                        error: null,
                        isSuccess: true,
                        isError: false
                    })
                } else {
                    newCalls.set(key, {
                        data: null,
                        loading: false,
                        error: response.error || 'Unknown error',
                        isSuccess: false,
                        isError: true
                    })
                }
                return newCalls
            })
        }).catch(error => {
            setCalls(prev => {
                const newCalls = new Map(prev)
                newCalls.set(key, {
                    data: null,
                    loading: false,
                    error: error.message || 'Unknown error',
                    isSuccess: false,
                    isError: true
                })
                return newCalls
            })
        })
    }, [])

    const getCallState = useCallback((key: string) => {
        return calls.get(key) || {
            data: null,
            loading: false,
            error: null,
            isSuccess: false,
            isError: false
        }
    }, [calls])

    const isAllLoading = Array.from(calls.values()).some(call => call.loading)
    const isAnyError = Array.from(calls.values()).some(call => call.isError)
    const isAllSuccess = Array.from(calls.values()).every(call => call.isSuccess || !call.loading)

    return {
        addCall,
        getCallState,
        isAllLoading,
        isAnyError,
        isAllSuccess,
        calls: Object.fromEntries(calls)
    }
}