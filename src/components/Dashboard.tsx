import React, { useState } from 'react';
import { useGoals } from '../context/GoalContext';
import { GoalWithCalculations, GoalTag } from '../types/goal';
import GoalCard from './GoalCard';
import { PlusCircle, Filter, TrendingUp, Clock, CheckCheck, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressChart from './ProgressChart';

type SortOption = 'priority' | 'deadline' | 'effort' | 'progress';
type TimeframeFilter = 'all' | 'today' | 'tomorrow';

interface DashboardProps {
  onOpenForm: () => void;
  onEditGoal: (goal: GoalWithCalculations) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onOpenForm, onEditGoal }) => {
  const { goals, completeGoal, deleteGoal, userProfile } = useGoals();
  const [selectedTags, setSelectedTags] = useState<GoalTag[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('priority');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [timeframeFilter, setTimeframeFilter] = useState<TimeframeFilter>('all');

  const handleDeleteGoal = (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(id);
    }
  };

  const handleTagToggle = (tag: GoalTag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Helper function to check if a date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Helper function to check if a date is tomorrow
  const isTomorrow = (date: Date): boolean => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear();
  };

  const filteredGoals = goals.filter(goal => {
    // Status filter (active/completed)
    if (filter === 'completed' && goal.status !== 'completed') return false;
    if (filter === 'active' && goal.status === 'completed') return false;
    
    // Tags filter
    if (selectedTags.length > 0) {
      if (!goal.tags.some(tag => selectedTags.includes(tag as GoalTag))) {
        return false;
      }
    }
    
    // Timeframe filter
    if (timeframeFilter !== 'all') {
      const goalDate = new Date(goal.startDate);
      if (timeframeFilter === 'today' && !isToday(goalDate)) return false;
      if (timeframeFilter === 'tomorrow' && !isTomorrow(goalDate)) return false;
    }
    
    return true;
  });

  const sortedGoals = [...filteredGoals].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        return b.priorityScore - a.priorityScore;
      case 'deadline':
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      case 'effort':
        return a.effort - b.effort;
      case 'progress':
        return b.progress - a.progress;
      default:
        return 0;
    }
  });

  const allTags = Array.from(
    new Set(goals.flatMap(goal => goal.tags))
  ) as GoalTag[];

  const todaysPriorities = sortedGoals
    .filter(goal => goal.status !== 'completed')
    .slice(0, 3);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2 sm:mb-0">Your Goals</h2>
            <button
              onClick={onOpenForm}
              className="flex items-center px-4 py-2 bg-gradient-primary text-white rounded-md font-medium hover:opacity-90 transition-opacity"
            >
              <PlusCircle size={18} className="mr-1" />
              Add New Goal
            </button>
          </div>

          <div className="border border-gray-800 rounded-lg p-4 mb-6 bg-surface/50 backdrop-blur-sm">
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="flex items-center mr-2">
                <Filter size={16} className="text-gray-400 mr-1" />
                <span className="text-sm font-medium text-gray-400">Filter:</span>
              </div>
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-sm rounded-full border ${
                  filter === 'all'
                    ? 'border-primary-500 text-primary-400'
                    : 'border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-3 py-1 text-sm rounded-full border ${
                  filter === 'active'
                    ? 'border-primary-500 text-primary-400'
                    : 'border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1 text-sm rounded-full border ${
                  filter === 'completed'
                    ? 'border-primary-500 text-primary-400'
                    : 'border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                Completed
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <div className="flex items-center mr-2">
                <Calendar size={16} className="text-gray-400 mr-1" />
                <span className="text-sm font-medium text-gray-400">Timeframe:</span>
              </div>
              <button
                onClick={() => setTimeframeFilter('all')}
                className={`px-3 py-1 text-sm rounded-full border ${
                  timeframeFilter === 'all'
                    ? 'border-primary-500 text-primary-400'
                    : 'border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                All Dates
              </button>
              <button
                onClick={() => setTimeframeFilter('today')}
                className={`px-3 py-1 text-sm rounded-full border ${
                  timeframeFilter === 'today'
                    ? 'border-primary-500 text-primary-400'
                    : 'border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setTimeframeFilter('tomorrow')}
                className={`px-3 py-1 text-sm rounded-full border ${
                  timeframeFilter === 'tomorrow'
                    ? 'border-primary-500 text-primary-400'
                    : 'border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                Tomorrow
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <div className="flex items-center mr-2">
                <TrendingUp size={16} className="text-gray-400 mr-1" />
                <span className="text-sm font-medium text-gray-400">Sort by:</span>
              </div>
              {['priority', 'deadline', 'effort', 'progress'].map((option) => (
                <button
                  key={option}
                  onClick={() => setSortBy(option as SortOption)}
                  className={`px-3 py-1 text-sm rounded-full border ${
                    sortBy === option
                      ? 'border-primary-500 text-primary-400'
                      : 'border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>

            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center mr-2">
                  <span className="text-sm font-medium text-gray-400">Tags:</span>
                </div>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 text-sm rounded-full border ${
                      selectedTags.includes(tag)
                        ? 'border-primary-500 text-primary-400'
                        : 'border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          <AnimatePresence>
            {sortedGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onComplete={completeGoal}
                onEdit={() => onEditGoal(goal)}
                onDelete={handleDeleteGoal}
              />
            ))}
          </AnimatePresence>

          {sortedGoals.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No goals found matching your filters</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="border border-gray-800 rounded-lg p-4 mb-6 bg-surface/50 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center text-white">
              <TrendingUp size={18} className="mr-2" />
              Progress Overview
            </h3>
            <ProgressChart />
          </div>

          <div className="border border-gray-800 rounded-lg p-4 mb-6 bg-surface/50 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center text-white">
              <Clock size={18} className="mr-2" />
              Today's Priorities
            </h3>
            
            {todaysPriorities.length > 0 ? (
              <div>
                {todaysPriorities.map(goal => (
                  <div 
                    key={goal.id}
                    className="border-b border-gray-800 py-2 last:border-0"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium text-white">{goal.name}</h4>
                      <span className="text-xs font-bold bg-surface text-primary-400 px-2 py-1 rounded-full border border-gray-800">
                        P: {goal.priorityScore.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>{goal.progress}% done</span>
                      <button
                        onClick={() => completeGoal(goal.id)}
                        className="text-primary-400 hover:text-primary-300 flex items-center"
                      >
                        <CheckCheck size={14} className="mr-1" />
                        Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No active goals to show</p>
            )}
          </div>

          <div className="border border-gray-800 rounded-lg p-4 bg-surface/50 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-2 text-white">Your Growth</h3>
            {userProfile && (
              <div className="text-white">
                <p className="mb-1">Level {userProfile.level} Achiever</p>
                <p className="text-primary-400 text-sm mb-3">
                  Total Score: {Math.round(userProfile.totalScore)} XP
                </p>
                
                <div className="border border-gray-800 p-3 rounded-lg bg-surface/50">
                  <p className="text-sm mb-2">Next achievement unlocks at level {userProfile.level + 1}</p>
                  <div className="h-2 w-full bg-gray-800 rounded-full mb-1">
                    <div 
                      className="h-full bg-gradient-primary rounded-full"
                      style={{ 
                        width: `${Math.min(
                          ((userProfile.totalScore - userProfile.scoreForCurrentLevel) / 
                          (userProfile.scoreToNextLevel - userProfile.scoreForCurrentLevel)) * 100, 100
                        )}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{Math.round(userProfile.totalScore - userProfile.scoreForCurrentLevel)} XP</span>
                    <span>{Math.round(userProfile.scoreToNextLevel - userProfile.scoreForCurrentLevel)} XP</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;