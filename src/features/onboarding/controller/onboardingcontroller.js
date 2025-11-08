import { 
  saveSkills, 
  saveProjects, 
  saveInterests, 
  getSuggestedSkills, 
  getSuggestedInterests,
  getUserOnboardingData 
} from '../model/onboardingModel';

import { completeOnboarding } from '../../auth/controller/authcontroller';

/**
 * Controller for handling user skills during onboarding
 * @param {Array} skills - Array of skill objects
 * @returns {Promise<Object>} Response object with success status and data
 */
export async function handleSkillsSubmission(skills) {
  try {
    if (!Array.isArray(skills) || skills.length === 0) {
      return {
        success: false,
        message: 'Please add at least one skill'
      };
    }

    const response = await saveSkills(skills);
    return response;
  } catch (error) {
    console.error('Error saving skills:', error);
    return {
      success: false,
      message: 'An error occurred while saving skills'
    };
  }
}

/**
 * Controller for handling user projects during onboarding
 * @param {Array} projects - Array of project objects
 * @returns {Promise<Object>} Response object with success status and data
 */
export async function handleProjectsSubmission(projects) {
  try {
    // Projects are optional, so we don't need to validate length
    const response = await saveProjects(projects);
    return response;
  } catch (error) {
    console.error('Error saving projects:', error);
    return {
      success: false,
      message: 'An error occurred while saving projects'
    };
  }
}

/**
 * Controller for handling user interests during onboarding
 * @param {Array} interests - Array of interest objects
 * @returns {Promise<Object>} Response object with success status and data
 */
export async function handleInterestsSubmission(interests) {
  try {
    if (!Array.isArray(interests) || interests.length === 0) {
      return {
        success: false,
        message: 'Please select at least one interest'
      };
    }

    const response = await saveInterests(interests);
    if (response.success) {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        await completeOnboarding(userEmail);
      }
    }
    
    return response;
  } catch (error) {
    console.error('Error saving interests:', error);
    return {
      success: false,
      message: 'An error occurred while saving interests'
    };
  }
}

/**
 * Get suggested skills for user selection
 * @returns {Array} Array of suggested skill objects
 */
export function getSkillSuggestions() {
  return getSuggestedSkills();
}

/**
 * Get suggested interests for user selection
 * @returns {Array} Array of suggested interest objects
 */
export function getInterestSuggestions() {
  return getSuggestedInterests();
}

/**
 * Get the complete onboarding data for a user
 * @returns {Object} User's onboarding data including skills, projects, and interests
 */
export function getOnboardingData() {
  return getUserOnboardingData();
}
