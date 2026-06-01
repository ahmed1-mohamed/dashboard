
export interface UpcomingSessions {
    total: number;
    growth: number;
    trend: string;
    next_session: string;
}

export interface CompletedSessions {
    total: number;
    this_month: number;
    previous_period: number;
    growth: number;
    trend: string;
}

export interface MonthlyEarnings {
    last_month: number;
    previous_period: number;
    growth: number;
    trend: string;
}

export interface Rating {
    average: number;
    total_reviews: number;
}


export interface DashboardMetricsData {
    upcoming_sessions: UpcomingSessions;
    completed_sessions: CompletedSessions;
    monthly_earnings: MonthlyEarnings;
    rating: Rating;
}

export interface DashboardMetricsResponse {
    status: boolean;
    message: string;
    data: DashboardMetricsData;
}
