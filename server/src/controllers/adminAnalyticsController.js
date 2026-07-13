import { Prisma } from "@prisma/client";
import prisma from "../config/db.js";

const PERIOD_MAP = {
  "7d": 7,
  "30d": 30,
  "3m": 90,
  "1y": 365,
};

function toNumber(value) {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function startOfMonth(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0));
}

function endOfMonth(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 23, 59, 59, 999));
}

function parseDate(value, fallback) {
  if (!value) return fallback;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function parseFilters(query) {
  const now = new Date();
  const period = query.period === "custom" || (query.period && PERIOD_MAP[query.period]) ? query.period : "30d";
  const days = PERIOD_MAP[period] || PERIOD_MAP["30d"];
  const fallbackStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const startDate = period === "custom" ? parseDate(query.startDate, fallbackStart) : fallbackStart;
  const endDate = period === "custom" ? parseDate(query.endDate, now) : now;

  const membershipId = toNumber(query.membershipType || query.membershipId);
  const trainerId = toNumber(query.trainer);
  const gender = query.gender || null;
  const age = query.age || null;
  const ageMin = toNumber(query.ageMin);
  const ageMax = toNumber(query.ageMax);

  return {
    period,
    startDate,
    endDate,
    membershipId,
    trainerId,
    gender,
    age,
    ageMin,
    ageMax,
    unsupportedFilters: [...(gender ? ["gender"] : []), ...(age || ageMin !== null || ageMax !== null ? ["age"] : [])],
  };
}

function buildChange(current, previous) {
  if (previous === 0) {
    if (current === 0) return { value: 0, trend: "flat", label: "без змін" };
    return { value: 100, trend: "up", label: "+100% vs prev month" };
  }
  const change = ((current - previous) / Math.abs(previous)) * 100;
  const rounded = Number(change.toFixed(1));
  const trend = rounded > 0 ? "up" : rounded < 0 ? "down" : "flat";
  const sign = rounded > 0 ? "+" : "";
  return { value: rounded, trend, label: `${sign}${rounded}% vs prev month` };
}

function monthLabel(dateValue) {
  return new Intl.DateTimeFormat("uk-UA", { month: "short", year: "2-digit", timeZone: "UTC" }).format(dateValue);
}

function normalizeMonthlyRows(startDate, endDate, rows, valueKey) {
  const bucketMap = new Map();
  for (const row of rows) {
    const monthKey = new Date(row.month).toISOString().slice(0, 7);
    bucketMap.set(monthKey, Number(row[valueKey] || 0));
  }

  const start = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), 1));
  const end = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), 1));
  const points = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    const key = cursor.toISOString().slice(0, 7);
    points.push({
      month: key,
      label: monthLabel(cursor),
      value: bucketMap.get(key) ?? 0,
    });
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }

  return points;
}

async function fetchFilterOptions() {
  const [membershipTypes, trainers] = await Promise.all([
    prisma.membership.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.trainer.findMany({
      select: { id: true, user: { select: { name: true } } },
      orderBy: { id: "asc" },
    }),
  ]);

  return {
    membershipTypes,
    trainers: trainers.map((item) => ({ id: item.id, name: item.user?.name || `Trainer #${item.id}` })),
  };
}

async function getMonthComparisonWindow() {
  const now = new Date();
  const currentStart = startOfMonth(now);
  const currentEnd = now;
  const previousStart = startOfMonth(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)));
  const previousEnd = endOfMonth(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)));
  return { currentStart, currentEnd, previousStart, previousEnd };
}

async function countActiveMembers(from, to, trainerId = null) {
  const trainerClause = trainerId ? Prisma.sql`AND fc."trainerId" = ${trainerId}` : Prisma.empty;
  const rows = await prisma.$queryRaw(Prisma.sql`
    SELECT COUNT(DISTINCT b."userId")::int AS value
    FROM "Booking" b
    INNER JOIN "FitnessClass" fc ON fc."id" = b."classId"
    WHERE b."status" = 'ACTIVE'
      AND b."createdAt" >= ${from}
      AND b."createdAt" <= ${to}
      ${trainerClause}
  `);
  return Number(rows?.[0]?.value || 0);
}

