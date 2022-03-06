export const periods = ['month', 'year'] as const;
export type Period = typeof periods[number];
