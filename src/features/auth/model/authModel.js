// Get completed users from localStorage or initialize empty array
const getCompletedUsers = () => {
  const stored = localStorage.getItem('completedUsers');
  return stored ? JSON.parse(stored) : [];
};

// In-memory users storage (simulating a database)
const users = [
  { 
    email: "test@example.com", 
    password: "123456", 
    name: "Test User",
    hasCompletedOnboarding: true  // This user has completed onboarding
  }
];

// Check if a user has completed onboarding
const hasUserCompletedOnboarding = (email) => {
  const completedUsers = getCompletedUsers();
  return completedUsers.includes(email);
};

export async function loginApi({ email, password }) {
  // Basic validation
  if (!email || !password) {
    return { success: false, message: "Email and password are required" };
  }

  // Check if this email has completed onboarding
  const completedUsers = getCompletedUsers();
  const hasCompletedOnboarding = completedUsers.includes(email);

  // Find user in our "database"
  const user = users.find(u => u.email === email);

  if (user && user.password === password) {
    return { 
      success: true, 
      token: "dummy-token", 
      userId: email,
      user: { 
        email: user.email,
        name: user.name,
        hasCompletedOnboarding: hasCompletedOnboarding
      }
    };
  }

  // For testing: Accept any email/password combination that's valid for new users
  if (email.includes('@') && password.length >= 6) {
    // Add new user to our "database"
    const newUser = {
      email,
      password,
      name: email.split('@')[0],
      hasCompletedOnboarding: hasCompletedOnboarding
    };
    users.push(newUser);

    return { 
      success: true, 
      token: "dummy-token",
      userId: email,
      user: {
        email: newUser.email,
        name: newUser.name,
        hasCompletedOnboarding: hasCompletedOnboarding
      }
    };
  }

  return { success: false, message: "Invalid credentials. Password should be at least 6 characters." };
}

export async function registerApi({ fullName, email, password }) {
  // Basic validation
  if (!email || !password || !fullName) {
    return { success: false, message: "All fields are required" };
  }

  if (!email.includes('@')) {
    return { success: false, message: "Invalid email format" };
  }

  if (password.length < 6) {
    return { success: false, message: "Password must be at least 6 characters" };
  }

  // Store the new user (in a real app, this would go to a database)
  users.push({ 
    email, 
    password, 
    name: fullName,
    hasCompletedOnboarding: false
  });

  return { success: true, userId: users.length };
}

export function markOnboardingComplete(email) {
  // Update user in our "database"
  const user = users.find(u => u.email === email);
  if (user) {
    user.hasCompletedOnboarding = true;
  }

  // Add to completed users list in localStorage
  const completedUsers = getCompletedUsers();
  if (!completedUsers.includes(email)) {
    completedUsers.push(email);
    localStorage.setItem('completedUsers', JSON.stringify(completedUsers));
  }
}