import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import {
  BatchContext,
  BatchProcessorItem,
  EvmLogEvent,
  SubstrateBatchProcessor,
  SubstrateBlock,
} from "@subsquid/substrate-processor";
import { In } from "typeorm";
import { ethers } from "ethers";
import { Provider } from '@reef-defi/evm-provider';
import { WsProvider } from '@polkadot/api';

import { CHAIN_NODE, sqwidErc1155Address, getContractEntity } from "./contract";
import { ERC1155Owner, ERC1155Token, ERC1155Transfer } from "./model";
import * as erc1155 from "./abi/erc1155";

const provider = new Provider({
    provider: new WsProvider(CHAIN_NODE),
  });
const database = new TypeormDatabase();
const processor = new SubstrateBatchProcessor()
  .setBlockRange( {from: 4_613_263, to: 4_620_000} )
  .setDataSource({
    chain: CHAIN_NODE,
    archive: 'http://localhost:2938/graphql'
  })
  .addEvmLog(sqwidErc1155Address, {
    filter: [erc1155.events["TransferSingle(address,address,address,uint256,uint256)"].topic],
  });

type Item = BatchProcessorItem<typeof processor>;
type Context = BatchContext<Store, Item>;

processor.run(database, async (ctx) => {
  await provider.api.isReadyOrError;

  const transfersData: TransferData[] = [];

  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.name === "EVM.Log") {
        const transfer = handleTransfer(block.header, item.event);
        transfersData.push(transfer);
      }
    }
  }

  await saveTransfers(ctx, transfersData);
});

type TransferData = {
  id: string;
  tokenId: ethers.BigNumber;
  from: string;
  to: string;
  amount: number;
  timestamp: bigint;
  block: number;
  transactionHash: string;
};

function handleTransfer(
  block: SubstrateBlock,
  event: EvmLogEvent
): TransferData {
  const { operator, from, to, id, value } = erc1155.events[
    "TransferSingle(address,address,address,uint256,uint256)"
  ].decode(((event.args.log || event.args)));

  const transfer: TransferData = {
    id: event.id,
    tokenId: id,
    from,
    to,
    amount: value.toNumber(),
    timestamp: BigInt(block.timestamp),
    block: block.height,
    transactionHash: event.evmTxHash,
  };

  return transfer;
}

async function saveTransfers(ctx: Context, transfersData: TransferData[]) {
  const tokensIds: Set<string> = new Set();
  const ownersIds: Set<string> = new Set();

  for (const transferData of transfersData) {
    tokensIds.add(transferData.tokenId.toString());
    ownersIds.add(transferData.from);
    ownersIds.add(transferData.to);
  }

  const transfers: Set<ERC1155Transfer> = new Set();

  const tokens: Map<string, ERC1155Token> = new Map(
    (await ctx.store.findBy(ERC1155Token, { id: In([...tokensIds]) })).map((token) => [
      token.id,
      token,
    ])
  );

  const owners: Map<string, ERC1155Owner> = new Map(
    (await ctx.store.findBy(ERC1155Owner, { id: In([...ownersIds]) })).map((owner) => [
      owner.id,
      owner,
    ])
  );

  for (const transferData of transfersData) {
    const contract = new erc1155.Contract(
      sqwidErc1155Address,
      provider
    );

    let from = owners.get(transferData.from);
    if (from == null) {
      from = new ERC1155Owner({ id: transferData.from, balance: 0n });
      owners.set(from.id, from);
    }

    let to = owners.get(transferData.to);
    if (to == null) {
      to = new ERC1155Owner({ id: transferData.to, balance: 0n });
      owners.set(to.id, to);
    }

    const tokenId = transferData.tokenId.toString();

    let token = tokens.get(tokenId);
    if (token == null) {
      token = new ERC1155Token({
        id: tokenId,
        uri: await contract.uri(transferData.tokenId),
        contract: await getContractEntity(ctx.store),
      });
      tokens.set(token.id, token);
    }
    token.owner = to;

    const { id, block, transactionHash, timestamp } = transferData;

    const transfer = new ERC1155Transfer({
      id,
      block,
      timestamp,
      transactionHash,
      from,
      to,
      token,
    });

    transfers.add(transfer);
  }

  await ctx.store.save([...owners.values()]);
  await ctx.store.save([...tokens.values()]);
  await ctx.store.save([...transfers]);
}