// Dummy data for suggestions
const suggestedSkills = [
  { id: '1', name: 'React', category: 'technical' },
  { id: '2', name: 'TypeScript', category: 'technical' },
  { id: '3', name: 'Node.js', category: 'technical' },
  { id: '4', name: 'Communication', category: 'soft' },
  { id: '5', name: 'Problem Solving', category: 'soft' },
  { id: '6', name: 'Leadership', category: 'soft' }
];

const suggestedInterests = [
  { id: '1', name: 'Web Development', category: 'Development' },
  { id: '2', name: 'Machine Learning', category: 'AI' },
  { id: '3', name: 'UI/UX Design', category: 'Design' },
  { id: '4', name: 'Mobile Development', category: 'Development' },
  { id: '5', name: 'DevOps', category: 'Operations' }
];

// Simulated API calls
export async function saveSkills(skills) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Store in localStorage
    localStorage.setItem('user_skills', JSON.stringify(skills));

    return {
      success: true,
      data: { skills, projects: [], interests: [] }
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to save skills'
    };
  }
}

export async function saveProjects(projects) {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.setItem('user_projects', JSON.stringify(projects));

    return {
      success: true,
      data: {
        skills: JSON.parse(localStorage.getItem('user_skills') || '[]'),
        projects,
        interests: []
      }
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to save projects'
    };
  }
}

export async function saveInterests(interests) {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.setItem('user_interests', JSON.stringify(interests));

    // Mark onboarding as complete
    localStorage.setItem('onboardingComplete', 'true');

    // Get current user's email and mark their onboarding complete
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      try {
        const { markOnboardingComplete } = await import('../../auth/model/authModel.js');
        markOnboardingComplete(userEmail);
      } catch (err) {
        console.error('Failed to mark onboarding complete:', err);
      }
    }

    return {
      success: true,
      data: {
        skills: JSON.parse(localStorage.getItem('user_skills') || '[]'),
        projects: JSON.parse(localStorage.getItem('user_projects') || '[]'),
        interests
      }
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to save interests'
    };
  }
}

export function getSuggestedSkills() {
  return suggestedSkills;
}

export function getSuggestedInterests() {
  return suggestedInterests;
}

export function getUserOnboardingData() {
  try {
    const skills = JSON.parse(localStorage.getItem('user_skills') || '[]');
    const projects = JSON.parse(localStorage.getItem('user_projects') || '[]');
    const interests = JSON.parse(localStorage.getItem('user_interests') || '[]');

    return {
      success: true,
      data: { skills, projects, interests }
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to get user data'
    };
  }
}
