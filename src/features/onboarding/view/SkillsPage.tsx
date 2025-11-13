import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../onboarding/styles/onboarding.css";
import {
  onboardingData,
  skillCategories,
} from "../model/onboardingModel";
import { submitSkills } from "../controller/Onboardingcontroller";


type SkillLevel = "beginner" | "intermediate" | "advanced";

interface SelectedSkill {
  name: string;
  level: SkillLevel;
}

const AddSkillsPage: React.FC = () => {
  const navigate = useNavigate();

  const [skills, setSkills] = useState<SelectedSkill[]>(() => {
    const stored = localStorage.getItem("skills");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return onboardingData.skills || [];
      }
    }
    return onboardingData.skills || [];
  });

  const [input, setInput] = useState("");
  const [defaultLevel, setDefaultLevel] = useState<SkillLevel>("intermediate");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    onboardingData.skills = skills;
    localStorage.setItem("skills", JSON.stringify(skills));
  }, [skills]);

  const upsertSkill = (name: string, level?: SkillLevel) => {
    setError("");
    const trimmed = name.trim();
    if (!trimmed) return;

    const chosenLevel = level || defaultLevel;

    const existingIndex = skills.findIndex((s) => s.name === trimmed);
    if (existingIndex >= 0) {
      const updated = [...skills];
      updated[existingIndex] = { ...updated[existingIndex], level: chosenLevel };
      setSkills(updated);
    } else {
      setSkills([...skills, { name: trimmed, level: chosenLevel }]);
    }
  };

  const removeSkill = (name: string) => {
    setSkills(skills.filter((s) => s.name !== name));
  };

  const handleAddInputSkill = () => {
    if (!input.trim()) return;
    upsertSkill(input.trim(), defaultLevel);
    setInput("");
  };

  const handleChangeLevel = (name: string, level: SkillLevel) => {
    const updated = skills.map((s) =>
      s.name === name ? { ...s, level } : s
    );
    setSkills(updated);
  };

  const handleNext = async () => {
    setSaving(true);
    setError("");

    const res = await submitSkills(undefined, skills);

    setSaving(false);

    if (!res.success) {
      setError(res.message || "Failed to save skills");
      return;
    }

    navigate("/onboarding/interests");
  };

  const allSuggested = skillCategories.flatMap((category) => category.items);

  const selectedNames = new Set(skills.map((s) => s.name));
  const remainingSuggestions = allSuggested.filter((name) => !selectedNames.has(name));

  return (
    <motion.div
      className="onboarding-container"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="logo">SKILLSYNC</h1>

      <div className="onboarding-card">
        <div className="step-indicators">
          <button
            type="button"
            className="dot active"
            onClick={() => navigate("/onboarding/skills")}
          />
          <button
            type="button"
            className="dot"
            onClick={() => navigate("/onboarding/interests")}
          />
          <button
            type="button"
            className="dot"
            onClick={() => navigate("/onboarding/projects")}
          />
        </div>

        <h2>Add Your Skills</h2>
        <p>Select your skills and choose your proficiency level.</p>

        {error && <p className="error-text">{error}</p>}
        {skills.length > 0 && (
          <div className="selected-interests">
            <p className="selected-label">Selected skills:</p>
            <div className="tag-container">
              {skills.map((skill) => (
                <div key={skill.name} className="skill-chip">
                  <button
                    type="button"
                    className="tag selected"
                    onClick={() => removeSkill(skill.name)}
                  >
                    {skill.name}
                  </button>
                  <select
                    value={skill.level}
                    onChange={(e) =>
                      handleChangeLevel(
                        skill.name,
                        e.target.value as SkillLevel
                      )
                    }
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="default-level-row">
          <span>Default level for new skills:</span>
          <select
            value={defaultLevel}
            onChange={(e) =>
              setDefaultLevel(e.target.value as SkillLevel)
            }
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div className="input-group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a skill (e.g., FastAPI, React, Docker)"
          />
          <button type="button" onClick={handleAddInputSkill}>
            +
          </button>
        </div>
        <div className="tag-container">
          {remainingSuggestions.map((name) => (
            <button
              key={name}
              type="button"
              className="tag"
              onClick={() => upsertSkill(name)}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="buttons">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/")}
            disabled={saving}
          >
            Skip
          </button>
          <button
            type="button"
            className="next-btn"
            onClick={handleNext}
            disabled={saving}
          >
            {saving ? "Saving..." : "Next"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AddSkillsPage;