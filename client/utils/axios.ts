import axios from "axios";

const url = 'http://localhost:5000/api/v1'

const axiosInstancePublic = axios.create({
    baseURL: url
})

const axiosInstancePrivate = axios.create({
    baseURL: url,
    withCredentials: true,
});

const getAccessToken = () => localStorage.getItem("token");
const setAccessToken = (token: string) => localStorage.setItem("token", token);

axiosInstancePrivate.interceptors.request.use(config => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    }
    return Promise.reject(new axios.AxiosError(
        'Access token bulunamadı!',
        'TOKEN_MISSING'
    ));
});

axiosInstancePrivate.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const res = await axios.post(`${url}/auth/refresh`, {}, { withCredentials: true });

                const newAccessToken = res.data.accessToken;
                setAccessToken(newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstancePrivate(originalRequest);
            } catch (refreshError) {
                console.error("Token yenileme başarısız", refreshError);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export { axiosInstancePrivate, axiosInstancePublic };
