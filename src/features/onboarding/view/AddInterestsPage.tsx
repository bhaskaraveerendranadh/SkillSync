import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/button';
import { saveInterests, getSuggestedInterests } from '../model/onboardingModel';
import '../styles/onboarding.css';

export default function AddInterestsPage() {
  type Interest = {
    id: string;
    name: string;
    category?: string;
  };

  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const suggestedInterests = getSuggestedInterests();

  const handleInterestToggle = (interest: Interest) => {
    const isSelected = selectedInterests.find(i => i.id === interest.id);
    if (isSelected) {
      setSelectedInterests(selectedInterests.filter(i => i.id !== interest.id));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleAddCustomInterest = () => {
    if (!newInterest.trim()) return;

    const customInterest = {
      id: Date.now().toString(),
      name: newInterest.trim(),
      category: 'Custom'
    };

    setSelectedInterests([...selectedInterests, customInterest]);
    setNewInterest('');
  };

  const handleNext = async () => {
    if (selectedInterests.length === 0) {
      setError('Please add at least one interest');
      return;
    }

    try {
      setError('');
      const response = await saveInterests(selectedInterests);

      if (response.success) {
        navigate('/onboarding/skills');
      } else {
        setError(response.message || 'Failed to save interests');
      }
    } catch (err) {
      console.error('Error saving interests:', err);
      setError('An error occurred. Please try again.');
    }
  };

  const handleBack = () => {
    navigate('/onboarding/profile');
  };

  return (
    <div className="onboarding-page">
      <h1 className="onboarding-title">Add Your Interests</h1>
      <p className="onboarding-subtitle">
        What areas are you most passionate about? Add your interests below.
      </p>

      {error && <p className="error-message">{error}</p>}

      <div className="skill-input-container">
        <input
          type="text"
          className="auth-input"
          placeholder="Add an interest (e.g., AI, Web Dev, IoT)"
          value={newInterest}
          onChange={(e) => setNewInterest(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddCustomInterest()}
        />
        <Button onClick={handleAddCustomInterest} variant="primary" size="small">
          Add
        </Button>
      </div>

      <div className="skills-section">
        <h3>Your Selected Interests</h3>
        <div className="selected-skills">
          {selectedInterests.map(interest => (
            <div
              key={interest.id}
              className="skill-tag"
              onClick={() => handleInterestToggle(interest)}
            >
              {interest.name}
              <button className="remove-btn">&times;</button>
            </div>
          ))}
        </div>

        <h3>Suggested Interests</h3>
        <div className="skills-grid">
          {suggestedInterests.map(interest => (
            <div
              key={interest.id}
              className={
                'skill-card ' +
                (selectedInterests.find(i => i.id === interest.id) ? 'selected' : '')
              }
              onClick={() => handleInterestToggle(interest)}
            >
              <h3>{interest.name}</h3>
              <p>{interest.category}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="navigation-buttons">
        <Button onClick={handleBack} variant="secondary" size="medium">
          Back
        </Button>
        <Button onClick={handleNext} variant="primary" size="medium">
          Next
        </Button>
      </div>
    </div>
  );
}
