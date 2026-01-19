import { IsDateString, IsTimeZone } from 'class-validator';

export class GetScheduleDto {
  @IsDateString()
  date: string;

  @IsTimeZone()
  tz: string;
}
