import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Connection,
  Keypair,
  Transaction,
  VersionedTransaction,
} from '@solana/web3.js';
import { decode } from 'bs58';
import { NotFoundError } from 'rxjs';
import { MagicEdenCollectionsService } from 'src/magic-eden-collections/magic-eden-collections.service';
import { setupCandyMachine } from 'src/utilities/candyMachine';
import { heliusRpc, parseKeypair } from 'src/utilities/solana/utilities';
import { checkIfMessageIsSigned, derugProgram } from 'src/utilities/utils';
import { WalletWlService } from 'src/wallet_wl/wallet_wl.service';
import { GetNftsByUpdateAuthority } from './dto/candy-machine.dto';
import { InitMachineRequestDto } from './dto/init-machine.dto';
import { RemintDto } from './dto/remint.dto';
import { AuthorityRepository } from './repository/authority.repository.impl';
import { CandyMachineRepository } from './repository/candy-machine.pg.repository';
import { PublicRemintRepository } from './repository/public-remint.pg.repository';
import { FetchAllNftsFromCollection } from './so/fetch-all-nfts';
import { GetCandyMachineData } from './so/get-candy-machine';
import { GetNonMinted } from './so/get-non-minted';
import { GetPrivateMintNftData } from './so/get-private-mint-nft-data';
import { RemintNft } from './so/remint_nft.so';
import { SavePublicMintData } from './so/save-public-mint';
import { UpdateMintedNft } from './so/update-minted-nft';
import { UpdateReminted } from './so/update-reminted';

@Injectable()
export class PublicRemintService {
  private fetchAllNfts: FetchAllNftsFromCollection;
  private updateReminted: UpdateReminted;
  private getNonMinted: GetNonMinted;
  private savePublicMintData: SavePublicMintData;
  private getCandyMachine: GetCandyMachineData;
  private updateMintedNft: UpdateMintedNft;
  private getPrivateMintNftData: GetPrivateMintNftData;
  private remintNft: RemintNft;
  constructor(
    @InjectRepository(PublicRemintRepository)
    private readonly publicRemintRepo: PublicRemintRepository,
    @InjectRepository(CandyMachineRepository)
    private readonly candyMachineRepo: CandyMachineRepository,
    private readonly wlService: WalletWlService,
    private readonly collectionService: MagicEdenCollectionsService,
    @InjectRepository(AuthorityRepository)
    private readonly authorityRepo: AuthorityRepository,
  ) {
    this.fetchAllNfts = new FetchAllNftsFromCollection(publicRemintRepo);
    this.updateReminted = new UpdateReminted(publicRemintRepo);
    this.getNonMinted = new GetNonMinted(publicRemintRepo);
    this.savePublicMintData = new SavePublicMintData(
      candyMachineRepo,
      this.authorityRepo,
      this.collectionService,
    );
    this.getCandyMachine = new GetCandyMachineData(candyMachineRepo);
    this.updateMintedNft = new UpdateMintedNft(publicRemintRepo);
    this.getPrivateMintNftData = new GetPrivateMintNftData(publicRemintRepo);
    this.remintNft = new RemintNft(authorityRepo, publicRemintRepo);
  }
  private readonly logger = new Logger(PublicRemintService.name);

  fetchAllNftsFromCollection(tx: GetNftsByUpdateAuthority) {
    return this.fetchAllNfts.execute(tx.creator, tx.derugData, tx);
  }

  saveReminted(mint: string, reminter: string) {
    return this.updateMintedNft.execute(mint, reminter);
  }

  async getAuthority(derugData: string) {
    const authority = await this.authorityRepo.findOne({
      where: { derugData },
    });
    if (!authority) {
      throw new NotFoundException('Authority for given derug does not exist!');
    }

    return { authority: authority.pubkey };
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

  async initializeDerug(tx: string, derugData: string) {
    const transaction = Transaction.from(JSON.parse(tx).data);
    const authority = await this.authorityRepo.findOne({
      where: { derugData },
    });
    if (!authority) throw new NotFoundException('Authority not found!');
    const authorityPayer = Keypair.fromSecretKey(decode(authority.secretKey));
    try {
      transaction.partialSign(authorityPayer);
      const connection = new Connection(heliusRpc, 'finalized');
      const txSig = await connection.sendRawTransaction(
        transaction.serialize(),
      );
      await connection.confirmTransaction(txSig);
      this.logger.log('Derug initialized');
      return true;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
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

  remintNftHandler(remint: RemintDto) {
    try {
      return this.remintNft.execute(remint);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
