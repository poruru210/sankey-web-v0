# APIクライアント ドキュメント

## 🚀 概要

APIクライアントは、SANKEY ライセンスサービス API への認証済みHTTPリクエストを行うための包括的なソリューションを提供します。自動トークン管理、エラーハンドリング、リトライ機能、React統合用フックが含まれています。

## 📁 ファイル構成

```
/lib
├── auth-service.ts     # トークンリフレッシュ機能付き認証サービス
├── auth-config.ts      # 認証設定
├── api-client.ts       # 自動認証機能付きHTTPクライアント
└── api-hooks.ts        # API呼び出し用Reactフック
```

## 🔧 機能

### ✅ **自動認証**
- Bearer トークンを使用したAuthorizationヘッダーの自動追加
- ユーザー情報からAPIキーを取得・追加
- トークン有効期限切れ時の自動リフレッシュ

### ✅ **エラーハンドリング**
- 全APIコール共通のエラーハンドリング
- 指数バックオフによる自動リトライ
- 401エラー時のトークンリフレッシュ処理
- リクエストタイムアウト管理

### ✅ **React統合**
- 一般的なパターン用カスタムフック
- ローディング状態とエラー状態の管理
- コンポーネントアンマウント時の自動クリーンアップ
- 完全なTypeScriptサポート

### ✅ **リクエスト管理**
- リクエストキャンセル機能
- 並行リクエスト処理
- バックグラウンド再取得機能
- リクエスト重複排除

## 🛠️ 基本的な使用方法

### 1. APIクライアント直接使用

```typescript
import { apiClient } from '@/lib/api-client'

// ライセンス生成
const response = await apiClient.generateLicense({
  accountNumber: '12345678',
  brokerName: 'XM Trading',
  eaName: 'My EA',
  expirationDays: 30
})

if (response.success) {
  console.log('ライセンス:', response.data.licenseKey)
} else {
  console.error('エラー:', response.error)
}
```

### 2. Reactフックの使用

```typescript
import { useLicenseGeneration } from '@/lib/api-hooks'

function LicenseForm() {
  const licenseGen = useLicenseGeneration()

  const handleSubmit = async (formData) => {
    const result = await licenseGen.execute(formData)
    if (result.success) {
      // 成功時の処理
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* フォームフィールド */}
      <button disabled={licenseGen.loading}>
        {licenseGen.loading ? '生成中...' : 'ライセンス生成'}
      </button>
      {licenseGen.error && <p>エラー: {licenseGen.error}</p>}
    </form>
  )
}
```

### 3. 自動データ取得

```typescript
import { useCurrentPlan } from '@/lib/api-hooks'

function PlanDisplay() {
  const plan = useCurrentPlan({ 
    immediate: true,           // 即座に取得
    refetchInterval: 30000     // 30秒毎に再取得
  })

  if (plan.loading) return <div>読み込み中...</div>
  if (plan.error) return <div>エラー: {plan.error}</div>
  
  return <div>現在のプラン: {plan.data?.currentPlan}</div>
}
```

## 🎯 利用可能なフック

### `useApiCall<T, P>(apiFunction)`
手動API呼び出し用（ミューテーション、フォーム送信）:

```typescript
const { data, loading, error, execute, reset, cancel } = useApiCall(apiFunction)
```

### `useApiQuery<T>(apiFunction, options)`
自動データ取得用（クエリ）:

```typescript
const { data, loading, error, refetch, cancel } = useApiQuery(apiFunction, {
  immediate: true,        // 即座に実行
  refetchInterval: 30000  // 再取得間隔（ミリ秒）
})
```

### `useApiForm<T, P>(apiFunction, options)`
コールバック付きフォーム送信用:

```typescript
const { data, loading, error, handleSubmit } = useApiForm(apiFunction, {
  onSuccess: (data) => console.log('成功!'),
  onError: (error) => console.log('エラー!'),
  resetOnSuccess: true  // 成功時にリセット
})
```

### 専用APIフック

- `useLicenseGeneration()` - ライセンス生成
- `useCreateUser()` - ユーザー作成（管理者用）
- `usePlanChange(isAdmin)` - サブスクリプションプラン変更
- `useCurrentPlan(options)` - 現在のプラン情報取得
- `useHealthCheck(options)` - APIヘルスステータス

## 🔐 認証フロー

