import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CronData {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'simple-array' })
  slugs: string[];
}
