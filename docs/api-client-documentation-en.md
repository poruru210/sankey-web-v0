# APIクライアント ドキュメント

## 🚀 概要

APIクライアントは、SANKEY ライセンスサービス API への認証済みHTTPリクエストを行うための包括的なソリューションを提供します。自動トークン管理、エラーハンドリング、リトライ機能、React統合用フックが含まれています。

## 📁 File Structure

```
/lib
├── auth-service.ts     # Authentication service with token refresh
├── auth-config.ts      # Authentication configuration
├── api-client.ts       # HTTP client with auto-authentication
└── api-hooks.ts        # React hooks for API calls
```

## 🔧 Features

### ✅ **Automatic Authentication**
- Automatically adds `Authorization` header with Bearer tokens
- Retrieves and includes API keys from user info
- Handles token expiration with automatic refresh

### ✅ **Error Handling**
- Unified error handling across all API calls
- Automatic retry with exponential backoff
- 401 error handling with token refresh
- Request timeout management

### ✅ **React Integration**
- Custom hooks for common patterns
- Loading and error state management
- Automatic cleanup on component unmount
- TypeScript support with full type safety

### ✅ **Request Management**
- Request cancellation support
- Concurrent request handling
- Background refetch capabilities
- Request deduplication

## 🛠️ Basic Usage

### 1. Direct API Client Usage

```typescript
import { apiClient } from '@/lib/api-client'

// Generate a license
const response = await apiClient.generateLicense({
  accountNumber: '12345678',
  brokerName: 'XM Trading',
  eaName: 'My EA',
  expirationDays: 30
})

if (response.success) {
  console.log('License:', response.data.licenseKey)
} else {
  console.error('Error:', response.error)
}
```

### 2. Using React Hooks

```typescript
import { useLicenseGeneration } from '@/lib/api-hooks'

function LicenseForm() {
  const licenseGen = useLicenseGeneration()

  const handleSubmit = async (formData) => {
    const result = await licenseGen.execute(formData)
    if (result.success) {
      // Handle success
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={licenseGen.loading}>
        {licenseGen.loading ? 'Generating...' : 'Generate License'}
      </button>
      {licenseGen.error && <p>Error: {licenseGen.error}</p>}
    </form>
  )
}
```

### 3. Automatic Data Fetching

```typescript
import { useCurrentPlan } from '@/lib/api-hooks'

function PlanDisplay() {
  const plan = useCurrentPlan({ 
    immediate: true,           // Fetch immediately
    refetchInterval: 30000     // Refetch every 30 seconds
  })

  if (plan.loading) return <div>Loading...</div>
  if (plan.error) return <div>Error: {plan.error}</div>
  
  return <div>Current plan: {plan.data?.currentPlan}</div>
}
```

## 🎯 Available Hooks

### `useApiCall<T, P>(apiFunction)`
For manual API calls (mutations, form submissions):

```typescript
const { data, loading, error, execute, reset, cancel } = useApiCall(apiFunction)
```

### `useApiQuery<T>(apiFunction, options)`
For automatic data fetching (queries):

```typescript
const { data, loading, error, refetch, cancel } = useApiQuery(apiFunction, {
  immediate: true,
  refetchInterval: 30000
})
```

### `useApiForm<T, P>(apiFunction, options)`
For form submissions with callbacks:

```typescript
const { data, loading, error, handleSubmit } = useApiForm(apiFunction, {
  onSuccess: (data) => console.log('Success!'),
  onError: (error) => console.log('Error!'),
  resetOnSuccess: true
})
```

### Specific API Hooks

- `useLicenseGeneration()` - Generate licenses
- `useCreateUser()` - Create users (admin)
- `usePlanChange(isAdmin)` - Change subscription plans
- `useCurrentPlan(options)` - Get current plan info
- `useHealthCheck(options)` - API health status

## 🔐 Authentication Flow

1. **Login**: User authenticates via Cognito
2. **Token Storage**: Tokens stored in localStorage
3. **Auto Headers**: API client adds headers automatically
4. **Token Refresh**: Expired tokens refreshed automatically
5. **Error Handling**: 401 errors trigger re-authentication

```typescript
// Automatic flow:
// 1. Request made → API client checks token validity
// 2. If expired → Refresh token automatically  
// 3. If refresh fails → Redirect to login
// 4. If valid → Add headers and proceed
```

## ⚡ Best Practices

### 1. **Use Appropriate Hooks**
```typescript
// ✅ Good: Use useApiQuery for data fetching
const plan = useCurrentPlan({ immediate: true })

// ❌ Avoid: Manual useEffect for simple queries
useEffect(() => {
  apiClient.getCurrentPlan().then(...)
}, [])
```

### 2. **Handle Loading States**
```typescript
// ✅ Good: Show loading indicators
{loading && <Spinner />}
{error && <ErrorMessage error={error} />}
{data && <DataDisplay data={data} />}

// ❌ Avoid: Ignoring loading states
{data && <DataDisplay data={data} />}
```

