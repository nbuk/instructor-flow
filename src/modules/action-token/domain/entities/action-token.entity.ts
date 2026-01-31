import { nanoid } from 'nanoid';
import { uuidv7 } from 'uuidv7';

import { AggregateRoot } from '@/libs/domain/aggregate-root.base';
import {
  ArgumentOutOfRangeException,
  ConflictException,
} from '@/libs/exceptions/exceptions';

import { ActionTokenPayload, IActionToken } from './types';

export class ActionTokenEntity extends AggregateRoot<IActionToken> {
  private readonly token: string;
  private readonly payload: ActionTokenPayload;
  private readonly isReusable: boolean;
  private usedCount: number;
  private readonly maxUses: number | null;
  private readonly expiredAt: Date | null;
  private consumedAt: Date | null;
  private readonly createdAt: Date;
  private updatedAt: Date;

  private constructor(data: IActionToken) {
    super(data.id);
    this.token = data.token;
    this.payload = data.payload;
    this.isReusable = data.isReusable;
    this.usedCount = data.usedCount;
    this.maxUses = data.maxUses;
    this.expiredAt = data.expiredAt;
    this.consumedAt = data.consumedAt;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static create(
    data: Omit<
      IActionToken,
      'id' | 'token' | 'usedCount' | 'consumedAt' | 'createdAt' | 'updatedAt'
    >,
  ) {
    const id = uuidv7();
    const token = nanoid(10);
    const createdAt = new Date();
    return new ActionTokenEntity({
      id,
      token,
      createdAt,
      updatedAt: createdAt,
      usedCount: 0,
      consumedAt: null,
      ...data,
    });
  }

  static restore(data: IActionToken) {
    return new ActionTokenEntity(data);
  }

  public consume<T>(): T {
    if (this.expiredAt && this.expiredAt.getTime() < Date.now()) {
      throw new ArgumentOutOfRangeException('action token expired', {
        token: this.serialize(),
      });
    }
    if (!this.isReusable) {
      if (this.consumedAt) {
        throw new ConflictException('action token already consumed', {
          token: this.serialize(),
        });
      }
      this.consumedAt = new Date();
    } else {
      const usedCount = this.usedCount++;
      if (this.maxUses && this.maxUses < usedCount) {
        throw new ConflictException('action token usage limit exceeded', {
          token: this.serialize(),
        });
      }
      this.usedCount = usedCount;
    }

    this.updatedAt = new Date();
    return this.payload as T;
  }

  public getToken() {
    return this.token;
  }

  serialize(): IActionToken {
    return {
      id: this.id,
      token: this.token,
      payload: this.payload,
      isReusable: this.isReusable,
      maxUses: this.maxUses,
      usedCount: this.usedCount,
      expiredAt: this.expiredAt,
      consumedAt: this.consumedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
