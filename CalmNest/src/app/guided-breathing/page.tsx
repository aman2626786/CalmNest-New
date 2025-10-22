'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '@supabase/auth-helpers-react';
import { X, Zap, Wind, Brain, Eye, PersonStanding } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const exercises = [
  {
    id: 'box-breathing',
    title: 'Box Breathing',
    icon: <Wind className="h-8 w-8 text-primary" />,
    description: 'A simple technique to calm your nervous system and reduce stress.',
    science: 'Evens out breath pace, stimulating the vagus nerve to lower heart rate and blood pressure.',
    steps: ['Inhale for 4s', 'Hold for 4s', 'Exhale for 4s', 'Hold for 4s'],
    cycle: [
      { instruction: 'Inhale', duration: 4, animation: 'inhale' },
      { instruction: 'Hold', duration: 4, animation: 'hold' },
      { instruction: 'Exhale', duration: 4, animation: 'exhale' },
      { instruction: 'Hold', duration: 4, animation: 'hold' },
    ],
  },
  {
    id: '478-breathing',
    title: '4-7-8 Breathing',
    icon: <Zap className="h-8 w-8 text-primary" />,
    description: 'Known as the "relaxing breath," it helps with anxiety and sleep.',
    science: 'Acts as a natural tranquilizer for the nervous system by increasing oxygen in the bloodstream.',
    steps: ['Inhale for 4s', 'Hold for 7s', 'Exhale for 8s'],
    cycle: [
      { instruction: 'Inhale', duration: 4, animation: 'inhale' },
      { instruction: 'Hold', duration: 7, animation: 'hold' },
      { instruction: 'Exhale', duration: 8, animation: 'exhale' },
    ],
  },
   {
    id: '54321-grounding',
    title: '5-4-3-2-1 Grounding',
    icon: <Eye className="h-8 w-8 text-primary" />,
    description: 'Pulls you out of anxious thoughts by focusing on your senses.',
    science: 'Redirects focus from internal distress to the external environment, interrupting overwhelming thoughts.',
    steps: ['See 5 things', 'Feel 4 things', 'Hear 3 things', 'Smell 2 things', 'Taste 1 thing'],
     cycle: [
      { instruction: 'Acknowledge 5 things you can SEE', duration: 10, animation: 'observe' },
      { instruction: 'Acknowledge 4 things you can TOUCH', duration: 8, animation: 'observe' },
      { instruction: 'Acknowledge 3 things you can HEAR', duration: 6, animation: 'observe' },
      { instruction: 'Acknowledge 2 things you can SMELL', duration: 5, animation: 'observe' },
      { instruction: 'Acknowledge 1 thing you can TASTE', duration: 5, animation: 'observe' },
    ],
  },
  {
    id: 'pmr',
    title: 'Progressive Muscle Relaxation',
    icon: <PersonStanding className="h-8 w-8 text-primary" />,
    description: 'Reduces anxiety and physical tension by tensing and relaxing muscle groups.',
    science: 'Teaches the body the difference between tension and relaxation, promoting a state of deep calm.',
    steps: ['Tense muscles for 5s', 'Release and relax for 10s', 'Repeat for different muscle groups'],
    cycle: [
        { instruction: 'Tense your feet', duration: 5, animation: 'squeeze'},
        { instruction: 'Release your feet', duration: 10, animation: 'release'},
        { instruction: 'Tense your legs', duration: 5, animation: 'squeeze'},
        { instruction: 'Release your legs', duration: 10, animation: 'release'},
        { instruction: 'Tense your torso', duration: 5, animation: 'squeeze'},
        { instruction: 'Release your torso', duration: 10, animation: 'release'},
        { instruction: 'Tense your arms', duration: 5, animation: 'squeeze'},
        { instruction: 'Release your arms', duration: 10, animation: 'release'},
        { instruction: 'Tense your face', duration: 5, animation: 'squeeze'},
        { instruction: 'Release your face', duration: 10, animation: 'release'},
    ],
  },
  {
    id: 'alternate-nostril',
    title: 'Alternate Nostril Breathing',
    icon: <Brain className="h-8 w-8 text-primary" />,
    description: 'Balances the brain hemispheres, promoting clarity and calm.',
    science: 'Nadi Shodhana is said to harmonize the left and right brain hemispheres, calming the mind.',
    steps: ['Inhale left', 'Exhale right', 'Inhale right', 'Exhale left'],
    cycle: [
      { instruction: 'Close right nostril, INHALE left', duration: 4, animation: 'inhale' },
      { instruction: 'Close left, EXHALE right', duration: 6, animation: 'exhale' },
      { instruction: 'INHALE right', duration: 4, animation: 'inhale' },
      { instruction: 'Close right, EXHALE left', duration: 6, animation: 'exhale' },
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


export default function GuidedBreathingPage() {
  const [activeExercise, setActiveExercise] = useState(null);
  const session = useSession();

  const handleFinish = () => {
    if (!activeExercise) return;

    const totalDuration = activeExercise.cycle.reduce((sum, phase) => sum + phase.duration, 0);

    if (session?.user?.id) {
      console.log("Saving breathing exercise:", {
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
          console.log("Breathing exercise saved successfully");
        } else {
          console.error("Failed to save breathing exercise:", response.status, response.statusText);
        }
      })
      .catch(error => console.error("Failed to save breathing exercise:", error));
    } else {
      console.log("User not logged in, skipping breathing exercise save");
    }

    setActiveExercise(null);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">Quick Relief Exercises</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Find your center with these guided exercises designed to calm your mind and body in minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {exercises.map((exercise) => (
          <Card key={exercise.id} className="flex flex-col">
            <CardHeader className="flex-row items-center gap-4">
              {exercise.icon}
              <div>
                <CardTitle>{exercise.title}</CardTitle>
                <CardDescription>{exercise.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-primary">How it Works</h4>
                  <p className="text-sm text-muted-foreground">{exercise.science}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-primary">Steps</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {exercise.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Button className="w-full" onClick={() => setActiveExercise(exercise)}>
                Start Exercise
              </Button>
            </div>
          </Card>
        ))}
      </div>

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