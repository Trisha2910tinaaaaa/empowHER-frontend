"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export const TECH_SKILLS = [
  // Programming Languages
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Ruby", "Go", "PHP", "Swift", "Kotlin",
  
  // Frontend
  "React", "Angular", "Vue.js", "Next.js", "HTML", "CSS", "SCSS", "Tailwind CSS", "Bootstrap",
  "Redux", "GraphQL", "Material UI", "Styled Components", "Responsive Design", "Web Accessibility",
  
  // Backend
  "Node.js", "Express", "Django", "Flask", "Spring Boot", "Laravel", "ASP.NET", "REST API",
  "GraphQL API", "Serverless", "Microservices", "API Design",
  
  // Database
  "SQL", "NoSQL", "MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase", "DynamoDB", "Elasticsearch",
  
  // DevOps & Cloud
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Jenkins", "GitHub Actions",
  "Terraform", "Ansible", "Prometheus", "Grafana", "Linux",
  
  // Mobile
  "React Native", "Flutter", "iOS", "Android", "Mobile App Development",
  
  // AI/ML
  "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "TensorFlow", "PyTorch", "Data Science",
  
  // Tools & Practices
  "Git", "GitHub", "GitLab", "Agile", "Scrum", "Kanban", "Test-Driven Development", "Unit Testing",
  
  // Design
  "UI Design", "UX Design", "Figma", "Adobe XD", "Sketch", "Design Systems", "Wireframing", "Prototyping",
  
  // Soft Skills
  "Communication", "Team Leadership", "Project Management", "Problem Solving", "Critical Thinking"
];

export interface SkillSuggestionsProps {
  /** Currently selected skills */
  currentSkills: string[];
  /** Callback when a skill is selected */
  onSelectSkill: (skill: string) => void;
  /** Maximum number of suggestions to show */
  maxSuggestions?: number;
  /** Optional title for the suggestions section */
  title?: string;
}

/**
 * A component that displays a list of suggested skills that can be clicked to add to a profile
 */
export function SkillSuggestions({
  currentSkills,
  onSelectSkill,
  maxSuggestions = 30,
  title = "Suggested Skills"
}: SkillSuggestionsProps) {
  // Filter out skills that are already selected
  const filteredSuggestions = TECH_SKILLS
    .filter(skill => !currentSkills.includes(skill))
    .slice(0, maxSuggestions);
  
  if (filteredSuggestions.length === 0) return null;
  
  return (
    <div className="my-3">
      <h4 className="text-sm font-medium text-gray-500 mb-2">{title}</h4>
      <ScrollArea className="h-[120px] w-full border rounded-md p-2">
        <div className="flex flex-wrap gap-2 pb-2">
          {filteredSuggestions.map(skill => (
            <Badge
              key={skill}
              variant="outline"
              className="bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => onSelectSkill(skill)}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
} 