'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Answer {
  question: string;
  option: string;
  score: number;
}

interface Result {
  testType: string;
  score: number;
  severity: string;
  answers: Answer[];
  date: string;
}

interface ResultsContextType {
  results: Result[];
  addResult: (result: Result) => void;
}

const ResultsContext = createContext<ResultsContextType | undefined>(undefined);

export const ResultsProvider = ({ children }: { children: ReactNode }) => {
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    try {
      const storedResults = localStorage.getItem('calm-nest-results');
      if (storedResults) {
        setResults(JSON.parse(storedResults));
      }
    } catch (error) {
      console.error("Failed to load results from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('calm-nest-results', JSON.stringify(results));
    } catch (error) {
      console.error("Failed to save results to localStorage", error);
    }
  }, [results]);

  const addResult = (result: Result) => {
    setResults(prevResults => [...prevResults, result]);
  };

  return (
    <ResultsContext.Provider value={{ results, addResult }}>
      {children}
    </ResultsContext.Provider>
  );
};

export const useResults = () => {
  const context = useContext(ResultsContext);
  if (context === undefined) {
    throw new Error('useResults must be used within a ResultsProvider');
  }
  return context;
};
