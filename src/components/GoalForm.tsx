import React, { useState, useEffect } from 'react';
import { Goal, GoalStatus, GoalTag, SubTask } from '../types/goal';
import { v4 as uuidv4 } from 'uuid';
import { X, Plus, Save, Trash2 } from 'lucide-react';

interface GoalFormProps {
  initialGoal?: Goal;
  onSave: (goal: Goal) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

const DEFAULT_GOAL: Goal = {
  id: '',
  name: '',
  tags: [],
  notes: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  urgency: 5,
  impact: 5,
  timeEstimate: 1,
  motivation: 5,
  complexity: 5,
  status: 'not-started',
  progress: 0,
  subTasks: [],
  createdAt: new Date().toISOString(),
};

const TAGS: GoalTag[] = [
  'work', 
  'health', 
  'personal', 
  'finance', 
  'creative', 
  'learning', 
  'social', 
  'other'
];

const GoalForm: React.FC<GoalFormProps> = ({ initialGoal, onSave, onCancel, onDelete }) => {
  const [goal, setGoal] = useState<Goal>(initialGoal || { ...DEFAULT_GOAL, id: uuidv4() });
  const [newSubTask, setNewSubTask] = useState('');

  useEffect(() => {
    if (initialGoal) {
      setGoal(initialGoal);
    }
  }, [initialGoal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setGoal(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = name === 'progress' ? parseInt(value) : parseFloat(value);
    
    setGoal(prev => ({
      ...prev,
      [name]: numValue,
    }));
  };

  const handleTagToggle = (tag: GoalTag) => {
    setGoal(prev => {
      const currentTags = prev.tags as GoalTag[];
      
      if (currentTags.includes(tag)) {
        return {
          ...prev,
          tags: currentTags.filter(t => t !== tag),
        };
      } else {
        return {
          ...prev,
          tags: [...currentTags, tag],
        };
      }
    });
  };

  const addSubTask = () => {
    if (!newSubTask.trim()) return;
    
    const newTask: SubTask = {
      id: uuidv4(),
      text: newSubTask.trim(),
      completed: false,
    };
    
    setGoal(prev => ({
      ...prev,
      subTasks: [...prev.subTasks, newTask],
    }));
    
    setNewSubTask('');
  };

  const removeSubTask = (id: string) => {
    setGoal(prev => ({
      ...prev,
      subTasks: prev.subTasks.filter(task => task.id !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(goal);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface border border-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">{initialGoal ? 'Edit Goal' : 'Create New Goal'}</h2>
        {initialGoal && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(initialGoal.id)}
            className="text-red-500 hover:text-red-400 flex items-center"
          >
            <Trash2 size={18} className="mr-1" />
            Delete Goal
          </button>
        )}
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Goal Name
        </label>
        <input
          type="text"
          name="name"
          value={goal.name}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-[#0d0d0d] border border-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {TAGS.map(tag => (
            <button
              type="button"
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1 text-sm rounded-full border ${
                goal.tags.includes(tag)
                  ? 'border-primary-500 text-primary-400'
                  : 'border-gray-800 text-gray-400 hover:border-gray-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          value={goal.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 bg-[#0d0d0d] border border-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Start Date
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              name="startDate"
              value={goal.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#0d0d0d] border border-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
            <div
              className="absolute inset-y-0 right-0 flex items-center px-3 py-2 cursor-pointer"
              onClick={() => {
                const datePicker = document.getElementById('startDatePicker') as HTMLInputElement;
                if (datePicker) {
                  datePicker.showPicker();
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 4a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H5zm3 0h4a1 1 0 011 1v1a1 1 0 01-1 1H8a1 1 0 01-1-1V5a1 1 0 011-1zm5 5a1 1 0 00-1 1v3a1 1 0 001 1h2a1 1 0 001-1v-3a1 1 0 00-1-1h-2zm-4 0a1 1 0 00-1 1v3a1 1 0 001 1h2a1 1 0 001-1v-3a1 1 0 00-1-1H7zm-2 4a1 1 0 100 2 1 1 0 000-2zm7 0a1 1 0 100 2 1 1 0 000-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="date"
              id="startDatePicker"
              className="absolute inset-y-0 right-0 px-3 py-2 bg-transparent border-none text-white cursor-pointer opacity-0 z-10"
              style={{zIndex: 1}}
              

                onChange={(e) => {
                  if (e.target instanceof HTMLInputElement) {
                    setGoal({ ...goal, startDate: e.target.value });
                  }
                handleChange(e);
                if (e.target instanceof HTMLInputElement) {
                  e.target.blur(); // Close the calendar after selection
                }
              }}
            />
          </div>
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            End Date
          </label>
          <div  className="relative flex items-center">
            <input type="text" name="endDate" value={goal.endDate} onChange={handleChange} className="w-full px-3 py-2 bg-[#0d0d0d] border border-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" required />
            <div className="absolute inset-y-0 right-0 flex items-center px-3 py-2 cursor-pointer" onClick={() => { const datePicker = document.getElementById('endDatePicker') as HTMLInputElement; if (datePicker) { datePicker.showPicker(); } }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H5zm3 0h4a1 1 0 011 1v1a1 1 0 01-1 1H8a1 1 0 01-1-1V5a1 1 0 011-1zm5 5a1 1 0 00-1 1v3a1 1 0 001 1h2a1 1 0 001-1v-3a1 1 0 00-1-1h-2zm-4 0a1 1 0 00-1 1v3a1 1 0 001 1h2a1 1 0 001-1v-3a1 1 0 00-1-1H7zm-2 4a1 1 0 100 2 1 1 0 000-2zm7 0a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>
            </div>
            <input type="date" id="endDatePicker" className="absolute inset-y-0 right-0 px-3 py-2 bg-transparent border-none text-white cursor-pointer opacity-0 z-10" style={{ zIndex: 1 }} onChange={(e) => { if (e.target instanceof HTMLInputElement) { setGoal({ ...goal, endDate: e.target.value }); } handleChange(e); if (e.target instanceof HTMLInputElement) { e.target.blur(); } }} />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Urgency (1-10)
          </label>
          <input
            type="range"
            name="urgency"
            min="1"
            max="10"
            value={goal.urgency}
            onChange={handleNumberChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Impact (1-10)
          </label>
          <input
            type="range"
            name="impact"
            min="1"
            max="10"
            value={goal.impact}
            onChange={handleNumberChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Motivation (1-10)
          </label>
          <input
            type="range"
            name="motivation"
            min="1"
            max="10"
            value={goal.motivation}
            onChange={handleNumberChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Time Estimate (hours)
          </label>
          <input
            type="number"
            name="timeEstimate"
            min="0.5"
            step="0.5"
            value={goal.timeEstimate}
            onChange={handleNumberChange}
            className="w-full px-3 py-2 bg-[#0d0d0d] border border-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Complexity (1-10)
          </label>
          <input
            type="range"
            name="complexity"
            min="1"
            max="10"
            value={goal.complexity}
            onChange={handleNumberChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Easy</span>
            <span>Medium</span>
            <span>Hard</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Status
          </label>
          <select
            name="status"
            value={goal.status}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#0d0d0d] border border-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          >
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Progress (%)
          </label>
          <input
            type="range"
            name="progress"
            min="0"
            max="100"
            value={goal.progress}
            onChange={handleNumberChange}
            className="w-full"
          />
          <div className="text-center text-sm text-gray-400">{goal.progress}%</div>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Subtasks
        </label>
        <div className="flex">
          <input
            type="text"
            value={newSubTask}
            onChange={(e) => setNewSubTask(e.target.value)}
            className="flex-1 px-3 py-2 bg-[#0d0d0d] border border-gray-800 rounded-l-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Add a subtask"
          />
          <button
            type="button"
            onClick={addSubTask}
            className="bg-primary-500 text-white px-3 py-2 rounded-r-md hover:bg-primary-600 flex items-center"
          >
            <Plus size={18} />
          </button>
        </div>
        
        <ul className="mt-2">
          {goal.subTasks.map(task => (
            <li key={task.id} className="flex items-center justify-between bg-surface border border-gray-800 p-2 mb-1 rounded">
              <span className="text-sm text-gray-300">{task.text}</span>
              <button
                type="button"
                onClick={() => removeSubTask(task.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-300 border border-gray-800 hover:bg-surface rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-gradient-primary hover:opacity-90 rounded-md flex items-center"
        >
          <Save size={18} className="mr-1" />
          Save Goal
        </button>
      </div>
    </form>
  );
};

export default GoalForm;