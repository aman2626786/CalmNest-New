interface AssessmentResults {
  phq9?: { score: number; severity: string; answers: any[] };
  gad7?: { score: number; severity: string; answers: any[] };
  moodGrove?: { 
    dominantMood: string; 
    confidence: number; 
    depression: number; 
    anxiety: number; 
    expressions: any 
  };
  additional?: {
    resilience: { score: number; answers: any[] };
    stress: { score: number; answers: any[] };
    sleep_quality: { score: number; answers: any[] };
    social_support: { score: number; answers: any[] };
  };
}

export function generateComprehensiveAnalysis(results: AssessmentResults): {
  overall_severity: string;
  risk_level: string;
  analysis_prompt: string;
  recommendations: string[];
} {
  const { phq9, gad7, moodGrove, additional } = results;
  
  // Calculate overall severity
  const overallSeverity = calculateOverallSeverity(phq9, gad7, moodGrove);
  const riskLevel = calculateRiskLevel(phq9, gad7, moodGrove);
  
  // Generate comprehensive analysis prompt
  const analysisPrompt = generateAnalysisPrompt(results, overallSeverity, riskLevel);
  
  // Generate recommendations
  const recommendations = generateRecommendations(results, overallSeverity);
  
  return {
    overall_severity: overallSeverity,
    risk_level: riskLevel,
    analysis_prompt: analysisPrompt,
    recommendations
  };
}

function calculateOverallSeverity(
  phq9?: { score: number; severity: string },
  gad7?: { score: number; severity: string },
  moodGrove?: { depression: number; anxiety: number }
): string {
  const severityScores: number[] = [];
  
  // PHQ-9 severity mapping
  if (phq9) {
    if (phq9.score <= 4) severityScores.push(1);
    else if (phq9.score <= 9) severityScores.push(2);
    else if (phq9.score <= 14) severityScores.push(3);
    else if (phq9.score <= 19) severityScores.push(4);
    else severityScores.push(5);
  }
  
  // GAD-7 severity mapping
  if (gad7) {
    if (gad7.score <= 4) severityScores.push(1);
    else if (gad7.score <= 9) severityScores.push(2);
    else if (gad7.score <= 14) severityScores.push(3);
    else severityScores.push(4);
  }
  
  // Mood Grove severity (based on depression/anxiety indicators)
  if (moodGrove) {
    const avgMoodScore = (moodGrove.depression + moodGrove.anxiety) / 2;
    if (avgMoodScore <= 20) severityScores.push(1);
    else if (avgMoodScore <= 40) severityScores.push(2);
    else if (avgMoodScore <= 60) severityScores.push(3);
    else severityScores.push(4);
  }
  
  const avgSeverity = severityScores.reduce((sum, score) => sum + score, 0) / severityScores.length;
  
  if (avgSeverity <= 1.5) return "Minimal";
  if (avgSeverity <= 2.5) return "Mild";
  if (avgSeverity <= 3.5) return "Moderate";
  if (avgSeverity <= 4.5) return "Moderately Severe";
  return "Severe";
}

function calculateRiskLevel(
  phq9?: { score: number },
  gad7?: { score: number },
  moodGrove?: { depression: number; anxiety: number }
): string {
  let riskFactors = 0;
  
  // High PHQ-9 score
  if (phq9 && phq9.score >= 15) riskFactors++;
  
  // High GAD-7 score
  if (gad7 && gad7.score >= 15) riskFactors++;
  
  // High mood indicators
  if (moodGrove && (moodGrove.depression >= 60 || moodGrove.anxiety >= 60)) riskFactors++;
  
  if (riskFactors >= 2) return "High";
  if (riskFactors === 1) return "Medium";
  return "Low";
}

