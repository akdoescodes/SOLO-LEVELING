import React from 'react';
import { formatDistance } from 'date-fns';
import { CheckCircle, Circle, AlertCircle, Clock, Edit, Trash2, BarChart } from 'lucide-react';
import { GoalWithCalculations } from '../types/goal';
import { formatNumber } from '../utils/calculations';
import { motion } from 'framer-motion';

interface GoalCardProps {
  goal: GoalWithCalculations;
  onComplete: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onComplete, onEdit, onDelete }) => {
  const getDeadlineIcon = () => {
    switch (goal.deadlineIndicator) {
      case 'red':
        return <AlertCircle className="text-red-500" size={18} />;
      case 'orange':
        return <Clock className="text-orange-500" size={18} />;
      case 'green':
        return <Clock className="text-green-500" size={18} />;
      default:
        return null;
    }
  };

  const getStatusIcon = () => {
    switch (goal.status) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'in-progress':
        return <BarChart className="text-blue-500" size={20} />;
      case 'not-started':
        return <Circle className="text-gray-400" size={20} />;
      default:
        return null;
    }
  };

  const getDeadlineColor = () => {
    switch (goal.deadlineIndicator) {
      case 'red':
        return 'text-red-500';
      case 'orange':
        return 'text-orange-500';
      case 'green':
        return 'text-green-500';
      default:
        return 'text-gray-400';
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <motion.div 
      className="border border-gray-800 rounded-lg p-4 mb-4 bg-surface/50 backdrop-blur-sm hover:shadow-glow transition-all"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          {getStatusIcon()}
          <h3 className="font-semibold text-lg ml-2 text-white">{goal.name}</h3>
        </div>
        <div className="flex">
          <button 
            onClick={() => onEdit(goal.id)}
            className="text-gray-400 hover:text-primary-400 mr-2"
            aria-label="Edit goal"
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={() => onDelete(goal.id)}
            className="text-gray-400 hover:text-red-500"
            aria-label="Delete goal"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mt-2">
        {goal.tags.map(tag => (
          <span 
            key={tag} 
            className="text-xs px-2 py-1 rounded-full bg-surface text-gray-300 border border-gray-800"
          >
            {tag}
          </span>
        ))}
      </div>

      {goal.notes && (
        <p className="text-sm text-gray-400 mt-2">{goal.notes}</p>
      )}

      <div className="mt-3">
        <div className="h-2 w-full bg-surface rounded-full mt-1">
          <div 
            className="h-full rounded-full bg-gradient-primary"
            style={{ width: `${goal.progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{goal.progress}% complete</span>
          <span className={`flex items-center ${getDeadlineColor()}`}>
            {getDeadlineIcon()}
            <span className="ml-1">
              {formatDistance(new Date(goal.endDate), new Date(), { addSuffix: true })}
            </span>
          </span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
        <div className="border border-gray-800 rounded p-2 bg-surface">
          <div className="font-medium text-gray-400">Priority</div>
          <div className="font-bold text-primary-400">{formatNumber(goal.priorityScore)}</div>
        </div>
        <div className="border border-gray-800 rounded p-2 bg-surface">
          <div className="font-medium text-gray-400">Effort</div>
          <div className="font-bold text-primary-400">{formatNumber(goal.effort)}</div>
        </div>
        <div className="border border-gray-800 rounded p-2 bg-surface">
          <div className="font-medium text-gray-400">Value</div>
          <div className="font-bold text-primary-400">{formatNumber(goal.cumulativeScore)}</div>
        </div>
      </div>

      {goal.status !== 'completed' && (
        <div className="mt-3">
          <button
            onClick={() => onComplete(goal.id)}
            className="w-full py-2 bg-gradient-primary text-white rounded-md font-medium transition-all hover:opacity-90"
          >
            Complete Goal
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default GoalCard;