import { Logger } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { Client, REST, Routes, SlashCommandBuilder } from 'discord.js';
import { WlType } from '../dto/wallet_wl.dto';
import { WalletWlRepository } from '../repository/wallet_wl.repository';

export class DiscordBotHandler {
  private readonly logger = new Logger(DiscordBotHandler.name);

  constructor(private readonly wlRepo: WalletWlRepository) {}
  async execute() {
    const bot = new Client({
      intents: 'GuildBans',
    });

    let wlConfig = await this.wlRepo.getAllWhitelistsForDerug('nice-mice');

    if (!wlConfig) {
      wlConfig = await this.wlRepo.saveOrUpdateWalletWhitelist({
        derugAddress: 'nice-mice',
        duration: 1,
        wallets: '[]',
        wlType: WlType.AllowList,
      });
    }

    const parsedWlList: { userId: string; wallet: string }[] = JSON.parse(
      wlConfig?.wallets,
    );

    await bot.login(process.env.DISCORD_BOT_TOKEN!);

    bot.on('ready', () => {
      this.logger.debug('Registered discord bot!');
    });

    const channel = await bot.channels.fetch(process.env.CHANNEL_ID!);
    const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN!);

    (async () => {
      try {
        await rest.put(
          Routes.applicationGuildCommands(
            process.env.APPLICATION_ID!,
            process.env.GUILD_ID!,
          ),
          {
            body: [
              new SlashCommandBuilder()
                .setName('whitelist')
                .setDescription('Command for whitelisting!')
                .addStringOption((option) =>
                  option
                    .setName('wallet')
                    .setDescription('Wallet address')
                    .setRequired(true),
                ),
            ],
          },
        );
        this.logger.verbose('Registered command');
      } catch (error) {
        this.logger.error('Failed to register command!' + error.message);
      }
    })();

    if (!channel.isTextBased()) {
      throw new Error('Channel is not text based!');
    }

    bot.on('interactionCreate', async (interaction) => {
      if (!interaction.isCommand())
        throw new Error('Inetaction is not command!');

      try {
        const { channelId, options, user } = interaction;

        const wallet = options.data[0].value;
        new PublicKey(wallet);

        if (parsedWlList.find((w) => w.userId === user.id)) {
          interaction.reply('You are already whitelisted! 🟥');
          return;
        }
        if (channelId !== process.env.CHANNEL_ID!) {
          interaction.reply('Failed to whitelist. Invalid channel! 🟥');
        }
        parsedWlList.push({ userId: user.id, wallet: wallet as string });
        wlConfig.wallets = JSON.stringify(parsedWlList);
        await this.wlRepo.saveOrUpdateWalletWhitelist(wlConfig);
        interaction.reply(
          `Congrats ${user.username}.You successfully whitelisted 🟩`,
        );
      } catch (error) {
        if (
          error.message.includes('Assertion failed') ||
          error.message.includes('public key')
        ) {
          interaction.reply('Invalid pubkey input!🟥');
        } else {
          interaction.reply('Failed.' + ' 🟥');
        }
      }
    });
  }
}
