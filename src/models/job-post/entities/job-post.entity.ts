import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { Application } from '../../application/entities/application.entity';

@Entity()
export class JobPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  title: string;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  skill: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: ['remote', 'onsite'],
    default: 'onsite',
  })
  location: 'remote' | 'onsite';

  @Column({ type: 'decimal', nullable: true })
  salary: number;

  @Column({ type: 'uuid' })
  company_id: string;

  @Column({ type: 'int', default: 0 })
  total_applications: number;

  @Column({ type: 'int', default: 100 })
  max_applications: number;

  @Column({
    type: 'enum',
    enum: ['active', 'nonactive'],
    default: 'active',
  })
  status: string;

  @Column({ type: 'boolean', default: false })
  expired: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  expiredDate: Date;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;

  @ManyToOne(() => Company, (company) => company.jobPosts, { eager: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => Application, (application) => application.jobPost)
  applications: Application[];
}
