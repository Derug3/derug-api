import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { setupCandyMachine } from 'src/utilities/candyMachine';
import { parseKeypair } from 'src/utilities/solana/utilities';
import { checkIfMessageIsSigned, derugProgram } from 'src/utilities/utils';
import { WalletWlService } from 'src/wallet_wl/wallet_wl.service';
import { GetNftsByUpdateAuthority } from './dto/candy-machine.dto';
import { InitMachineRequestDto } from './dto/init-machine.dto';
import { PublicRemint } from './entity/public-remint.entity';
import { AuthorityRepository } from './repository/authority.repository';
import { CandyMachineRepository } from './repository/candy-machine.repository';
import { PublicRemintRepository } from './repository/public-remint.repository';
import { FetchAllNftsFromCollection } from './so/fetch-all-nfts';
import { GetCandyMachineData } from './so/get-candy-machine';
import { GetNonMinted } from './so/get-non-minted';
import { GetPrivateMintNftData } from './so/get-private-mint-nft-data';
import { InitCandyMachine } from './so/init-candy-machine';
import { SavePublicMintData } from './so/save-public-mint';
import { UpdateMintedNft } from './so/update-minted-nft';
import { UpdateReminted } from './so/update-reminted';

@Injectable()
export class PublicRemintService implements OnModuleInit {
  private fetchAllNfts: FetchAllNftsFromCollection;
  private updateReminted: UpdateReminted;
  private getNonMinted: GetNonMinted;
  private savePublicMintData: SavePublicMintData;
  private getCandyMachine: GetCandyMachineData;
  private updateMintedNft: UpdateMintedNft;
  private getPrivateMintNftData: GetPrivateMintNftData;
  private readonly authorityRepo: AuthorityRepository;
  constructor(
    private readonly publicRemintRepo: PublicRemintRepository,
    private readonly candyMachineRepo: CandyMachineRepository,
    private readonly wlService: WalletWlService,
  ) {
    this.fetchAllNfts = new FetchAllNftsFromCollection(publicRemintRepo);
    this.updateReminted = new UpdateReminted(publicRemintRepo);
    this.getNonMinted = new GetNonMinted(publicRemintRepo);
    this.savePublicMintData = new SavePublicMintData(
      candyMachineRepo,
      this.authorityRepo,
    );
    this.getCandyMachine = new GetCandyMachineData(candyMachineRepo);
    this.updateMintedNft = new UpdateMintedNft(publicRemintRepo);
    this.getPrivateMintNftData = new GetPrivateMintNftData(publicRemintRepo);
  }
  private readonly logger = new Logger(PublicRemintService.name);
  async onModuleInit() {
    this.logger.debug(
      `Subscribed to event listener ${derugProgram.programId.toString()}`,
    );
    derugProgram.addEventListener('NftRemintedEvent', async (data) => {
      try {
        await this.updateMintedNft.execute(
          data.oldNftMint.toString(),
          data.reminter.toString(),
        );
        this.logger.debug(`Minted NFT:${data.oldNftMint.toString()}`);
      } catch (error) {}
    });
  }

  fetchAllNftsFromCollection(tx: GetNftsByUpdateAuthority) {
    return this.fetchAllNfts.execute(tx.updateAuthority, tx.derugData, tx);
  }

  saveReminted(mint: string, reminter: string) {
    return this.updateMintedNft.execute(mint, reminter);
  }

  getNonMintedNfts(derugData: string) {
    return this.getNonMinted.execute(derugData);
  }

  updateRemintedNft(metadata: string, wallet: string) {
    return this.updateReminted.execute(metadata, wallet);
  }

  storePublicMintData(derugData: string) {
    return this.savePublicMintData.execute(derugData);
  }

  getCandyMachineData(derugData: string) {
    return this.getCandyMachine.execute(derugData);
  }

  getNftData(metadata: string) {
    return this.getPrivateMintNftData.execute(metadata);
  }

  async initCandyMacihine(dto: InitMachineRequestDto) {
    try {
      const { derugData, payer, signedMessage } = dto;
      const isValid = checkIfMessageIsSigned(
        signedMessage,
        `Init candy machine for derug ${derugData}`,
        payer,
      );
      if (!isValid) throw new UnauthorizedException();
      const rawAuthority = await this.authorityRepo.get(derugData);
      const rawCandyMachine = await this.candyMachineRepo.get(derugData);
      if (!rawAuthority || !rawCandyMachine) {
        throw new BadRequestException(
          'Missing data for initializing public mint!',
        );
      }
      const authority = parseKeypair(rawAuthority.secretKey);
      const candyMachine = parseKeypair(rawCandyMachine.candyMachineSecretKey);
      const walletWl = await this.wlService.getByDerugData(derugData);
      const publicMintConfig = await this.publicRemintRepo.getByDerugData(
        derugData,
      );

      await setupCandyMachine(
        candyMachine,
        authority,
        publicMintConfig,
        derugData,
        walletWl,
        payer,
      );
      return candyMachine.publicKey.toString();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
