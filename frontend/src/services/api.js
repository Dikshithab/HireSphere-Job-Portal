import axios from "axios";

const api = axios.create({
baseURL: "https://hiresphere-backend-6ksv.onrender.com/api"
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        console.log("API Request:", config.method?.toUpperCase(), config.url);
        console.log("Token exists:", !!token);

        if (!config.skipAuth && token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,

    (error) => {
        if (error.response?.status === 401) {
            console.error(
                "401 Unauthorized:",
                error.response.data
            );

            console.error(
                "Request URL:",
                error.config?.url
            );

            console.error(
                "Authorization Header:",
                error.config?.headers?.Authorization
            );
        }

        return Promise.reject(error);
    }
);

export default api;