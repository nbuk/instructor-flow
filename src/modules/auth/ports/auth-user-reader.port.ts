import { UserAuthInfo } from '@/modules/auth/types';

export abstract class AuthUserReaderPort {
  abstract findUser(id: string): Promise<UserAuthInfo | null>;
  abstract findUserByTgId(tgId: string): Promise<UserAuthInfo | null>;
}
