import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, dashboardApi, farmApi, farmCalendarApi, cropApi, weatherApi, marketApi, soilTestApi } from './api';

// Auth Hooks
export const useRegister = () => {
    return useMutation({
        mutationFn: authApi.register
    });
};

export const useLogin = () => {
    return useMutation({
        mutationFn: ({ email, password }) => authApi.login(email, password)
    });
};

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: authApi.getCurrentUser
    });
};

// Farm Hooks
export const useFarms = () => {
    return useQuery({
        queryKey: ['farms'],
        queryFn: farmApi.getAllFarms
    });
};

export const useFarm = (id: number) => {
    return useQuery({
        queryKey: ['farm', id],
        queryFn: () => farmApi.getFarmById(id)
    });
};

export const useCreateFarm = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: farmApi.createFarm,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['farms'] });
        }
    });
};

export const useUpdateFarm = (id: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => farmApi.updateFarm(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['farms'] });
            queryClient.invalidateQueries({ queryKey: ['farm', id] });
        }
    });
};

export const useDeleteFarm = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: farmApi.deleteFarm,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['farms'] });
        }
    });
};

export const useLatestSoilTest = (farmId: number) => {
    return useQuery({
        queryKey: ['soil-test', 'latest', farmId],
        queryFn: () => soilTestApi.getLatestByFarm(farmId),
        enabled: !!farmId,
    });
};

export const useCreateSoilTest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: soilTestApi.create,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['soil-test', 'latest', variables.farm_id] });
            queryClient.invalidateQueries({ queryKey: ['farms'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });
        }
    });
};

export const useFarmCalendar = (farmId: number, params?: { lat?: number; lon?: number }) => {
    return useQuery({
        queryKey: ['farm-calendar', farmId, params],
        queryFn: () => farmCalendarApi.getByFarm(farmId, params),
        enabled: !!farmId,
    });
};

// Crop Hooks
export const useDiseaseDetection = () => {
    return useMutation({
        mutationFn: cropApi.detectDisease
    });
};

export const useCropRecommendations = () => {
    return useMutation({
        mutationFn: cropApi.getCropRecommendations
    });
};

export const useYieldPrediction = () => {
    return useMutation({
        mutationFn: cropApi.predictYield
    });
};

// Weather Hooks
export const useCurrentWeather = (location: string) => {
    return useQuery({
        queryKey: ['weather', 'current', location],
        queryFn: () => weatherApi.getCurrentWeather({ location })
    });
};

export const useWeatherForecast = (location: string, days: number = 7) => {
    return useQuery({
        queryKey: ['weather', 'forecast', location, days],
        queryFn: () => weatherApi.getWeatherForecast({ location, days })
    });
};

export const useWeatherHistory = (location: string, days: number = 30) => {
    return useQuery({
        queryKey: ['weather', 'history', location, days],
        queryFn: () => weatherApi.getWeatherHistory(location, days)
    });
};

// Market Hooks
export const useCurrentPrices = (params?: { state?: string; market?: string; commodity?: string; crop_id?: number }) => {
    return useQuery({
        queryKey: ['market', 'prices', 'current', params],
        queryFn: () => marketApi.getCurrentPrices(params)
    });
};

export const usePriceHistory = (cropId: number, days: number = 30) => {
    return useQuery({
        queryKey: ['market', 'prices', 'history', cropId, days],
        queryFn: () => marketApi.getPriceHistory(cropId, days)
    });
};

export const useMarkets = () => {
    return useQuery({
        queryKey: ['market', 'list'],
        queryFn: marketApi.getMarkets
    });
};

export const useMarketTrends = (cropId: number) => {
    return useQuery({
        queryKey: ['market', 'trends', cropId],
        queryFn: () => marketApi.getMarketTrends(cropId)
    });
};

export const useDashboardOverview = () => {
    return useQuery({
        queryKey: ['dashboard', 'overview'],
        queryFn: dashboardApi.getOverview
    });
};
