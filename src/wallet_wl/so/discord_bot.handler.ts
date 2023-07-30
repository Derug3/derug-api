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
        const { channelId, options, user, guildId } = interaction;

        const wallet = options.data[0].value;
        new PublicKey(wallet);

        const whitelistConfig = await this.wlRepo.getAllWhitelistsForDerug(
          guildId,
        );

        if (!whitelistConfig) {
          interaction.reply('Invalid discord bot setup! 🟥 ');
        }

        if (whitelistConfig.wallets.find((w) => w.userId === user.id)) {
          interaction.reply('You are already whitelisted! 🟥');
          return;
        }

        whitelistConfig.wallets.push({
          userId: user.id,
          wallet: wallet as string,
        });

        await this.wlRepo.saveOrUpdateWalletWhitelist(whitelistConfig);
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
