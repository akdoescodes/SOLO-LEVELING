import { Goal, GoalWithCalculations } from '../types/goal';
import { differenceInDays, parseISO } from 'date-fns';

/**
 * Calculate effort based on time, complexity, and motivation
 */
export const calculateEffort = (
  timeEstimate: number,
  complexity: number,
  motivation: number
): number => {
  return (timeEstimate * complexity) / motivation;
};

/**
 * Calculate priority score based on impact, urgency, and effort
 */
export const calculatePriorityScore = (
  impact: number,
  urgency: number,
  effort: number
): number => {
  return (impact * urgency) / effort;
};

/**
 * Calculate cumulative score for goal value
 */
export const calculateCumulativeScore = (
  impact: number,
  urgency: number,
  motivation: number,
  timeEstimate: number,
  complexity: number
): number => {
  return (impact * urgency * Math.pow(motivation, 2)) / (timeEstimate * complexity);
};

/**
 * Determine deadline indicator color based on days until deadline
 */
export const determineDeadlineIndicator = (endDate: string): 'red' | 'orange' | 'green' => {
  const today = new Date();
  const deadline = parseISO(endDate);
  const daysRemaining = differenceInDays(deadline, today);

  if (daysRemaining <= 0) return 'red';
  if (daysRemaining <= 3) return 'orange';
  return 'green';
};

/**
 * Calculate all derived values for a goal
 */
export const calculateGoalValues = (goal: Goal): GoalWithCalculations => {
  const effort = calculateEffort(goal.timeEstimate, goal.complexity, goal.motivation);
  const priorityScore = calculatePriorityScore(goal.impact, goal.urgency, effort);
  const cumulativeScore = calculateCumulativeScore(
    goal.impact,
    goal.urgency,
    goal.motivation,
    goal.timeEstimate,
    goal.complexity
  );
  const deadlineIndicator = determineDeadlineIndicator(goal.endDate);

  return {
    ...goal,
    effort,
    priorityScore,
    cumulativeScore,
    deadlineIndicator,
  };
};

/**
 * Calculate level based on total score
 * Level formula: 1 + floor(sqrt(totalScore / 10))
 */
export const calculateLevel = (totalScore: number): number => {
  return 1 + Math.floor(Math.sqrt(totalScore / 10));
};

/**
 * Calculate score needed for next level
 */
export const calculateScoreForLevel = (level: number): number => {
  return Math.pow(level - 1, 2) * 10;
};

/**
 * Calculate score needed for next level
 */
export const calculateScoreToNextLevel = (level: number): number => {
  return Math.pow(level, 2) * 10;
};

/**
 * Format a number to 1 decimal place
 */
export const formatNumber = (num: number): string => {
  return num.toFixed(1);
};