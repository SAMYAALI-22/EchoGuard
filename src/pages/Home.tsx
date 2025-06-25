import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Play, Square, AlertTriangle, Heart, Brain, Shield } from 'lucide-react';
import { useEmotion } from '../context/EmotionContext';

const Home: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const { setIsLoading } = useEmotion();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      const chunks: BlobPart[] = [];
      mediaRecorder.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const analyzeEmotion = async () => {
    if (!audioBlob) return;

    setIsLoading(true);
    
    // Mock API call - in real implementation, send audioBlob to backend
    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // In real implementation, send audio data
          mockText: "I'm feeling quite overwhelmed today. Everything seems so difficult and I can't seem to find any joy in things I used to love."
        }),
      });

      if (response.ok) {
        const result = await response.json();
        navigate('/result');
      } else {
        throw new Error('Analysis failed');
      }
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      // Use mock data for demo
      setTimeout(() => {
        setIsLoading(false);
        navigate('/result');
      }, 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mb-6">
          <Heart className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          How are you feeling today?
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Share your thoughts through voice and receive personalized emotional insights 
          powered by AI. Your mental health matters.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Brain className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">AI Analysis</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Advanced sentiment analysis to understand your emotional state
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Shield className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Crisis Detection</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Automatic alerts for mental health emergencies with support resources
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Heart className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Trend Tracking</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Monitor your emotional patterns over time for better self-awareness
          </p>
        </div>
      </div>

      {/* Recording Section */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50">
        <div className="text-center">
          <div className="mb-8">
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 transition-all duration-300 ${
              isRecording 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse shadow-lg shadow-red-200' 
                : 'bg-gradient-to-r from-blue-500 to-emerald-500 hover:shadow-lg hover:shadow-blue-200'
            }`}>
              {isRecording ? (
                <MicOff className="h-16 w-16 text-white" />
              ) : (
                <Mic className="h-16 w-16 text-white" />
              )}
            </div>

            {isRecording && (
              <div className="mb-4">
                <div className="text-2xl font-mono font-bold text-red-600 mb-2">
                  {formatTime(recordingTime)}
                </div>
                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-red-500 rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 20 + 10}px`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {!isRecording && !audioBlob && (
                <button
                  onClick={startRecording}
                  className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <div className="flex items-center space-x-3">
                    <Mic className="h-5 w-5" />
                    <span>Start Voice Check-in</span>
                  </div>
                </button>
              )}

              {isRecording && (
                <button
                  onClick={stopRecording}
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <Square className="h-5 w-5" />
                    <span>Stop Recording</span>
                  </div>
                </button>
              )}

              {audioBlob && (
                <div className="space-y-4">
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => {
                        const audio = new Audio(URL.createObjectURL(audioBlob));
                        audio.play();
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      <Play className="h-4 w-4" />
                      <span>Play Recording</span>
                    </button>
                    <button
                      onClick={() => {
                        setAudioBlob(null);
                        setRecordingTime(0);
                      }}
                      className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Record Again
                    </button>
                  </div>
                  <button
                    onClick={analyzeEmotion}
                    className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    <div className="flex items-center space-x-3">
                      <Brain className="h-5 w-5" />
                      <span>Analyze My Emotions</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Privacy & Support</p>
                <p>
                  Your voice data is processed securely and never stored permanently. 
                  If you're experiencing a mental health crisis, please contact emergency services 
                  or call the National Suicide Prevention Lifeline at 988.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;