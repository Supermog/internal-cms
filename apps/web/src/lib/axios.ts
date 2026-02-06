import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { HttpError } from "@internal-cms/shared";
import { AxiosResponse } from "axios";
import { toast } from "react-hot-toast";
import supabase from "./supabase";

declare module "axios" {
  export interface AxiosRequestConfig {
    disableToast?: boolean;
    disableErrorToast?: boolean;
    requestToastId?: string;
    _retry?: boolean;
  }
}

// Create axios instance with default configuration
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 100000, // 100 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

let toastId = "";

const onRequest = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const transformedConfig = config as InternalAxiosRequestConfig & {
    _retry: boolean;
  };

  if (
    config.method === "patch" ||
    config.method === "post" ||
    config.method === "delete"
  ) {
    //do not display a new toast on retry, keep loading
    if (transformedConfig._retry) {
      toast.loading("Loading...", {
        id: transformedConfig.requestToastId || toastId,
      });
    } else if (!transformedConfig.disableToast) {
      toastId = toast.loading("Loading...", {
        id: transformedConfig.requestToastId || toastId,
      });
    }
  }
  return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  console.error(`[axios request error]:`, JSON.stringify(error));
  return Promise.reject(error.response?.data);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  const method = response.config.method;

  //don't show message
  if (response.config.disableToast) {
    return response;
  }

  if (method === "patch") {
    toast.success("The changes have been saved!", {
      id: response.config.requestToastId || toastId,
    });
  } else if (method === "post") {
    toast.success("The record has been created successfully!", {
      id: response.config.requestToastId || toastId,
    });
  } else if (method === "delete") {
    toast.success("The item has been deleted!", {
      id: response.config.requestToastId || toastId,
    });
  }

  return response;
};

const onResponseError = async (
  error: AxiosError<HttpError>
): Promise<AxiosError> => {
  const originalRequest = error.config as InternalAxiosRequestConfig & {
    _retry: boolean;
  };

  // If error is canceled, we don't want to throw an error
  if (error.name === "CanceledError") {
    return Promise.reject(error.response?.data);
  }

  if (
    (error.response?.status === 401 || error.response?.status === 403) &&
    originalRequest &&
    !originalRequest?._retry
  ) {
    // add a _retry flag to avoid infinite loop
    originalRequest._retry = true;
    const session = await supabase.auth.getSession();

    const token = session.data.session?.access_token;

    if (token) {
      // set header to the failed request
      originalRequest.headers.setAuthorization(`Bearer ${token.toString()}`);

      //set header to the axiosClient instance
      axiosClient.defaults.headers.common.Authorization = `Bearer ${token.toString()}`;
      return axiosClient(originalRequest);
    }
  } else if (error.response?.status === 400) {
    if (error.response.config.disableToast) {
      return Promise.reject(error.response?.data);
    }

    if (error.response.data.message) {
      if (Array.isArray(error.response.data.message)) {
        toast.error(error.response.data.message[0], {
          id: error.response.config.requestToastId || toastId,
        });
      } else {
        toast.error(error.response.data.message, {
          id: error.response.config.requestToastId || toastId,
        });
      }
    } else {
      toast.error("Sorry, there was an unexpected error.", {
        id: error.response.config.requestToastId || toastId,
      });
    }
  } else if (error.response?.status === 409 || error.response?.status === 404) {
    if (!originalRequest.disableErrorToast) {
      const rawErrorMessage = error.response.data.message;
      const formattedErrorMessage = Array.isArray(rawErrorMessage)
        ? rawErrorMessage.join(",")
        : rawErrorMessage;

      toast.error(formattedErrorMessage, {
        id: error.response.config.requestToastId || toastId,
      });
    }
  } else {
    if (originalRequest?._retry) {
      toast.error(
        "Sorry, you do not have permission to access this resource.",
        {
          id: originalRequest.requestToastId || toastId,
        }
      );

      return Promise.reject(error.response?.data);
    }

    toast.error("Sorry, there was an unexpected error.", {
      id: originalRequest.requestToastId || toastId,
    });
  }

  if (process.env.NODE_ENV === "development") {
    console.error(`[axios response error]:`, JSON.stringify(error));
  }
  return Promise.reject(error.response?.data);
};

axiosClient.interceptors.request.use(onRequest, onRequestError);
axiosClient.interceptors.response.use(onResponse, onResponseError);

export { axiosClient };
