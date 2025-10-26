'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '@supabase/auth-helpers-react';
import { X, Zap, Wind, Brain, Eye, PersonStanding, Moon, Bed, Clock, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FAQ } from '@/components/common/FAQ';
import { HydrationSafeTranslation } from '@/components/common/HydrationSafeTranslation';
import { useTranslation } from 'react-i18next';

const getBreathingExercises = (t: any) => [
  {
    id: 'box-breathing',
    title: t('exercises.box-breathing.title'),
    icon: <Wind className="h-8 w-8 text-blue-500" />,
    description: t('exercises.box-breathing.description'),
    science: t('exercises.box-breathing.science'),
    steps: t('exercises.box-breathing.steps', { returnObjects: true }),
    duration: '5-10 minutes',
    difficulty: 'Beginner',
    cycle: [
      { instruction: 'Inhale', duration: 4, animation: 'inhale' },
      { instruction: 'Hold', duration: 4, animation: 'hold' },
      { instruction: 'Exhale', duration: 4, animation: 'exhale' },
      { instruction: 'Hold', duration: 4, animation: 'hold' },
    ],
  },
  {
    id: '478-breathing',
    title: t('exercises.478-breathing.title'),
    icon: <Zap className="h-8 w-8 text-purple-500" />,
    description: t('exercises.478-breathing.description'),
    science: t('exercises.478-breathing.science'),
    steps: t('exercises.478-breathing.steps', { returnObjects: true }),
    duration: '3-5 minutes',
    difficulty: 'Intermediate',
    cycle: [
      { instruction: 'Inhale', duration: 4, animation: 'inhale' },
      { instruction: 'Hold', duration: 7, animation: 'hold' },
      { instruction: 'Exhale', duration: 8, animation: 'exhale' },
    ],
  },
   {
    id: '54321-grounding',
    title: t('exercises.54321-grounding.title'),
    icon: <Eye className="h-8 w-8 text-green-500" />,
    description: t('exercises.54321-grounding.description'),
    science: t('exercises.54321-grounding.science'),
    steps: t('exercises.54321-grounding.steps', { returnObjects: true }),
    duration: '5-7 minutes',
    difficulty: 'Beginner',
     cycle: [
      { instruction: 'Acknowledge 5 things you can SEE', duration: 10, animation: 'observe' },
      { instruction: 'Acknowledge 4 things you can TOUCH', duration: 8, animation: 'observe' },
      { instruction: 'Acknowledge 3 things you can HEAR', duration: 6, animation: 'observe' },
      { instruction: 'Acknowledge 2 things you can SMELL', duration: 5, animation: 'observe' },
      { instruction: 'Acknowledge 1 thing you can TASTE', duration: 5, animation: 'observe' },
    ],
  },
  {
    id: 'alternate-nostril',
    title: t('exercises.alternate-nostril.title'),
    icon: <Brain className="h-8 w-8 text-indigo-500" />,
    description: t('exercises.alternate-nostril.description'),
    science: t('exercises.alternate-nostril.science'),
    steps: t('exercises.alternate-nostril.steps', { returnObjects: true }),
    duration: '5-10 minutes',
    difficulty: 'Advanced',
    cycle: [
      { instruction: 'Close right nostril, INHALE left', duration: 4, animation: 'inhale' },
      { instruction: 'Close left, EXHALE right', duration: 6, animation: 'exhale' },
      { instruction: 'INHALE right', duration: 4, animation: 'inhale' },
      { instruction: 'Close right, EXHALE left', duration: 6, animation: 'exhale' },
    ],
  },
];