function generateAnalysisPrompt(
  results: AssessmentResults,
  overallSeverity: string,
  riskLevel: string
): string {
  const { phq9, gad7, moodGrove, additional } = results;
  const currentDate = new Date().toLocaleDateString();
  
  let prompt = `COMPREHENSIVE MENTAL HEALTH ASSESSMENT RESULTS

Assessment Date: ${currentDate}
Overall Severity: ${overallSeverity}
Risk Level: ${riskLevel}

=== DEPRESSION ASSESSMENT (PHQ-9) ===`;

  if (phq9) {
    prompt += `
Score: ${phq9.score}/27
Severity Level: ${phq9.severity}
Interpretation: `;
    
    if (phq9.score <= 4) {
      prompt += "Minimal depression symptoms. Your mood appears to be within the normal range.";
    } else if (phq9.score <= 9) {
      prompt += "Mild depression symptoms detected. Some low mood or loss of interest present but manageable.";
    } else if (phq9.score <= 14) {
      prompt += "Moderate depression symptoms. These symptoms may be affecting your daily life and relationships.";
    } else if (phq9.score <= 19) {
      prompt += "Moderately severe depression symptoms. Significant impact on daily functioning likely.";
    } else {
      prompt += "Severe depression symptoms detected. Immediate professional support is strongly recommended.";
    }
    
    // Add specific symptom insights
    const highScoreSymptoms = phq9.answers
      .filter(answer => answer.score >= 2)
      .map(answer => answer.question.toLowerCase());
    
    if (highScoreSymptoms.length > 0) {
      prompt += `\nKey Areas of Concern: ${highScoreSymptoms.slice(0, 3).join(', ')}`;
    }
  }

  prompt += `

=== ANXIETY ASSESSMENT (GAD-7) ===`;

  if (gad7) {
    prompt += `
Score: ${gad7.score}/21
Severity Level: ${gad7.severity}
Interpretation: `;
    
    if (gad7.score <= 4) {
      prompt += "Minimal anxiety symptoms. You appear to be managing stress well.";
    } else if (gad7.score <= 9) {
      prompt += "Mild anxiety symptoms present. Some worry or tension but generally manageable.";
    } else if (gad7.score <= 14) {
      prompt += "Moderate anxiety symptoms. Worry and tension may be interfering with daily activities.";
    } else {
      prompt += "Severe anxiety symptoms detected. Significant distress and functional impairment likely.";
    }
    
    const highAnxietySymptoms = gad7.answers
      .filter(answer => answer.score >= 2)
      .map(answer => answer.question.toLowerCase());
    
    if (highAnxietySymptoms.length > 0) {
      prompt += `\nPrimary Anxiety Concerns: ${highAnxietySymptoms.slice(0, 3).join(', ')}`;
    }
  }

  prompt += `

=== MOOD ANALYSIS (AI-Powered Facial Recognition) ===`;

  if (moodGrove) {
    prompt += `
Dominant Emotion Detected: ${moodGrove.dominantMood.charAt(0).toUpperCase() + moodGrove.dominantMood.slice(1)}
Analysis Confidence: ${(moodGrove.confidence * 100).toFixed(1)}%
Depression Indicators: ${moodGrove.depression.toFixed(1)}%
Anxiety Indicators: ${moodGrove.anxiety.toFixed(1)}%

Facial Expression Analysis: `;
    
    if (moodGrove.dominantMood === 'happy') {
      prompt += "Positive emotional state detected. Facial expressions suggest good mood and emotional well-being.";
    } else if (moodGrove.dominantMood === 'sad') {
      prompt += "Sadness detected in facial expressions. This aligns with potential depressive symptoms.";
    } else if (moodGrove.dominantMood === 'fearful') {
      prompt += "Anxiety-related expressions detected. Facial analysis suggests heightened stress or worry.";
    } else if (moodGrove.dominantMood === 'angry') {
      prompt += "Irritability or frustration detected. May indicate stress, depression, or anxiety manifestation.";
    } else {
      prompt += "Neutral emotional expression. Facial analysis suggests stable but possibly subdued emotional state.";
    }
    
    // Correlation analysis
    const moodPhq9Correlation = phq9 ? 
      (moodGrove.depression > 40 && phq9.score > 10) ? "Strong correlation between facial analysis and PHQ-9 results." :
      (moodGrove.depression > 30 || phq9.score > 5) ? "Moderate correlation between mood analysis and depression screening." :
      "Facial analysis and PHQ-9 results show minimal correlation." : "";
    
    const moodGad7Correlation = gad7 ?
      (moodGrove.anxiety > 40 && gad7.score > 10) ? "Strong correlation between facial analysis and GAD-7 results." :
      (moodGrove.anxiety > 30 || gad7.score > 5) ? "Moderate correlation between mood analysis and anxiety screening." :
      "Facial analysis and GAD-7 results show minimal correlation." : "";
    
    if (moodPhq9Correlation) prompt += `\n${moodPhq9Correlation}`;
    if (moodGad7Correlation) prompt += `\n${moodGad7Correlation}`;
  }

  prompt += `

=== ADDITIONAL WELLNESS FACTORS ===`;

  if (additional) {
    if (additional.resilience) {
      const resilienceLevel = additional.resilience.score >= 25 ? "High" : 
                             additional.resilience.score >= 20 ? "Moderate" : "Low";
      prompt += `
Resilience Level: ${resilienceLevel} (Score: ${additional.resilience.score}/30)`;
    }
    
    if (additional.stress) {
      const stressLevel = additional.stress.score >= 13 ? "High" : 
                         additional.stress.score >= 7 ? "Moderate" : "Low";
      prompt += `
Perceived Stress: ${stressLevel} (Score: ${additional.stress.score}/16)`;
    }
    
    if (additional.sleep_quality) {
      const sleepQuality = additional.sleep_quality.score <= 3 ? "Good" : 
                          additional.sleep_quality.score <= 6 ? "Fair" : "Poor";
      prompt += `
Sleep Quality: ${sleepQuality} (Score: ${additional.sleep_quality.score}/9)`;
    }
    
    if (additional.social_support) {
      const supportLevel = additional.social_support.score >= 18 ? "Strong" : 
                          additional.social_support.score >= 12 ? "Moderate" : "Limited";
      prompt += `
Social Support: ${supportLevel} (Score: ${additional.social_support.score}/21)`;
    }
  }

  prompt += `

=== COMPREHENSIVE ANALYSIS SUMMARY ===
Overall Mental Health Status: ${overallSeverity}
Risk Assessment: ${riskLevel} Risk
`;

  // Add integrated analysis
  if (overallSeverity === "Minimal") {
    prompt += `
Your assessment results indicate good overall mental health with minimal symptoms of depression or anxiety. The various assessment tools show consistent results suggesting emotional stability and effective coping mechanisms.`;
  } else if (overallSeverity === "Mild") {
    prompt += `
Your results suggest mild mental health symptoms that are manageable but worth monitoring. You may be experiencing some stress or mood changes that could benefit from self-care strategies and lifestyle adjustments.`;
  } else if (overallSeverity === "Moderate") {
    prompt += `
Your assessment indicates moderate mental health symptoms that may be impacting your daily life. The combination of depression and anxiety screening results, along with mood analysis, suggests you could benefit from professional support and structured coping strategies.`;
  } else {
    prompt += `
Your results indicate significant mental health symptoms that require attention. Multiple assessment tools show elevated scores suggesting that professional mental health support would be beneficial for your wellbeing and recovery.`;
  }

  prompt += `

=== PERSONALIZED GUIDANCE REQUEST ===
Based on these comprehensive results, please provide:

1. **Immediate Coping Strategies**: Specific techniques I can use today to manage my current symptoms, particularly focusing on my ${phq9?.severity.toLowerCase() || 'detected'} depression levels and ${gad7?.severity.toLowerCase() || 'detected'} anxiety symptoms.

2. **Lifestyle Recommendations**: Concrete changes to my daily routine that could improve my mental health, considering my ${additional?.sleep_quality ? 'sleep quality issues' : 'sleep patterns'} and ${additional?.stress ? 'stress levels' : 'stress management needs'}.

3. **Professional Support Guidance**: Given my ${riskLevel.toLowerCase()} risk level and ${overallSeverity.toLowerCase()} severity, what type of professional help should I consider and when?

4. **Progress Monitoring**: How should I track my mental health going forward, and what warning signs should prompt me to seek immediate help?

5. **Personalized Action Plan**: A step-by-step plan tailored to my specific combination of symptoms and strengths, including my ${additional?.resilience ? 'resilience level' : 'coping abilities'} and ${additional?.social_support ? 'social support system' : 'support network'}.

Please tailor your response specifically to my assessment profile and provide practical, actionable guidance that acknowledges both my challenges and strengths.`;

  return prompt;
}

