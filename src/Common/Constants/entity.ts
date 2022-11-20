import { ProfessionalsEntity } from 'src/admin/entity/professional.entity';
import { AdminEntity } from 'src/admin/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacturesEntity } from 'src/admin/entity/facture.entity';
import { ServiceEntity } from 'src/admin/entity/service.entity';

export const ALL_ENTITY = [
  TypeOrmModule.forFeature([AdminEntity]),
  TypeOrmModule.forFeature([ProfessionalsEntity]),
  TypeOrmModule.forFeature([ServiceEntity]),
  TypeOrmModule.forFeature([FacturesEntity]),
];
