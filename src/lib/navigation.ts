export type AppView =
  | 'dashboard'
  | 'lesson'
  | 'review'
  | 'vocabulary'
  | 'stats'
  | 'profile'
  | 'simulator';

const VALID_VIEWS = new Set<AppView>([
  'dashboard',
  'lesson',
  'review',
  'vocabulary',
  'stats',
  'profile',
  'simulator',
]);

const VIEW_ALIASES: Record<string, AppView> = {
  home: 'dashboard',
  lessons: 'lesson',
  placement: 'dashboard',
};

export function normalizeView(saved: string | null): AppView {
  if (!saved) return 'dashboard';
  const mapped = VIEW_ALIASES[saved] ?? saved;
  if (VALID_VIEWS.has(mapped as AppView)) {
    return mapped as AppView;
  }
  return 'dashboard';
}
