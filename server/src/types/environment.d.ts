declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
      PORT?: string
      MONGO_URI?: string
      CLIENT_URL?: string
      SESSION_SECRET?: string
      JWT_SECRET?: string
      REFRESH_TOKEN_SECRET?: string
      SESSION_EXPIRY?: string
      REFRESH_TOKEN_EXPIRY?: string
    }
  }
}

export {}
