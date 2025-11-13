import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyListingRequestsService } from './property-listing-requests.service';
import { PropertyListingRequestsController } from './property-listing-requests.controller';
import { PropertyListingRequest, PropertyListingRequestAttachment, User, PropertyType } from 'entities/global.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyListingRequest, PropertyListingRequestAttachment, User, PropertyType])],
  controllers: [PropertyListingRequestsController],
  providers: [PropertyListingRequestsService],
  exports: [PropertyListingRequestsService],
})
export class PropertyListingRequestsModule {}