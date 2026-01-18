import { IsDateString } from 'class-validator';

export class GetScheduleDto {
  @IsDateString()
  date: string;
}