const getSleepTechniques = (t: any) => [
  {
    id: 'progressive-muscle-relaxation',
    title: t('exercises.pmr.title'),
    icon: <PersonStanding className="h-8 w-8 text-purple-500" />,
    description: t('exercises.pmr.description'),
    science: t('exercises.pmr.science'),
    steps: t('exercises.pmr.steps', { returnObjects: true }),
    duration: '15-20 minutes',
    difficulty: 'Beginner',
    cycle: [
        { instruction: 'Tense your feet and toes', duration: 5, animation: 'squeeze'},
        { instruction: 'Release and relax your feet', duration: 10, animation: 'release'},
        { instruction: 'Tense your calves and legs', duration: 5, animation: 'squeeze'},
        { instruction: 'Release and relax your legs', duration: 10, animation: 'release'},
        { instruction: 'Tense your abdomen and chest', duration: 5, animation: 'squeeze'},
        { instruction: 'Release and relax your torso', duration: 10, animation: 'release'},
        { instruction: 'Tense your hands and arms', duration: 5, animation: 'squeeze'},
        { instruction: 'Release and relax your arms', duration: 10, animation: 'release'},
        { instruction: 'Tense your shoulders and neck', duration: 5, animation: 'squeeze'},
        { instruction: 'Release and relax your shoulders', duration: 10, animation: 'release'},
        { instruction: 'Tense your face muscles', duration: 5, animation: 'squeeze'},
        { instruction: 'Release and relax your face', duration: 10, animation: 'release'},
    ],
  },
  {
    id: 'body-scan-meditation',
    title: t('exercises.body-scan.title'),
    icon: <Sparkles className="h-8 w-8 text-blue-500" />,
    description: t('exercises.body-scan.description'),
    science: t('exercises.body-scan.science'),
    steps: t('exercises.body-scan.steps', { returnObjects: true }),
    duration: '10-15 minutes',
    difficulty: 'Beginner',
    cycle: [
      { instruction: 'Focus on your head and scalp', duration: 15, animation: 'observe' },
      { instruction: 'Notice your face and jaw', duration: 15, animation: 'observe' },
      { instruction: 'Feel your neck and shoulders', duration: 15, animation: 'observe' },
      { instruction: 'Scan your arms and hands', duration: 15, animation: 'observe' },
      { instruction: 'Focus on your chest and breathing', duration: 15, animation: 'observe' },
      { instruction: 'Notice your abdomen', duration: 15, animation: 'observe' },
      { instruction: 'Feel your back and spine', duration: 15, animation: 'observe' },
      { instruction: 'Scan your hips and pelvis', duration: 15, animation: 'observe' },
      { instruction: 'Notice your thighs and knees', duration: 15, animation: 'observe' },
      { instruction: 'Feel your calves and feet', duration: 15, animation: 'observe' },
    ],
  },
  {
    id: 'sleep-breathing',
    title: t('exercises.sleep-breathing.title'),
    icon: <Moon className="h-8 w-8 text-indigo-500" />,
    description: t('exercises.sleep-breathing.description'),
    science: t('exercises.sleep-breathing.science'),
    steps: t('exercises.sleep-breathing.steps', { returnObjects: true }),
    duration: '2-4 minutes',
    difficulty: 'Intermediate',
    cycle: [
      { instruction: 'Inhale quietly through nose', duration: 4, animation: 'inhale' },
      { instruction: 'Hold your breath', duration: 7, animation: 'hold' },
      { instruction: 'Exhale completely through mouth', duration: 8, animation: 'exhale' },
    ],
  },
  {
    id: 'visualization-technique',
    title: t('exercises.visualization.title'),
    icon: <Eye className="h-8 w-8 text-green-500" />,
    description: t('exercises.visualization.description'),
    science: t('exercises.visualization.science'),
    steps: t('exercises.visualization.steps', { returnObjects: true }),
    duration: '10-20 minutes',
    difficulty: 'Beginner',
    cycle: [
      { instruction: 'Imagine a peaceful beach scene', duration: 30, animation: 'observe' },
      { instruction: 'Feel the warm sand beneath you', duration: 30, animation: 'observe' },
      { instruction: 'Hear the gentle waves', duration: 30, animation: 'observe' },
      { instruction: 'Feel the cool ocean breeze', duration: 30, animation: 'observe' },
      { instruction: 'See the beautiful sunset colors', duration: 30, animation: 'observe' },
      { instruction: 'Let yourself drift deeper into peace', duration: 60, animation: 'observe' },
    ],
  },
  {
    id: 'counting-technique',
    title: t('exercises.counting.title'),
    icon: <Clock className="h-8 w-8 text-orange-500" />,
    description: t('exercises.counting.description'),
    science: t('exercises.counting.science'),
    steps: t('exercises.counting.steps', { returnObjects: true }),
    duration: '5-15 minutes',
    difficulty: 'Beginner',
    cycle: [
      { instruction: 'Count backwards from 100', duration: 20, animation: 'observe' },
      { instruction: 'Visualize each number clearly', duration: 20, animation: 'observe' },
      { instruction: 'If you lose count, start over', duration: 20, animation: 'observe' },
      { instruction: 'Let your mind become quiet', duration: 30, animation: 'observe' },
    ],
  },
  {
    id: 'gratitude-relaxation',
    title: t('exercises.gratitude.title'),
    icon: <Heart className="h-8 w-8 text-pink-500" />,
    description: t('exercises.gratitude.description'),
    science: t('exercises.gratitude.science'),
    steps: t('exercises.gratitude.steps', { returnObjects: true }),
    duration: '5-10 minutes',
    difficulty: 'Beginner',
    cycle: [
      { instruction: 'Think of something you\'re grateful for today', duration: 30, animation: 'observe' },
      { instruction: 'Feel the warmth of gratitude in your heart', duration: 30, animation: 'observe' },
      { instruction: 'Think of a person you appreciate', duration: 30, animation: 'observe' },
      { instruction: 'Remember a happy moment from today', duration: 30, animation: 'observe' },
      { instruction: 'Let these positive feelings surround you', duration: 60, animation: 'observe' },
    ],
  },
];

