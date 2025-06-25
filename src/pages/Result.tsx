import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  AlertTriangle, 
  Phone, 
  MessageSquare, 
  Heart,
  ArrowRight,
  Clock,
  Brain,
  TrendingUp
} from 'lucide-react';
import { useEmotion, EmotionData } from '../context/EmotionContext';

const Result: React.FC = () => {
  const { addEmotion, isLoading, setIsLoading } = useEmotion();
  const [result, setResult] = useState<EmotionData | null>(null);

  useEffect(() => {
    // Simulate API response with mock data
    const mockAnalysis = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult: EmotionData = {
        id: Date.now().toString(),
        timestamp: new Date(),
        emotion: 'sad',
        confidence: 0.85,
        text: "I'm feeling quite overwhelmed today. Everything seems so difficult and I can't seem to find any joy in things I used to love.",
        isCrisis: true
      };

      setResult(mockResult);
      addEmotion(mockResult);
      setIsLoading(false);
    };

    if (!result) {
      mockAnalysis();
    }
  }, [result, addEmotion, setIsLoading]);

  const getEmotionColor = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'happy':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-900/20',
          border: 'border-emerald-200 dark:border-emerald-800',
          text: 'text-emerald-800 dark:text-emerald-300',
          icon: 'text-emerald-600 dark:text-emerald-400'
        };
      case 'sad':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-800 dark:text-blue-300',
          icon: 'text-blue-600 dark:text-blue-400'
        };
      case 'angry':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-800 dark:text-red-300',
          icon: 'text-red-600 dark:text-red-400'
        };
      case 'anxious':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          text: 'text-yellow-800 dark:text-yellow-300',
          icon: 'text-yellow-600 dark:text-yellow-400'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-800',
          border: 'border-gray-200 dark:border-gray-700',
          text: 'text-gray-800 dark:text-gray-300',
          icon: 'text-gray-600 dark:text-gray-400'
        };
    }
  };

  const getRecommendations = (emotion: string, isCrisis: boolean) => {
    if (isCrisis) {
      return [
        "Reach out to a mental health professional immediately",
        "Contact a trusted friend or family member",
        "Practice grounding techniques (5-4-3-2-1 method)",
        "Consider calling a crisis hotline for immediate support"
      ];
    }

    switch (emotion.toLowerCase()) {
      case 'happy':
        return [
          "Share your positive feelings with others",
          "Engage in activities that bring you joy",
          "Practice gratitude journaling",
          "Consider helping others to spread positivity"
        ];
      case 'sad':
        return [
          "Allow yourself to feel and process your emotions",
          "Reach out to supportive friends or family",
          "Consider gentle physical activity like walking",
          "Practice self-compassion and patience"
        ];
      case 'angry':
        return [
          "Take time to cool down before reacting",
          "Practice deep breathing or meditation",
          "Express your feelings through journaling",
          "Consider the root cause of your anger"
        ];
      case 'anxious':
        return [
          "Practice deep breathing exercises",
          "Try progressive muscle relaxation",
          "Focus on what you can control",
          "Consider mindfulness meditation"
        ];
      default:
        return [
          "Continue monitoring your emotional state",
          "Maintain healthy daily routines",
          "Stay connected with supportive people",
          "Practice self-care activities regularly"
        ];
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mb-6 animate-pulse">
          <Brain className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Analyzing Your Emotional State...
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Our AI is processing your voice input to understand your current emotional wellbeing.
        </p>
        <div className="flex justify-center space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <p className="text-gray-600 dark:text-gray-300">Unable to load analysis results. Please try again.</p>
        <Link 
          to="/"
          className="inline-flex items-center space-x-2 mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          <span>Start New Analysis</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const emotionColors = getEmotionColor(result.emotion);
  const recommendations = getRecommendations(result.emotion, result.isCrisis);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Crisis Alert */}
      {result.isCrisis && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-red-900 dark:text-red-200 mb-2">
                Crisis Detected - Immediate Support Available
              </h2>
              <p className="text-red-800 dark:text-red-300 mb-4">
                Our analysis indicates you may be experiencing significant distress. 
                Please know that help is available and you're not alone.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="tel:988"
                  className="flex items-center space-x-3 p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  <div>
                    <div className="font-semibold">Call 988</div>
                    <div className="text-sm opacity-90">Crisis Lifeline</div>
                  </div>
                </a>
                <a
                  href="sms:741741&body=HOME"
                  className="flex items-center space-x-3 p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <MessageSquare className="h-5 w-5" />
                  <div>
                    <div className="font-semibold">Text HOME to 741741</div>
                    <div className="text-sm opacity-90">Crisis Text Line</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${emotionColors.bg} ${emotionColors.border} border-2`}>
            <Heart className={`h-10 w-10 ${emotionColors.icon}`} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Analysis Complete
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Here's what our AI detected from your voice input
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3 ${emotionColors.bg}`}>
              <Brain className={`h-6 w-6 ${emotionColors.icon}`} />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Detected Emotion</h3>
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${emotionColors.bg} ${emotionColors.text} capitalize`}>
              {result.emotion}
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-3">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Confidence</h3>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round(result.confidence * 100)}%
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-3">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Analyzed</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {result.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Transcription */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">What You Shared</h3>
          <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
            "{result.text}"
          </p>
        </div>

        {/* Recommendations */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Personalized Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 dark:text-gray-300 text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/dashboard"
            className="flex-1 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-center"
          >
            View Your Dashboard
          </Link>
          <Link
            to="/"
            className="flex-1 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-xl border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 text-center"
          >
            New Check-in
          </Link>
        </div>
      </div>

      {/* Support Resources */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-4">
          Additional Support Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Professional Help</h4>
            <ul className="space-y-1 text-blue-700 dark:text-blue-300">
              <li>• Find a therapist near you</li>
              <li>• Online counseling services</li>
              <li>• Mental health apps</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Self-Care</h4>
            <ul className="space-y-1 text-blue-700 dark:text-blue-300">
              <li>• Mindfulness meditation</li>
              <li>• Regular exercise routine</li>
              <li>• Healthy sleep habits</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;