### 3. **Cancel Requests on Unmount**
```typescript
// ✅ Good: Hooks handle this automatically
const api = useLicenseGeneration()

// ❌ Avoid: Manual requests without cleanup
useEffect(() => {
  apiClient.generateLicense(...) // May cause memory leaks
}, [])
```

### 4. **Use Request IDs for Tracking**
```typescript
// ✅ Good: Use request IDs for long operations
const requestId = 'license-gen-001'
await apiClient.generateLicense(data, requestId)

// Later: Cancel if needed
apiClient.cancelRequest(requestId)
```

### 5. **Error Handling Patterns**
```typescript
// ✅ Good: Handle specific error cases
if (response.error) {
  switch (response.error) {
    case 'AUTHENTICATION_REQUIRED':
      // Redirect to login
      break
    case 'RATE_LIMIT_EXCEEDED':
      // Show rate limit message
      break
    default:
      // Show generic error
  }
}
```

## 🚨 Error Types

### Authentication Errors
- `AUTHENTICATION_REQUIRED` - No valid token
- `AUTHENTICATION_FAILED` - Token refresh failed
- `API_KEY_REQUIRED` - Missing API key

### HTTP Errors  
- `HTTP_400` - Bad request
- `HTTP_401` - Unauthorized
- `HTTP_403` - Forbidden
- `HTTP_429` - Rate limited
- `HTTP_500` - Server error

### Client Errors
- `TIMEOUT` - Request timeout
- `NETWORK_ERROR` - Network issues
- `PARSE_ERROR` - Response parsing failed

## 🔧 Configuration

### API Client Config
```typescript
const apiClient = new ApiClient({
  baseURL: 'https://api.example.com',
  timeout: 30000,    // 30 seconds
  retries: 3         // Retry failed requests
})
```

### Hook Options
```typescript
// Query options
useCurrentPlan({
  immediate: true,        // Fetch on mount
  refetchInterval: 30000  // Background refresh
})

// Form options  
useApiForm(apiFunction, {
  onSuccess: (data) => {},     // Success callback
  onError: (error) => {},      // Error callback  
  resetOnSuccess: true         // Reset form after success
})
```

## 🧪 Testing

### Mock API Responses
```typescript
// Mock successful response
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    generateLicense: jest.fn().mockResolvedValue({
      success: true,
      data: { licenseKey: 'test-key' }
    })
  }
}))

// Mock error response
apiClient.generateLicense.mockResolvedValue({
  success: false,
  error: 'Test error'
})
```

### Test Hooks
```typescript
import { renderHook, act } from '@testing-library/react'
import { useLicenseGeneration } from '@/lib/api-hooks'

test('license generation hook', async () => {
  const { result } = renderHook(() => useLicenseGeneration())
  
  await act(async () => {
    await result.current.execute(testData)
  })
  
  expect(result.current.data).toBeDefined()
  expect(result.current.loading).toBe(false)
})
```

## 🔄 Migration Guide

### From Direct Fetch to API Client

```typescript
// ❌ Before: Manual fetch with auth
const token = localStorage.getItem('accessToken')
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})

// ✅ After: API client handles everything
const response = await apiClient.generateLicense(data)
```

### From useState to Hooks

```typescript
// ❌ Before: Manual state management
const [data, setData] = useState(null)
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

useEffect(() => {
  setLoading(true)
  apiClient.getCurrentPlan()
    .then(result => {
      if (result.success) {
        setData(result.data)
      } else {
        setError(result.error)
      }
    })
    .finally(() => setLoading(false))
}, [])

// ✅ After: Hook handles state
const { data, loading, error } = useCurrentPlan()
```

## 🚀 Advanced Usage

### Multiple Concurrent Requests
```typescript
const multiCall = useApiMultiCall()

// Add multiple API calls
multiCall.addCall('plan', () => apiClient.getCurrentPlan())
multiCall.addCall('health', () => apiClient.healthCheck())

// Check status
const planState = multiCall.getCallState('plan')
const isAllDone = multiCall.isAllSuccess
```

### Request Cancellation
```typescript
const api = useLicenseGeneration()

// Cancel ongoing request
const handleCancel = () => {
  api.cancel()
}

// Auto-cancellation on unmount is handled automatically
```

### Custom Request Configuration
```typescript
// Override default settings
await apiClient.post('/custom-endpoint', data, {
  requiresAuth: false,    // Skip authentication
  requiresApiKey: true,   // But require API key
  timeout: 60000          // Custom timeout
})
```

## 💡 Troubleshooting

### Common Issues

1. **Token Refresh Loops**
   - Check if refresh token is valid
   - Verify Cognito configuration

2. **CORS Errors**
   - Ensure API allows your origin
   - Check preflight requests

3. **Memory Leaks**  
   - Use provided hooks instead of manual requests
   - Hooks automatically cleanup on unmount

4. **Rate Limiting**
   - Implement proper error handling
   - Consider request queuing for high-frequency calls

### Debug Mode
```typescript
// Enable detailed logging
localStorage.setItem('DEBUG_API', 'true')

// Check request details in browser dev tools
// Network tab shows all requests with headers
```