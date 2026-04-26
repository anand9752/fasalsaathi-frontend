export interface ApiError {
    status: number;
    message: string;
}

interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
}

export interface WeatherParams {
    location: string;
    days?: number;
}

export interface CropRecommendationParams {
    soil_type: string;
    season: string;
    location: string;
    irrigation_type?: string;
    search?: string;
}

export interface YieldPredictionParams {
    crop_id: number;
    area: number;
    soil_type: string;
    irrigation_type: string;
    season: string;
}

export interface MarketPriceParams {
    market?: string;
    crop_id?: number;
}

// Utility types
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type WithoutId<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>;
export type UpdateFields<T> = Partial<WithoutId<T>>;
