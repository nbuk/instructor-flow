import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginatedQueryDto {
  @IsInt()
  @Min(10)
  @Max(100)
  @Type(() => Number)
  limit: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset: number;

  @IsString()
  orderBy: string;

  @IsIn(['asc', 'desc'])
  sort: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  search?: string;
}
