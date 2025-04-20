import React from 'react';
import { useGoals } from '../context/GoalContext';
import LevelBar from './LevelBar';
import { Trophy } from 'lucide-react';

const Header: React.FC = () => {
  const { userProfile } = useGoals();

  if (!userProfile) return null;

  return (
    <header className="border-b border-gray-800 bg-surface/50 backdrop-blur-sm text-white py-4 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold flex items-center">
              <Trophy className="mr-2 text-primary-400" size={24} />
              Leveler
            </h1>
            <p className="text-gray-400 text-sm">Track your growth, level up your life</p>
          </div>
          
          <div className="w-full md:w-1/2 lg:w-2/5">
            <LevelBar
              level={userProfile.level}
              currentScore={userProfile.totalScore}
              scoreForCurrentLevel={userProfile.scoreForCurrentLevel}
              scoreToNextLevel={userProfile.scoreToNextLevel}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;