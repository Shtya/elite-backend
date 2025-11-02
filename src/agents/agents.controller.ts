import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { imageUploadOptions } from 'common/upload.config';

import { AgentsService } from './agents.service';
import { CreateAgentDto, UpdateAgentDto, ApproveAgentDto } from '../../dto/agents.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from 'entities/global.entity';
import { CRUD } from 'common/crud.service';

@Controller('agents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @Roles(UserType.ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'identityProof', maxCount: 1 },
        { name: 'residencyDocument', maxCount: 1 },
      ],
      imageUploadOptions,
    ),
  )
  async create(
    @Body() createAgentDto: any,
    @UploadedFiles()
    files?: {
      identityProof?: Express.Multer.File[];
      residencyDocument?: Express.Multer.File[];
    },
  ) {
    // Map uploaded files -> URLs (if present)
    if (files?.identityProof?.[0]) {
      createAgentDto.identityProofUrl = `/uploads/images/${files.identityProof[0].filename}`;
    }
    if (files?.residencyDocument?.[0]) {
      createAgentDto.residencyDocumentUrl = `/uploads/images/${files.residencyDocument[0].filename}`;
    }

    // Enforce presence: either URL in body or uploaded file must exist
    if (!createAgentDto.identityProofUrl || !createAgentDto.residencyDocumentUrl) {
      throw new BadRequestException('identityProof or residencyDocument is missing (send as URL or file).');
    }

    return this.agentsService.create(createAgentDto);
  }

  @Get()
  @Roles(UserType.ADMIN, UserType.QUALITY)
  findAll(@Query() query: any) {
    const filters: Record<string, any> = {};
    if (query.status) filters.status = query.status;
    if (query.cityId) filters.city = { id: Number(query.cityId) };

    return CRUD.findAll(this.agentsService.agentsRepository, 'agent', query.q || query.search, query.page, query.limit, query.sortBy, query.sortOrder, ['user', 'city'], ['status'], filters);
  }

  @Get(':id')
  @Roles(UserType.ADMIN, UserType.QUALITY)
  findOne(@Param('id') id: string) {
    return this.agentsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserType.ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'identityProof', maxCount: 1 },
        { name: 'residencyDocument', maxCount: 1 },
      ],
      imageUploadOptions,
    ),
  )
  update(
    @Param('id') id: string,
    @Body() updateAgentDto: any,
    @UploadedFiles()
    files?: {
      identityProof?: Express.Multer.File[];
      residencyDocument?: Express.Multer.File[];
    },
  ) {
    if (files?.identityProof?.[0]) {
      updateAgentDto.identityProofUrl = `/uploads/images/${files.identityProof[0].filename}`;
    }
    if (files?.residencyDocument?.[0]) {
      updateAgentDto.residencyDocumentUrl = `/uploads/images/${files.residencyDocument[0].filename}`;
    }
    return this.agentsService.update(+id, updateAgentDto);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN)
  remove(@Param('id') id: string) {
    return this.agentsService.remove(+id);
  }

  @Post(':id/approve')
  @Roles(UserType.ADMIN, UserType.QUALITY)
  approve(@Param('id') id: string, @Body() approveAgentDto: ApproveAgentDto) {
    return this.agentsService.approve(+id, approveAgentDto);
  }

  @Get('user/:userId')
  @Roles(UserType.ADMIN, UserType.QUALITY)
  findByUserId(@Param('userId') userId: string) {
    return this.agentsService.findByUserId(+userId);
  }
}
