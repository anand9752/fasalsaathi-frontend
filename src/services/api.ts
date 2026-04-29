/// <reference types="vite/client" />
import axios, { 
    AxiosError, 
    AxiosResponse, 
    InternalAxiosRequestConfig,
    AxiosRequestConfig
} from 'axios';
import { Crop, CropDetailResponse, CropRecommendation, CropRecommendationRequest, DashboardOverview, Disease, Farm, FarmCalendarResponse, InventoryItem, InventoryItemCreate, InventoryItemUpdate, InventoryStats, ManagedCrop, ManagedCropCreatePayload, ManagedCropUpdatePayload, MarketPrice, RegisterPayload, SoilTest, SoilTestCreatePayload, User, WeatherCurrentResponse, WeatherForecastResponse } from '../types/api';

// Error interface for backend responses
interface ApiError {
    detail: string;
    status_code?: number;
}

const API_BASE_URL = (() => {
    const envUrl = import.meta.env.VITE_API_BASE_URL?.trim();
    if (envUrl && envUrl !== '') {
        return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
    }
    return 'http://localhost:8000/api/v1';
})();

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // ─── THE FIX: Check if this was a login attempt ───
        const isLoginRequest = originalRequest.url?.includes('/auth/token');

        // Handle 401 Unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // ─── THE FIX: Do not redirect if they are actively trying to log in ───
            if (isLoginRequest) {
                return Promise.reject(error); // Let LoginPage.tsx handle the UI error message
            }

            // Clear token and redirect to login if refresh fails (for normal dashboard requests)
            const handleAuthError = () => {
                localStorage.removeItem('accessToken');
                window.location.href = '/login'; // Changed from '/' to '/login' for better UX
                return Promise.reject(error);
            };

            // Try to refresh token
            try {
                // TODO: Implement proper token refresh mechanism
                // const response = await authApi.refreshToken();
                // const { access_token } = response.data;
                // localStorage.setItem('accessToken', access_token);
                // originalRequest.headers.Authorization = `Bearer ${access_token}`;
                // return apiClient(originalRequest);
                return handleAuthError();
            } catch (refreshError) {
                return handleAuthError();
            }
        }

        // Handle other errors
        let errorMessage = error.response?.data?.detail || error.message;
        
        // Handle FastAPI validation errors (422) which return detail as an array
        if (Array.isArray(error.response?.data?.detail)) {
            errorMessage = error.response.data.detail.map((err: any) => `${err.loc.join('.')}: ${err.msg}`).join(', ');
        } else if (typeof errorMessage === 'object' && errorMessage !== null) {
            errorMessage = JSON.stringify(errorMessage);
        }

        console.error('API Error:', errorMessage);
        
        // Normalize both the message and the detail field to prevent React rendering issues
        error.message = errorMessage;
        if (error.response?.data) {
            error.response.data.detail = errorMessage;
        }
        
        return Promise.reject(error);
    }
);

