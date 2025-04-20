import React from 'react';
import { motion } from 'framer-motion';

interface LevelBarProps {
  level: number;
  currentScore: number;
  scoreForCurrentLevel: number;
  scoreToNextLevel: number;
}

const LevelBar: React.FC<LevelBarProps> = ({
  level,
  currentScore,
  scoreForCurrentLevel,
  scoreToNextLevel,
}) => {
  const progress = Math.min(
    (currentScore - scoreForCurrentLevel) / (scoreToNextLevel - scoreForCurrentLevel) * 100,
    100
  );

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          <div className="h-6 w-6 flex items-center justify-center rounded-full bg-gradient-primary text-white text-xs font-bold">
            {level}
          </div>
          <span className="ml-2 font-semibold text-white">Level {level}</span>
        </div>
        <span className="text-sm text-gray-400">
          {Math.round(currentScore - scoreForCurrentLevel)}/{Math.round(scoreToNextLevel - scoreForCurrentLevel)} XP
        </span>
      </div>
      <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default LevelBar;