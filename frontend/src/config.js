const BASE_URL = import.meta.env.VITE_API_URL;

export const API_URL = BASE_URL.endsWith("/")
  ? BASE_URL.slice(0, -1)
  : BASE_URL;
