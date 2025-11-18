import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentsService } from './agents.service';
import { AgentsController } from './agents.controller';
import { Agent, AgentAppointmentRequest, AgentBalance, AgentPayment, Appointment, Area, City, CustomerReview, User } from 'entities/global.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agent, User, Appointment, AgentPayment, CustomerReview, AgentBalance,Area,City,AgentAppointmentRequest]), 
    NotificationsModule,
  ],  controllers: [AgentsController],
  providers: [AgentsService],
  exports: [AgentsService],
})
export class AgentsModule {}