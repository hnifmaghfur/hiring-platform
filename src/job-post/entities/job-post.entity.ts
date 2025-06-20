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
} from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { Application } from '../../application/entities/application.entity';

@Entity()
export class JobPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  skill: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column('decimal', { nullable: true })
  salary: number;

  @Column()
  company_id: string;

  @Column()
  total_applications: number;

  @Column()
  max_applications: number;

  @Column()
  status: string;

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
