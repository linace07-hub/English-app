export function getFallbackLesson(level: string) {
  const lessons: Record<string, object> = {
    A1: {
      objective: 'Aprende saludos y presentaciones básicas en inglés.',
      vocabulary: [
        { word: 'Hello', meaning: 'Hola', example: 'Hello, my name is Lina.' },
        { word: 'Goodbye', meaning: 'Adiós', example: 'Goodbye, see you tomorrow!' },
        { word: 'Please', meaning: 'Por favor', example: 'A coffee, please.' },
        { word: 'Thank you', meaning: 'Gracias', example: 'Thank you for your help.' },
        { word: 'Nice to meet you', meaning: 'Mucho gusto', example: 'Nice to meet you, I am Lina.' },
      ],
      explanation:
        'Usa "I am" para presentarte: I am + nombre. Para preguntar: What is your name?',
      exercises: [
        {
          type: 'multiple-choice',
          question: 'How do you say "Hola" in English?',
          options: ['Goodbye', 'Hello', 'Please', 'Thanks'],
          correctAnswer: 'Hello',
          explanation: '"Hello" es el saludo más común.',
        },
        {
          type: 'fill-blank',
          question: 'Nice to ____ you. (Mucho gusto)',
          correctAnswer: 'meet',
          explanation: 'La frase fija es "Nice to meet you".',
        },
        {
          type: 'multiple-choice',
          question: 'Choose the correct introduction:',
          options: ['I is Lina', 'I am Lina', 'I are Lina', 'Me am Lina'],
          correctAnswer: 'I am Lina',
          explanation: 'Con "I" usamos "am": I am Lina.',
        },
        {
          type: 'order-phrase',
          question: 'Ordena la frase:',
          scrambledWords: ['How', 'are', 'you', '?'],
          correctAnswer: 'How are you?',
          explanation: 'Pregunta común: How are you?',
        },
        {
          type: 'vocabulary',
          question: 'What does "Thank you" mean?',
          options: ['Por favor', 'Gracias', 'Adiós', 'Hola'],
          correctAnswer: 'Gracias',
          explanation: '"Thank you" = Gracias.',
        },
      ],
    },
    A2: {
      objective: 'Domina frases de rutina diaria en inglés.',
      vocabulary: [
        { word: 'Wake up', meaning: 'Despertarse', example: 'I wake up at 7 am.' },
        { word: 'Breakfast', meaning: 'Desayuno', example: 'I have breakfast at home.' },
        { word: 'Work', meaning: 'Trabajar', example: 'I work from Monday to Friday.' },
        { word: 'Usually', meaning: 'Normalmente', example: 'I usually walk to school.' },
        { word: 'Go to bed', meaning: 'Ir a dormir', example: 'I go to bed at 10 pm.' },
      ],
      explanation:
        'Presente simple para rutinas: sujeto + verbo (+ s en he/she/it). Ej: I work, She works.',
      exercises: [
        {
          type: 'multiple-choice',
          question: 'She ____ to work by bus. (va)',
          options: ['go', 'goes', 'going', 'went'],
          correctAnswer: 'goes',
          explanation: 'Con he/she/it añadimos -s: goes.',
        },
        {
          type: 'fill-blank',
          question: 'I usually ____ breakfast at 8. (desayuno)',
          correctAnswer: 'have',
          explanation: '"Have breakfast" = desayunar.',
        },
        {
          type: 'multiple-choice',
          question: 'Which sentence is correct?',
          options: ['I wakes up at 7', 'I wake up at 7', 'I waking up at 7', 'I wake ups at 7'],
          correctAnswer: 'I wake up at 7',
          explanation: 'Con I/you/we/they el verbo no lleva -s.',
        },
        {
          type: 'order-phrase',
          question: 'Ordena:',
          scrambledWords: ['bed', 'I', 'at', '10', 'go', 'to'],
          correctAnswer: 'I go to bed at 10',
          explanation: 'Orden: sujeto + verbo + complementos.',
        },
        {
          type: 'vocabulary',
          question: '"Usually" means:',
          options: ['Nunca', 'A veces', 'Normalmente', 'Siempre'],
          correctAnswer: 'Normalmente',
          explanation: '"Usually" = con frecuencia / normalmente.',
        },
      ],
    },
    B1: {
      objective: 'Escribe y entiende correos profesionales simples.',
      vocabulary: [
        { word: 'Dear', meaning: 'Estimado/a', example: 'Dear Mr. Smith,' },
        { word: 'Regarding', meaning: 'Con respecto a', example: 'Regarding your email...' },
        { word: 'Attached', meaning: 'Adjunto', example: 'Please find the file attached.' },
        { word: 'Looking forward', meaning: 'Quedo a la espera', example: 'Looking forward to your reply.' },
        { word: 'Best regards', meaning: 'Saludos cordiales', example: 'Best regards, Lina' },
      ],
      explanation:
        'En emails formales: saludo (Dear...), cuerpo claro, cierre (Best regards).',
      exercises: [
        {
          type: 'multiple-choice',
          question: 'Best opening for a formal email:',
          options: ['Hey!!!', 'Dear Ms. Lopez,', 'Yo Lopez', 'What\'s up'],
          correctAnswer: 'Dear Ms. Lopez,',
          explanation: '"Dear + nombre" es formal y correcto.',
        },
        {
          type: 'fill-blank',
          question: 'Please find the document ____. (adjunto)',
          correctAnswer: 'attached',
          explanation: '"Attached" = adjunto en correos.',
        },
        {
          type: 'multiple-choice',
          question: 'Polite closing:',
          options: ['Bye', 'Best regards', 'See ya', 'Later'],
          correctAnswer: 'Best regards',
          explanation: '"Best regards" es un cierre profesional.',
        },
        {
          type: 'order-phrase',
          question: 'Ordena:',
          scrambledWords: ['your', 'to', 'forward', 'reply', 'Looking'],
          correctAnswer: 'Looking forward to your reply',
          explanation: 'Frase fija para cerrar emails.',
        },
        {
          type: 'vocabulary',
          question: '"Regarding" means:',
          options: ['Adiós', 'Con respecto a', 'Gracias', 'Urgente'],
          correctAnswer: 'Con respecto a',
          explanation: '"Regarding" introduce el tema del email.',
        },
      ],
    },
  };

  return lessons[level] ?? lessons.A2;
}
