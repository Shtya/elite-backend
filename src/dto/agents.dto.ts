import { IsNotEmpty, IsNumber, IsEnum, IsOptional, IsString } from 'class-validator';
import { AgentApprovalStatus } from '../entities/global.entity';

export class CreateAgentDto {
  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsNotEmpty()
  @IsNumber()
  cityId: number;

  @IsOptional()
  @IsString()
  identityProof: string; 

  @IsOptional()
  @IsString()
  residencyDocument?: string;
}

export class UpdateAgentDto {
  @IsOptional()
  @IsNumber()
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
  cityId?: number;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}