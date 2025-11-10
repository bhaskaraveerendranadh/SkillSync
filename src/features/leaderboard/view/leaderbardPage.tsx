import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../controller/leaderboardController";

interface DashboardData {
  totalUsers: number;
  activeProjects: number;
  pendingTasks: number;
  completionRate: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const data = await getDashboardStats();
      setStats(data);
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;
  }

  if (!stats) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>No data available.</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📊 Dashboard</h1>
      <div style={styles.cardContainer}>
        <div style={styles.card}>
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div style={styles.card}>
          <h3>Active Projects</h3>
          <p>{stats.activeProjects}</p>
        </div>
        <div style={styles.card}>
          <h3>Pending Tasks</h3>
          <p>{stats.pendingTasks}</p>
        </div>
        <div style={styles.card}>
          <h3>Completion Rate</h3>
          <p>{stats.completionRate}%</p>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "2rem",
    textAlign: "center",
  },
  title: {
    marginBottom: "2rem",
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "1.5rem",
  },
  card: {
    width: "200px",
    padding: "1rem",
    borderRadius: "10px",
    backgroundColor: "#f3f3f3",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
};

export default Dashboard;