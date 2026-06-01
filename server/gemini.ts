import type { GoogleGenAI } from '@google/genai';

type GenerateParams = Parameters<GoogleGenAI['models']['generateContent']>[0];
type GenerateParamsWithoutModel = Omit<GenerateParams, 'model'>;

const FALLBACK_MODELS = [
  'gemini-2.5-flash',
  'gemini-3.5-flash',
  'gemini-2.0-flash',
];

const RETRYABLE_STATUS = new Set([429, 500, 502, 503]);

export function getGeminiModels(): string[] {
  const preferred = process.env.GEMINI_MODEL?.trim();
  const models = preferred ? [preferred, ...FALLBACK_MODELS] : FALLBACK_MODELS;
  return [...new Set(models)];
}

export function assertGeminiApiKey(): void {
  if (!process.env.GEMINI_API_KEY?.trim()) {
    throw new Error(
      'GEMINI_API_KEY no está configurada. Crea un archivo .env con tu clave de https://aistudio.google.com/apikey',
    );
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function getErrorStatus(error: unknown): number | undefined {
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as { status: unknown }).status;
    return typeof status === 'number' ? status : undefined;
  }
  return undefined;
}

export async function generateContentWithFallback(
  ai: GoogleGenAI,
  params: GenerateParamsWithoutModel,
): Promise<Awaited<ReturnType<GoogleGenAI['models']['generateContent']>>> {
  assertGeminiApiKey();

  const models = getGeminiModels();

  let lastError: unknown;

  for (const model of models) {
    try {
      return await ai.models.generateContent({ ...params, model });
    } catch (error) {
      lastError = error;
      const status = getErrorStatus(error);
      console.warn(`[gemini] ${model} failed${status ? ` (${status})` : ''}:`, getErrorMessage(error).slice(0, 120));
      if (status !== undefined && !RETRYABLE_STATUS.has(status)) {
        throw error;
      }
    }
  }

  throw lastError;
}

export function sendGeminiError(
  res: { status: (code: number) => { json: (body: object) => void } },
  error: unknown,
  fallbackMessage: string,
): void {
  const status = getErrorStatus(error);
  const httpStatus = status === 429 ? 429 : status === 503 ? 503 : 500;
  let details = getErrorMessage(error);

  if (status === 503) {
    details = 'El modelo de IA está saturado. Espera unos segundos y pulsa Reintentar.';
  } else if (status === 429) {
    details = 'Cuota de API agotada o demasiadas peticiones. Espera un minuto o revisa tu plan en Google AI Studio.';
  } else if (details.includes('API key')) {
    details = 'Clave API inválida. Revisa GEMINI_API_KEY en tu archivo .env.';
  }

  res.status(httpStatus).json({ error: fallbackMessage, details });
}
