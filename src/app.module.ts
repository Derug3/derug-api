import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from 'typeorm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MagicEdenCollectionsModule } from './magic-eden-collections/magic-eden-collections.module';
import { TensorModule } from './tensor/tensor.module';
import { PublicRemintModule } from './public-remint/public-remint.module';
import { TwitterAuthModule } from './twitter-auth/twitter-auth.module';
import { CollectionVolumeModule } from './collection-volume/collection-volume.module';
import { UserMintModule } from './user-mint/user-mint.module';
import { WalletWlModule } from './wallet_wl/wallet_wl.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: typeormConfig,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MagicEdenCollectionsModule,
    TensorModule,
    PublicRemintModule,
    TwitterAuthModule,
    CollectionVolumeModule,
    UserMintModule,
    WalletWlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