const GuidedExercise = ({ exercise, onFinish }) => {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    if (phaseIndex >= exercise.cycle.length) {
      onFinish();
      return;
    }

    const timer = setTimeout(() => {
      setPhaseIndex(phaseIndex + 1);
    }, exercise.cycle[phaseIndex].duration * 1000);

    return () => clearTimeout(timer);
  }, [phaseIndex, exercise, onFinish]);

  const currentPhase = exercise.cycle[phaseIndex];

  const circleVariants = {
    initial: { scale: 1, opacity: 0.8 },
    inhale: { scale: 1.5, transition: { duration: currentPhase?.duration || 4, ease: 'easeInOut' } },
    exhale: { scale: 0.75, transition: { duration: currentPhase?.duration || 4, ease: 'easeInOut' } },
    hold: { scale: 1.5, transition: { duration: currentPhase?.duration || 4, ease: 'easeInOut' } },
    squeeze: { scale: 0.9, opacity: 1, transition: { duration: 0.5, repeat: Infinity, repeatType: 'mirror' } },
    release: { scale: 1, opacity: 0.8, transition: { duration: 2, ease: 'easeOut' } },
    observe: { scale: 1, opacity: 0.8, transition: { duration: 1, ease: 'easeInOut' } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center z-50"
    >
      <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={onFinish}>
        <X className="h-6 w-6" />
      </Button>

      <div className="relative flex items-center justify-center w-80 h-80">
        <motion.div
          className="absolute bg-primary/20 rounded-full w-full h-full"
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
              <p className="text-2xl font-semibold text-foreground">{currentPhase.instruction}</p>
              <p className="text-5xl font-bold text-primary">{currentPhase.duration}s</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-8 text-lg text-muted-foreground">Follow the instructions to find your calm.</p>
    </motion.div>
  );
};


