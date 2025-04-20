import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartData
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { useGoals } from '../context/GoalContext';
import { GoalTag } from '../types/goal';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ProgressChart: React.FC = () => {
  const { goals, scoreHistory } = useGoals();
  
  // Prepare data for line chart - last 7 entries
  const lineData = {
    labels: scoreHistory
      .slice(-7)
      .map(entry => new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Growth Score',
        data: scoreHistory.slice(-7).map(entry => entry.score),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  };

  // Calculate tag distribution for pie chart
  const tagCounts: Record<GoalTag, number> = goals.reduce((acc, goal) => {
    goal.tags.forEach(tag => {
      const tagKey = tag as GoalTag;
      acc[tagKey] = (acc[tagKey] || 0) + 1;
    });
    return acc;
  }, {} as Record<GoalTag, number>);

  const pieData: ChartData<'pie'> = {
    labels: Object.keys(tagCounts),
    datasets: [
      {
        data: Object.values(tagCounts),
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)',  // primary-500
          'rgba(59, 130, 246, 0.7)',  // secondary-500
          'rgba(236, 72, 153, 0.7)',  // accent-500
          'rgba(249, 115, 22, 0.7)',  // orange-500
          'rgba(139, 92, 246, 0.7)',  // purple-500
          'rgba(234, 179, 8, 0.7)',   // yellow-500
          'rgba(6, 182, 212, 0.7)',   // cyan-500
          'rgba(156, 163, 175, 0.7)', // gray-400
        ],
        borderWidth: 1,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
    maintainAspectRatio: false,
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 10,
          font: {
            size: 10,
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-2">Growth Over Time</h4>
      <div className="h-48 mb-6">
        <Line data={lineData} options={lineOptions} />
      </div>
      
      <h4 className="text-sm font-medium text-gray-700 mb-2">Goals by Tag</h4>
      <div className="h-48">
        <Pie data={pieData} options={pieOptions} />
      </div>
    </div>
  );
};

export default ProgressChart;