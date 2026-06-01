import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import {
  assertGeminiApiKey,
  generateContentWithFallback,
  getGeminiModels,
  sendGeminiError,
} from './server/gemini.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  try {
    assertGeminiApiKey();
  } catch (e) {
    console.error('⚠️', e instanceof Error ? e.message : e);
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  console.log(`Gemini models (fallback order): ${getGeminiModels().join(' → ')}`);

  // API: Generate Exercises
  app.post('/api/generate-exercise', async (req, res) => {
    try {
      const { level, topic } = req.body;
      const response = await generateContentWithFallback(ai, {
        contents: `Generate 5 varied English learning exercises for level ${level} about ${topic}. 
        Mix these types: 
        1. 'multiple-choice': Standard question with options.
        2. 'fill-blank': A sentence with a missing word shown as '____'.
        3. 'order-phrase': A scrambled sentence the user needs to reorder.
        4. 'vocabulary': A word definition or synonym matching task.
        5. 'listening': A short text (max 2 sentences) meant to be read aloud, followed by a comprehension question.
        
        Return as JSON.`,
        config: {
          systemInstruction: "You are an English teacher. Create engaging, high-quality exercises. For 'order-phrase', provide 'scrambledWords' as an array. For 'listening', provide the 'audioText' which is what the speaker says.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["multiple-choice", "fill-blank", "order-phrase", "vocabulary", "listening"] },
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Required for multiple-choice and vocabulary" },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING },
                scrambledWords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Required for order-phrase" },
                audioText: { type: Type.STRING, description: "Required for listening - the text to be spoken" }
              },
              required: ["id", "question", "correctAnswer", "explanation", "type"]
            }
          }
        }
      });
      res.json(JSON.parse(response.text!));
    } catch (error) {
      console.error(error);
      sendGeminiError(res, error, 'Failed to generate exercises');
    }
  });

  // API: Ask AI
  app.post('/api/ask', async (req, res) => {
    try {
      const { question, context } = req.body;
      const response = await generateContentWithFallback(ai, {
        contents: question,
        config: {
          systemInstruction: `You are Linguae AI, a friendly English tutor. Help the user learn English. Context: ${context || 'General conversation'}. Keep it concise and encouraging.`,
        }
      });
      res.json({ answer: response.text });
    } catch (error) {
      console.error("Error en /api/ask:", error);
      sendGeminiError(res, error, 'Failed to get answer');
    }
  });

  // API: Analyze Mistake
  app.post('/api/analyze-mistake', async (req, res) => {
    try {
      const { question, userAnswer, correctAnswer, type, level, isCorrect } = req.body;
      
      const prompt = isCorrect 
        ? `I am an English student at level ${level}. I answered correctly.
           The question was: "${question}".
           The type of exercise was: ${type}.
           My answer was: "${userAnswer}".
           
           Please provide a short, highly motivating success message in Spanish that highlights what I did right (e.g., "Excelente ✨ Ya estás usando correctamente el [Grammar Point]").`
        : `I am an English student at level ${level}. 
           The question was: "${question}".
           The type of exercise was: ${type}.
           My answer was: "${userAnswer}".
           The correct answer is: "${correctAnswer}".
           
           Please provide:
           1. An elegant corrective feedback (e.g., "Casi perfecto 👏 Recuerda que [specific rule]").
           2. Why my answer is incorrect.
           3. Any grammatical errors in my answer.
           4. A recommended improvement.
        
           Respond in Spanish, but keep English terms in English. Format as JSON.`;

      const response = await generateContentWithFallback(ai, {
        contents: prompt,
        config: {
          systemInstruction: "You are an expert English tutor. You provide constructive, elegant and motivating feedback. Respond ONLY in JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              successMessage: { type: Type.STRING, description: "Only if isCorrect is true" },
              elegantFeedback: { type: Type.STRING, description: "Elegant correction if incorrect" },
              whyIncorrect: { type: Type.STRING },
              grammarErrors: { type: Type.STRING },
              recommendation: { type: Type.STRING }
            },
            required: isCorrect ? ["successMessage"] : ["elegantFeedback", "whyIncorrect", "recommendation"]
          }
        }
      });
      res.json(JSON.parse(response.text!));
    } catch (error) {
      console.error(error);
      sendGeminiError(res, error, 'Failed to analyze answer');
    }
  });

  // API: Simulator Chat
  app.post('/api/simulator-chat', async (req, res) => {
    try {
      const { scenario, messages, level } = req.body;
      const systemInstructions = {
        'travel': `You are a helpful airline check-in agent. The student is checking in for a flight to London. Act naturally, ask for passport, baggage, and seating preferences. Keep your English appropriate for level ${level}.`,
        'interview': `You are a professional HR manager at a modern tech company. The student is interviewing for a Junior Developer position. Ask challenging but fair questions about their background and projects. Level: ${level}.`,
        'restaurant': `You are an attentive waiter at a busy New York bistro. Take the student's order, suggest specials, and handle request nicely. Level: ${level}.`,
        'meeting': `You are a project manager leading a weekly sync. Treat the student as a team member. Ask for updates on their tasks. Level: ${level}.`,
        'daily': `You are a friendly neighbor meeting the student at the park. Talk about the weather, weekend plans, or local events. Level: ${level}.`
      };

      const response = await generateContentWithFallback(ai, {
        contents: messages.map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: systemInstructions[scenario as keyof typeof systemInstructions] || "You are an English tutor.",
        }
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error("Error en /api/simulator-chat:", error);
      sendGeminiError(res, error, 'Falla en el simulador');
    }
  });

  // API: Generate Full Micro-Lesson
  app.post('/api/generate-lesson', async (req, res) => {
    try {
      const { level, topic } = req.body;
      const response = await generateContentWithFallback(ai, {
        contents: `Actúa como diseñador curricular de inglés. Crea una microlección nivel ${level} sobre "${topic}".
        
        Debe incluir:
        1. Objetivo (Una frase motivadora).
        2. Vocabulario (5 palabras clave con traducción y ejemplo).
        3. Explicación (Regla gramatical corta y clara).
        4. Ejercicios (5 variados: multiple-choice, fill-blank, order-phrase).
        
        Responde exclusivamente en JSON.`,
        config: {
          systemInstruction: "You are an expert English Curriculum Designer. Your goal is to make lessons fun, modern and effective. Format as JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              objective: { type: Type.STRING },
              vocabulary: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    word: { type: Type.STRING },
                    meaning: { type: Type.STRING },
                    example: { type: Type.STRING }
                  },
                  required: ["word", "meaning"]
                }
              },
              explanation: { type: Type.STRING },
              exercises: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING, enum: ["multiple-choice", "fill-blank", "order-phrase", "vocabulary"] },
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswer: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    scrambledWords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Required for order-phrase: shuffled words" }
                  },
                  required: ["type", "question", "correctAnswer"]
                }
              }
            },
            required: ["objective", "vocabulary", "explanation", "exercises"]
          }
        }
      });
      res.json(JSON.parse(response.text!));
    } catch (error) {
      console.error(error);
      sendGeminiError(res, error, 'Failed to generate lesson');
    }
  });

  // API: Generate Placement Test
  app.post('/api/generate-placement-test', async (req, res) => {
    try {
      const response = await generateContentWithFallback(ai, {
        contents: `Actúa como un examinador experto de inglés. Crea un mini test de nivelación de 10 preguntas.
        
        Reglas absolutas:
        1. Las preguntas y opciones de respuesta DEBEN estar escritas 100% en inglés. No las traduzcas al español.
        2. 10 preguntas de opción múltiple con dificultad progresiva (3 de A1, 4 de A2, 3 de B1).
        3. Evaluar gramática y vocabulario real.
        4. Las explicaciones pueden estar en español para que el usuario entienda su error.
        
        Responde exclusivamente en JSON.`,
        config: {
          systemInstruction: "You are an expert English Examiner. Format the test as JSON. Crucial rule: The 'question', and all items in 'options' and 'correctAnswer' must be written 100% in English. The 'explanation' may be written in Spanish to provide friendly help.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    level: { type: Type.STRING, enum: ["A1", "A2", "B1"] },
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswer: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                  },
                  required: ["level", "question", "options", "correctAnswer"]
                }
              }
            },
            required: ["questions"]
          }
        }
      });
      res.json(JSON.parse(response.text!));
    } catch (error) {
      console.error(error);
      sendGeminiError(res, error, 'Failed to generate placement test');
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
