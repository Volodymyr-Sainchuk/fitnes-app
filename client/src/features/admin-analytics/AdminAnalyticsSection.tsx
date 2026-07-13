import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import {
  Activity,
  BadgeDollarSign,
  BookOpenCheck,
  CalendarClock,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  fetchBookingsAnalytics,
  fetchMembersAnalytics,
  fetchMembershipsAnalytics,
  fetchOverviewAnalytics,
  fetchRevenueAnalytics,
} from "../../services/adminAnalyticsApi";
import type { AnalyticsFilters, DatePeriod } from "./types";
import StatCard from "./components/StatCard";
import LineChartCard from "./components/LineChartCard";
import PieChartCard from "./components/PieChartCard";
import RevenueChart from "./components/RevenueChart";
import MembersChart from "./components/MembersChart";
import AnalyticsCard from "./components/AnalyticsCard";
import EmptyChartState from "./components/EmptyChartState";

const periodOptions: Array<{ value: DatePeriod; label: string }> = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "3m", label: "Last 3 months" },
  { value: "1y", label: "Last year" },
  { value: "custom", label: "Custom date range" },
];

const genderOptions = ["All", "Male", "Female", "Other"];
const ageOptions = ["All", "18-24", "25-34", "35-44", "45-54", "55+"];

function formatCurrency(value: number) {
  return `${value.toLocaleString("uk-UA", { maximumFractionDigits: 0 })} грн`;
}

function formatShortDate(date: string) {
  return new Date(date).toLocaleDateString("uk-UA");
}

