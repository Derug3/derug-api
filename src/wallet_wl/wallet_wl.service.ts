import { Injectable, OnModuleInit } from '@nestjs/common';
import { WalletWlDto } from './dto/wallet_wl.dto';
import { WalletWlRepository } from './repository/wallet_wl.repository';
import { DiscordBotHandler } from './so/discord_bot.handler';

@Injectable()
export class WalletWlService implements OnModuleInit {
  private readonly discorBotHandler: DiscordBotHandler;
  constructor(private readonly wlRepo: WalletWlRepository) {
    this.discorBotHandler = new DiscordBotHandler(wlRepo);
  }
  onModuleInit() {
    this.discorBotHandler.execute();
  }

  getAllWhitelistsForDerug(derugAddress: string) {
    return this.wlRepo.getAllWhitelistsForDerug(derugAddress);
  }

  saveOrUpdateWhitelistConfig(wlDto: WalletWlDto) {
    const signedMessage = Buffer.from(wlDto.signedMessage, 'hex');
  }
}
