// src/features/auth/controller/authController.js

import { loginApi, registerApi } from "../model/authModel.js";
import.meta.env.VITE_BASE_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * LOGIN USER
 */
export async function loginUser(credentials) {
  try {
    if (!credentials.email || !credentials.password) {
      return { success: false, message: "Email and password are required" };
    }

    const res = await loginApi(`${BASE_URL}/auth/login`, {
      email: credentials.email,
      password: credentials.password,
    });

    if (res.id || res.name) {
      if (res.token) localStorage.setItem("authToken", res.token);
      return { success: true, message: "Login successful!" };
    }

    return { success: false, message: res.detail || "Invalid credentials" };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "An error occurred during login" };
  }
}

/**
 * REGISTER USER
 */
export async function registerUser(data) {
  try {
    if (!data.email || !data.name || !data.password || !data.university) {
      return { success: false, message: "All fields are required" };
    }

    const res = await registerApi(`${BASE_URL}/auth/register`, {
      email: data.email,
      name: data.name,
      password: data.password,
      university: data.university,
    });

    if (res.id) {
      return { success: true, message: "Registration successful!" };
    }

    return { success: false, message: res.detail || "Registration failed" };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: "An error occurred during registration" };
  }
}

/**
 * FETCH UNIVERSITY SUGGESTIONS (India Only)
 * @param {string} query - User-typed university name
 * @returns {Promise<string[]>} - List of up to 5 suggestions
 */
export async function fetchUniversitySuggestions(query) {
  if (!query || query.length < 2) return [];

  try {
    const res = await fetch(
      `http://universities.hipolabs.com/search?country=India&name=${encodeURIComponent(
        query
      )}`
    );
    const data = await res.json();

    // Filter for India universities only
    const names = data
      .filter((u) => u.country === "India")
      .map((u) => u.name);

    return names.slice(0, 5);
  } catch (error) {
    console.error("Error fetching universities:", error);
    return [];
  }
}
