import React, { useState } from 'react';
import { GoalProvider } from './context/GoalContext';
import MainLayout from './layouts/MainLayout';
import Dashboard from './components/Dashboard';
import GoalForm from './components/GoalForm';
import { Goal } from './types/goal';
import { useGoals } from './context/GoalContext';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | undefined>(undefined);

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsFormOpen(true);
  };

  const GoalFormModal: React.FC = () => {
    const { saveGoal, deleteGoal } = useGoals();

    const handleSave = (goal: Goal) => {
      saveGoal(goal);
      setIsFormOpen(false);
      setSelectedGoal(undefined);
    };

    const handleCancel = () => {
      setIsFormOpen(false);
      setSelectedGoal(undefined);
    };

    const handleDelete = (id: string) => {
      if (window.confirm('Are you sure you want to delete this goal?')) {
        deleteGoal(id);
        setIsFormOpen(false);
        setSelectedGoal(undefined);
      }
    };

    return (
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-3xl max-h-[90vh] overflow-auto"
            >
              <GoalForm 
                initialGoal={selectedGoal} 
                onSave={handleSave} 
                onCancel={handleCancel}
                onDelete={handleDelete}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <GoalProvider>
      <MainLayout>
        <Dashboard 
          onOpenForm={handleOpenForm}
          onEditGoal={handleEditGoal}
        />
        <GoalFormModal />
      </MainLayout>
    </GoalProvider>
  );
};

export default App;