import axios, { CancelTokenSource } from "axios";

// Create axios instance with default configuration
export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: 100000, // 100 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Utility function to create authenticated request config
export const createAuthConfig = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Utility function to create a cancel token
export const createCancelToken = (): CancelTokenSource =>
  axios.CancelToken.source();

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 2,
  retryDelay: 1000, // 1 second
  retryStatusCodes: [408, 429, 500, 502, 503, 504], // Retry on these status codes
};

// Utility function to retry failed requests
const retryRequest = async (
  error: any,
  retryCount: number = 0
): Promise<any> => {
  const { config } = error;

  if (retryCount >= RETRY_CONFIG.maxRetries) {
    throw error;
  }

  if (!RETRY_CONFIG.retryStatusCodes.includes(error.response?.status)) {
    throw error;
  }

  // Wait before retrying
  await new Promise((resolve) =>
    setTimeout(resolve, RETRY_CONFIG.retryDelay * (retryCount + 1))
  );

  console.log(
    `🔄 Retrying request (${retryCount + 1}/${RETRY_CONFIG.maxRetries}): ${config.url}`
  );

  try {
    return await axiosClient(config);
  } catch (retryError) {
    return retryRequest(retryError, retryCount + 1);
  }
};

// Request interceptor to add auth token
axiosClient.interceptors.request.use(
  (config) => {
    // Log outgoing requests for debugging
    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosClient.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    // Don't retry cancelled requests
    if (axios.isCancel(error)) {
      console.log("🔄 Request cancelled");
      return Promise.reject(error);
    }

    // Try to retry the request
    try {
      return await retryRequest(error);
    } catch (retryError) {
      // Type guard to check if it's an axios error
      if (axios.isAxiosError(retryError)) {
        // Handle common errors globally
        if (retryError.response?.status === 401) {
          // Unauthorized - could redirect to login or clear session
          console.error("🔒 Unauthorized request");
        } else if (retryError.response?.status === 403) {
          // Forbidden
          console.error("🚫 Access forbidden");
        } else if (
          retryError.response?.status &&
          retryError.response.status >= 500
        ) {
          // Server error
          console.error("💥 Server error occurred");
        }

        // Log error details for debugging
        console.error("❌ API Error:", {
          status: retryError.response?.status,
          statusText: retryError.response?.statusText,
          url: retryError.config?.url,
          data: retryError.response?.data,
        });
      } else {
        // Handle non-axios errors
        console.error("❌ Non-axios error:", retryError);
      }

      return Promise.reject(retryError);
    }
  }
);
