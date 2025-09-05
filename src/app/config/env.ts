import dotenv from "dotenv";

dotenv.config();

interface EnvVariables {
  PORT: string;
  DB_URI: string;
  NODE_ENV: "development" | "production";
  // JWT
  JWT_AUTH_SECRET: string;
  JWT_AUTH_TIME: string;
  JWT_AUTH_REFRESH_SECRET: string;
  JWT_AUTH_REFRESH_TIME: string;
  // BCRYPT
  BCRYPT_SALT: string;
  // SUPER ADMIN
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
  // passport google
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CALLBACK_URL: string;
  EXPRESS_SESSION_SECRET: string;
  FRONTEND_URL: string;
  // ssl
  SSL: {
    STORE_ID: string;
    STORE_PASS: string;
    SSL_PAYMENT_API: string;
    SSL_VALIDATION_API: string;
    SSL_SUCCESS_FRONTEND_URL: string;
    SSL_FAIL_FRONTEND_URL: string;
    SSL_CANCEL_FRONTEND_URL: string;
    SSL_SUCCESS_BACKEND_URL: string;
    SSL_FAIL_BACKEND_URL: string;
    SSL_CANCEL_BACKEND_URL: string;
    SSL_IPN_URL: string;
  };
  // CLOUDINARY
  CLOUDINARY: {
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    CLOUDINARY_URL: string;
  };
  // SMTP
  EMAIL_SENDER: {
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_USER: string;
    SMTP_FROM: string;
    SMTP_PASS: string;
  };
  // Redis
  REDIS: {
    REDIS_USERNAME: string;
    REDIS_PASSWORD: string;
    REDIS_HOST: string;
    REDIS_PORT: string;
  };
}

const envVarKeys: string[] = [
  "PORT",
  "DB_URI",
  "NODE_ENV",
  // JWT
  "JWT_AUTH_SECRET",
  "JWT_AUTH_TIME",
  "JWT_AUTH_REFRESH_SECRET",
  "JWT_AUTH_REFRESH_TIME",
  // BCRYPT
  "BCRYPT_SALT",
  // SUPER ADMIN
  "SUPER_ADMIN_EMAIL",
  "SUPER_ADMIN_PASSWORD",
  // passport google
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CALLBACK_URL",
  "EXPRESS_SESSION_SECRET",
  "FRONTEND_URL",
  // ssl
  "SSL_STORE_ID",
  "SSL_STORE_PASS",
  "SSL_PAYMENT_API",
  "SSL_VALIDATION_API",
  "SSL_SUCCESS_FRONTEND_URL",
  "SSL_FAIL_FRONTEND_URL",
  "SSL_CANCEL_FRONTEND_URL",
  "SSL_SUCCESS_BACKEND_URL",
  "SSL_FAIL_BACKEND_URL",
  "SSL_CANCEL_BACKEND_URL",
  "SSL_IPN_URL",
  // cloudinary
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "CLOUDINARY_URL",
  // SMTP
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_FROM",
  "SMTP_PASS",
  // Redis
  "REDIS_USERNAME",
  "REDIS_PASSWORD",
  "REDIS_HOST",
  "REDIS_PORT",
];

const loadEnvVariables = (): EnvVariables => {
  envVarKeys.forEach((key) => {
    if (!process.env[key])
      throw new Error(`${key} is not found from .env file.`);
  });

  return {
    PORT: process.env.PORT as string,
    DB_URI: process.env.DB_URI as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    // JWT
    JWT_AUTH_SECRET: process.env.JWT_AUTH_SECRET as string,
    JWT_AUTH_TIME: process.env.JWT_AUTH_TIME as string,
    JWT_AUTH_REFRESH_SECRET: process.env.JWT_AUTH_REFRESH_SECRET as string,
    JWT_AUTH_REFRESH_TIME: process.env.JWT_AUTH_REFRESH_TIME as string,
    // BCRYPT
    BCRYPT_SALT: process.env.BCRYPT_SALT as string,
    // SUPER ADMIN
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    // passport google
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    // ssl
    SSL: {
      STORE_ID: process.env.SSL_STORE_ID as string,
      STORE_PASS: process.env.SSL_STORE_PASS as string,
      SSL_PAYMENT_API: process.env.SSL_PAYMENT_API as string,
      SSL_VALIDATION_API: process.env.SSL_VALIDATION_API as string,
      SSL_SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL as string,
      SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL as string,
      SSL_CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL as string,
      SSL_SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL as string,
      SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL as string,
      SSL_CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL as string,
      SSL_IPN_URL: process.env.SSL_IPN_URL as string,
    },
    // CLOUDINARY
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
      CLOUDINARY_URL: process.env.CLOUDINARY_URL as string,
    },
    // SMTP
    EMAIL_SENDER: {
      SMTP_HOST: process.env.SMTP_HOST as string,
      SMTP_PORT: process.env.SMTP_PORT as string,
      SMTP_USER: process.env.SMTP_USER as string,
      SMTP_FROM: process.env.SMTP_FROM as string,
      SMTP_PASS: process.env.SMTP_PASS as string,
    },
    // Redis
    REDIS: {
      REDIS_USERNAME: process.env.REDIS_USERNAME as string,
      REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
      REDIS_HOST: process.env.REDIS_HOST as string,
      REDIS_PORT: process.env.REDIS_PORT as string,
    },
  };
};

export const envVars = loadEnvVariables();
