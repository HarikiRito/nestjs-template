function envConfig() {
  return {
    port: parseInt(process.env.PORT ?? '', 10),
    jwtSecret: process.env.JWT_SECRET,
    database: {
      database: process.env.DATABASE_NAME,
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      nodeEnv: process.env.NODE_ENV,
      debug: process.env.DB_DEBUG === 'true',
    },
    rabbitmq: {
      host: process.env.RABBITMQ_HOST,
      port: parseInt(process.env.RABBITMQ_PORT || '5672', 10),
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
    firebaseAdminPath: process.env.FIREBASE_ADMIN_ACCOUNT_PATH,
    serviceAccount: {
      googlePlayPubsubPath: process.env.SERVICE_ACCOUNT_GOOGLE_PLAY_PUBSUB_PATH,
    },
    twilio: {
      accountSID: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    },
    aws: {
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
      bucket_name: process.env.AWS_BUCKET_NAME,
    },
    fileUpload: {
      maxImageFileSize: parseInt(process.env.MAX_IMAGE_SIZE ?? '10'),
    },
    email: {
      clientID: process.env.EMAIL_CLIENT_ID,
      clientSecret: process.env.EMAIL_CLIENT_SECRET,
      refreshToken: process.env.EMAIL_REFRESH_TOKEN,
      mailAddress: process.env.EMAIL_MAIL,
      accessToken: process.env.EMAIL_ACCESS_TOKEN,
      mailPassword: process.env.EMAIL_PASSWORD,
    },
    apple: {
      keyId: process.env.APPLE_KEY_ID,
      issuerId: process.env.APPLE_ISSUER_ID,
      bundleId: 'com.gtsvietnam.vpro',
      authKeyPath: process.env.APPLE_AUTH_KEY_PATH,
    },
  }
}

export const envVars = envConfig()
