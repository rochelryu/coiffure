import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ALL_ENTITY } from '../Common/Constants/entity';

@Module({
  imports: [...ALL_ENTITY],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
