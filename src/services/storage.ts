import { v4 as uuidv4 } from 'uuid';
import { Goal, GoalStatus, GoalTag, ScoreHistoryEntry, UserProfile } from '../types/goal';
import { calculateGoalValues, calculateLevel, calculateScoreForLevel, calculateScoreToNextLevel } from '../utils/calculations';

// Mock storage keys
const GOALS_STORAGE_KEY = 'leveler_goals';
const USER_PROFILE_KEY = 'leveler_user_profile';
const SCORE_HISTORY_KEY = 'leveler_score_history';

// Initialize local storage with sample data if empty
const initializeStorage = (): void => {
  if (!localStorage.getItem(GOALS_STORAGE_KEY)) {
    const sampleGoals: Goal[] = [
      {
        id: uuidv4(),
        name: 'Launch Thumbnail Business',
        tags: ['work', 'creative', 'finance'],
        notes: 'Learn skills, build client base, earn $70/month',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        urgency: 8,
        impact: 9,
        timeEstimate: 15,
        motivation: 7,
        complexity: 6,
        status: 'in-progress',
        progress: 30,
        subTasks: [
          { id: uuidv4(), text: 'Learn basic design skills', completed: true },
          { id: uuidv4(), text: 'Set up portfolio', completed: false },
          { id: uuidv4(), text: 'Find first client', completed: false },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'Daily Meditation Habit',
        tags: ['health', 'personal'],
        notes: 'Meditate for 10 minutes every morning to reduce stress',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        urgency: 6,
        impact: 7,
        timeEstimate: 5,
        motivation: 8,
        complexity: 3,
        status: 'not-started',
        progress: 0,
        recurring: 'daily',
        energyLevel: 'low',
        subTasks: [
          { id: uuidv4(), text: 'Download meditation app', completed: false },
          { id: uuidv4(), text: 'Set daily reminder', completed: false },
        ],
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(sampleGoals));

    const initialProfile: UserProfile = {
      id: uuidv4(),
      level: 1,
      totalScore: 0,
      scoreToNextLevel: 10,
      scoreForCurrentLevel: 0,
      badges: [],
    };
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(initialProfile));
    
    localStorage.setItem(SCORE_HISTORY_KEY, JSON.stringify([]));
  }
};

// Get all goals with calculated values
export const getGoals = (): Goal[] => {
  initializeStorage();
  const goalsJson = localStorage.getItem(GOALS_STORAGE_KEY);
  return goalsJson ? JSON.parse(goalsJson) : [];
};

// Save a goal
export const saveGoal = (goal: Goal): Goal => {
  const goals = getGoals();
  const isNew = !goals.find(g => g.id === goal.id);
  
  if (isNew) {
    goal.id = uuidv4();
    goal.createdAt = new Date().toISOString();
    goals.push(goal);
  } else {
    const index = goals.findIndex(g => g.id === goal.id);
    goals[index] = {
      ...goals[index],
      ...goal,
    };
  }
  
  localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  return goal;
};

// Delete a goal
// Delete a goal
export const deleteGoal = (id: string): void => {
  const goals = getGoals();
  const filteredGoals = goals.filter(goal => goal.id !== id);
  
  if (filteredGoals.length !== goals.length) {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(filteredGoals));
    return;
  }
  
  throw new Error(`Goal with id ${id} not found`);
};

// Get user profile
export const getUserProfile = (): UserProfile => {
  initializeStorage();
  const profileJson = localStorage.getItem(USER_PROFILE_KEY);
  return profileJson ? JSON.parse(profileJson) : null;
};

// Save user profile
export const saveUserProfile = (profile: UserProfile): UserProfile => {
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  return profile;
};

// Get score history
export const getScoreHistory = (): ScoreHistoryEntry[] => {
  initializeStorage();
  const historyJson = localStorage.getItem(SCORE_HISTORY_KEY);
  return historyJson ? JSON.parse(historyJson) : [];
};

// Add score entry
export const addScoreEntry = (goal: Goal, score: number): ScoreHistoryEntry => {
  const history = getScoreHistory();
  const entry: ScoreHistoryEntry = {
    id: uuidv4(),
    goalId: goal.id,
    goalName: goal.name,
    score,
    date: new Date().toISOString(),
    tags: goal.tags as GoalTag[],
  };
  
  history.push(entry);
  localStorage.setItem(SCORE_HISTORY_KEY, JSON.stringify(history));
  
  // Update user profile
  const profile = getUserProfile();
  const newTotalScore = profile.totalScore + score;
  const newLevel = calculateLevel(newTotalScore);
  
  const updatedProfile: UserProfile = {
    ...profile,
    level: newLevel,
    totalScore: newTotalScore,
    scoreForCurrentLevel: calculateScoreForLevel(newLevel),
    scoreToNextLevel: calculateScoreToNextLevel(newLevel),
  };
  
  saveUserProfile(updatedProfile);
  return entry;
};

// Complete a goal
export const completeGoal = (id: string): void => {
  const goals = getGoals();
  const goalIndex = goals.findIndex(goal => goal.id === id);
  
  if (goalIndex !== -1) {
    const goal = goals[goalIndex];
    const calculatedGoal = calculateGoalValues(goal);
    
    goals[goalIndex] = {
      ...goal,
      status: 'completed' as GoalStatus,
      progress: 100,
      completedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
    
    // Add to score history
    addScoreEntry(goal, calculatedGoal.cumulativeScore);
  }
};