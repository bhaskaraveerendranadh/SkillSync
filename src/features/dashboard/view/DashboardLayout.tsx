// src/features/dashboard/view/DashboardLayout.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../navbar/view/navbar";
import DashBoardScreen from "./dashBoardScreen";
import ProfilePage from "../../profile/view/profilePage";
import TeamPage from "../../teams/view/teamsPage";
import LeaderboardPage from "../../leaderboard/view/leaderboardPage";
import "../styles/dashboard.css";

export default function DashboardLayout() {
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();

  // Mock authentication check
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Example: change according to your auth logic

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  let PageComponent = DashBoardScreen;
  if (activePage === "profile") PageComponent = ProfilePage;
  if (activePage === "teams") PageComponent = TeamPage;
  if (activePage === "leaderboard") PageComponent = LeaderboardPage;

  if (!isLoggedIn) return null; // Prevent rendering before redirect

  return (
    <div style={{ display: "flex" }}>
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <div style={{ flex: 1, marginLeft: 240 }}>
        <PageComponent />
      </div>
    </div>
  );
}
