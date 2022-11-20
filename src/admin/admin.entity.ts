import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class AdminEntity extends BaseEntity {
  @PrimaryGeneratedColumn() id: string;
  @Column({ length: 225 })
  firstname: string;

  @Column({ length: 20 })
  contact: string;

  @Column({ length: 20, default: 'Homme' })
  sexe: string;

  @Column({ length: 25 })
  recovery: string;

  @Column({ length: 255 })
  password: string;

  @Column({ type: 'int' })
  level: number;

  @CreateDateColumn() create_at: Date;

  @UpdateDateColumn() updated_at: Date;
}
