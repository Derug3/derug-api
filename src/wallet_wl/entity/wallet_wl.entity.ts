import { Column, Entity, PrimaryColumn } from 'typeorm';
import { WlType } from '../dto/wallet_wl.dto';

@Entity()
export class WalletWl {
  @PrimaryColumn()
  serverId: string;

  @Column()
  derugAddress: string;

  @Column({ type: 'jsonb' })
  wallets: WlConfig[];

  @Column({ nullable: true })
  duration: number;

  @Column({ enum: WlType })
  wlType: WlType;
}

export interface WlConfig {
  userId: string;
  wallet: string;
}
