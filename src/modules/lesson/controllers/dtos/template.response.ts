import { Exclude, Expose } from 'class-transformer';

import { type DefaultTemplateRules } from '../../domain/entities/schedule-template/types';

@Exclude()
export class TemplateListResponse {
  @Expose()
  id: string;

  @Expose()
  title: string;
}

@Exclude()
export class TemplateResponse {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  defaultRules: DefaultTemplateRules;

  @Expose()
  rules: unknown[];
}
