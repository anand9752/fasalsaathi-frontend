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
    managed_crops?: ManagedCrop[];
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

export interface ManagedCrop {
    id: number;
    farm_id: number;
    farm_name: string;
    name: string;
    name_hindi: string;
    crop_type: string;
    season: string;
    duration: number;
    area: number;
    estimated_cost: number;
    estimated_profit: number;
    expected_yield?: number | null;
    risk_level: string;
    status: string;
    sowing_date?: string | null;
    expected_harvest_date?: string | null;
    actual_harvest_date?: string | null;
    variety?: string | null;
    water_requirement: string;
    soil_preference: string;
    description: string;
    notes: string;
    created_at: string;
    updated_at: string;
}

export interface ManagedCropCreatePayload {
    farm_id: number;
    name: string;
    name_hindi: string;
    crop_type: string;
    season?: string;
    duration: number;
    area: number;
    estimated_cost: number;
    estimated_profit: number;
    expected_yield?: number | null;
    risk_level: string;
    status?: string;
    sowing_date?: string | null;
    expected_harvest_date?: string | null;
    actual_harvest_date?: string | null;
    variety?: string | null;
    water_requirement?: string;
    soil_preference?: string;
    description?: string;
    notes?: string;
}

export interface ManagedCropUpdatePayload extends Partial<ManagedCropCreatePayload> {}

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
    soil_ph: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    organic_matter: number;
    soil_moisture: number;
    temperature: number;
    test_date: string;
    created_at: string;
    updated_at: string;
}

export interface SoilTestCreatePayload {
    farm_id: number;
    soil_ph: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    soil_moisture: number;
    temperature: number;
}

export interface WeatherCondition {
    main: string;
    description: string;
    icon: string;
}

export interface WeatherCurrentResponse {
    location: string;
    recorded_at: string;
    weather: WeatherCondition[];
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
    };
    wind: {
        speed: number;
    };
    rainfall: number;
    source: "live" | "cache" | "fallback";
    is_stale: boolean;
}

export interface WeatherForecastResponse {
    location: string;
    forecast: Array<{
        recorded_at: string;
        weather: WeatherCondition[];
        main: {
            temp: number;
            feels_like: number;
            humidity: number;
        };
        wind: {
            speed: number;
        };
        rainfall: number;
    }>;
    source: "live" | "cache" | "fallback";
    is_stale: boolean;
}

export interface FarmCalendarCropContext {
    crop_id: number;
    crop_name: string;
    crop_name_hindi: string;
    season: string;
    sowing_date: string;
    expected_harvest_date: string;
    days_since_sowing: number;
    total_duration_days: number;
    current_stage: string;
    current_stage_hindi: string;
    stage_progress_percent: number;
}

export interface FarmCalendarHealthMetric {
    key: string;
    label: string;
    value: number;
    unit: string;
    status: "good" | "warning" | "critical" | "info";
    note: string;
}

export interface FarmCalendarTimelineItem {
    name: string;
    name_hindi: string;
    start_day: number;
    end_day: number;
    is_current: boolean;
}

export interface FarmCalendarRecommendation {
    title: string;
    message: string;
    priority: "critical" | "high" | "medium" | "info";
}

export interface FarmCalendarTask {
    id: string;
    date: string;
    task: string;
    task_hindi: string;
    category: "irrigation" | "fertilizer" | "pest" | "weather" | "milestone" | "general";
    priority: "critical" | "high" | "medium" | "info" | "optimal";
    reason: string;
    recommendation: string;
    suggested_time?: string | null;
}

export interface FarmCalendarWeatherAlert {
    title: string;
    message: string;
    priority: "critical" | "high" | "medium" | "info";
}

export interface FarmCalendarWeatherSnapshot {
    location: string;
    rainfall: number;
    forecast_rainfall: number;
    temperature: number;
    humidity: number;
    wind_speed: number;
    summary: string;
    source: "live" | "cache" | "fallback";
    is_stale: boolean;
}

export interface FarmCalendarResponse {
    farm_id: number;
    generated_at: string;
    crop_context?: FarmCalendarCropContext | null;
    weather: FarmCalendarWeatherSnapshot;
    farm_health: FarmCalendarHealthMetric[];
    growth_timeline: FarmCalendarTimelineItem[];
    recommendations: FarmCalendarRecommendation[];
    weather_alerts: FarmCalendarWeatherAlert[];
    tasks: FarmCalendarTask[];
}

export interface MarketPrice {
    id: string;
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
    state?: string;
    district?: string;
    variety?: string;
    min_price?: number;
    max_price?: number;
    modal_price?: number;
    source?: string;
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
    season?: string | null;
    score?: number | null;
    profit_margin: number;
    estimated_yield_range: string;
    water_requirement: string;
    market_demand: string;
    climate_suitability: string;
    duration: string;
    investment: number;
    risk_level: string;
    description: string;
}

export interface CropRecommendationRequest {
    soil_ph: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    soil_moisture: number;
    temperature: number;
    rainfall: number;
    location: string;
}

export interface CropDetailResponse {
    crop_name: string;
    crop_name_hindi: string;
    overview: string;
    land_preparation: string[];
    sowing_time: string[];
    irrigation_schedule: string[];
    fertilizers: string[];
    pesticides: string[];
    harvesting: string[];
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
        temperature: number;
        rainfall: number;
        climate_summary: string;
    } | null;
    yield_forecast?: {
        crop_name: string;
        range_label: string;
        progress_percent: number;
        expected_harvest: string;
        estimated_income_range: string;
    } | null;
    weather?: WeatherCurrentResponse | null;
    market_alert?: MarketPrice | null;
    recommendation_preview?: CropRecommendation[];
}

export interface KisanNewsArticle {
    title: string;
    description?: string | null;
    link: string;
    image_url?: string | null;
    pubDate?: string | null;
    tags: string[];
}

export interface KisanNewsResponse {
    articles: KisanNewsArticle[];
    source: "live" | "cache" | "none";
    is_stale: boolean;
    refreshed_at?: string | null;
    message: string;
}

export type InventoryCategory = 'fertilizer' | 'seeds' | 'pesticide' | 'equipment' | 'other';

export interface InventoryItem {
    id: number;
    owner_id: number;
    name: string;
    name_hindi: string;
    category: InventoryCategory;
    quantity: number;
    unit: string;
    low_stock_threshold: number;
    cost: number;
    supplier: string;
    expiry_date?: string | null;
    is_low_stock: boolean;
    created_at: string;
    updated_at: string;
}

export interface InventoryItemCreate {
    name: string;
    name_hindi?: string;
    category: InventoryCategory;
    quantity: number;
    unit: string;
    low_stock_threshold?: number;
    cost?: number;
    supplier?: string;
    expiry_date?: string | null;
}

export interface InventoryItemUpdate {
    name?: string;
    name_hindi?: string;
    category?: InventoryCategory;
    quantity?: number;
    unit?: string;
    low_stock_threshold?: number;
    cost?: number;
    supplier?: string;
    expiry_date?: string | null;
}

export interface InventoryStats {
    total_items: number;
    low_stock_count: number;
    total_value: number;
    categories_count: number;
}
