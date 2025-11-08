import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/button';
import { saveSkills, getSuggestedSkills } from '../model/onboardingModel';
import '../styles/onboarding.css';

interface Skill {
  id: string;
  name: string;
  category: string;
}

export default function AddSkillsPage() {
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const suggestedSkills = getSuggestedSkills();

  const handleSkillToggle = (skill: Skill) => {
    const isSelected = selectedSkills.find(s => s.id === skill.id);
    if (isSelected) {
      setSelectedSkills(selectedSkills.filter(s => s.id !== skill.id));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = () => {
    if (!newSkill.trim()) return;
    
    const customSkill: Skill = {
      id: Date.now().toString(),
      name: newSkill.trim(),
      category: 'Custom'
    };
    
    setSelectedSkills([...selectedSkills, customSkill]);
    setNewSkill('');
  };

  const handleNext = async () => {
    if (selectedSkills.length === 0) {
      setError('Please add at least one skill');
      return;
    }

    try {
      setError('');
      const response = await saveSkills(selectedSkills);
      
      if (response.success) {
        navigate('/onboarding/projects');
      } else {
        setError(response.message || 'Failed to save skills');
      }
    } catch (err) {
      console.error('Error saving skills:', err);
      setError('An error occurred. Please try again.');
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

  return (
    <div className="onboarding-page">
      <h1 className="onboarding-title">Add Your Skills</h1>
      <p className="onboarding-subtitle">
        What are you good at? Add your technical and soft skills.
      </p>

      {error && <p className="error-message">{error}</p>}

      <div className="skill-input-container">
        <input
          type="text"
          className="auth-input"
          placeholder="Add a skill (e.g., React, Python, Design)"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSkill()}
        />
        <Button 
          onClick={handleAddCustomSkill}
          variant="primary"
          size="small"
        >
          Add
        </Button>
      </div>

      <div className="skills-section">
        <h3>Your Selected Skills</h3>
        <div className="selected-skills">
          {selectedSkills.map(skill => (
            <div
              key={skill.id}
              className="skill-tag"
              onClick={() => handleSkillToggle(skill)}
            >
              {skill.name}
              <button className="remove-btn">&times;</button>
            </div>
          ))}
        </div>

        <h3>Suggested Skills</h3>
        <div className="skills-grid">
          {suggestedSkills.map(skill => (
            <div
              key={skill.id}
              className={'skill-card ' + (selectedSkills.find(s => s.id === skill.id) ? 'selected' : '')}
              onClick={() => handleSkillToggle(skill)}
            >
              <h3>{skill.name}</h3>
              <p>{skill.category}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="navigation-buttons">
        <Button 
          onClick={handleBack}
          variant="secondary"
          size="medium"
        >
          Back
        </Button>
        <Button 
          onClick={handleNext}
          variant="primary"
          size="medium"
        >
          Next
        </Button>
      </div>
    </div>
  );
}