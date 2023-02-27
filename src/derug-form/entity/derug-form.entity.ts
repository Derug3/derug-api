import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { UserRequest } from './user-request.entity';

@Entity()
export class DerugForm {
  @PrimaryColumn()
  collectionKey: string;

  @Column()
  requestsCount: number;

  @Column()
  dateCreated: Date;

  @Column()
  lastRequest: Date;

  @OneToMany(() => UserRequest, (userRequst) => userRequst.collection)
  userRequests: UserRequest[];
}