function generateRecommendations(
  results: AssessmentResults,
  overallSeverity: string
): string[] {
  const recommendations: string[] = [];
  const { phq9, gad7, moodGrove, additional } = results;
  
  // Base recommendations based on overall severity
  if (overallSeverity === "Minimal") {
    recommendations.push("Continue current wellness practices");
    recommendations.push("Maintain regular exercise and sleep schedule");
    recommendations.push("Practice preventive mental health strategies");
  } else if (overallSeverity === "Mild") {
    recommendations.push("Implement daily stress management techniques");
    recommendations.push("Consider mindfulness or meditation practice");
    recommendations.push("Monitor symptoms weekly");
  } else if (overallSeverity === "Moderate") {
    recommendations.push("Consider professional counseling or therapy");
    recommendations.push("Implement structured self-care routine");
    recommendations.push("Reach out to trusted friends or family for support");
  } else {
    recommendations.push("Seek professional mental health support promptly");
    recommendations.push("Consider medication evaluation with healthcare provider");
    recommendations.push("Establish crisis support plan");
  }
  
  // Specific recommendations based on individual assessments
  if (phq9 && phq9.score >= 10) {
    recommendations.push("Focus on depression-specific coping strategies");
    recommendations.push("Engage in behavioral activation techniques");
  }
  
  if (gad7 && gad7.score >= 10) {
    recommendations.push("Practice anxiety management techniques");
    recommendations.push("Learn grounding and breathing exercises");
  }
  
  if (moodGrove && moodGrove.dominantMood === 'sad') {
    recommendations.push("Engage in mood-lifting activities");
    recommendations.push("Increase social connections and support");
  }
  
  if (additional?.sleep_quality && additional.sleep_quality.score >= 6) {
    recommendations.push("Improve sleep hygiene practices");
    recommendations.push("Consider sleep disorder evaluation");
  }
  
  if (additional?.stress && additional.stress.score >= 10) {
    recommendations.push("Implement stress reduction techniques");
    recommendations.push("Identify and address stress triggers");
  }
  
  if (additional?.social_support && additional.social_support.score <= 12) {
    recommendations.push("Build stronger social connections");
    recommendations.push("Consider joining support groups or communities");
  }
  
  return recommendations;
}