export default function AdminAnalyticsSection() {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    period: "30d",
    startDate: "",
    endDate: "",
    membershipType: "",
    trainer: "",
    gender: "",
    age: "",
  });

  const queryResults = useQueries({
    queries: [
      {
        queryKey: ["admin-analytics", "overview", filters],
        queryFn: () => fetchOverviewAnalytics(filters),
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ["admin-analytics", "members", filters],
        queryFn: () => fetchMembersAnalytics(filters),
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ["admin-analytics", "memberships", filters],
        queryFn: () => fetchMembershipsAnalytics(filters),
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ["admin-analytics", "revenue", filters],
        queryFn: () => fetchRevenueAnalytics(filters),
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ["admin-analytics", "bookings", filters],
        queryFn: () => fetchBookingsAnalytics(filters),
        staleTime: 1000 * 60 * 5,
      },
    ],
  });

  const [overviewQuery, membersQuery, membershipsQuery, revenueQuery, bookingsQuery] = queryResults;
  const isLoading = queryResults.some((query) => query.isLoading);
  const isError = queryResults.find((query) => query.error)?.error as Error | undefined;

  const overview = overviewQuery.data;
  const members = membersQuery.data;
  const memberships = membershipsQuery.data;
  const revenue = revenueQuery.data;
  const bookings = bookingsQuery.data;

  const filterOptions = overview?.options;

  const recentActivity = useMemo(
    () => ({
      latestMembers: members?.recent?.registeredMembers ?? [],
      latestMemberships: memberships?.recent?.purchasedMemberships ?? [],
      latestBookings: bookings?.recent?.bookings ?? [],
      latestPayments: revenue?.recent?.payments ?? [],
    }),
    [
      bookings?.recent?.bookings,
      members?.recent?.registeredMembers,
      memberships?.recent?.purchasedMemberships,
      revenue?.recent?.payments,
    ],
  );

  if (isLoading) {
    return <p className="helper-text">Завантаження аналітики...</p>;
  }

  if (isError) {
    return <p className="form-error">{isError.message || "Не вдалося завантажити аналітику"}</p>;
  }

  if (!overview || !members || !memberships || !revenue || !bookings) {
    return <p className="helper-text">Аналітичні дані поки недоступні.</p>;
  }

  const stats = overview.stats;

  return (
    <section className="admin-analytics-section">
      <div className="admin-analytics-filters info-card">
        <div className="section-title compact">
          <p className="section-eyebrow">Analytics Filters</p>
          <h2>Фільтри аналітики</h2>
        </div>

        <div className="analytics-filter-grid">
          <label className="field">
            <span className="field-label">Date Range</span>
            <select
              value={filters.period}
              onChange={(event) => setFilters((current) => ({ ...current, period: event.target.value as DatePeriod }))}
            >
              {periodOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          {filters.period === "custom" ? (
            <>
              <label className="field">
                <span className="field-label">Start Date</span>
                <input
                  type="date"
                  className="field-input"
                  value={filters.startDate}
                  onChange={(event) => setFilters((current) => ({ ...current, startDate: event.target.value }))}
                />
              </label>
              <label className="field">
                <span className="field-label">End Date</span>
                <input
                  type="date"
                  className="field-input"
                  value={filters.endDate}
                  onChange={(event) => setFilters((current) => ({ ...current, endDate: event.target.value }))}
                />
              </label>
            </>
          ) : null}

          <label className="field">
            <span className="field-label">Membership Type</span>
            <select
              value={filters.membershipType}
              onChange={(event) => setFilters((current) => ({ ...current, membershipType: event.target.value }))}
            >
              <option value="">All</option>
              {filterOptions?.membershipTypes?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field-label">Trainer</span>
            <select
              value={filters.trainer}
              onChange={(event) => setFilters((current) => ({ ...current, trainer: event.target.value }))}
            >
              <option value="">All</option>
              {filterOptions?.trainers?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field-label">Gender</span>
            <select
              value={filters.gender || "All"}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  gender: event.target.value === "All" ? "" : event.target.value,
                }))
              }
            >
              {genderOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field-label">Age</span>
            <select
              value={filters.age || "All"}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  age: event.target.value === "All" ? "" : event.target.value,
                }))
              }
            >
              {ageOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="admin-analytics-stats-grid">
        <StatCard
          icon={<Users size={20} />}
          title="Total Members"
          value={stats.totalMembers.value}
          comparison={stats.totalMembers.comparison}
        />
        <StatCard
          icon={<UserCheck size={20} />}
          title="Active Members"
          value={stats.activeMembers.value}
          comparison={stats.activeMembers.comparison}
        />
        <StatCard
          icon={<CalendarClock size={20} />}
          title="New Members This Month"
          value={stats.newMembersThisMonth.value}
          comparison={stats.newMembersThisMonth.comparison}
        />
        <StatCard
          icon={<ShieldCheck size={20} />}
          title="Expired Memberships"
          value={stats.expiredMemberships.value}
          comparison={stats.expiredMemberships.comparison}
        />
        <StatCard
          icon={<BadgeDollarSign size={20} />}
          title="Total Membership Revenue"
          value={stats.totalMembershipRevenue.value}
          comparison={stats.totalMembershipRevenue.comparison}
          valueFormatter={formatCurrency}
        />
        <StatCard
          icon={<BookOpenCheck size={20} />}
          title="Total Memberships Sold"
          value={stats.totalMembershipsSold.value}
          comparison={stats.totalMembershipsSold.comparison}
        />
        <StatCard
          icon={<GraduationCap size={20} />}
          title="Number of Trainers"
          value={stats.numberOfTrainers.value}
          comparison={stats.numberOfTrainers.comparison}
        />
        <StatCard
          icon={<Activity size={20} />}
          title="Number of Bookings"
          value={stats.numberOfBookings.value}
          comparison={stats.numberOfBookings.comparison}
        />
      </div>

      <div className="admin-analytics-grid two-col">
        <LineChartCard
          title="New members per month"
          subtitle="Member registrations trend"
          data={members.series.newMembersPerMonth}
          lineLabel="Нові учасники"
        />
        <PieChartCard
          title="Active vs Inactive Members"
          subtitle="Activity split"
          data={members.series.activeVsInactive}
          donut
        />
        <MembersChart title="Members by age group" data={members.series.ageGroups} />
        <PieChartCard
          title="Members by gender"
          subtitle={members.notes?.gender}
          data={members.series.genderBreakdown}
          donut
        />
      </div>

      <div className="admin-analytics-grid two-col">
        <AnalyticsCard title="Membership sales per month" subtitle="Кількість продажів абонементів">
          {memberships.series.salesPerMonth.length === 0 ? (
            <EmptyChartState message="Продажі за обраний період відсутні." />
          ) : (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={290}>
                <BarChart data={memberships.series.salesPerMonth} margin={{ top: 12, right: 16, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
                  <XAxis dataKey="label" stroke="var(--muted)" />
                  <YAxis stroke="var(--muted)" />
                  <Tooltip
                    contentStyle={{
                      background: "var(--panel)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      color: "var(--text)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="value"
                    name="Продажі"
                    fill="var(--accent)"
                    radius={[8, 8, 0, 0]}
                    animationDuration={780}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </AnalyticsCard>

        <RevenueChart title="Revenue per month" data={memberships.series.revenuePerMonth} />

        <PieChartCard
          title="Most popular membership type"
          subtitle="Порівняння типів абонементів"
          data={memberships.series.popularMembershipTypes}
        />
        <PieChartCard
          title="Active vs Expired memberships"
          subtitle="Статус проданих абонементів"
          data={memberships.series.activeVsExpired}
          donut
        />

        <AnalyticsCard title="Revenue by membership type" subtitle="Горизонтальний зріз по типах">
          {memberships.series.revenueByType.length === 0 ? (
            <EmptyChartState message="Немає доходу для відображення." />
          ) : (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={memberships.series.revenueByType}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 16, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
                  <XAxis type="number" stroke="var(--muted)" />
                  <YAxis dataKey="name" type="category" stroke="var(--muted)" width={130} />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value ?? 0))}
                    contentStyle={{
                      background: "var(--panel)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      color: "var(--text)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Дохід" fill="#5bc0ff" radius={[0, 8, 8, 0]} animationDuration={760} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </AnalyticsCard>

        <AnalyticsCard title="Membership Statistics" subtitle="Ключові метрики абонементів">
          <div className="analytics-kpi-grid">
            <div>
              <span>Total memberships sold</span>
              <strong>{memberships.stats.totalMembershipsSold.toLocaleString("uk-UA")}</strong>
            </div>
            <div>
              <span>Active memberships</span>
              <strong>{memberships.stats.activeMemberships.toLocaleString("uk-UA")}</strong>
            </div>
            <div>
              <span>Expired memberships</span>
              <strong>{memberships.stats.expiredMemberships.toLocaleString("uk-UA")}</strong>
            </div>
            <div>
              <span>Average membership price</span>
              <strong>{formatCurrency(memberships.stats.averageMembershipPrice)}</strong>
            </div>
            <div>
              <span>Monthly income</span>
              <strong>{formatCurrency(memberships.stats.monthlyIncome)}</strong>
            </div>
            <div>
              <span>Yearly income</span>
              <strong>{formatCurrency(memberships.stats.yearlyIncome)}</strong>
            </div>
          </div>
        </AnalyticsCard>
      </div>

      <div className="admin-analytics-grid two-col">
        <RevenueChart title="Revenue overview" data={revenue.series.revenuePerMonth} />
        <AnalyticsCard title="Bookings volume" subtitle="Динаміка бронювань по місяцях">
          {bookings.series.bookingsPerMonth.length === 0 ? (
            <EmptyChartState message="Бронювання за період відсутні." />
          ) : (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={290}>
                <LineChartCardRenderer data={bookings.series.bookingsPerMonth} />
              </ResponsiveContainer>
            </div>
          )}
        </AnalyticsCard>
      </div>

      <div className="admin-analytics-grid two-col">
        <AnalyticsCard title="Recent Activity" subtitle="Latest registered members">
          <ul className="activity-list">
            {recentActivity.latestMembers.length === 0 ? (
              <li className="activity-empty">No recent members</li>
            ) : (
              recentActivity.latestMembers.map((item) => (
                <li key={item.id}>
                  <span>{item.name}</span>
                  <small>{item.email}</small>
                  <time>{formatShortDate(item.createdAt)}</time>
                </li>
              ))
            )}
          </ul>
        </AnalyticsCard>

        <AnalyticsCard title="Latest purchased memberships" subtitle="Останні покупки абонементів">
          <ul className="activity-list">
            {recentActivity.latestMemberships.length === 0 ? (
              <li className="activity-empty">No membership purchases</li>
            ) : (
              recentActivity.latestMemberships.map((item) => (
                <li key={item.id}>
                  <span>Payment #{item.id}</span>
                  <small>{formatCurrency(item.amount)}</small>
                  <time>{formatShortDate(item.createdAt)}</time>
                </li>
              ))
            )}
          </ul>
        </AnalyticsCard>

        <AnalyticsCard title="Latest bookings" subtitle="Останні бронювання тренувань">
          <ul className="activity-list">
            {recentActivity.latestBookings.length === 0 ? (
              <li className="activity-empty">No recent bookings</li>
            ) : (
              recentActivity.latestBookings.map((item) => (
                <li key={item.id}>
                  <span>{item.user?.name || "Member"}</span>
                  <small>{item.fitness?.title || "Class"}</small>
                  <time>{formatShortDate(item.createdAt)}</time>
                </li>
              ))
            )}
          </ul>
        </AnalyticsCard>

        <AnalyticsCard title="Latest payments" subtitle="Останні фінансові операції">
          <ul className="activity-list">
            {recentActivity.latestPayments.length === 0 ? (
              <li className="activity-empty">No recent payments</li>
            ) : (
              recentActivity.latestPayments.map((item) => (
                <li key={item.id}>
                  <span>{item.status || "PENDING"}</span>
                  <small>{formatCurrency(item.amount)}</small>
                  <time>{formatShortDate(item.createdAt)}</time>
                </li>
              ))
            )}
          </ul>
        </AnalyticsCard>
      </div>
    </section>
  );
}

function LineChartCardRenderer({ data }: { data: Array<{ label: string; value: number }> }) {
  return (
    <BarChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 4 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
      <XAxis dataKey="label" stroke="var(--muted)" />
      <YAxis stroke="var(--muted)" />
      <Tooltip
        contentStyle={{
          background: "var(--panel)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          color: "var(--text)",
        }}
      />
      <Legend />
      <Bar dataKey="value" name="Бронювання" fill="#34d399" radius={[8, 8, 0, 0]} animationDuration={760} />
    </BarChart>
  );
}
