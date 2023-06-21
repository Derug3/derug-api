import { Column, Entity, PrimaryColumn } from 'typeorm';
import { WlType } from '../dto/wallet_wl.dto';

@Entity()
export class WalletWl {
  @PrimaryColumn()
  derugAddress: string;

  @Column()
  derugger: string;

  @Column({ type: 'simple-array' })
  wallets: string[];

  @Column({ nullable: true })
  duration: number;

  @Column({ enum: WlType })
  wlType: WlType;
}