async function countExpiredMemberships(from, to, membershipId = null) {
  const membershipClause = membershipId ? Prisma.sql`AND p."membershipId" = ${membershipId}` : Prisma.empty;
  const rows = await prisma.$queryRaw(Prisma.sql`
    SELECT COUNT(*)::int AS value
    FROM "Payment" p
    LEFT JOIN "Membership" m ON m."id" = p."membershipId"
    WHERE p."membershipId" IS NOT NULL
      AND (p."createdAt" + (COALESCE(m."durationDays", 0) || ' days')::interval) >= ${from}
      AND (p."createdAt" + (COALESCE(m."durationDays", 0) || ' days')::interval) <= ${to}
      ${membershipClause}
  `);
  return Number(rows?.[0]?.value || 0);
}

async function sumRevenue(from, to, membershipId = null) {
  const membershipClause = membershipId ? Prisma.sql`AND p."membershipId" = ${membershipId}` : Prisma.empty;
  const rows = await prisma.$queryRaw(Prisma.sql`
    SELECT COALESCE(SUM(p."amount"), 0)::float AS value
    FROM "Payment" p
    WHERE p."membershipId" IS NOT NULL
      AND p."createdAt" >= ${from}
      AND p."createdAt" <= ${to}
      ${membershipClause}
  `);
  return Number(rows?.[0]?.value || 0);
}

async function countMembershipSales(from, to, membershipId = null) {
  const membershipClause = membershipId ? Prisma.sql`AND p."membershipId" = ${membershipId}` : Prisma.empty;
  const rows = await prisma.$queryRaw(Prisma.sql`
    SELECT COUNT(*)::int AS value
    FROM "Payment" p
    WHERE p."membershipId" IS NOT NULL
      AND p."createdAt" >= ${from}
      AND p."createdAt" <= ${to}
      ${membershipClause}
  `);
  return Number(rows?.[0]?.value || 0);
}

