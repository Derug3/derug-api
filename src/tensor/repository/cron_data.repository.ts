import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CronData } from '../entities/cron_data.entity';

@Injectable()
export class CronDataRepository extends Repository<CronData> {
  constructor(private readonly dataSource: DataSource) {
    super(CronData, dataSource.createEntityManager());
  }

  async saveCronData(cronData: CronData) {
    await this.save(cronData);
  }

  async getCronData() {
    return (await this.find())[0];
  }

  async appendSlugs(slugs: string[]) {
    let cronData = await this.getCronData();

    cronData = { ...cronData, slugs: [...cronData.slugs, ...slugs] };

    await this.save(cronData);
  }
}
