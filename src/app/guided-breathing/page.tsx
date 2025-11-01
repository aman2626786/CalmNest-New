'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { X, Wind, Brain, Heart, Moon, PersonStanding, Eye, Sparkles, Clock, Star, Zap, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { HydrationSafeTranslation } from '@/components/common/HydrationSafeTranslation';

// TypeScript interfaces
interface BreathingPhase {
  instruction: string;
  duration: number;
  animation: string;
}

interface BreathingExercise {
  id: string;
  titleKey: string;
  descriptionKey: string;
  scienceKey: string;
  icon: JSX.Element;
  difficulty: string;
  color: string;
  cycle: BreathingPhase[];
  steps?: string[];
}

interface ExerciseCardProps {
  exercise: BreathingExercise;
  onStart: (exercise: BreathingExercise) => void;
}

interface ExerciseGridProps {
  exercises: BreathingExercise[];
  onStart: (exercise: BreathingExercise) => void;
}

interface BreathingAnimationProps {
  exercise: BreathingExercise;
  onFinish: () => void;
}

// Breathing Exercises Data
const getBreathingExercises = () => [
  {
    id: 'box-breathing',
    titleKey: 'box-breathing.title',
    descriptionKey: 'box-breathing.description',
    scienceKey: 'box-breathing.science',
    icon: <Wind className="h-8 w-8 text-blue-500" />,
    difficulty: 'Beginner',
    color: 'from-blue-500 to-cyan-500',
    cycle: [
      { instruction: 'Inhale slowly through nose', duration: 4, animation: 'inhale' },
      { instruction: 'Hold breath gently', duration: 4, animation: 'hold' },
      { instruction: 'Exhale slowly through mouth', duration: 4, animation: 'exhale' },
      { instruction: 'Hold empty lungs', duration: 4, animation: 'hold' },
    ],
  },
  {
    id: '478-breathing',
    titleKey: '478-breathing.title',
    descriptionKey: '478-breathing.description',
    scienceKey: '478-breathing.science',
    icon: <Moon className="h-8 w-8 text-purple-500" />,
    difficulty: 'Intermediate',
    color: 'from-purple-500 to-indigo-500',
    steps: [
      'Place tongue tip behind upper front teeth',
      'Exhale completely through mouth',
      'Close mouth, inhale through nose for 4',
      'Hold breath for 7 counts',
      'Exhale through mouth for 8 counts',
      'Repeat 3-4 cycles'
    ],
    cycle: [
      { instruction: 'Inhale through nose', duration: 4, animation: 'inhale' },
      { instruction: 'Hold breath completely', duration: 7, animation: 'hold' },
      { instruction: 'Exhale through mouth (whoosh)', duration: 8, animation: 'exhale' },
    ],
  },
  {
    id: '54321-grounding',
    titleKey: '54321-grounding.title',
    descriptionKey: '54321-grounding.description',
    scienceKey: '54321-grounding.science',
    icon: <Eye className="h-8 w-8 text-green-500" />,
    difficulty: 'Beginner',
    color: 'from-green-500 to-emerald-500',
    cycle: [
      { instruction: 'See 5 things around you', duration: 10, animation: 'observe' },
      { instruction: 'Feel 4 things you can touch', duration: 10, animation: 'observe' },
      { instruction: 'Hear 3 sounds around you', duration: 10, animation: 'observe' },
      { instruction: 'Smell 2 scents', duration: 10, animation: 'observe' },
      { instruction: 'Taste 1 thing', duration: 10, animation: 'observe' },
    ],
  },
  {
    id: 'alternate-nostril',
    titleKey: 'alternate-nostril.title',
    descriptionKey: 'alternate-nostril.description',
    scienceKey: 'alternate-nostril.science',
    icon: <Wind className="h-8 w-8 text-blue-400" />,
    difficulty: 'Intermediate',
    color: 'from-blue-400 to-indigo-400',
    cycle: [
      { instruction: 'Inhale through left nostril', duration: 4, animation: 'inhale' },
      { instruction: 'Exhale through right nostril', duration: 4, animation: 'exhale' },
      { instruction: 'Inhale through right nostril', duration: 4, animation: 'inhale' },
      { instruction: 'Exhale through left nostril', duration: 4, animation: 'exhale' },
    ],
  },
  {
    id: 'pmr',
    titleKey: 'pmr.title',
    descriptionKey: 'pmr.description',
    scienceKey: 'pmr.science',
    icon: <PersonStanding className="h-8 w-8 text-purple-500" />,
    difficulty: 'Beginner',
    color: 'from-purple-500 to-indigo-500',
    cycle: [
      { instruction: 'Tense muscles for 5 seconds', duration: 5, animation: 'squeeze' },
      { instruction: 'Release and relax for 10 seconds', duration: 10, animation: 'release' },
    ],
  },
];

