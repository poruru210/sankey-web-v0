import {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
    ForgotPasswordCommand,
    ConfirmForgotPasswordCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { authConfig } from './auth-config'

class AuthService {
    private client: CognitoIdentityProviderClient

    constructor() {
        this.client = new CognitoIdentityProviderClient({
            region: authConfig.userPool.region,
        })
    }

    // カスタムログイン
    async signIn(email: string, password: string) {
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

            if (response.ChallengeName) {
                return {
                    success: false,
                    challenge: response.ChallengeName,
                    session: response.Session,
                }
            }

            return {
                success: true,
                tokens: {
                    accessToken: response.AuthenticationResult?.AccessToken,
                    idToken: response.AuthenticationResult?.IdToken,
                    refreshToken: response.AuthenticationResult?.RefreshToken,
                },
            }
        } catch (error: any) {
            return {
                success: false,
                error: this.parseError(error.name),
            }
        }
    }

    private parseError(errorCode: string): string {
        const errorMessages: Record<string, string> = {
            'NotAuthorizedException': 'メールアドレスまたはパスワードが正しくありません',
            'UserNotFoundException': 'ユーザーが見つかりません',
            'UserNotConfirmedException': 'メールアドレスの確認が完了していません',
            'TooManyRequestsException': 'リクエストが多すぎます。しばらく待ってから再試行してください',
        }

        return errorMessages[errorCode] || '認証エラーが発生しました'
    }
}

export const authService = new AuthService()