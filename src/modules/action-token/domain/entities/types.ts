export interface IActionToken {
  id: string;
  token: string;
  payload: ActionTokenPayload;
  isReusable: boolean;
  usedCount: number;
  maxUses: number | null;
  expiredAt: Date | null;
  consumedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ActionTokenPayload = Record<string, unknown>;
