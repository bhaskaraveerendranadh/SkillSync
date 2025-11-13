import axios from "axios";
import { getOnboardingData } from "../model/onboardingModel";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

export type SubmitResult = {
  success: boolean;
  message: string;
};

export type SkillLevel = "beginner" | "intermediate" | "advanced";

export interface SelectedSkill {
  name: string;
  level: SkillLevel;
}

export async function submitInterests(
  userIdParam?: number,
  interestsOverride?: string[]
): Promise<SubmitResult> {
  try {
    const storedId = localStorage.getItem("userId");
    const userId =
      userIdParam !== undefined && userIdParam !== null
        ? userIdParam
        : storedId
        ? parseInt(storedId, 10)
        : null;

    if (!userId) {
      return { success: false, message: "User not logged in" };
    }

    const data = getOnboardingData();
    const interests = interestsOverride ?? data.interests ?? [];

    // dedupe
    const uniqueInterests = Array.from(new Set(interests));

    if (uniqueInterests.length === 0) {
      return { success: true, message: "No interests to save" };
    }

    const client = axios.create({
      baseURL: BASE_URL,
      withCredentials: false,
    });

    const interestRequests = uniqueInterests.map((interest) =>
      client.post(`/onboarding/${userId}/interest`, {
        interest_name: interest,
      })
    );

    await Promise.all(interestRequests);

    return { success: true, message: "Interests saved" };
  } catch (error) {
    console.error("submitInterests error:", error);
    return {
      success: false,
      message: "Failed to save interests",
    };
  }
}

export async function submitSkills(
  userIdParam?: number,
  skillsOverride?: SelectedSkill[]
): Promise<SubmitResult> {
  try {
    const storedId = localStorage.getItem("userId");
    const userId =
      userIdParam !== undefined && userIdParam !== null
        ? userIdParam
        : storedId
        ? parseInt(storedId, 10)
        : null;

    if (!userId) {
      return { success: false, message: "User not logged in" };
    }

    const data = getOnboardingData();
    const skills = skillsOverride ?? (data.skills as SelectedSkill[] | undefined) ?? [];

    if (!skills.length) {
      return { success: true, message: "No skills to save" };
    }

    const byName = new Map<string, SelectedSkill>();
    for (const s of skills) {
      if (!s || !s.name) continue;
      byName.set(s.name, s);
    }
    const uniqueSkills = Array.from(byName.values());

    const client = axios.create({
      baseURL: BASE_URL,
      withCredentials: false,
    });

    const skillRequests = uniqueSkills.map((skill) =>
      client.post(`/onboarding/${userId}/skills`, {
        skill_name: skill.name,
        proficiency_level: skill.level,
      })
    );

    await Promise.all(skillRequests);

    return { success: true, message: "Skills saved" };
  } catch (error) {
    console.error("submitSkills error:", error);
    return {
      success: false,
      message: "Failed to save skills",
    };
  }
}