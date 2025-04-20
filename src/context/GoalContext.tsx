import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Goal, GoalWithCalculations, UserProfile, ScoreHistoryEntry } from '../types/goal';
import * as storageService from '../services/storage';
import { calculateGoalValues } from '../utils/calculations';

interface GoalContextType {
  goals: GoalWithCalculations[];
  userProfile: UserProfile | null;
  scoreHistory: ScoreHistoryEntry[];
  loading: boolean;
  saveGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  completeGoal: (id: string) => void;
  getGoalById: (id: string) => GoalWithCalculations | undefined;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [goals, setGoals] = useState<GoalWithCalculations[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [scoreHistory, setScoreHistory] = useState<ScoreHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data from storage
  useEffect(() => {
    const loadData = () => {
      try {
        const storedGoals = storageService.getGoals();
        const goalsWithCalculations = storedGoals.map(calculateGoalValues);
        setGoals(goalsWithCalculations);
        
        const profile = storageService.getUserProfile();
        setUserProfile(profile);
        
        const history = storageService.getScoreHistory();
        setScoreHistory(history);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const saveGoal = (goal: Goal) => {
    const savedGoal = storageService.saveGoal(goal);
    const goalWithCalculations = calculateGoalValues(savedGoal);
    
    setGoals(prevGoals => {
      const index = prevGoals.findIndex(g => g.id === goal.id);
      if (index !== -1) {
        const updatedGoals = [...prevGoals];
        updatedGoals[index] = goalWithCalculations;
        return updatedGoals;
      }
      return [...prevGoals, goalWithCalculations];
    });
  };

  const deleteGoal = (id: string) => {
    storageService.deleteGoal(id);
    setGoals(prevGoals => prevGoals.filter(goal => goal.id !== id));
  };

  const completeGoal = (id: string) => {
    storageService.completeGoal(id);
    
    // Refresh data
    const storedGoals = storageService.getGoals();
    const goalsWithCalculations = storedGoals.map(calculateGoalValues);
    setGoals(goalsWithCalculations);
    
    const profile = storageService.getUserProfile();
    setUserProfile(profile);
    
    const history = storageService.getScoreHistory();
    setScoreHistory(history);
  };

  const getGoalById = (id: string) => {
    return goals.find(goal => goal.id === id);
  };

  return (
    <GoalContext.Provider
      value={{
        goals,
        userProfile,
        scoreHistory,
        loading,
        saveGoal,
        deleteGoal,
        completeGoal,
        getGoalById,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
};