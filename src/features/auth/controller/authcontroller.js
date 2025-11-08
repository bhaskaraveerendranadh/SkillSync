import { loginApi, markOnboardingComplete } from "../model/authModel";

/**
 * Handles user login
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<{ success: boolean, message?: string, token?: string, user?: Object }>}
 */
export async function loginUser(credentials) {
  try {
    // Input validation
    if (!credentials.email || !credentials.password) {
      return { success: false, message: "Email and password are required" };
    }

    if (!credentials.email.includes('@')) {
      return { success: false, message: "Please enter a valid email" };
    }

    if (credentials.password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters" };
    }

    // Call login API
    const res = await loginApi(credentials);
    
    if (res.success && res.user) {
      // Store auth token and user info
      localStorage.setItem('authToken', res.token || 'dummy-token');
      localStorage.setItem('userEmail', credentials.email);
      
      return {
        ...res,
        isNewUser: !res.user.hasCompletedOnboarding
      };
    }

    return { 
      success: false, 
      message: res.message || "Invalid credentials" 
    };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      message: "An error occurred during login" 
    };
  }
}

/**
 * Completes the onboarding process for a user
 * @param {string} email - The email of the user completing onboarding
 * @returns {Promise<void>}
 */
export async function completeOnboarding(email) {
  // Mark onboarding complete in the backend
  markOnboardingComplete(email);
  
  // Update localStorage to reflect the change immediately
  localStorage.setItem('onboardingComplete', 'true');
  
  // Re-login to update the user session
  const storedEmail = localStorage.getItem('userEmail');
  const storedToken = localStorage.getItem('authToken');
  
  if (storedEmail && storedToken) {
    await loginApi({ email: storedEmail, password: 'dummy' }); // Password not needed for refresh
  }
}
