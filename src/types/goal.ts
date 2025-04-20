export type GoalStatus = 'not-started' | 'in-progress' | 'completed';
export type GoalTag = 'work' | 'health' | 'personal' | 'finance' | 'creative' | 'learning' | 'social' | 'other';
export type EnergyLevel = 'low' | 'medium' | 'high';

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  name: string;
  tags: GoalTag[];
  notes: string;
  startDate: string;
  endDate: string;
  urgency: number; // 1-10
  impact: number; // 1-10
  timeEstimate: number; // hours
  motivation: number; // 1-10
  complexity: number; // 1-10
  status: GoalStatus;
  progress: number; // 0-100
  energyLevel?: EnergyLevel;
  recurring?: string; // e.g., "daily", "weekly", "monthly"
  subTasks: SubTask[];
  createdAt: string;
  completedAt?: string;
}

export interface CalculatedGoalValues {
  effort: number; // (Time × Complexity) ÷ Motivation
  priorityScore: number; // (Impact × Urgency) ÷ Effort
  cumulativeScore: number; // (Impact × Urgency × Motivation²) ÷ (Time × Complexity)
  deadlineIndicator: 'red' | 'orange' | 'green'; // deadline indicators based on proximity
}

export interface GoalWithCalculations extends Goal, CalculatedGoalValues {}

export interface UserProfile {
  id: string;
  level: number;
  totalScore: number;
  scoreToNextLevel: number;
  scoreForCurrentLevel: number;
  badges: string[];
}

export interface ScoreHistoryEntry {
  id: string;
  goalId: string;
  goalName: string;
  score: number;
  date: string;
  tags: GoalTag[];
}