export interface User {
    id: number;
    email: string;
    phone: string;
    full_name: string;
    language_preference: string;
    role?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Farm {
    id: number;
    name: string;
    location: string;
    area: number;
    soil_type: string;
    irrigation_type: string;
    owner_id: number;
    created_at: string;
    updated_at: string;
    crops?: Crop[];
    soil_tests?: SoilTest[];
    crop_cycles?: FarmCropCycle[];
}

export interface Crop {
    id: number;
    name: string;
    name_hindi: string;
    scientific_name: string;
    season: string;
    duration: number;
    water_requirement: number;
    soil_compatibility?: string;
    estimated_yield_min?: number;
    estimated_yield_max?: number;
    estimated_profit?: number;
    investment_per_acre?: number;
    market_demand_level?: string;
    risk_level?: string;
    description?: string;
    created_at: string;
    updated_at: string;
    diseases?: Disease[];
}

export interface FarmCropCycle {
    id: number;
    crop_id: number;
    crop_name: string;
    crop_name_hindi: string;
    season: string;
    year: number;
    sowing_date?: string | null;
    expected_harvest_date?: string | null;
    area: number;
    status: string;
    yield_achieved?: number | null;
    profit_loss?: number | null;
}

export interface Disease {
    id: number;
    name: string;
    name_hindi: string;
    crop_id: number;
    symptoms: string;
    prevention: string;
    treatment: string;
    created_at: string;
    updated_at: string;
}

export interface SoilTest {
    id: number;
    farm_id: number;
    ph: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    organic_matter: number;
    test_date: string;
    created_at: string;
    updated_at: string;
}

export interface WeatherData {
    id: number;
    location: string;
    temperature: number;
    humidity: number;
    rainfall: number;
    wind_speed: number;
    date: string;
    created_at: string;
}

export interface MarketPrice {
    id: number;
    crop_id: number;
    crop_name?: string;
    crop_name_hindi?: string;
    market_name: string;
    price: number;
    previous_price?: number;
    change?: number;
    change_percent?: number;
    date: string;
    created_at: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    phone?: string;
    full_name: string;
    language_preference?: string;
}

export interface CropRecommendation {
    crop_id: number;
    name: string;
    name_hindi: string;
    season: string;
    score: number;
    profit_margin: number;
    estimated_yield_range: string;
    water_requirement: string;
    market_demand: string;
    climate_suitability: string;
    duration: string;
    difficulty: string;
    investment: number;
    risk_level: string;
    description: string;
}

export interface DashboardOverview {
    farm?: Farm | null;
    active_crop?: FarmCropCycle | null;
    latest_soil_test?: SoilTest | null;
    today_priority?: {
        title: string;
        description: string;
        recommended_time: string;
        priority: string;
    } | null;
    farm_vitals?: {
        soil_moisture: number;
        soil_ph: number;
        nitrogen: number;
        phosphorus: number;
        potassium: number;
    } | null;
    yield_forecast?: {
        crop_name: string;
        range_label: string;
        progress_percent: number;
        expected_harvest: string;
        estimated_income_range: string;
    } | null;
    weather?: any;
    market_alert?: MarketPrice | null;
    recommendation_preview?: CropRecommendation[];
}
