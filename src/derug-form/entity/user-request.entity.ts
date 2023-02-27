import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { DerugForm } from './derug-form.entity';

@Entity()
export class UserRequest {
  @PrimaryColumn()
  userPubkey: string;

  @PrimaryColumn()
  @ManyToOne(() => DerugForm, (derugForm) => derugForm.userRequests)
  collection: DerugForm;

  @Column()
  collectionNftsCount: number;

  @Column()
  lastRequest: Date;
}
