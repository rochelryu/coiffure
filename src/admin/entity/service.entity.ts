import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FacturesEntity } from './facture.entity';

@Entity()
export class ServiceEntity extends BaseEntity {
  @PrimaryGeneratedColumn() id: string;

  @Column({ length: 225 })
  title: string;

  @Column({ type: 'int' })
  price: number;

  @OneToMany(() => FacturesEntity, (facture) => facture.serviceId)
  factures: FacturesEntity[];

  @CreateDateColumn() create_at: Date;

  @UpdateDateColumn() updated_at: Date;
}
