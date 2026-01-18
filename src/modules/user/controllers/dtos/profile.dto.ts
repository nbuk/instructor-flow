import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

class BaseUpdateProfileDto {
  @IsString()
  firstName: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  lastName: string;

  @IsString()
  phone: string;
}

export class StudentUpdateProfileDto extends BaseUpdateProfileDto {}

class InstructorCar {
  @IsString()
  model: string;

  @IsString()
  licensePlate: string;
}

export class InstructorUpdateProfileDto extends BaseUpdateProfileDto {
  @ValidateNested()
  @Type(() => InstructorCar)
  car: InstructorCar;
}
