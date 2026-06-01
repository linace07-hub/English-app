const TYPE_LABELS: Record<string, string> = {
  'multiple-choice': 'Opción múltiple',
  'fill-blank': 'Completar la frase',
  'order-phrase': 'Ordenar palabras',
  vocabulary: 'Vocabulario',
  listening: 'Escuchar y responder',
};

export function normalizeLessonData(data: unknown) {
  if (!data || typeof data !== 'object') return data;
  const lesson = data as { exercises?: unknown[]; [key: string]: unknown };
  if (!Array.isArray(lesson.exercises)) return data;

  return {
    ...lesson,
    exercises: lesson.exercises.map((ex, index) => normalizeExercise(ex, index)),
  };
}

function normalizeExercise(ex: unknown, index: number) {
  const e = (ex && typeof ex === 'object' ? ex : {}) as Record<string, unknown>;
  const type = String(e.type || 'multiple-choice');

  let question = typeof e.question === 'string' ? e.question.trim() : '';
  if (!question) {
    const defaults: Record<string, string> = {
      'order-phrase': 'Ordena las palabras para formar una frase correcta en inglés.',
      'fill-blank': 'Completa la palabra que falta en la frase (____).',
      listening: 'Escucha el audio y elige la mejor respuesta.',
      vocabulary: 'Elige la opción correcta según el significado.',
      'multiple-choice': `Responde la pregunta ${index + 1}.`,
    };
    question = defaults[type] ?? `Pregunta ${index + 1}`;
  }

  return { ...e, type, question };
}

export function getExerciseTypeLabel(type: string): string {
  return TYPE_LABELS[type] ?? 'Ejercicio';
}

export function getExerciseHint(type: string): string | null {
  switch (type) {
    case 'order-phrase':
      return 'Construye la frase en inglés tocando las palabras en orden. Para corregir, toca una palabra en la frase de arriba.';
    case 'fill-blank':
      return 'Lee la frase completa y escribe solo la palabra que falta donde dice ____';
    case 'listening':
      return 'Primero escucha con el botón morado; después elige una respuesta.';
    case 'vocabulary':
      return 'Lee la pregunta y elige la traducción o significado correcto.';
    default:
      return 'Lee la pregunta con atención y elige la mejor respuesta.';
  }
}

export function getExerciseTitle(exercise: {
  type: string;
  question: string;
}): string {
  if (exercise.type === 'listening') {
    return exercise.question || 'Escucha y responde';
  }
  return exercise.question;
}
