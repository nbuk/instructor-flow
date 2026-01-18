import { FindSessionUseCase } from './find-session.use-case';
import { LoginUseCase } from './login.use-case';
import { RefreshTokenUseCase } from './refresh-token.use-case';

export const authUseCases = [
  LoginUseCase,
  RefreshTokenUseCase,
  FindSessionUseCase,
];
