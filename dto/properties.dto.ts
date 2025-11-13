import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, IsArray, IsObject, IsBoolean } from 'class-validator';
import { AccessType } from '../entities/global.entity';

export class CreatePropertyDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  propertyTypeId: number;

  @IsNotEmpty()
  cityId: number;

  @IsNotEmpty()
  
  areaId: number;

  @IsNotEmpty()
  
  bedrooms: number;

  @IsNotEmpty()

  bathrooms: number;

  @IsNotEmpty()
  @IsString()
  areaM2: string;

  @IsOptional()
  @IsString()
  price?: string;

  @IsNotEmpty()
  
  specifications: Record<string, any>;

  @IsNotEmpty()
  
  guarantees: Record<string, any>;

  @IsEnum(AccessType)
  accessType: AccessType;

  @IsOptional()
  @IsString()
  ownerName?: string;

  @IsOptional()
  @IsString()
  ownerPhone?: string;

  @IsOptional()
  @IsString()
  ownerNotes?: string;

  @IsOptional()
  @IsString()
  latitude?: string;

  @IsOptional()
  @IsString()
  longitude?: string;

  @IsOptional()
  @IsString()
  mapPlaceId?: string;
}

export class UpdatePropertyDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  propertyTypeId?: number;

  @IsOptional()
  @IsNumber()
  cityId?: number;

  @IsOptional()
  @IsNumber()
  areaId?: number;

  @IsOptional()
  @IsNumber()
  bedrooms?: number;

  @IsOptional()
  @IsNumber()
  bathrooms?: number;

  @IsOptional()
  @IsString()
  areaM2?: string;

  @IsOptional()
  @IsString()
  price?: string;

  @IsOptional()
  @IsObject()
  specifications?: Record<string, any>;

  @IsOptional()
  @IsObject()
  guarantees?: Record<string, any>;

  @IsOptional()
  @IsEnum(AccessType)
  accessType?: AccessType;

  @IsOptional()
  @IsString()
  ownerName?: string;

  @IsOptional()
  @IsString()
  ownerPhone?: string;

  @IsOptional()
  @IsString()
  ownerNotes?: string;

  @IsOptional()
  @IsString()
  latitude?: string;

  @IsOptional()
  @IsString()
  longitude?: string;

  @IsOptional()
  @IsString()
  mapPlaceId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class PropertyQueryDto {
  @IsOptional()
  @IsNumber()
  cityId?: number;

  @IsOptional()
  @IsNumber()
  areaId?: number;

  @IsOptional()
  @IsNumber()
  propertyTypeId?: number;

  @IsOptional()
  @IsNumber()
  minBedrooms?: number;

  @IsOptional()
  @IsNumber()
  maxBedrooms?: number;

  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}

export class PropertyMediaDto {
  @IsNotEmpty()
  @IsString()
  mediaUrl: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsOptional()
  @IsNumber()
  orderIndex?: number;
}

export class CreateManyPropertyMediaDto {
  medias: PropertyMediaDto[] | string;
}
