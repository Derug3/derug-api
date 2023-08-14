import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from '@solana/web3.js';
import {
  mplCandyMachine,
  GuardGroupArgs,
  DefaultGuardSetArgs,
  SolPayment,
  TokenPayment,
  addConfigLines,
  fetchCandyMachine,
} from 'derug-tech-mpl-candy-machine';
import { PublicRemint } from 'src/public-remint/entity/public-remint.entity';
import {
  CONNECTION_URL,
  heliusRpc,
  metaplexAuthorizationRules,
} from './solana/utilities';
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
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export const umi = createUmi(CONNECTION_URL, { commitment: 'confirmed' }).use(
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

  const connection = new Connection(heliusRpc);

  const candyMachineAccInfo = await connection.getAccountInfo(
    candyMachine.publicKey,
  );

  if (
    candyMachineAccInfo &&
    candyMachineAccInfo.data &&
    candyMachineAccInfo.data.length > 0
  ) {
    try {
      await insertInCandyMachine(
        publicMintNfts.map((pm) => ({ name: pm.newName, uri: pm.uri })),
        authority,
        candyMachine.publicKey.toString(),
      );
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(error.message);
    }

    return;
  }

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

  const longestName = publicMintNfts.sort(
    (a, b) => b.newName.length - a.newName.length,
  );
  const longestUri = publicMintNfts.sort((a, b) => b.uri.length - a.uri.length);
  await (
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
      symbol: derugRequestAccount.newSymbol,
      itemsAvailable: publicMintNfts.length,
      sellerFeeBasisPoints: percentAmount(
        derugRequestAccount.mintConfig.sellerFeeBps / 100,
        2,
      ),
      tokenStandard: TokenStandard.ProgrammableNonFungible,
      ruleSet: publicKey(metaplexAuthorizationRules),
      configLineSettings: {
        isSequential: false,
        nameLength: nameLength,
        prefixName: namePrefix,
        prefixUri,
        uriLength: longestUri[0].uri.length,
      },
      groups,
    })
  ).sendAndConfirm(umi);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    await insertInCandyMachine(
      publicMintNfts.map((pm) => ({ name: pm.newName, uri: pm.uri })),
      authority,
      candyMachine.publicKey.toString(),
    );
  } catch (error) {
    console.log(error.message);

    throw new BadRequestException(error.message);
  }
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
      derugRequestAccount.mintConfig.whitelistConfig.price.toNumber() /
        LAMPORTS_PER_SOL,
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
    derugRequestAccount.mintConfig.publicMintPrice.toNumber() /
      LAMPORTS_PER_SOL,
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
      //TODO:figure out how to return this!
      // botTax: {
      //   lamports: sol(
      //     derugRequestAccount.mintConfig.publicMintPrice.toNumber() /
      //       LAMPORTS_PER_SOL,
      //   ),
      //   lastInstruction: true,
      // },
    },
  });

  return guards;
}

export function getConfigLineSettings(publicRemint: PublicRemint) {
  const namePrefix = publicRemint.newName.split('#')[0];

  const uri = publicRemint.newUri.split('.json')[0];

  const extractedUri = extractBeforeLastSlash(uri);

  return {
    namePrefix,
    nameLength: namePrefix.length + 10,
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
  try {
    const chunkedConfigLines = chunk(configLines, 5);
    let sumInserted = 0;
    for (const [index, cLines] of chunkedConfigLines.entries()) {
      try {
        addConfigLines(umi, {
          authority: auth,
          candyMachine: publicKey(candyMachine),
          configLines: cLines.map((cl) => ({
            name: cl.name,
            uri: cl.uri,
          })),
          index: sumInserted,
        }).sendAndConfirm(umi);
        sumInserted += 8;
        console.log(sumInserted);
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
