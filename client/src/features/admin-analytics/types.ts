export type Trend = "up" | "down" | "flat";

export type DatePeriod = "7d" | "30d" | "3m" | "1y" | "custom";

export interface Comparison {
  value: number;
  trend: Trend;
  label: string;
}

export interface StatMetric {
  value: number;
  comparison: Comparison;
}

export interface AnalyticsPoint {
  label: string;
  value: number;
  month?: string;
}

export interface NameValuePoint {
  name: string;
  value: number;
}

export interface FilterOption {
  id: number;
  name: string;
}

export interface AnalyticsFilters {
  period: DatePeriod;
  startDate?: string;
  endDate?: string;
  membershipType?: string;
  trainer?: string;
  gender?: string;
  age?: string;
}

export interface OverviewResponse {
  stats: {
    totalMembers: StatMetric;
    activeMembers: StatMetric;
    newMembersThisMonth: StatMetric;
    expiredMemberships: StatMetric;
    totalMembershipRevenue: StatMetric;
    totalMembershipsSold: StatMetric;
    numberOfTrainers: StatMetric;
    numberOfBookings: StatMetric;
  };
  options: {
    membershipTypes: FilterOption[];
    trainers: FilterOption[];
  };
}

export interface MembersResponse {
  series: {
    newMembersPerMonth: AnalyticsPoint[];
    activeVsInactive: NameValuePoint[];
    ageGroups: NameValuePoint[];
    genderBreakdown: NameValuePoint[];
  };
  notes?: {
    age?: string;
    gender?: string;
  };
  recent: {
    registeredMembers: Array<{
      id: number;
      name: string;
      email: string;
      createdAt: string;
    }>;
  };
}

export interface MembershipsResponse {
  stats: {
    totalMembershipsSold: number;
    activeMemberships: number;
    expiredMemberships: number;
    averageMembershipPrice: number;
    monthlyIncome: number;
    yearlyIncome: number;
  };
  series: {
    salesPerMonth: AnalyticsPoint[];
    revenuePerMonth: AnalyticsPoint[];
    popularMembershipTypes: NameValuePoint[];
    activeVsExpired: NameValuePoint[];
    revenueByType: NameValuePoint[];
  };
  recent: {
    purchasedMemberships: Array<{
      id: number;
      membershipId: number | null;
      amount: number;
      status: string;
      createdAt: string;
    }>;
  };
}

export interface RevenueResponse {
  summary: {
    totalRevenue: number;
    monthlyIncome: number;
    yearlyIncome: number;
  };
  series: {
    revenuePerMonth: AnalyticsPoint[];
    revenueByMembershipType: NameValuePoint[];
  };
  recent: {
    payments: Array<{
      id: number;
      membershipId: number | null;
      amount: number;
      status: string;
      createdAt: string;
    }>;
  };
}

export interface BookingsResponse {
  summary: {
    totalBookings: number;
    activeBookings: number;
  };
  series: {
    bookingsPerMonth: AnalyticsPoint[];
  };
  recent: {
    bookings: Array<{
      id: number;
      status: string;
      createdAt: string;
      user?: {
        id: number;
        name: string;
        email: string;
      };
      fitness?: {
        id: number;
        title: string;
        dateTime: string;
      };
    }>;
  };
}
