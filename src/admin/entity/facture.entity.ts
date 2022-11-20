import { ServiceEntity } from './service.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProfessionalsEntity } from './professional.entity';

@Entity()
export class FacturesEntity extends BaseEntity {
  @PrimaryGeneratedColumn() id: string;

  @Column({ type: 'int' })
  serviceId: number;

  @Column({ type: 'int' })
  professionalId: number;


  @Column({ type: 'int' })
  priceFinal: number;

  @ManyToOne(
    () => ServiceEntity,
    (service) => service.factures,
  )
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;

  @ManyToOne(
    () => ProfessionalsEntity,
    (professional) => professional.factures,
  )
  @JoinColumn({ name: 'professionalId' })
  professional: ProfessionalsEntity;

  @CreateDateColumn() create_at: Date;

  @UpdateDateColumn() updated_at: Date;
}
