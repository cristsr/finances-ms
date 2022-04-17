export const movementTypes = ['income', 'expense'] as const;

export type MovementType = typeof movementTypes[number];

export enum MovementEvents {
  CREATE = 'movement:create',
  UPDATE = 'movement:update',
}

export const periods = ['day', 'week', 'month', 'year'] as const;
export type Period = typeof periods[number];
