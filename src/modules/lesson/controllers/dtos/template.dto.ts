import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsTimeZone,
  IsUUID,
  Matches,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

class TemplateRuleBreak {
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  startTime: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  endTime: string;
}

class DefaultRule {
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  startTime: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  endTime: string;

  @IsInt()
  @Min(1)
  slotDurationMinutes: number;

  @IsInt()
  @Min(0)
  slotGapMinutes: number;

  @ValidateNested()
  @Type(() => TemplateRuleBreak)
  breaks: TemplateRuleBreak[];
}

class TemplateRule extends DefaultRule {
  @IsInt()
  @Min(0)
  @Max(6)
  weekday: number;
}

class UpdateTemplateRule extends TemplateRule {
  @IsOptional()
  @IsUUID('7')
  id: string;
}

export class TemplateDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsTimeZone()
  timezone: string;

  @ValidateNested()
  @Type(() => DefaultRule)
  defaultRules: DefaultRule;

  @ValidateNested()
  @Type(() => TemplateRule)
  rules: TemplateRule[];
}

export class UpdateTemplateDto {
  @IsString()
  @MinLength(1)
  title: string;

  @ValidateNested()
  @Type(() => DefaultRule)
  defaultRules: DefaultRule;

  @ValidateNested()
  @Type(() => UpdateTemplateRule)
  rules: UpdateTemplateRule[];
}
