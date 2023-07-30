import {
  BadRequestException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { Client, REST } from 'discord.js';
import { botUrl } from 'src/utilities/solana/utilities';
import { checkIfMessageIsSigned } from 'src/utilities/utils';
import { WalletWlDto, WlType } from './dto/wallet_wl.dto';
import { WalletWl } from './entity/wallet_wl.entity';
import { WalletWlRepository } from './repository/wallet_wl.repository';
import { DiscordBotHandler } from './so/discord_bot.handler';

@Injectable()
export class WalletWlService implements OnModuleInit {
  private readonly discorBotHandler: DiscordBotHandler;
  constructor(private readonly wlRepo: WalletWlRepository) {
    this.discorBotHandler = new DiscordBotHandler(wlRepo);
  }
  onModuleInit() {
    // this.discorBotHandler.execute();
  }

  getAllWhitelistsForDerug(derugAddress: string) {
    return this.wlRepo.getAllWhitelistsForDerug(derugAddress);
  }

  saveOrUpdateWhitelistConfig(wlDto: WalletWlDto) {
    const signedMessage = Buffer.from(wlDto.signedMessage, 'hex');
  }

  async setupBot(wlDto: WalletWlDto) {
    const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN!);
    const wlConfig: WalletWl = {
      derugAddress: wlDto.derugAddress,
      serverId: wlDto.serverId,
      wallets: [],
      wlType: WlType.AllowList,
      duration: wlDto.duration,
    };
    try {
      const verifiedMessage = checkIfMessageIsSigned(
        wlDto.signedMessage,
        `Add Derug Bot in discord server ${wlDto.serverId}`,
        wlDto.derugger,
      );
      if (!verifiedMessage) throw new UnauthorizedException('Unauthorized:');
      await this.wlRepo.saveOrUpdateWalletWhitelist(wlConfig);
      return { authUrl: botUrl };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  getByDerugData(derugData: string) {
    return this.wlRepo.getByDerugData(derugData);
  }
}
