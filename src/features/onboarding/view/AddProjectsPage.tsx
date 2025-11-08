import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/button';
import { saveProjects, getSuggestedProjects } from '../model/onboardingModel';
import '../styles/onboarding.css';

export default function AddProjectsPage() {
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [newProject, setNewProject] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const suggestedProjects = getSuggestedProjects() || [];

  const handleProjectToggle = (project) => {
    const isSelected = selectedProjects.some((p) => p.id === project.id);
    if (isSelected) {
      setSelectedProjects(selectedProjects.filter((p) => p.id !== project.id));
    } else {
      setSelectedProjects([...selectedProjects, project]);
    }
  };

  const handleAddCustomProject = () => {
    if (!newProject.trim()) return;

    const customProject = {
      id: Date.now().toString(),
      title: newProject.trim(),
      description: 'Custom project',
      category: 'Custom',
    };

    setSelectedProjects([...selectedProjects, customProject]);
    setNewProject('');
  };

  const handleNext = async () => {
    if (selectedProjects.length === 0) {
      setError('Please add at least one project');
      return;
    }

    try {
      setError('');
      const response = await saveProjects(selectedProjects);

      if (response && response.success) {
        navigate('/dashboard');
      } else {
        setError((response && response.message) || 'Failed to save projects');
      }
    } catch (err) {
      console.error('Error saving projects:', err);
      setError('An error occurred. Please try again.');
    }
  };

  const handleBack = () => {
    navigate('/onboarding/skills');
  };

  return (
    <div className="onboarding-page">
      <h1 className="onboarding-title">Add Your Projects</h1>
      <p className="onboarding-subtitle">
        Showcase your best work! Add your past or ongoing projects.
      </p>

      {error && <p className="error-message">{error}</p>}

      <div className="skill-input-container">
        <input
          type="text"
          className="auth-input"
          placeholder="Add a project (e.g., Portfolio Website, AI Chatbot)"
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddCustomProject()}
        />
        <Button onClick={handleAddCustomProject} variant="primary" size="small">
          Add
        </Button>
      </div>

      <div className="skills-section">
        <h3>Your Selected Projects</h3>
        <div className="selected-skills">
          {selectedProjects.length === 0 ? (
            <p className="empty-placeholder">No projects added yet.</p>
          ) : (
            selectedProjects.map((project) => (
              <div
                key={project.id}
                className="skill-tag"
                onClick={() => handleProjectToggle(project)}
              >
                {project.title}
                <button
                  type="button"
                  className="remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProjects(
                      selectedProjects.filter((p) => p.id !== project.id)
                    );
                  }}
                >
                  &times;
                </button>
              </div>
            ))
          )}
        </div>

        <h3>Suggested Projects</h3>
        <div className="skills-grid">
          {suggestedProjects.length === 0 ? (
            <p className="empty-placeholder">No suggested projects available.</p>
          ) : (
            suggestedProjects.map((project) => (
              <div
                key={project.id}
                className={`skill-card ${
                  selectedProjects.some((p) => p.id === project.id)
                    ? 'selected'
                    : ''
                }`}
                onClick={() => handleProjectToggle(project)}
              >
                <h3>{project.title}</h3>
                <p>{project.category}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="navigation-buttons">
        <Button onClick={handleBack} variant="secondary" size="medium">
          Back
        </Button>
        <Button onClick={handleNext} variant="primary" size="medium">
          Finish
        </Button>
      </div>
    </div>
  );
}
