'use client';

import { useState, useEffect, FC } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, Zap, Wind, Brain, Eye, PersonStanding } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { HydrationSafeTranslation } from '@/components/common/HydrationSafeTranslation';

const exercises = [
  {
    id: 'box-breathing',
    icon: <Wind className="h-8 w-8 text-primary" />,
    cycle: [
      { instruction: 'Inhale', duration: 4, animation: 'inhale' },
      { instruction: 'Hold', duration: 4, animation: 'hold' },
      { instruction: 'Exhale', duration: 4, animation: 'exhale' },
      { instruction: 'Hold', duration: 4, animation: 'hold' },
    ],
  },
  {
    id: '478-breathing',
    icon: <Zap className="h-8 w-8 text-primary" />,
    cycle: [
      { instruction: 'Inhale', duration: 4, animation: 'inhale' },
      { instruction: 'Hold', duration: 7, animation: 'hold' },
      { instruction: 'Exhale', duration: 8, animation: 'exhale' },
    ],
  },
   {
    id: '54321-grounding',
    icon: <Eye className="h-8 w-8 text-primary" />,
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
    icon: <PersonStanding className="h-8 w-8 text-primary" />,
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
    icon: <Brain className="h-8 w-8 text-primary" />,
    cycle: [
      { instruction: 'Close right nostril, INHALE left', duration: 4, animation: 'inhale' },
      { instruction: 'Close left, EXHALE right', duration: 6, animation: 'exhale' },
      { instruction: 'INHALE right', duration: 4, animation: 'inhale' },
      { instruction: 'Close right, EXHALE left', duration: 6, animation: 'exhale' },
    ],
  },
];

type Exercise = typeof exercises[number];

interface GuidedExerciseProps {
  exercise: Exercise;
  onFinish: () => void;
}

const GuidedExercise: FC<GuidedExerciseProps> = ({ exercise, onFinish }) => {
  const { t } = useTranslation('exercises');
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

  const circleVariants: Variants = {
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
              <p className="text-2xl font-semibold text-foreground">{t(`${exercise.id}.cycle.${phaseIndex}.instruction`)}</p>
              <p className="text-5xl font-bold text-primary">{currentPhase.duration}s</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-8 text-lg text-muted-foreground">{t('followInstructions')}</p>
    </motion.div>
  );
};


export default function GuidedBreathingPage() {
  const { t } = useTranslation('exercises');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <HydrationSafeTranslation
          translationKey="title"
          fallbackText="Breathing & Sleep Techniques"
          namespace="exercises"
          as="h1"
          className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
        />
        <HydrationSafeTranslation
          translationKey="subtitle"
          fallbackText="Master the art of relaxation with scientifically-proven breathing exercises and sleep techniques. Find your calm, reduce stress, and improve your sleep quality naturally."
          namespace="exercises"
          as="p"
          className="mt-4 text-lg leading-8 text-muted-foreground"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {exercises.map((exercise) => (
          <Card key={exercise.id} className="flex flex-col">
            <CardHeader className="flex-row items-center gap-4">
              {exercise.icon}
              <div>
                <CardTitle>{t(`${exercise.id}.title`)}</CardTitle>
                <CardDescription>{t(`${exercise.id}.description`)}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-primary">{t('howItWorks')}</h4>
                  <p className="text-sm text-muted-foreground">{t(`${exercise.id}.science`)}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-primary">{t('steps')}</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {(t(`${exercise.id}.steps`, { returnObjects: true }) as string[]).map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Button className="w-full" onClick={() => setActiveExercise(exercise)}>
                {t('startExercise')}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {activeExercise && (
          <GuidedExercise
            exercise={activeExercise}
            onFinish={() => setActiveExercise(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
