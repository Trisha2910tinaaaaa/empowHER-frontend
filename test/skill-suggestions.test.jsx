/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SkillSuggestions, TECH_SKILLS } from '../components/skill-suggestions';

describe('SkillSuggestions Component', () => {
  test('renders the component with correct title', () => {
    const mockCallback = jest.fn();
    const currentSkills = ['JavaScript', 'React'];
    
    render(
      <SkillSuggestions
        currentSkills={currentSkills}
        onSelectSkill={mockCallback}
        title="Test Title"
      />
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('does not show skills already selected', () => {
    const mockCallback = jest.fn();
    const currentSkills = ['JavaScript', 'React'];
    
    render(
      <SkillSuggestions
        currentSkills={currentSkills}
        onSelectSkill={mockCallback}
      />
    );
    
    // These skills should not be in the document as they're already selected
    expect(screen.queryByText('JavaScript')).not.toBeInTheDocument();
    expect(screen.queryByText('React')).not.toBeInTheDocument();
    
    // But these should be there
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  test('calls onSelectSkill when a skill is clicked', () => {
    const mockCallback = jest.fn();
    const currentSkills = ['JavaScript'];
    
    render(
      <SkillSuggestions
        currentSkills={currentSkills}
        onSelectSkill={mockCallback}
      />
    );
    
    // Click on a suggestion
    fireEvent.click(screen.getByText('TypeScript'));
    
    // The callback should be called with the skill name
    expect(mockCallback).toHaveBeenCalledWith('TypeScript');
  });

  test('limits the number of suggestions shown', () => {
    const mockCallback = jest.fn();
    const currentSkills = [];
    const maxSuggestions = 5;
    
    render(
      <SkillSuggestions
        currentSkills={currentSkills}
        onSelectSkill={mockCallback}
        maxSuggestions={maxSuggestions}
      />
    );
    
    // Count the number of badges rendered
    const badges = screen.getAllByRole('button');
    expect(badges.length).toBe(maxSuggestions);
  });
  
  test('does not render when all skills are already selected', () => {
    const mockCallback = jest.fn();
    // Use all skills from the TECH_SKILLS array
    const currentSkills = [...TECH_SKILLS];
    
    const { container } = render(
      <SkillSuggestions
        currentSkills={currentSkills}
        onSelectSkill={mockCallback}
      />
    );
    
    // Component should not render anything, container should be empty
    expect(container.firstChild).toBeNull();
  });
}); 