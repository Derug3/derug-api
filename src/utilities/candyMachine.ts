import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { Keypair, PublicKey } from '@solana/web3.js';
import {
  mplCandyMachine,
  GuardGroupArgs,
  DefaultGuardSetArgs,
  SolPayment,
  TokenPayment,
  addConfigLines,
} from 'derug-tech-mpl-candy-machine';
import { PublicRemint } from 'src/public-remint/entity/public-remint.entity';
import { heliusRpc, metaplexAuthorizationRules } from './solana/utilities';
import { derugProgram } from './utils';
import { create } from 'derug-tech-mpl-candy-machine';
import {
  createSignerFromKeypair,
  dateTime,
  keypairIdentity,
  lamports,
  none,
  OptionOrNullable,
  percentAmount,
  publicKey,
  sol,
  tokenAmount,
} from '@metaplex-foundation/umi';
import { NATIVE_MINT } from '@solana/spl-token';
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
import { WalletWl, WlConfig } from 'src/wallet_wl/entity/wallet_wl.entity';
import { chunk, getMerkleRoot, toBigNumber } from '@metaplex-foundation/js';
import { UnauthorizedException } from '@nestjs/common';

export const umi = createUmi(heliusRpc, { commitment: 'confirmed' }).use(
  mplCandyMachine(),
);

export async function setupCandyMachine(
  candyMachine: Keypair,
  authority: Keypair,
  publicMint: PublicRemint[],
  derugData: string,
  wlConfig: WalletWl | null,
  payer: string,
) {
  const reminted = (
    await derugProgram.account.remintProof.all([
      {
        memcmp: {
          offset: 8,
          bytes: new PublicKey(derugData).toBase58(),
        },
      },
    ])
  ).map((nft) => nft.account.oldMint.toString());
  const publicMintNfts = publicMint.filter((pm) => !reminted.includes(pm.mint));

  const derugDataAccount = await derugProgram.account.derugData.fetch(
    new PublicKey(derugData),
  );

  const derugRequestAccount = await derugProgram.account.derugRequest.fetch(
    derugDataAccount.winningRequest,
  );

  if (payer !== derugRequestAccount.derugger.toString())
    throw new UnauthorizedException();
  const { nameLength, namePrefix, uriLength, prefixUri } =
    getConfigLineSettings(publicMint[0]);

  const authoritySigner = createSignerFromKeypair(umi, {
    publicKey: publicKey(authority.publicKey),
    secretKey: authority.secretKey,
  });
  const groups = await getCmGuards(wlConfig, derugDataAccount.winningRequest);

  umi.use(keypairIdentity(authoritySigner));

  const cm = (
    await create(umi, {
      candyMachine: createSignerFromKeypair(umi, {
        publicKey: publicKey(candyMachine.publicKey),
        secretKey: candyMachine.secretKey,
      }),
      collectionMint: publicKey(derugDataAccount.newCollection),
      collectionUpdateAuthority: authoritySigner,
      creators: derugRequestAccount.creators.map((c) => ({
        address: publicKey(c.address),
        percentageShare: c.share,
        verified: false,
      })),
      itemsAvailable: publicMintNfts.length,
      sellerFeeBasisPoints: percentAmount(
        derugRequestAccount.mintConfig.sellerFeeBps,
        2,
      ),
      tokenStandard: TokenStandard.ProgrammableNonFungible,
      ruleSet: publicKey(metaplexAuthorizationRules),
      configLineSettings: {
        isSequential: false,
        nameLength,
        prefixName: namePrefix,
        prefixUri,
        uriLength,
      },
      groups,
    })
  ).sendAndConfirm(umi);

  await insertInCandyMachine(
    publicMintNfts.map((pm) => ({ name: pm.name, uri: pm.uri })),
    authority,
    candyMachine.publicKey.toString(),
  );
}

