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
export class ProfessionalsEntity extends BaseEntity {
  @PrimaryGeneratedColumn() id: string;

  @Column({ length: 225 })
  name: string;

  @Column({ length: 225 })
  contact: string;

  // Relationship

  @OneToMany(() => FacturesEntity, (facture) => facture.professionalId)
  factures: FacturesEntity[];

  @CreateDateColumn() create_at: Date;

  @UpdateDateColumn() updated_at: Date;
}
