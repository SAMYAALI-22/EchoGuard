import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { format, startOfDay, subDays } from 'date-fns';
import { TrendingUp, Calendar, Heart, AlertTriangle, Smile, Frown } from 'lucide-react';
import { useEmotion } from '../context/EmotionContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard: React.FC = () => {
  const { emotions } = useEmotion();

  const emotionColors = {
    happy: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
    sad: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
    angry: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
    anxious: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
    neutral: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
  };

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), 6 - i));
      return {
        date,
        label: format(date, 'MMM dd'),
        emotions: emotions.filter(e => 
          startOfDay(e.timestamp).getTime() === date.getTime()
        )
      };
    });

    const emotionScore = (emotion: string) => {
      switch (emotion.toLowerCase()) {
        case 'happy': return 5;
        case 'neutral': return 3;
        case 'anxious': return 2;
        case 'sad': return 1;
        case 'angry': return 0;
        default: return 3;
      }
    };

    const avgScores = last7Days.map(day => {
      if (day.emotions.length === 0) return null;
      const total = day.emotions.reduce((sum, e) => sum + emotionScore(e.emotion), 0);
      return total / day.emotions.length;
    });

    return {
      labels: last7Days.map(d => d.label),
      datasets: [
        {
          label: 'Emotional Wellbeing',
          data: avgScores,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: 'white',
          pointBorderWidth: 2,
          pointRadius: 6,
        },
      ],
    };
  }, [emotions]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#374151',
        bodyColor: '#6B7280',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context: any) => {
            const score = context.parsed.y;
            if (score === null) return 'No data';
            if (score >= 4.5) return 'Very Positive';
            if (score >= 3.5) return 'Positive';
            if (score >= 2.5) return 'Neutral';
            if (score >= 1.5) return 'Concerning';
            return 'Needs Attention';
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          callback: (value: any) => {
            const labels = ['Crisis', 'Low', 'Moderate', 'Good', 'Excellent'];
            return labels[value] || '';
          },
          color: '#6B7280',
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
        },
      },
      x: {
        ticks: {
          color: '#6B7280',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const recentEmotions = emotions.slice(0, 5);
  const emotionCounts = emotions.reduce((acc, emotion) => {
    acc[emotion.emotion] = (acc[emotion.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const crisisCount = emotions.filter(e => e.isCrisis).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Your Mental Health Dashboard
        </h1>
        <p className="text-gray-600">
          Track your emotional wellbeing over time and identify patterns
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Check-ins</p>
              <p className="text-2xl font-bold text-gray-900">{emotions.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Heart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {emotions.filter(e => e.timestamp >= subDays(new Date(), 7)).length}
              </p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Calendar className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Positive Moods</p>
              <p className="text-2xl font-bold text-gray-900">
                {emotions.filter(e => e.emotion === 'happy').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Smile className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Crisis Alerts</p>
              <p className="text-2xl font-bold text-red-600">{crisisCount}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Emotional Trend Chart */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">7-Day Emotional Trend</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <TrendingUp className="h-4 w-4" />
            <span>Wellbeing Score</span>
          </div>
        </div>
        <div className="h-64">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Check-ins */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200/50">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Check-ins</h2>
          <div className="space-y-4">
            {recentEmotions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No check-ins yet. Start by recording your first emotional check-in!
              </p>
            ) : (
              recentEmotions.map((emotion) => (
                <div key={emotion.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    emotionColors[emotion.emotion as keyof typeof emotionColors]?.bg || 'bg-gray-100'
                  } ${
                    emotionColors[emotion.emotion as keyof typeof emotionColors]?.text || 'text-gray-800'
                  }`}>
                    {emotion.emotion}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 truncate">{emotion.text}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(emotion.timestamp, 'MMM dd, yyyy at h:mm a')}
                    </p>
                  </div>
                  {emotion.isCrisis && (
                    <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Emotion Breakdown */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200/50">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Emotion Breakdown</h2>
          <div className="space-y-3">
            {Object.entries(emotionCounts).map(([emotion, count]) => {
              const percentage = Math.round((count / emotions.length) * 100);
              const colorClass = emotionColors[emotion as keyof typeof emotionColors];
              
              return (
                <div key={emotion} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {emotion}
                    </span>
                    <span className="text-sm text-gray-500">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        colorClass?.bg.replace('bg-', 'bg-').replace('-100', '-500') || 'bg-gray-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Crisis Support Section */}
      {crisisCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Mental Health Support Resources
              </h3>
              <p className="text-red-800 mb-4">
                We detected {crisisCount} concerning check-in{crisisCount > 1 ? 's' : ''} recently. 
                Your mental health is important, and help is available.
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-red-700">
                  <strong>Crisis Hotline:</strong> 988 (National Suicide Prevention Lifeline)
                </p>
                <p className="text-red-700">
                  <strong>Crisis Text Line:</strong> Text HOME to 741741
                </p>
                <p className="text-red-700">
                  <strong>Emergency:</strong> Call 911 for immediate assistance
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;