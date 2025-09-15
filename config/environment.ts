// Environment Configuration for oneQlick User App

export interface Environment {
  API_BASE_URL: string;
  API_TIMEOUT: number;
  ENABLE_LOGGING: boolean;
  ENABLE_ANALYTICS: boolean;
  ENABLE_CRASH_REPORTING: boolean;
  MAPS_API_KEY?: string;
  PAYMENT_GATEWAY_KEY?: string;
  SENTRY_DSN?: string;
}

const development: Environment = {
  API_BASE_URL: 'http://localhost:3000/api',
  API_TIMEOUT: 10000,
  ENABLE_LOGGING: true,
  ENABLE_ANALYTICS: false,
  ENABLE_CRASH_REPORTING: false,
  MAPS_API_KEY: 'your-dev-maps-key',
  PAYMENT_GATEWAY_KEY: 'your-dev-payment-key',
};

const staging: Environment = {
  API_BASE_URL: 'https://staging-api.oneqlick.com/v1',
  API_TIMEOUT: 15000,
  ENABLE_LOGGING: true,
  ENABLE_ANALYTICS: true,
  ENABLE_CRASH_REPORTING: true,
  MAPS_API_KEY: 'your-staging-maps-key',
  PAYMENT_GATEWAY_KEY: 'your-staging-payment-key',
  SENTRY_DSN: 'your-staging-sentry-dsn',
};

const production: Environment = {
  API_BASE_URL: 'https://api.oneqlick.com/v1',
  API_TIMEOUT: 20000,
  ENABLE_LOGGING: false,
  ENABLE_ANALYTICS: true,
  ENABLE_CRASH_REPORTING: true,
  MAPS_API_KEY: 'your-prod-maps-key',
  PAYMENT_GATEWAY_KEY: 'your-prod-payment-key',
  SENTRY_DSN: 'your-prod-sentry-dsn',
};

// Get current environment
const getEnvironment = (): Environment => {
  if (__DEV__) {
    return development;
  }
  
  // You can add logic here to determine staging vs production
  // For example, based on build configuration or environment variables
  const buildType = process.env.EXPO_PUBLIC_BUILD_TYPE || 'production';
  
  switch (buildType) {
    case 'staging':
      return staging;
    case 'production':
    default:
      return production;
  }
};

export const environment = getEnvironment();

// Export individual environment variables for convenience
export const {
  API_BASE_URL,
  API_TIMEOUT,
  ENABLE_LOGGING,
  ENABLE_ANALYTICS,
  ENABLE_CRASH_REPORTING,
  MAPS_API_KEY,
  PAYMENT_GATEWAY_KEY,
  SENTRY_DSN,
} = environment;

// Validation function
export const validateEnvironment = (): boolean => {
  const requiredKeys: (keyof Environment)[] = ['API_BASE_URL', 'API_TIMEOUT'];
  
  for (const key of requiredKeys) {
    if (!environment[key]) {
      console.error(`Missing required environment variable: ${key}`);
      return false;
    }
  }
  
  return true;
};

// Log environment info in development
if (__DEV__ && ENABLE_LOGGING) {
  console.log('Environment Configuration:', {
    API_BASE_URL,
    ENABLE_LOGGING,
    ENABLE_ANALYTICS,
    ENABLE_CRASH_REPORTING,
  });
}
