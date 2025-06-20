import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Candidate } from '../../candidate/entities/candidate.entity';
import { JobPost } from '../../job-post/entities/job-post.entity';

@Entity()
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Candidate, (candidate) => candidate.applications, {
    eager: true,
  })
  @JoinColumn({ name: 'candidate_id' })
  candidate: Candidate;

  @Column()
  candidate_id: string;

  @ManyToOne(() => JobPost, (jobPost) => jobPost.applications, {
    eager: true,
  })
  @JoinColumn({ name: 'job_post_id' })
  jobPost: JobPost;

  @Column()
  job_post_id: string;

  @Column({ default: 'pending' })
  status: string; // e.g., pending, accepted, rejected

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