export async function getCmGuards(
  wlConfig: WalletWl | null,
  derugRequest: PublicKey,
) {
  const guards: GuardGroupArgs<DefaultGuardSetArgs>[] = [];

  const derugRequestAccount = await derugProgram.account.derugRequest.fetch(
    derugRequest,
  );

  if (wlConfig) {
    const merkleRoot = getMerkleRoot(wlConfig.wallets.map((w) => w.wallet));
    const { solPayment, tokenPayment } = getCandyMachinePaymentGuards(
      derugRequestAccount.mintCurrency,
      derugRequestAccount.mintConfig.whitelistConfig.price.toNumber(),
      derugRequestAccount.mintConfig.destinationAta ??
        derugRequestAccount.derugger,
    );
    guards.push({
      label: 'wl',
      guards: {
        allowList: {
          merkleRoot,
        },
        solPayment: solPayment,
        tokenPayment: tokenPayment,
        endDate: {
          date: dateTime(
            new Date().setHours(
              new Date().getHours() +
                derugRequestAccount.mintConfig.whitelistConfig.duration,
            ),
          ),
        },
        startDate: {
          date: dateTime(new Date()),
        },
      },
    });
  }
  const { solPayment, tokenPayment } = getCandyMachinePaymentGuards(
    derugRequestAccount.mintConfig.mintCurrency,
    derugRequestAccount.mintConfig.publicMintPrice.toNumber(),
    derugRequestAccount.mintConfig.destinationAta ??
      derugRequestAccount.derugger,
  );

  const startDate = wlConfig
    ? dateTime(
        new Date().setHours(
          new Date().getHours() +
            derugRequestAccount.mintConfig.whitelistConfig.duration,
        ),
      )
    : dateTime(new Date());

  guards.push({
    label: 'public',
    guards: {
      solPayment,
      tokenPayment,
      startDate: {
        date: startDate,
      },
      botTax: {
        lamports: sol(
          derugRequestAccount.mintConfig.publicMintPrice.toNumber(),
        ),
        lastInstruction: true,
      },
    },
  });

  return guards;
}

export function getConfigLineSettings(publicRemint: PublicRemint) {
  const name = publicRemint.newName;

  const namePrefix = publicRemint.newName.split(' ')[0];

  const uri = publicRemint.newUri.split('.json')[0];

  const extractedUri = extractBeforeLastSlash(uri);

  return {
    namePrefix,
    nameLength: namePrefix.length + 5,
    prefixUri: extractedUri,
    uriLength: extractedUri.length + 10,
  };
}

function extractBeforeLastSlash(inputString: string): string {
  const lastSlashIndex = inputString.lastIndexOf('/');
  if (lastSlashIndex !== -1) {
    return inputString.substring(0, lastSlashIndex) + '/';
  } else {
    return inputString;
  }
}

export function getCandyMachinePaymentGuards(
  currency: PublicKey,
  price: number,
  destination: PublicKey,
): {
  tokenPayment: OptionOrNullable<TokenPayment>;
  solPayment: OptionOrNullable<SolPayment>;
} {
  if (currency.toString() === NATIVE_MINT.toString()) {
    return {
      tokenPayment: none(),
      solPayment: {
        lamports: sol(price),
        destination: publicKey(destination),
      },
    };
  } else {
    return {
      tokenPayment: {
        amount: BigInt(price),
        mint: publicKey(currency),
        destinationAta: publicKey(destination),
      },
      solPayment: none(),
    };
  }
}

export const insertInCandyMachine = async (
  configLines: { name: string; uri: string }[],
  authority: Keypair,
  candyMachine: string,
) => {
  const auth = createSignerFromKeypair(umi, {
    publicKey: publicKey(authority.publicKey),
    secretKey: authority.secretKey,
  });

  umi.use(keypairIdentity(auth));

  const chunkedConfigLines = chunk(configLines, 10);
  let sumInserted = 0;
  await Promise.all(
    chunkedConfigLines.map(async (configLines, index) => {
      await addConfigLines(umi, {
        authority: auth,
        candyMachine: publicKey(candyMachine),
        configLines: configLines.map((cl) => ({
          name: ' #' + cl.name.split('#')[1],
          uri: cl.uri.split('/')[4],
        })),
        index: sumInserted,
      }).sendAndConfirm(umi);
      sumInserted += 10 * (index + 1);
    }),
  );
};