1. **ログイン**: ユーザーがCognito経由で認証
2. **トークン保存**: トークンをlocalStorageに保存
3. **自動ヘッダー**: APIクライアントが自動でヘッダー追加
4. **トークンリフレッシュ**: 期限切れトークンを自動更新
5. **エラーハンドリング**: 401エラー時に再認証実行

```typescript
// 自動フロー:
// 1. リクエスト実行 → APIクライアントがトークン有効性をチェック
// 2. 期限切れの場合 → 自動でトークンリフレッシュ  
// 3. リフレッシュ失敗 → ログインページにリダイレクト
// 4. 有効な場合 → ヘッダー追加して実行
```

## ⚡ ベストプラクティス

### 1. **適切なフックの使用**
```typescript
// ✅ 良い例: データ取得にはuseApiQueryを使用
const plan = useCurrentPlan({ immediate: true })

// ❌ 避ける: 単純なクエリに手動useEffectは不要
useEffect(() => {
  apiClient.getCurrentPlan().then(...)
}, [])
```

### 2. **ローディング状態の処理**
```typescript
// ✅ 良い例: ローディングインジケーターを表示
{loading && <Spinner />}
{error && <ErrorMessage error={error} />}
{data && <DataDisplay data={data} />}

// ❌ 避ける: ローディング状態を無視
{data && <DataDisplay data={data} />}
```

### 3. **アンマウント時のリクエストキャンセル**
```typescript
// ✅ 良い例: フックが自動的に処理
const api = useLicenseGeneration()

// ❌ 避ける: クリーンアップなしの手動リクエスト
useEffect(() => {
  apiClient.generateLicense(...) // メモリリークの可能性
}, [])
```

### 4. **追跡用リクエストID**
```typescript
// ✅ 良い例: 長時間操作にはリクエストIDを使用
const requestId = 'license-gen-001'
await apiClient.generateLicense(data, requestId)

// 後で必要に応じてキャンセル
apiClient.cancelRequest(requestId)
```

### 5. **エラーハンドリングパターン**
```typescript
// ✅ 良い例: 具体的なエラーケースの処理
if (response.error) {
  switch (response.error) {
    case 'AUTHENTICATION_REQUIRED':
      // ログインページにリダイレクト
      break
    case 'RATE_LIMIT_EXCEEDED':
      // レート制限メッセージを表示
      break
    default:
      // 汎用エラーメッセージ
  }
}
```

## 🚨 エラータイプ

### 認証エラー
- `AUTHENTICATION_REQUIRED` - 有効なトークンなし
- `AUTHENTICATION_FAILED` - トークンリフレッシュ失敗
- `API_KEY_REQUIRED` - APIキー不足

### HTTPエラー  
- `HTTP_400` - 不正なリクエスト
- `HTTP_401` - 認証が必要
- `HTTP_403` - アクセス拒否
- `HTTP_429` - レート制限
- `HTTP_500` - サーバーエラー

### クライアントエラー
- `TIMEOUT` - リクエストタイムアウト
- `NETWORK_ERROR` - ネットワーク問題
- `PARSE_ERROR` - レスポンス解析エラー

## 🔧 設定

### APIクライアント設定
```typescript
const apiClient = new ApiClient({
  baseURL: 'https://api.example.com',
  timeout: 30000,    // 30秒
  retries: 3         // 失敗時のリトライ回数
})
```

### フックオプション
```typescript
// クエリオプション
useCurrentPlan({
  immediate: true,        // マウント時に取得
  refetchInterval: 30000  // バックグラウンド更新
})

// フォームオプション  
useApiForm(apiFunction, {
  onSuccess: (data) => {},     // 成功コールバック
  onError: (error) => {},      // エラーコールバック  
  resetOnSuccess: true         // 成功後のフォームリセット
})
```

## 🧪 テスト

### APIレスポンスのモック
```typescript
// 成功レスポンスのモック
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    generateLicense: jest.fn().mockResolvedValue({
      success: true,
      data: { licenseKey: 'test-key' }
    })
  }
}))

// エラーレスポンスのモック
apiClient.generateLicense.mockResolvedValue({
  success: false,
  error: 'テストエラー'
})
```