// Breathing Animation Component
const BreathingAnimation = ({ exercise, onFinish }: BreathingAnimationProps) => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(exercise.cycle[0]?.duration || 4);
  const [isActive, setIsActive] = useState(true);

  const currentPhase = exercise.cycle[phaseIndex];
  const maxCycles = 5; // Number of complete cycles

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          const nextPhaseIndex = (phaseIndex + 1) % exercise.cycle.length;

          if (nextPhaseIndex === 0) {
            setCycleCount(prev => prev + 1);
          }

          if (cycleCount >= maxCycles && nextPhaseIndex === 0) {
            setIsActive(false);
            setTimeout(onFinish, 1000);
            return 0;
          }

          setPhaseIndex(nextPhaseIndex);
          return exercise.cycle[nextPhaseIndex]?.duration || 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phaseIndex, cycleCount, isActive, exercise.cycle, onFinish]);

  const circleVariants: Variants = {
    initial: { scale: 1, opacity: 0.8 },
    inhale: { scale: 1.5, transition: { duration: currentPhase?.duration || 4, ease: 'easeInOut' } },
    exhale: { scale: 0.75, transition: { duration: currentPhase?.duration || 4, ease: 'easeInOut' } },
    hold: { scale: 1.2, transition: { duration: currentPhase?.duration || 4, ease: 'easeInOut' } },
    squeeze: { scale: 0.9, opacity: 1, transition: { duration: 0.5, repeat: Infinity, repeatType: 'mirror' as const } },
    release: { scale: 1, opacity: 0.8, transition: { duration: 2, ease: 'easeOut' } },
    observe: { scale: 1, opacity: 0.8, transition: { duration: 1, ease: 'easeInOut' } },
    'child-pose': { scale: 0.7, opacity: 0.7, transition: { duration: currentPhase?.duration || 3, ease: 'easeInOut' } },
    'self-love': { scale: 1.2, opacity: 0.9, transition: { duration: currentPhase?.duration || 3, ease: 'easeInOut' } },
    'universal-love': { scale: 1.6, opacity: 1, transition: { duration: currentPhase?.duration || 3, ease: 'easeInOut' } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center z-50"
    >
      <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white hover:bg-white/10" onClick={onFinish}>
        <X className="h-6 w-6" />
      </Button>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">{exercise.title}</h2>
        <p className="text-gray-300">{exercise.subtitle}</p>
        <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-400">
          <span>Cycle {cycleCount + 1} of {maxCycles}</span>
          <span>•</span>
          <span>{exercise.duration}</span>
        </div>
      </div>

      <div className="relative flex items-center justify-center w-80 h-80 mb-8">
        <motion.div
          className={`absolute rounded-full w-full h-full bg-gradient-to-r ${exercise.color} opacity-20`}
          variants={circleVariants}
          initial="initial"
          animate={currentPhase?.animation || 'initial'}
          key={phaseIndex}
        />
        <AnimatePresence mode="wait">
          {currentPhase && (
            <motion.div
              key={phaseIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="text-xl font-semibold text-white mb-2">{currentPhase.instruction}</p>
              <p className="text-4xl font-bold text-white">{timeLeft}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-lg text-gray-300 text-center max-w-md">
        Follow the breathing pattern and let your mind find peace
      </p>
    </motion.div>
  );
};

// Hardcoded fallbacks for SSR
const getHardcodedTitle = (id: string): string => {
  const titles: Record<string, string> = {
    'box-breathing': 'Box Breathing',
    '478-breathing': '4-7-8 Breathing',
    '54321-grounding': '5-4-3-2-1 Grounding',
    'alternate-nostril': 'Alternate Nostril Breathing',
    'pmr': 'Progressive Muscle Relaxation'
  };
  return titles[id] || 'Breathing Exercise';
};

const getHardcodedDescription = (id: string): string => {
  const descriptions: Record<string, string> = {
    'box-breathing': 'A simple technique to calm your nervous system and reduce stress.',
    '478-breathing': 'Known as the "relaxing breath," it helps with anxiety and sleep.',
    '54321-grounding': 'Pulls you out of anxious thoughts by focusing on your senses.',
    'alternate-nostril': 'Balances the brain hemispheres, promoting clarity and calm.',
    'pmr': 'Systematically tense and relax muscle groups to release physical tension.'
  };
  return descriptions[id] || 'A breathing exercise to help you relax.';
};

const getHardcodedScience = (id: string): string => {
  const science: Record<string, string> = {
    'box-breathing': 'Evens out breath pace, stimulating the vagus nerve to lower heart rate and blood pressure.',
    '478-breathing': 'Acts as a natural tranquilizer for the nervous system by increasing oxygen in the bloodstream.',
    '54321-grounding': 'Redirects focus from internal distress to the external environment, interrupting overwhelming thoughts.',
    'alternate-nostril': 'Nadi Shodhana is said to harmonize the left and right brain hemispheres, calming the mind.',
    'pmr': 'Teaches the body the difference between tension and relaxation, promoting deep sleep.'
  };
  return science[id] || 'Helps regulate breathing and reduce stress.';
};

const getHardcodedSteps = (id: string): string[] => {
  const steps: Record<string, string[]> = {
    'box-breathing': ['Inhale for 4s', 'Hold for 4s', 'Exhale for 4s', 'Hold for 4s'],
    '478-breathing': ['Inhale for 4s', 'Hold for 7s', 'Exhale for 8s'],
    '54321-grounding': ['See 5 things', 'Feel 4 things', 'Hear 3 things', 'Smell 2 things', 'Taste 1 thing'],
    'alternate-nostril': ['Inhale left', 'Exhale right', 'Inhale right', 'Exhale left'],
    'pmr': ['Tense muscles for 5s', 'Release and relax for 10s', 'Move through all muscle groups']
  };
  return steps[id] || ['Follow the instructions'];
};

// Exercise Card Component
const ExerciseCard = ({ exercise, onStart }: ExerciseCardProps) => {
  const { t, ready } = useTranslation('exercises');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get the actual translated values or fallbacks
  const getTitle = () => {
    if (!isClient || !ready) return getHardcodedTitle(exercise.id);
    return t(exercise.titleKey, { defaultValue: getHardcodedTitle(exercise.id) });
  };

  const getDescription = () => {
    if (!isClient || !ready) return getHardcodedDescription(exercise.id);
    return t(exercise.descriptionKey, { defaultValue: getHardcodedDescription(exercise.id) });
  };

  const getScience = () => {
    if (!isClient || !ready) return getHardcodedScience(exercise.id);
    return t(exercise.scienceKey, { defaultValue: getHardcodedScience(exercise.id) });
  };

  const getSteps = () => {
    if (!isClient || !ready) return getHardcodedSteps(exercise.id);
    return t(`${exercise.id}.steps`, { returnObjects: true, defaultValue: getHardcodedSteps(exercise.id) });
  };

  return (
    <Card className="group flex flex-col bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <CardHeader className="flex-row items-start gap-4">
        <div className={`p-3 bg-gradient-to-r ${exercise.color} rounded-lg group-hover:scale-110 transition-transform duration-300 bg-opacity-20`}>
          {exercise.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <CardTitle className="text-lg text-white" suppressHydrationWarning>
              {getTitle()}
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {exercise.difficulty}
            </Badge>
          </div>
          <CardDescription className="text-gray-300" suppressHydrationWarning>
            {getDescription()}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <h4 className="font-semibold text-sm text-blue-400 mb-2">
            <HydrationSafeTranslation 
              translationKey="howItWorks" 
              fallbackText="How it Works"
              namespace="exercises"
            />
          </h4>
          <p className="text-sm text-gray-300" suppressHydrationWarning>
            {getScience()}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-green-400 mb-2" suppressHydrationWarning>
            {isClient && ready ? t('steps', { defaultValue: 'Steps' }) : 'Steps'}
          </h4>
          <ul className="space-y-1">
            {getSteps().slice(0, 3).map((step: string, i: number) => (
              <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0" />
                {step}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <div className="p-6 pt-0">
        <Button
          className={`w-full bg-gradient-to-r ${exercise.color} hover:opacity-90 transition-all duration-300 hover:shadow-lg text-white`}
          onClick={() => onStart(exercise)}
        >
          <Wind className="w-4 h-4 mr-2" />
          <span suppressHydrationWarning>
            {isClient && ready ? t('startExercise', { defaultValue: 'Start Exercise' }) : 'Start Exercise'}
          </span>
        </Button>
      </div>
    </Card>
  );
};

// Exercise Grid Component
const ExerciseGrid = ({ exercises, onStart }: ExerciseGridProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {exercises.map((exercise: BreathingExercise) => (
      <ExerciseCard key={exercise.id} exercise={exercise} onStart={onStart} />
    ))}
  </div>
);

// Main Component
export default function GuidedBreathingPage() {
  const [activeExercise, setActiveExercise] = useState<BreathingExercise | null>(null);
  const { user } = useAuth();
  const { t, ready } = useTranslation('exercises');
  const [isClient, setIsClient] = useState(false);
  const breathingExercises = getBreathingExercises();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFinish = () => {
    if (!activeExercise) return;

    const totalDuration = activeExercise.cycle.reduce((sum: number, phase: BreathingPhase) => sum + phase.duration, 0) * 5; // 5 cycles

    if (user?.id) {
      console.log("Saving exercise:", {
        userId: user.id,
        exercise_name: activeExercise.id,
        duration_seconds: totalDuration,
      });

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      fetch(`${apiUrl}/api/breathing-exercise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          exercise_name: activeExercise.id,
          duration_seconds: totalDuration,
        }),
      }).catch(error => console.error("Failed to save breathing exercise:", error));
    }

    setActiveExercise(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-purple-900/80 to-indigo-900/90" />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full">
              <Wind className="w-10 h-10 text-blue-400" />
            </div>
            <Badge className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border-blue-400/20 text-lg px-6 py-3 rounded-full">
              🧘‍♀️ Mindfulness & Wellness Center
            </Badge>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight" suppressHydrationWarning>
            {isClient && ready ? t('title', { defaultValue: 'Breathing & Sleep Techniques' }) : 'Breathing & Sleep Techniques'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto" suppressHydrationWarning>
            {isClient && ready ? t('subtitle', { defaultValue: 'Master the art of relaxation with scientifically-proven breathing exercises and sleep techniques.' }) : 'Master the art of relaxation with scientifically-proven breathing exercises and sleep techniques.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-blue-400" />
              <span>Breathing Techniques</span>
            </div>
            <div className="flex items-center gap-2">
              <PersonStanding className="w-4 h-4 text-orange-400" />
              <span>Yoga Practices</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-green-400" />
              <span>Meditation</span>
            </div>
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-purple-400" />
              <span>Sleep & Relaxation</span>
            </div>
          </div>
        </div>
      </section>
      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent" suppressHydrationWarning>
              {isClient && ready ? t('breathingTitle', { defaultValue: 'Breathing Exercises' }) : 'Breathing Exercises'}
            </h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto" suppressHydrationWarning>
              {isClient && ready ? t('breathingSubtitle', { defaultValue: 'Quick and effective breathing techniques to reduce stress, anxiety, and promote relaxation' }) : 'Quick and effective breathing techniques to reduce stress, anxiety, and promote relaxation'}
            </p>
          </div>
          <ExerciseGrid exercises={breathingExercises} onStart={setActiveExercise} />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-800/50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Why These Practices Help with Depression & Anxiety
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-white">Neuroplasticity</h3>
              <p className="text-gray-300">
                Regular practice rewires your brain, strengthening areas responsible for emotional regulation
                and reducing activity in the amygdala (fear center).
              </p>
            </div>
            <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-white">Nervous System Balance</h3>
              <p className="text-gray-300">
                Breathing techniques activate your parasympathetic nervous system, naturally reducing
                stress hormones and promoting feelings of calm and safety.
              </p>
            </div>
            <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-white">Mindful Awareness</h3>
              <p className="text-gray-300">
                Meditation and mindfulness practices help you observe thoughts and emotions without
                being overwhelmed, creating space between you and your mental patterns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Breathing Animation Modal */}
      <AnimatePresence>
        {activeExercise && (
          <BreathingAnimation exercise={activeExercise} onFinish={handleFinish} />
        )}
      </AnimatePresence>
    </div>
  );
}