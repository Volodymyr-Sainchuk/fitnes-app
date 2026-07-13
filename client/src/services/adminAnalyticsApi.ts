import { get } from "./api.js";
import type {
  AnalyticsFilters,
  BookingsResponse,
  MembersResponse,
  MembershipsResponse,
  OverviewResponse,
  RevenueResponse,
} from "../features/admin-analytics/types";

function toQueryString(filters: AnalyticsFilters) {
  const params = new URLSearchParams();

  params.set("period", filters.period);
  if (filters.period === "custom") {
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
  }

  if (filters.membershipType) params.set("membershipType", filters.membershipType);
  if (filters.trainer) params.set("trainer", filters.trainer);
  if (filters.gender) params.set("gender", filters.gender);
  if (filters.age) params.set("age", filters.age);

  return params.toString();
}

async function fetchAnalytics<T>(endpoint: string, filters: AnalyticsFilters): Promise<T> {
  const query = toQueryString(filters);
  const response = await get(`/admin/analytics/${endpoint}${query ? `?${query}` : ""}`);
  return (response?.data ?? {}) as T;
}

export function fetchOverviewAnalytics(filters: AnalyticsFilters) {
  return fetchAnalytics<OverviewResponse>("overview", filters);
}

export function fetchMembersAnalytics(filters: AnalyticsFilters) {
  return fetchAnalytics<MembersResponse>("members", filters);
}

export function fetchMembershipsAnalytics(filters: AnalyticsFilters) {
  return fetchAnalytics<MembershipsResponse>("memberships", filters);
}

export function fetchRevenueAnalytics(filters: AnalyticsFilters) {
  return fetchAnalytics<RevenueResponse>("revenue", filters);
}

export function fetchBookingsAnalytics(filters: AnalyticsFilters) {
  return fetchAnalytics<BookingsResponse>("bookings", filters);
}
