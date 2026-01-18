import { uuidv7 } from 'uuidv7';

import { AggregateRoot } from '@/libs/domain/aggregate-root.base';

import { IUser, UserRoleType, UserStatus, UserStatusType } from './types';

export class UserEntity extends AggregateRoot<IUser> {
  private readonly role: UserRoleType;
  private readonly tgId: string;
  private status: UserStatusType;
  private readonly createdAt: Date;
  private updatedAt: Date;

  private constructor(user: IUser) {
    super(user.id);
    this.role = user.role;
    this.tgId = user.tgId;
    this.status = user.status;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  static create(tgId: string, role: UserRoleType) {
    const id = uuidv7();
    const createdAt = new Date();
    return new UserEntity({
      id,
      tgId,
      role,
      createdAt,
      updatedAt: createdAt,
      status: UserStatus.ACTIVE,
    });
  }

  static restore(user: IUser) {
    return new UserEntity(user);
  }

  public getId() {
    return this.id;
  }

  public getTgId() {
    return this.tgId;
  }

  public getRole() {
    return this.role;
  }

  public setStatus(status: UserStatusType) {
    this.status = status;
    this.updatedAt = new Date();
    return this;
  }

  public serialize(): IUser {
    return {
      id: this.id,
      role: this.role,
      tgId: this.tgId,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