const ExerciseGrid = ({ exercises, onStart, t }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {exercises.map((exercise) => (
      <Card key={exercise.id} className="group flex flex-col bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="flex-row items-start gap-4">
          <div className="p-3 bg-gray-700/50 rounded-lg group-hover:scale-110 transition-transform duration-300">
            {exercise.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{exercise.title}</CardTitle>
              <Badge variant="outline" className="text-xs">
                {exercise.difficulty}
              </Badge>
            </div>
            <CardDescription className="text-gray-400">{exercise.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {exercise.duration}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-purple-400 mb-2">{t('howItWorks')}</h4>
            <p className="text-sm text-gray-300 leading-relaxed">{exercise.science}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-purple-400 mb-2">{t('steps')}</h4>
            <ul className="space-y-1">
              {Array.isArray(exercise.steps) ? exercise.steps.map((step, i) => (
                <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0" />
                  {step}
                </li>
              )) : (
                <li className="text-sm text-gray-300 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0" />
                  {t('steps')} not available
                </li>
              )}
            </ul>
          </div>
        </CardContent>
        <div className="p-6 pt-0">
          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" 
            onClick={() => onStart(exercise)}
          >
            {exercise.title.includes('Sleep') || exercise.title.includes('Relaxation') || exercise.title.includes('Body Scan') || exercise.title.includes('Visualization') || exercise.title.includes('Counting') || exercise.title.includes('Gratitude') ? t('startSleepExercise') : t('startBreathingExercise')}
          </Button>
        </div>
      </Card>
    ))}
  </div>
);

export default function GuidedBreathingPage() {
  const { t } = useTranslation('exercises');
  const [activeExercise, setActiveExercise] = useState(null);
  const session = useSession();
  
  const breathingExercises = getBreathingExercises(t);
  const sleepTechniques = getSleepTechniques(t);

  const handleFinish = () => {
    if (!activeExercise) return;

    const totalDuration = activeExercise.cycle.reduce((sum, phase) => sum + phase.duration, 0);

    if (session?.user?.id) {
      console.log("Saving exercise:", {
        userId: session.user.id,
        exercise_name: activeExercise.title,
        duration_seconds: totalDuration
      });
      
      fetch('http://127.0.0.1:5001/api/breathing-exercise', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              userId: session.user.id,
              exercise_name: activeExercise.title,
              duration_seconds: totalDuration,
          }),
      })
      .then(response => {
        if (response.ok) {
          console.log("Exercise saved successfully");
        } else {
          console.error("Failed to save exercise:", response.status, response.statusText);
        }
      })
      .catch(error => console.error("Failed to save exercise:", error));
    } else {
      console.log("User not logged in, skipping exercise save");
    }

    setActiveExercise(null);
  };

  const breathingFAQs = [
    {
      question: "How often should I practice breathing exercises?",
      answer: "For best results, practice breathing exercises daily. Even 5-10 minutes can make a significant difference in stress levels and overall well-being."
    },
    {
      question: "Can breathing exercises help with anxiety attacks?",
      answer: "Yes! Box breathing and 4-7-8 breathing are particularly effective during anxiety attacks. They help activate your parasympathetic nervous system and restore calm."
    },
    {
      question: "What's the best time to practice sleep techniques?",
      answer: "Practice sleep techniques 30-60 minutes before your desired bedtime. Create a consistent routine to signal to your body that it's time to wind down."
    },
    {
      question: "Are these techniques safe for everyone?",
      answer: "These techniques are generally safe for most people. However, if you have respiratory conditions or feel dizzy during practice, consult with a healthcare provider."
    },
    {
      question: "How long before I see results?",
      answer: "Many people feel immediate relaxation effects. For long-term benefits like improved sleep quality and reduced anxiety, consistent practice for 2-4 weeks typically shows significant results."
    }
  ];

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
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Wind className="w-10 h-10 text-blue-400" />
            <Badge className="bg-blue-600/20 text-blue-300 border-blue-400/20 text-lg px-4 py-2">
              Wellness & Sleep Center
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent" suppressHydrationWarning>
            {t('title')}
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="breathing" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800 border border-gray-700 mb-8">
              <TabsTrigger 
                value="breathing" 
                className="flex items-center gap-2 text-gray-300 hover:text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Wind className="w-4 h-4" />
                {t('breathingTab')}
              </TabsTrigger>
              <TabsTrigger 
                value="sleep" 
                className="flex items-center gap-2 text-gray-300 hover:text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Moon className="w-4 h-4" />
                {t('sleepTab')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="breathing" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">{t('breathingTitle')}</h2>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                  {t('breathingSubtitle')}
                </p>
              </div>
              <ExerciseGrid exercises={breathingExercises} onStart={setActiveExercise} t={t} />
            </TabsContent>

            <TabsContent value="sleep" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">{t('sleepTitle')}</h2>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                  {t('sleepSubtitle')}
                </p>
              </div>
              <ExerciseGrid exercises={sleepTechniques} onStart={setActiveExercise} t={t} />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ 
        title="Breathing & Sleep FAQ"
        faqs={breathingFAQs}
        className="mt-16"
      />

      <AnimatePresence>
        {activeExercise && (
          <GuidedExercise
            exercise={activeExercise}
            onFinish={handleFinish}
          />
        )}
      </AnimatePresence>
    </div>
  );
}