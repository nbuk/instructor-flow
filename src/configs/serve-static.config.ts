import { ServeStaticModuleOptions } from '@nestjs/serve-static';
import path from 'path';

export const getServeStaticConfig = (): ServeStaticModuleOptions => ({
  rootPath: path.join(__dirname, '..', '..', 'client'),
});
