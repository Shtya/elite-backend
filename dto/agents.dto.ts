import { IsNotEmpty, IsNumber, IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { AgentApprovalStatus } from '../entities/global.entity';

export class CreateAgentDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  userId?: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  cityId: number;

  @IsOptional()
  @IsString()
  identityProof: string;

  @IsOptional()
  @IsString()
  residencyDocument?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  areaId?: number;
}

export class UpdateAgentDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  cityId?: number;

  @IsOptional()
  @IsString()
  identityProofUrl?: string;

  @IsOptional()
  @IsString()
  residencyDocumentUrl?: string;

  @IsOptional()
  @IsEnum(AgentApprovalStatus)
  status?: AgentApprovalStatus;

  @IsOptional()
  @IsString()
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
