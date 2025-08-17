/**
 * CORS Configuration for the Internal CMS API
 *
 * This configuration allows cross-origin requests from specified origins,
 * primarily for development and local testing purposes.
 *
 * Key Features:
 * - Allows localhost:8080 (your client app)
 * - Supports multiple development ports
 * - Environment-based origin configuration
 * - Secure header management
 * - Credentials support for authentication
 */

export const corsConfig = {
  // Allowed origins for CORS requests
  origin: [
    // Production origins (always allowed)
    'http://localhost:8080', // Your client app
    'http://localhost:3000', // API itself
    'http://localhost:5173', // Vite default port

    // Local IP addresses
    'http://127.0.0.1:8080',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',

    // Development-only origins (only in development mode)
    ...(process.env.NODE_ENV === 'development'
      ? [
          'http://localhost:3001',
          'http://localhost:3002',
          'http://localhost:8081',
          'http://localhost:8082',
          'http://localhost:4173', // Vite preview port
        ]
      : []),

    // Environment-specific origins (comma-separated in ALLOWED_ORIGINS env var)
    ...(process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
      : []),
  ],

  // Allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  // Allowed request headers
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
    'X-API-Key',
    'X-Request-ID',
  ],

  // Headers exposed to the client
  exposedHeaders: [
    'X-Total-Count', // For pagination
    'X-Page-Count', // For pagination
    'X-Current-Page', // For pagination
    'X-Request-ID', // For request tracking
  ],

  // Allow credentials (cookies, authorization headers)
  credentials: true,

  // CORS preflight handling
  preflightContinue: false,
  optionsSuccessStatus: 204,

  // Cache preflight response for 24 hours
  maxAge: 86400,
};
