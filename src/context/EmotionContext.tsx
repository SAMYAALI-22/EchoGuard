import React, { createContext, useContext, useState, useEffect } from 'react';

export interface EmotionData {
  id: string;
  timestamp: Date;
  emotion: string;
  confidence: number;
  text: string;
  isCrisis: boolean;
}

interface EmotionContextType {
  emotions: EmotionData[];
  addEmotion: (emotion: EmotionData) => void;
  latestEmotion: EmotionData | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const EmotionContext = createContext<EmotionContextType | undefined>(undefined);

export const useEmotion = () => {
  const context = useContext(EmotionContext);
  if (!context) {
    throw new Error('useEmotion must be used within an EmotionProvider');
  }
  return context;
};

export const EmotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [emotions, setEmotions] = useState<EmotionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load emotions from localStorage on mount
    const savedEmotions = localStorage.getItem('echoguard-emotions');
    if (savedEmotions) {
      const parsed = JSON.parse(savedEmotions).map((e: any) => ({
        ...e,
        timestamp: new Date(e.timestamp)
      }));
      setEmotions(parsed);
    }
  }, []);

  const addEmotion = (emotion: EmotionData) => {
    const newEmotions = [emotion, ...emotions];
    setEmotions(newEmotions);
    localStorage.setItem('echoguard-emotions', JSON.stringify(newEmotions));
  };

  const latestEmotion = emotions.length > 0 ? emotions[0] : null;

  return (
    <EmotionContext.Provider value={{ 
      emotions, 
      addEmotion, 
      latestEmotion, 
      isLoading, 
      setIsLoading 
    }}>
      {children}
    </EmotionContext.Provider>
  );
};