import { Module } from '@nestjs/common';

import { AuthUserReaderPort } from '@/modules/auth/ports/auth-user-reader.port';
import { AuthUserReaderAdapter } from '@/modules/integration/auth/auth-user-reader.adapter';
import { PrismaModule } from '@/modules/prisma';

@Module({
  imports: [PrismaModule],
  providers: [
    AuthUserReaderAdapter,
    {
      provide: AuthUserReaderPort,
      useExisting: AuthUserReaderAdapter,
    },
  ],
  exports: [AuthUserReaderPort],
})
export class AuthIntegrationModule {}
