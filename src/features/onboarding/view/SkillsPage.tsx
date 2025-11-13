import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../onboarding/styles/onboarding.css";
import { onboardingData, skillCategories } from "../model/onboardingModel";

type Skill = {
  name: string;
  level: "Beginner" | "Intermediate" | "Expert";
};

const SkillsPage: React.FC = () => {
  const navigate = useNavigate();

  // ✅ Safely convert stored data to Skill[]
  const [skills, setSkills] = useState<Skill[]>(
    Array.isArray(onboardingData.skills)
      ? onboardingData.skills.map((s) =>
          typeof s === "string" ? { name: s, level: "Beginner" } : s
        )
      : []
  );

  const [input, setInput] = useState("");

  // ✅ Sync skills with onboardingData
  useEffect(() => {
    onboardingData.skills = skills.map((s) => s.name);
  }, [skills]);

  const toggleSkill = (skillName: string) => {
    const exists = skills.find((s) => s.name === skillName);
    if (exists) {
      setSkills((prev) => prev.filter((s) => s.name !== skillName));
    } else {
      setSkills((prev) => [...prev, { name: skillName, level: "Beginner" }]);
    }
  };

  const handleAdd = () => {
    const newSkill = input.trim();
    if (!newSkill) return;
    if (skills.some((s) => s.name === newSkill)) {
      setInput("");
      return;
    }

    setSkills((prev) => [...prev, { name: newSkill, level: "Beginner" }]);
    setInput("");
  };

  const updateSkillLevel = (skillName: string, level: Skill["level"]) => {
    setSkills((prev) =>
      prev.map((s) => (s.name === skillName ? { ...s, level } : s))
    );
  };

  const predefinedSkills = skillCategories
    .slice(0, 4)
    .flatMap((category) => category.items.slice(0, 8));

  const customSkills = skills
    .filter((s) => !predefinedSkills.includes(s.name))
    .map((s) => s.name);

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
        {/* Step Indicators */}
        <div className="step-indicators">
          <div
            className="dot active"
            onClick={() => navigate("/onboarding/skills")}
            title="Go to Skills step"
            role="button"
            aria-label="Go to skills step"
          ></div>
          <div
            className="dot"
            onClick={() => navigate("/onboarding/interests")}
            title="Go to Interests step"
            role="button"
            aria-label="Go to interests step"
          ></div>
          <div
            className="dot"
            onClick={() => navigate("/onboarding/projects")}
            title="Go to Projects step"
            role="button"
            aria-label="Go to projects step"
          ></div>
        </div>

        <h2>Add Your Skills</h2>
        <p>Choose your skills and select your proficiency level.</p>

        {/* Input Field */}
        <div className="input-group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a skill (e.g., React, Python)"
            aria-label="Add a new skill"
          />
          <button
            type="button"
            onClick={handleAdd}
            aria-label="Add skill"
            title="Add skill"
          >
            +
          </button>
        </div>

        {/* Skill Tags */}
        <div className="tag-container">
          {/* Predefined Skills */}
          {predefinedSkills.map((skill) => {
            const selectedSkill = skills.find((s) => s.name === skill);
            const isSelected = Boolean(selectedSkill);

            return (
              <div key={skill} className="skill-tag">
                <button
                  type="button"
                  className={`tag ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleSkill(skill)}
                  aria-label={`Toggle ${skill}`}
                  title={`Toggle ${skill}`}
                >
                  {skill}
                </button>

                {isSelected && (
                  <select
                    value={selectedSkill!.level}
                    onChange={(e) =>
                      updateSkillLevel(skill, e.target.value as Skill["level"])
                    }
                    className="level-select"
                    aria-label={`Select proficiency for ${skill}`}
                    title={`Select proficiency level for ${skill}`}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Expert</option>
                  </select>
                )}
              </div>
            );
          })}

          {/* Custom Skills */}
          {customSkills.map((skill) => {
            const selectedSkill = skills.find((s) => s.name === skill);
            return (
              <div key={skill} className="skill-tag">
                <button
                  type="button"
                  className="tag selected"
                  onClick={() => toggleSkill(skill)}
                  aria-pressed="true"
                  aria-label={`Remove ${skill}`}
                  title={`Remove ${skill}`}
                >
                  {skill} ✕
                </button>

                {selectedSkill && (
                  <select
                    value={selectedSkill.level}
                    onChange={(e) =>
                      updateSkillLevel(skill, e.target.value as Skill["level"])
                    }
                    className="level-select"
                    aria-label={`Select proficiency for ${skill}`}
                    title={`Select proficiency level for ${skill}`}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Expert</option>
                  </select>
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="buttons">
          <button
            type="button"
            className="back-btn"
            disabled
            aria-disabled="true"
            aria-label="Go back"
          >
            Back
          </button>
          <button
            type="button"
            className="next-btn"
            onClick={() => navigate("/onboarding/interests")}
            aria-label="Next step"
            title="Go to next step"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillsPage;