// Auth API
export const authApi = {
    register: (userData: RegisterPayload) => 
        apiClient.post<User>('/auth/register', userData).then(response => response.data),
    
    login: (email: string, password: string) =>
        apiClient.post<{ access_token: string, token_type: string }>('/auth/token', 
            new URLSearchParams({ username: email, password }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        ).then(response => response.data),
    
    getCurrentUser: () => 
        apiClient.get<User>('/auth/me').then(response => response.data),

    updateCurrentUser: (userData: Partial<User>) =>
        apiClient.put<User>('/users/me', userData).then(response => response.data)
};

// Farm API
export const farmApi = {
    getAllFarms: () => 
        apiClient.get<Farm[]>('/farms').then(response => response.data),
    
    getFarmById: (id: number) => 
        apiClient.get<Farm>(`/farms/${id}`).then(response => response.data),
    
    createFarm: (farmData: Partial<Farm> & { initial_crop_id?: number; initial_crop_season?: string; initial_crop_year?: number }) => 
        apiClient.post<Farm>('/farms', farmData).then(response => response.data),
    
    updateFarm: (id: number, farmData: Partial<Farm>) => 
        apiClient.put<Farm>(`/farms/${id}`, farmData).then(response => response.data),
    
    deleteFarm: (id: number) => 
        apiClient.delete(`/farms/${id}`).then(response => response.data),
    
    getFarmSoilTests: (farmId: number) => 
        apiClient.get<SoilTest[]>(`/farms/${farmId}/soil-tests`).then(response => response.data)
};

export const soilTestApi = {
    create: (payload: SoilTestCreatePayload) =>
        apiClient.post<SoilTest>('/soil-test', payload).then(response => response.data),

    getLatestByFarm: (farmId: number) =>
        apiClient.get<SoilTest>(`/soil-test/${farmId}`).then(response => response.data),
};

export const farmCalendarApi = {
    getByFarm: (farmId: number, params?: { lat?: number; lon?: number }) =>
        apiClient.get<FarmCalendarResponse>('/farm-calendar', {
            params: { farm_id: farmId, ...params }
        }).then(response => response.data),
};

// Crop API
export const cropApi = {
    detectDisease: (image: File) => {
        const formData = new FormData();
        formData.append('image', image);
        return apiClient.post<Disease>('/crops/disease-detection', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(response => response.data);
    },

    getCropRecommendations: (params: CropRecommendationRequest) =>
        apiClient.post<CropRecommendation[]>('/crop-recommendation', params).then(response => response.data),

    getCropDetail: (cropName: string) =>
        apiClient.get<CropDetailResponse>('/crop-detail', { params: { crop_name: cropName } }).then(response => response.data),
    
    predictYield: (params: {
        crop_id: number,
        area: number,
        soil_type: string,
        irrigation_type: string,
        season: string
    }) => apiClient.post('/crops/yield-prediction', params).then(response => response.data),

    getAllCrops: () =>
        apiClient.get<Crop[]>('/crops').then(response => response.data),

    getManagedCrops: (farmId?: number) =>
        apiClient.get<ManagedCrop[]>('/crops/managed', { params: farmId ? { farm_id: farmId } : undefined }).then(response => response.data),

    createManagedCrop: (payload: ManagedCropCreatePayload) =>
        apiClient.post<ManagedCrop>('/crops/managed', payload).then(response => response.data),

    updateManagedCrop: (id: number, payload: ManagedCropUpdatePayload) =>
        apiClient.put<ManagedCrop>(`/crops/managed/${id}`, payload).then(response => response.data)
};

// Weather API
export const weatherApi = {
    getCurrentWeather: (params?: { lat?: number; lon?: number; location?: string }) => 
        apiClient.get<WeatherCurrentResponse>('/weather/current', { params })
            .then(response => response.data)
            .catch((error: AxiosError<ApiError>) => {
                console.error('Error fetching weather:', error.response?.data?.detail);
                throw error;
            }),
    
    getWeatherForecast: (params?: { lat?: number; lon?: number; location?: string; days?: number }) => 
        apiClient.get<WeatherForecastResponse>('/weather/forecast', { 
            params
        })
            .then(response => response.data)
            .catch((error: AxiosError<ApiError>) => {
                console.error('Error fetching forecast:', error.response?.data?.detail);
                throw error;
            }),

    getWeatherHistory: (location?: string, days: number = 7) =>
        apiClient.get<WeatherForecastResponse>('/weather/forecast', { params: { location, days } }).then(response => response.data),
    
    getWeatherIcon: (iconCode: string) =>
        `https://openweathermap.org/img/wn/${iconCode}@2x.png`
};

// Market API
export const marketApi = {
    getCurrentPrices: (params?: { state?: string, market?: string, commodity?: string, crop_id?: number }) => 
        apiClient.get<MarketPrice[]>('/market/prices/current', { params })
            .then(response => response.data)
            .catch((error: AxiosError<ApiError>) => {
                console.error('Error fetching current prices:', error.response?.data?.detail);
                throw error;
            }),
    
    getPriceHistory: (cropId: number, days: number = 30) => 
        apiClient.get<MarketPrice[]>(`/market/prices/history/${cropId}`, {
            params: { days }
        })
            .then(response => response.data)
            .catch((error: AxiosError<ApiError>) => {
                console.error('Error fetching price history:', error.response?.data?.detail);
                throw error;
            }),
    
    getMarkets: () => 
        apiClient.get<string[]>('/market/markets')
            .then(response => response.data)
            .catch((error: AxiosError<ApiError>) => {
                console.error('Error fetching markets:', error.response?.data?.detail);
                throw error;
            }),
    
    getMarketTrends: (cropId: number) => 
        apiClient.get<{
            trend: string;
            current_price: number;
            average_price: number;
            price_change: number;
            forecast: string;
        }>(`/market/trends/${cropId}`)
            .then(response => response.data)
            .catch((error: AxiosError<ApiError>) => {
                console.error('Error fetching market trends:', error.response?.data?.detail);
                throw error;
            })
};

export const dashboardApi = {
    getOverview: () =>
        apiClient.get<DashboardOverview>('/dashboard/overview').then(response => response.data)
};

export const inventoryApi = {
    /** List all items; optionally filter by category, search term, or low-stock flag */
    list: (params?: { category?: string; low_stock_only?: boolean; search?: string }) =>
        apiClient.get<InventoryItem[]>('/inventory', { params }).then(r => r.data),

    /** Aggregated stats for the inventory page header cards */
    getStats: () =>
        apiClient.get<InventoryStats>('/inventory/stats').then(r => r.data),

    /** Create a new inventory item */
    create: (data: InventoryItemCreate) =>
        apiClient.post<InventoryItem>('/inventory', data).then(r => r.data),

    /** Get a single item by id */
    get: (id: number) =>
        apiClient.get<InventoryItem>(`/inventory/${id}`).then(r => r.data),

    /** Partial or full update */
    update: (id: number, data: InventoryItemUpdate) =>
        apiClient.put<InventoryItem>(`/inventory/${id}`, data).then(r => r.data),

    /** Delete an item (returns void) */
    delete: (id: number) =>
        apiClient.delete(`/inventory/${id}`).then(r => r.data),
};

import { Notification, NotificationUpdate } from '../types/notification';

export const notificationApi = {
    getNotifications: () => 
        apiClient.get<Notification[]>('/notifications').then(response => response.data),
    
    markAsRead: (id: number, data: NotificationUpdate) => 
        apiClient.patch<Notification>(`/notifications/${id}/read`, data).then(response => response.data),
        
    deleteNotification: (id: number) => 
        apiClient.delete(`/notifications/${id}`).then(response => response.data),
};

export const askSathiApi = {
    ask: (query: string, history: { role: string; content: string }[] = []) =>
        apiClient.post<{ type: string; response: string; language: string }>('/ask-sathi/ask-sathi', { query, history })
            .then(response => response.data),
};

export default {
    auth: authApi,
    farms: farmApi,
    farmCalendar: farmCalendarApi,
    soilTests: soilTestApi,
    crops: cropApi,
    weather: weatherApi,
    market: marketApi,
    dashboard: dashboardApi,
    inventory: inventoryApi,
    notifications: notificationApi,
    askSathi: askSathiApi,
};
