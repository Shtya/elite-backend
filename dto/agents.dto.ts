import { IsNotEmpty, IsNumber, IsEnum, IsOptional, IsString, ArrayNotEmpty, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { AgentApprovalStatus } from '../entities/global.entity';


export class CreateAgentDto {
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map(v => Number(v))
      : value.split(',').map(v => Number(v))
  )
  @IsNumber({}, { each: true })
  cityIds: number[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map(v => Number(v))
      : value.split(',').map(v => Number(v))
  )
  @IsNumber({}, { each: true })
  areaIds?: number[];

  identityProof?: string;
  residencyDocument?: string;
}
export class UpdateAgentDto {
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  cityIds?: number[];

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  areaIds?: number[];

  @IsOptional()
  identityProof?: string;

  @IsOptional()
  residencyDocument?: string;
@IsOptional()
  kycNotes?: string;

}


export class ApproveAgentDto {
  @IsEnum(AgentApprovalStatus)
  status: AgentApprovalStatus;

  @IsOptional()
  @IsString()
  kycNotes?: string;
}

export class AgentQueryDto {
  @IsOptional()
  @IsEnum(AgentApprovalStatus)
  status?: AgentApprovalStatus;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  cityId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}
