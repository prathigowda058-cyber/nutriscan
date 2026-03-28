import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Vitamins {
    b12: bigint;
    iron: bigint;
    vitC: bigint;
    vitD: bigint;
    calcium: bigint;
    zinc: bigint;
}
export interface UserProfile {
    age: bigint;
    region: string;
    weight: bigint;
    height: bigint;
    name: string;
    language: string;
    dietType: string;
}
export interface HealthEntry {
    mood: string;
    notes: string;
    timestamp: bigint;
    healthScore: bigint;
    vitamins: Vitamins;
}
export interface GameStats {
    badges: Array<string>;
    longestStreak: bigint;
    healthScore: bigint;
    lastCheckIn: bigint;
    currentStreak: bigint;
}
export interface MealItem {
    kcal: bigint;
    name: string;
    nutrients: string;
}
export interface DietPlan {
    date: bigint;
    breakfast: Array<MealItem>;
    totalKcal: bigint;
    lunch: Array<MealItem>;
    snacks: Array<MealItem>;
    dinner: Array<MealItem>;
}
export interface SunlightLog {
    date: bigint;
    uvIndex: bigint;
    recommendation: string;
    outdoorMinutes: bigint;
}
export interface ChatMessage {
    content: string;
    role: string;
    language: string;
    timestamp: bigint;
}
export interface AnalysisResult {
    moduleName: string;
    explanation: string;
    timestamp: bigint;
    findings: Array<string>;
    confidence: bigint;
    deficiencies: Array<string>;
}
export interface DoctorSuggestion {
    name: string;
    available: boolean;
    specialty: string;
    phone: string;
    location: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addChatMessage(message: ChatMessage): Promise<void>;
    addDoctorSuggestions(suggestions: Array<DoctorSuggestion>): Promise<void>;
    addHealthEntry(entry: HealthEntry): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrUpdateProfile(profile: UserProfile): Promise<void>;
    getAnalysisHistory(): Promise<Array<AnalysisResult>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatHistory(): Promise<Array<ChatMessage>>;
    getDietPlan(date: bigint): Promise<DietPlan | null>;
    getDoctorSuggestions(): Promise<Array<DoctorSuggestion>>;
    getGameStats(): Promise<GameStats | null>;
    getHealthTimeline(): Promise<Array<HealthEntry>>;
    getProfile(user: Principal): Promise<UserProfile>;
    getSunlightHistory(): Promise<Array<SunlightLog>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    logSunlight(log: SunlightLog): Promise<void>;
    saveAnalysisResult(result: AnalysisResult): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveDietPlan(plan: DietPlan): Promise<void>;
    updateGameStats(stats: GameStats): Promise<void>;
}
