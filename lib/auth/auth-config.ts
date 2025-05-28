export const authConfig = {
    userPool: {
        region: process.env.NEXT_PUBLIC_AWS_REGION!,
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
        userPoolWebClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
    },
    oauth: {
        domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN!,
        scope: ['email', 'openid', 'profile'],
        redirectSignIn: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        redirectSignOut: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
        responseType: 'code',
    },
    api: {
        endpoint: process.env.NEXT_PUBLIC_API_ENDPOINT!,
    },
}