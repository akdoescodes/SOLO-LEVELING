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
  const chartRef = React.useRef<ChartJS<'line'>>(null);

  // Calculate cumulative scores
  const cumulativeScores = React.useMemo(() => {
    return scoreHistory.reduce((acc, entry, index) => {
      const previousTotal = index > 0 ? acc[index - 1] : 0;
      acc.push(previousTotal + entry.score);
      return acc;
    }, [] as number[]);
  }, [scoreHistory]);

  // Get last 7 entries (or all if less than 7)
  const displayCount = Math.min(100, scoreHistory.length);
  const lastEntries = scoreHistory.slice(-displayCount);
  const lastCumulative = cumulativeScores.slice(-displayCount);

  // Line chart data
  const lineData = {
    labels: lastEntries.map(entry => 
      new Date(entry.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    ),
    datasets: [
      {
        label: 'Cumulative Growth',
        data: lastCumulative,
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // Calculate max value for y-axis with some padding
  const maxValue = React.useMemo(() => {
    if (cumulativeScores.length === 0) return 10;
    return Math.max(...cumulativeScores) * 1.1;
  }, [cumulativeScores]);

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.raw;
            const prevValue = context.datasetIndex === 0 
              ? context.parsed.y - (scoreHistory[context.dataIndex]?.score || 0)
              : null;
            
            return prevValue !== null 
              ? [`${label}: ${value}`, `(+${value - prevValue} this time)`]
              : `${label}: ${value}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: maxValue,
        ticks: {
          precision: 0,
          stepSize: Math.ceil(maxValue / 5),
        },
      },
    },
    maintainAspectRatio: false,
  };

  // Pie chart data (tag distribution)
  const tagCounts: Record<GoalTag, number> = goals.reduce((acc, goal) => {
    goal.tags?.forEach(tag => {
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
          'rgba(16, 185, 129, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(236, 72, 153, 0.7)',
          'rgba(249, 115, 22, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(234, 179, 8, 0.7)',
          'rgba(6, 182, 212, 0.7)',
          'rgba(156, 163, 175, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
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

  // Update chart when data changes
  React.useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [scoreHistory, goals]);

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Growth Over Time</h4>
        <div className="h-48">
          <Line 
            ref={chartRef} 
            data={lineData} 
            options={lineOptions} 
          />
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Goals by Tag</h4>
        <div className="h-48">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;