### フックのテスト
```typescript
import { renderHook, act } from '@testing-library/react'
import { useLicenseGeneration } from '@/lib/api-hooks'

test('ライセンス生成フック', async () => {
  const { result } = renderHook(() => useLicenseGeneration())
  
  await act(async () => {
    await result.current.execute(testData)
  })
  
  expect(result.current.data).toBeDefined()
  expect(result.current.loading).toBe(false)
})
```

## 🔄 移行ガイド

### 直接fetchからAPIクライアントへ

```typescript
// ❌ 以前: 手動fetchと認証
const token = localStorage.getItem('accessToken')
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})

// ✅ 以後: APIクライアントが全て処理
const response = await apiClient.generateLicense(data)
```

### useStateからフックへ

```typescript
// ❌ 以前: 手動状態管理
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

// ✅ 以後: フックが状態を管理
const { data, loading, error } = useCurrentPlan()
```

## 🚀 高度な使用方法

### 複数の並行リクエスト
```typescript
const multiCall = useApiMultiCall()

// 複数のAPI呼び出しを追加
multiCall.addCall('plan', () => apiClient.getCurrentPlan())
multiCall.addCall('health', () => apiClient.healthCheck())

// 状態確認
const planState = multiCall.getCallState('plan')
const isAllDone = multiCall.isAllSuccess
```

### リクエストキャンセル
```typescript
const api = useLicenseGeneration()

// 実行中リクエストをキャンセル
const handleCancel = () => {
  api.cancel()
}

// アンマウント時の自動キャンセルは自動処理
```

### カスタムリクエスト設定
```typescript
// デフォルト設定を上書き
await apiClient.post('/custom-endpoint', data, {
  requiresAuth: false,    // 認証をスキップ
  requiresApiKey: true,   // ただしAPIキーは必要
  timeout: 60000          // カスタムタイムアウト
})
```

## 💡 トラブルシューティング

### よくある問題

1. **トークンリフレッシュループ**
   - リフレッシュトークンの有効性確認
   - Cognito設定の検証

2. **CORSエラー**
   - APIが送信元を許可しているか確認
   - プリフライトリクエストの確認

3. **メモリリーク**  
   - 手動リクエストではなく提供フックを使用
   - フックはアンマウント時に自動クリーンアップ

4. **レート制限**
   - 適切なエラーハンドリングの実装
   - 高頻度呼び出し時のリクエストキューの検討

### デバッグモード
```typescript
// 詳細ログを有効化
localStorage.setItem('DEBUG_API', 'true')

// ブラウザ開発者ツールでリクエスト詳細確認
// ネットワークタブに全リクエストとヘッダーが表示
```

## 📱 実装例

### ライセンス生成フォーム
```typescript
function LicenseForm() {
  const [formData, setFormData] = useState({
    accountNumber: '',
    brokerName: '',
    eaName: '',
    expirationDays: 30
  })

  const licenseGen = useLicenseGeneration()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await licenseGen.execute(formData)
    
    if (result.success) {
      alert(`ライセンス生成成功: ${result.data.licenseKey}`)
      setFormData({ accountNumber: '', brokerName: '', eaName: '', expirationDays: 30 })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="アカウント番号"
        value={formData.accountNumber}
        onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
        disabled={licenseGen.loading}
      />
      
      <button type="submit" disabled={licenseGen.loading}>
        {licenseGen.loading ? 'ライセンス生成中...' : 'ライセンス生成'}
      </button>
      
      {licenseGen.error && (
        <div style={{ color: 'red' }}>エラー: {licenseGen.error}</div>
      )}
    </form>
  )
}
```

### プラン情報表示
```typescript
function PlanInfo() {
  const plan = useCurrentPlan({ 
    immediate: true,
    refetchInterval: 60000 // 1分毎に更新
  })

  if (plan.loading && !plan.data) {
    return <div>プラン情報を読み込み中...</div>
  }

  if (plan.error) {
    return (
      <div>
        <div>エラー: {plan.error}</div>
        <button onClick={plan.refetch}>再試行</button>
      </div>
    )
  }

  return (
    <div>
      <h3>現在のプラン: {plan.data?.currentPlan}</h3>
      <p>月間ライセンス: {plan.data?.usageStats.monthlyLicenses.used} / {plan.data?.usageStats.monthlyLicenses.limit}</p>
      <p>有効ライセンス: {plan.data?.usageStats.activeLicenses}</p>
      <button onClick={plan.refetch}>更新</button>
    </div>
  )
}
```