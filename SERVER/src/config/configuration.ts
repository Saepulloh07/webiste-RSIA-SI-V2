export default () => ({
  app: {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '5000', 10),
    apiPrefix: process.env.API_PREFIX ?? 'api/v1',
    corsOrigins: process.env.CORS_ORIGINS ?? '',
    timezone: process.env.APP_TIMEZONE ?? 'Asia/Jakarta',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  simrs: {
    url: process.env.SIMRS_DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL ?? '60', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT ?? '100', 10),
    strictTtl: parseInt(process.env.THROTTLE_STRICT_TTL ?? '60', 10),
    strictLimit: parseInt(process.env.THROTTLE_STRICT_LIMIT ?? '10', 10),
  },
  storage: {
    driver: process.env.STORAGE_DRIVER ?? 'local',
    maxSizeMb: parseInt(process.env.UPLOAD_MAX_SIZE_MB ?? '5', 10),
    localUploadDir: process.env.LOCAL_UPLOAD_DIR ?? './uploads',
    localPublicUrl: process.env.LOCAL_UPLOAD_PUBLIC_URL ?? 'http://localhost:5000/uploads',
    s3: {
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION,
      bucket: process.env.S3_BUCKET,
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      publicUrlBase: process.env.S3_PUBLIC_URL_BASE,
    },
  },
});