export async function overview(req, res, next) {
  try {
    const filters = parseFilters(req.query);
    const { currentStart, currentEnd, previousStart, previousEnd } = await getMonthComparisonWindow();

    const [
      totalMembers,
      newMembersCurrent,
      newMembersPrevious,
      activeMembersCurrent,
      activeMembersPrevious,
      expiredCurrent,
      expiredPrevious,
      revenueCurrent,
      revenuePrevious,
      totalRevenue,
      soldCurrent,
      soldPrevious,
      totalSold,
      trainers,
      trainersCurrent,
      trainersPrevious,
      bookingsTotal,
      bookingsCurrent,
      bookingsPrevious,
      options,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "MEMBER" } }),
      prisma.user.count({ where: { role: "MEMBER", createdAt: { gte: currentStart, lte: currentEnd } } }),
      prisma.user.count({ where: { role: "MEMBER", createdAt: { gte: previousStart, lte: previousEnd } } }),
      countActiveMembers(currentStart, currentEnd, filters.trainerId),
      countActiveMembers(previousStart, previousEnd, filters.trainerId),
      countExpiredMemberships(currentStart, currentEnd, filters.membershipId),
      countExpiredMemberships(previousStart, previousEnd, filters.membershipId),
      sumRevenue(currentStart, currentEnd, filters.membershipId),
      sumRevenue(previousStart, previousEnd, filters.membershipId),
      prisma.payment.aggregate({
        where: { membershipId: { not: null }, ...(filters.membershipId ? { membershipId: filters.membershipId } : {}) },
        _sum: { amount: true },
      }),
      countMembershipSales(currentStart, currentEnd, filters.membershipId),
      countMembershipSales(previousStart, previousEnd, filters.membershipId),
      prisma.payment.count({
        where: { membershipId: { not: null }, ...(filters.membershipId ? { membershipId: filters.membershipId } : {}) },
      }),
      prisma.trainer.count(),
      prisma.user.count({ where: { role: "TRAINER", createdAt: { gte: currentStart, lte: currentEnd } } }),
      prisma.user.count({ where: { role: "TRAINER", createdAt: { gte: previousStart, lte: previousEnd } } }),
      prisma.booking.count({}),
      prisma.booking.count({ where: { createdAt: { gte: currentStart, lte: currentEnd } } }),
      prisma.booking.count({ where: { createdAt: { gte: previousStart, lte: previousEnd } } }),
      fetchFilterOptions(),
    ]);

    const stats = {
      totalMembers: {
        value: totalMembers,
        comparison: buildChange(newMembersCurrent, newMembersPrevious),
      },
      activeMembers: {
        value: activeMembersCurrent,
        comparison: buildChange(activeMembersCurrent, activeMembersPrevious),
      },
      newMembersThisMonth: {
        value: newMembersCurrent,
        comparison: buildChange(newMembersCurrent, newMembersPrevious),
      },
      expiredMemberships: {
        value: expiredCurrent,
        comparison: buildChange(expiredCurrent, expiredPrevious),
      },
      totalMembershipRevenue: {
        value: Number(totalRevenue?._sum?.amount || 0),
        comparison: buildChange(revenueCurrent, revenuePrevious),
      },
      totalMembershipsSold: {
        value: totalSold,
        comparison: buildChange(soldCurrent, soldPrevious),
      },
      numberOfTrainers: {
        value: trainers,
        comparison: buildChange(trainersCurrent, trainersPrevious),
      },
      numberOfBookings: {
        value: bookingsTotal,
        comparison: buildChange(bookingsCurrent, bookingsPrevious),
      },
    };

    res.json({
      success: true,
      data: {
        stats,
        filtersApplied: filters,
        options,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function members(req, res, next) {
  try {
    const filters = parseFilters(req.query);
    const { startDate, endDate } = filters;

    const monthlyRows = await prisma.$queryRaw(Prisma.sql`
      SELECT date_trunc('month', u."createdAt") AS month, COUNT(*)::int AS count
      FROM "User" u
      WHERE u."role" = 'MEMBER'
        AND u."createdAt" >= ${startDate}
        AND u."createdAt" <= ${endDate}
      GROUP BY 1
      ORDER BY 1
    `);

    const totalMembers = await prisma.user.count({ where: { role: "MEMBER" } });
    const activeMembers = await countActiveMembers(startDate, endDate, filters.trainerId);

    const recentMembers = await prisma.user.findMany({
      where: { role: "MEMBER" },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, name: true, email: true, createdAt: true },
    });

    const ageGroups = [];
    const genderBreakdown = [];

    res.json({
      success: true,
      data: {
        series: {
          newMembersPerMonth: normalizeMonthlyRows(startDate, endDate, monthlyRows, "count"),
          activeVsInactive: [
            { name: "Активні", value: activeMembers },
            { name: "Неактивні", value: Math.max(totalMembers - activeMembers, 0) },
          ],
          ageGroups,
          genderBreakdown,
        },
        notes: {
          age: "Дані віку відсутні в моделі User.",
          gender: "Дані статі відсутні в моделі User.",
        },
        recent: {
          registeredMembers: recentMembers,
        },
        filtersApplied: filters,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function memberships(req, res, next) {
  try {
    const filters = parseFilters(req.query);
    const { startDate, endDate } = filters;
    const membershipClause = filters.membershipId
      ? Prisma.sql`AND p."membershipId" = ${filters.membershipId}`
      : Prisma.empty;

    const [salesRows, revenueRows, typeRows, statusRows, revenueByTypeRows, summaryRows, recentPurchases] =
      await Promise.all([
        prisma.$queryRaw(Prisma.sql`
          SELECT date_trunc('month', p."createdAt") AS month, COUNT(*)::int AS value
          FROM "Payment" p
          WHERE p."membershipId" IS NOT NULL
            AND p."createdAt" >= ${startDate}
            AND p."createdAt" <= ${endDate}
            ${membershipClause}
          GROUP BY 1
          ORDER BY 1
        `),
        prisma.$queryRaw(Prisma.sql`
          SELECT date_trunc('month', p."createdAt") AS month, COALESCE(SUM(p."amount"), 0)::float AS value
          FROM "Payment" p
          WHERE p."membershipId" IS NOT NULL
            AND p."createdAt" >= ${startDate}
            AND p."createdAt" <= ${endDate}
            ${membershipClause}
          GROUP BY 1
          ORDER BY 1
        `),
        prisma.$queryRaw(Prisma.sql`
          SELECT COALESCE(m."name", 'Unknown') AS name, COUNT(*)::int AS value
          FROM "Payment" p
          LEFT JOIN "Membership" m ON m."id" = p."membershipId"
          WHERE p."membershipId" IS NOT NULL
            AND p."createdAt" >= ${startDate}
            AND p."createdAt" <= ${endDate}
            ${membershipClause}
          GROUP BY 1
          ORDER BY 2 DESC
        `),
        prisma.$queryRaw(Prisma.sql`
          SELECT
            COUNT(*) FILTER (
              WHERE p."membershipId" IS NOT NULL
                AND (p."createdAt" + (COALESCE(m."durationDays", 0) || ' days')::interval) >= NOW()
            )::int AS active,
            COUNT(*) FILTER (
              WHERE p."membershipId" IS NOT NULL
                AND (p."createdAt" + (COALESCE(m."durationDays", 0) || ' days')::interval) < NOW()
            )::int AS expired
          FROM "Payment" p
          LEFT JOIN "Membership" m ON m."id" = p."membershipId"
          WHERE p."createdAt" >= ${startDate}
            AND p."createdAt" <= ${endDate}
            ${membershipClause}
        `),
        prisma.$queryRaw(Prisma.sql`
          SELECT COALESCE(m."name", 'Unknown') AS name, COALESCE(SUM(p."amount"), 0)::float AS value
          FROM "Payment" p
          LEFT JOIN "Membership" m ON m."id" = p."membershipId"
          WHERE p."membershipId" IS NOT NULL
            AND p."createdAt" >= ${startDate}
            AND p."createdAt" <= ${endDate}
            ${membershipClause}
          GROUP BY 1
          ORDER BY 2 DESC
        `),
        prisma.$queryRaw(Prisma.sql`
          SELECT
            COUNT(*) FILTER (WHERE p."membershipId" IS NOT NULL)::int AS total_sold,
            COUNT(*) FILTER (
              WHERE p."membershipId" IS NOT NULL
                AND (p."createdAt" + (COALESCE(m."durationDays", 0) || ' days')::interval) >= NOW()
            )::int AS active_sold,
            COUNT(*) FILTER (
              WHERE p."membershipId" IS NOT NULL
                AND (p."createdAt" + (COALESCE(m."durationDays", 0) || ' days')::interval) < NOW()
            )::int AS expired_sold,
            COALESCE(AVG(NULLIF(p."amount", 0)), 0)::float AS avg_price,
            COALESCE(SUM(p."amount") FILTER (
              WHERE date_trunc('month', p."createdAt") = date_trunc('month', NOW())
            ), 0)::float AS monthly_income,
            COALESCE(SUM(p."amount") FILTER (
              WHERE date_trunc('year', p."createdAt") = date_trunc('year', NOW())
            ), 0)::float AS yearly_income
          FROM "Payment" p
          LEFT JOIN "Membership" m ON m."id" = p."membershipId"
          WHERE p."createdAt" >= ${startDate}
            AND p."createdAt" <= ${endDate}
            ${membershipClause}
        `),
        prisma.payment.findMany({
          where: {
            membershipId: { not: null },
            ...(filters.membershipId ? { membershipId: filters.membershipId } : {}),
          },
          orderBy: { createdAt: "desc" },
          take: 8,
        }),
      ]);

    const summary = summaryRows?.[0] || {};
    const status = statusRows?.[0] || { active: 0, expired: 0 };

    res.json({
      success: true,
      data: {
        stats: {
          totalMembershipsSold: Number(summary.total_sold || 0),
          activeMemberships: Number(summary.active_sold || 0),
          expiredMemberships: Number(summary.expired_sold || 0),
          averageMembershipPrice: Number(summary.avg_price || 0),
          monthlyIncome: Number(summary.monthly_income || 0),
          yearlyIncome: Number(summary.yearly_income || 0),
        },
        series: {
          salesPerMonth: normalizeMonthlyRows(startDate, endDate, salesRows, "value"),
          revenuePerMonth: normalizeMonthlyRows(startDate, endDate, revenueRows, "value"),
          popularMembershipTypes: typeRows.map((row) => ({ name: row.name, value: Number(row.value || 0) })),
          activeVsExpired: [
            { name: "Активні", value: Number(status.active || 0) },
            { name: "Прострочені", value: Number(status.expired || 0) },
          ],
          revenueByType: revenueByTypeRows.map((row) => ({ name: row.name, value: Number(row.value || 0) })),
        },
        recent: {
          purchasedMemberships: recentPurchases,
        },
        filtersApplied: filters,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function revenue(req, res, next) {
  try {
    const filters = parseFilters(req.query);
    const { startDate, endDate } = filters;
    const membershipClause = filters.membershipId
      ? Prisma.sql`AND p."membershipId" = ${filters.membershipId}`
      : Prisma.empty;

    const [revenueRows, revenueByTypeRows, totals, latestPayments] = await Promise.all([
      prisma.$queryRaw(Prisma.sql`
        SELECT date_trunc('month', p."createdAt") AS month, COALESCE(SUM(p."amount"), 0)::float AS value
        FROM "Payment" p
        WHERE p."membershipId" IS NOT NULL
          AND p."createdAt" >= ${startDate}
          AND p."createdAt" <= ${endDate}
          ${membershipClause}
        GROUP BY 1
        ORDER BY 1
      `),
      prisma.$queryRaw(Prisma.sql`
        SELECT COALESCE(m."name", 'Unknown') AS name, COALESCE(SUM(p."amount"), 0)::float AS value
        FROM "Payment" p
        LEFT JOIN "Membership" m ON m."id" = p."membershipId"
        WHERE p."membershipId" IS NOT NULL
          AND p."createdAt" >= ${startDate}
          AND p."createdAt" <= ${endDate}
          ${membershipClause}
        GROUP BY 1
        ORDER BY 2 DESC
      `),
      prisma.$queryRaw(Prisma.sql`
        SELECT
          COALESCE(SUM(p."amount"), 0)::float AS total_revenue,
          COALESCE(SUM(p."amount") FILTER (
            WHERE date_trunc('month', p."createdAt") = date_trunc('month', NOW())
          ), 0)::float AS monthly_income,
          COALESCE(SUM(p."amount") FILTER (
            WHERE date_trunc('year', p."createdAt") = date_trunc('year', NOW())
          ), 0)::float AS yearly_income
        FROM "Payment" p
        WHERE p."membershipId" IS NOT NULL
          ${membershipClause}
      `),
      prisma.payment.findMany({
        where: {
          membershipId: { not: null },
          ...(filters.membershipId ? { membershipId: filters.membershipId } : {}),
        },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ]);

    const summary = totals?.[0] || {};

    res.json({
      success: true,
      data: {
        summary: {
          totalRevenue: Number(summary.total_revenue || 0),
          monthlyIncome: Number(summary.monthly_income || 0),
          yearlyIncome: Number(summary.yearly_income || 0),
        },
        series: {
          revenuePerMonth: normalizeMonthlyRows(startDate, endDate, revenueRows, "value"),
          revenueByMembershipType: revenueByTypeRows.map((row) => ({ name: row.name, value: Number(row.value || 0) })),
        },
        recent: {
          payments: latestPayments,
        },
        filtersApplied: filters,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function bookings(req, res, next) {
  try {
    const filters = parseFilters(req.query);
    const { startDate, endDate } = filters;
    const trainerClause = filters.trainerId ? Prisma.sql`AND fc."trainerId" = ${filters.trainerId}` : Prisma.empty;

    const [bookingsRows, totalsRows, recentBookings] = await Promise.all([
      prisma.$queryRaw(Prisma.sql`
        SELECT date_trunc('month', b."createdAt") AS month, COUNT(*)::int AS value
        FROM "Booking" b
        INNER JOIN "FitnessClass" fc ON fc."id" = b."classId"
        WHERE b."createdAt" >= ${startDate}
          AND b."createdAt" <= ${endDate}
          ${trainerClause}
        GROUP BY 1
        ORDER BY 1
      `),
      prisma.$queryRaw(Prisma.sql`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE b."status" = 'ACTIVE')::int AS active
        FROM "Booking" b
        INNER JOIN "FitnessClass" fc ON fc."id" = b."classId"
        WHERE b."createdAt" >= ${startDate}
          AND b."createdAt" <= ${endDate}
          ${trainerClause}
      `),
      prisma.booking.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          ...(filters.trainerId
            ? {
                fitness: {
                  is: {
                    trainerId: filters.trainerId,
                  },
                },
              }
            : {}),
        },
        orderBy: { createdAt: "desc" },
        take: 8,
        include: {
          user: { select: { id: true, name: true, email: true } },
          fitness: { select: { id: true, title: true, dateTime: true } },
        },
      }),
    ]);

    const totals = totalsRows?.[0] || { total: 0, active: 0 };

    res.json({
      success: true,
      data: {
        summary: {
          totalBookings: Number(totals.total || 0),
          activeBookings: Number(totals.active || 0),
        },
        series: {
          bookingsPerMonth: normalizeMonthlyRows(startDate, endDate, bookingsRows, "value"),
        },
        recent: {
          bookings: recentBookings,
        },
        filtersApplied: filters,
      },
    });
  } catch (err) {
    next(err);
  }
}
