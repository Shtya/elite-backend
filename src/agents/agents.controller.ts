import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Req,
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { imageUploadOptions } from "common/upload.config";

import { AgentsService } from "./agents.service";
import {
  CreateAgentDto,
  UpdateAgentDto,
  ApproveAgentDto,
} from "../dto/agents.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserType } from "src/entities/global.entity";
import { CRUD } from "common/crud.service";
interface RequestWithUser extends Request {
  user: any;
}
@Controller("agents")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @Roles(UserType.ADMIN, UserType.CUSTOMER)
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
    @Req() req: RequestWithUser,
    @UploadedFiles()
    files?: {
      identityProof?: Express.Multer.File[];
      residencyDocument?: Express.Multer.File[];
    },
  ) {
    createAgentDto.cityId = Number(createAgentDto.cityId); 
    if (isNaN(createAgentDto.cityId)) {
      throw new BadRequestException('cityId must be a number');
    }
    if (req.user.type == UserType.ADMIN && !createAgentDto.userId) {
      throw new BadRequestException(
        'The admin must provide userId for the customer',
      );
    }

    
    if (files?.identityProof?.[0]) {
      createAgentDto.identityProof = `/uploads/images/${files.identityProof[0].filename}`;
    }
    if (files?.residencyDocument?.[0]) {
      createAgentDto.residencyDocument = `/uploads/images/${files.residencyDocument[0].filename}`;
    }

    // Ensure either URL or file is provided
    if (!createAgentDto.identityProof || !createAgentDto.residencyDocument) {
      throw new BadRequestException(
        'identityProof or residencyDocument is missing (send as URL or file)',
      );
    }

    return this.agentsService.create(createAgentDto,req.user.id);
  }
  @Get("dashboard")
  @Roles(UserType.AGENT)
  async getMyDashboard(@Req() req: RequestWithUser) {
    const agentId = req.user?.id; // assuming JWT contains agentId
    if (!agentId) {
      throw new BadRequestException("Agent information not found in token");
    }
    return this.agentsService.getDashboard(agentId);
  }


  @Get()
@Roles(UserType.ADMIN, UserType.QUALITY, UserType.AGENT)
async findAll(@Query() query: any) {
  const repository = this.agentsService.agentsRepository;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const qb = repository.createQueryBuilder('agent')
    .leftJoinAndSelect('agent.user', 'agent_user')
    .leftJoinAndSelect('agent.city', 'city')
    .skip(skip)
    .take(limit)
    .orderBy('agent.createdAt', 'DESC');

  // Filters
  if (query.status) qb.andWhere('agent.status = :status', { status: query.status });
  if (query.cityId) qb.andWhere('city.id = :cityId', { cityId: Number(query.cityId) });

  // Only users of type AGENT
  qb.andWhere('agent_user.user_type = :userType', { userType: UserType.AGENT });

  const [records, total] = await qb.getManyAndCount();

  return {
    total_records: total,
    current_page: page,
    per_page: limit,
    records,
  };
}

  

  @Get(":id")
  @Roles(UserType.ADMIN, UserType.QUALITY)
  findOne(@Param("id") id: string) {
    return this.agentsService.findOne(+id);
  }

  @Patch(":id")
  @Roles(UserType.ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "identityProof", maxCount: 1 },
        { name: "residencyDocument", maxCount: 1 },
      ],
      imageUploadOptions
    )
  )
  update(
    @Param("id") id: string,
    @Body() updateAgentDto: any,
    @UploadedFiles()
    files?: {
      identityProof?: Express.Multer.File[];
      residencyDocument?: Express.Multer.File[];
    }
  ) {
    if (files?.identityProof?.[0]) {
      updateAgentDto.identityProofUrl = `/uploads/images/${files.identityProof[0].filename}`;
    }
    if (files?.residencyDocument?.[0]) {
      updateAgentDto.residencyDocumentUrl = `/uploads/images/${files.residencyDocument[0].filename}`;
    }
    return this.agentsService.update(+id, updateAgentDto);
  }

  @Delete(":id")
  @Roles(UserType.ADMIN)
  remove(@Param("id") id: string) {
    return this.agentsService.remove(+id);
  }

  @Post(":id/approve")
  @Roles(UserType.ADMIN, UserType.QUALITY)
  approve(@Param("id") id: string, @Body() approveAgentDto: ApproveAgentDto) {
    return this.agentsService.approve(+id, approveAgentDto);
  }

  @Get("user/:userId")
  @Roles(UserType.ADMIN, UserType.QUALITY)
  findByUserId(@Param("userId") userId: string) {
    return this.agentsService.findByUserId(+userId);
  }
}
