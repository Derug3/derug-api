import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class CandyMachineData {
  @PrimaryColumn()
  derugData: string;

  @Column()
  candyMachineKey: string;

  @Column()
  candyMachineSecretKey: string;
}
