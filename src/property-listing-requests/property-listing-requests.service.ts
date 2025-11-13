import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyListingRequest, PropertyListingRequestAttachment, User, PropertyType, ListingRequestStatus, RelationshipType } from 'entities/global.entity';
import { CreatePropertyListingRequestDto, UpdatePropertyListingRequestDto, PropertyListingRequestQueryDto, AddAttachmentDto } from '../../dto/property-listing-requests.dto';
import { toWebPathFiles } from 'common/upload.config';

@Injectable()
export class PropertyListingRequestsService {
  constructor(
    @InjectRepository(PropertyListingRequest)
    public propertyListingRequestsRepository: Repository<PropertyListingRequest>,
    @InjectRepository(PropertyListingRequestAttachment)
    private attachmentsRepository: Repository<PropertyListingRequestAttachment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(PropertyType)
    private propertyTypesRepository: Repository<PropertyType>,
  ) {}
  async create(dto: CreatePropertyListingRequestDto, attachmentsFiles: Express.Multer.File[] = []): Promise<PropertyListingRequest> {
    const owner = await this.usersRepository.findOne({ where: { id: dto.ownerId } });
    if (!owner) throw new NotFoundException('Owner not found');
  
    const propertyType = await this.propertyTypesRepository.findOne({ where: { id: dto.propertyTypeId } });
    if (!propertyType) throw new NotFoundException('Property type not found');
  
    let specifications = dto.specifications;
    if (typeof specifications === 'string') {
      try {
        specifications = JSON.parse(specifications);
      } catch {
        throw new BadRequestException('Invalid specifications JSON');
      }
    }
  
    // Save main request
    const request = this.propertyListingRequestsRepository.create({
      owner,
      relationshipType: dto.relationshipType,
      propertyType,
      location: dto.location,
      specifications,
      askingPrice: dto.askingPrice ?? null,
      authorizationDocUrl: dto.authorizationDocUrl ?? null,
      ownershipDocUrl: dto.ownershipDocUrl ?? null,
    });
  
    const savedRequest = await this.propertyListingRequestsRepository.save(request);
  
    // Save attachments
    if (attachmentsFiles.length > 0) {
      const attachmentsRows = attachmentsFiles.map(file =>
        this.attachmentsRepository.create({
          request: savedRequest,
          attachmentUrl: toWebPathFiles(file.filename),
        }),
      );
      await this.attachmentsRepository.save(attachmentsRows);
    }
  
    return this.findOne(savedRequest.id);
  }
  
  
  async findOne(id: number): Promise<PropertyListingRequest> {
    const request = await this.propertyListingRequestsRepository.findOne({
      where: { id },
      relations: ['owner', 'propertyType', 'attachments', 'updatedBy'],
    });

    if (!request) {
      throw new NotFoundException('Property listing request not found');
    }

    return request;
  }

  async update(id: number, updateDto: UpdatePropertyListingRequestDto): Promise<PropertyListingRequest> {
    const request = await this.findOne(id);
    if (!request) throw new NotFoundException('Property listing request not found');
  
    const { attachments, ...mainFields } = updateDto;
    Object.assign(request, mainFields);
  
    const savedRequest = await this.propertyListingRequestsRepository.save(request);
  
    if (attachments && attachments.length > 0) {
      const rows = attachments.map(attachmentUrl =>
        this.attachmentsRepository.create({
          request: savedRequest,
          attachmentUrl,
        })
      );
      await this.attachmentsRepository.save(rows);
    }
  
    return this.findOne(savedRequest.id);
  }
  
  async remove(id: number): Promise<void> {
    const request = await this.findOne(id);
    await this.propertyListingRequestsRepository.remove(request);
  }

  async addAttachment(requestId: number, addAttachmentDto: AddAttachmentDto): Promise<PropertyListingRequestAttachment> {
    const request = await this.findOne(requestId);

    const attachment = this.attachmentsRepository.create({
      ...addAttachmentDto,
      request,
    });

    return this.attachmentsRepository.save(attachment);
  }

  async approve(id: number): Promise<PropertyListingRequest> {
    const request = await this.findOne(id);
    request.status = ListingRequestStatus.INSPECTED;
    return this.propertyListingRequestsRepository.save(request);
  }

  async reject(id: number, reason: string): Promise<PropertyListingRequest> {
    const request = await this.findOne(id);
    request.status = ListingRequestStatus.REJECTED;
    // You might want to store the rejection reason
    return this.propertyListingRequestsRepository.save(request);
  }

  async publish(id: number): Promise<PropertyListingRequest> {
    const request = await this.findOne(id);
    request.status = ListingRequestStatus.PUBLISHED;

    // Here you would create an actual property from the request
    await this.createPropertyFromRequest(request);

    return this.propertyListingRequestsRepository.save(request);
  }

  async findByOwner(ownerId: number): Promise<PropertyListingRequest[]> {
    return this.propertyListingRequestsRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['propertyType', 'attachments'],
      order: { createdAt: 'DESC' },
    });
  }

  private async createPropertyFromRequest(request: PropertyListingRequest): Promise<void> {
    // Implementation to create a property from the approved request
    // This would involve creating a new Property entity with the request data
    console.log('Creating property from request:', request.id);
  }
}
