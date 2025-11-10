import { fetchDashboardData } from "../model/leaderboarddModel";

export async function getDashboardStats() {
  const data = await fetchDashboardData();
  return {
    ...data,
    completionRate: Math.round((data.activeProjects / 10) * 100),
  };
}