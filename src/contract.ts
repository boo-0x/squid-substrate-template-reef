import { Store } from "@subsquid/typeorm-store";
import { ERC1155Contract } from "./model";


export const CHAIN_NODE = "wss://rpc.reefscan.com/ws";
export const sqwidErc1155Address = "0x0601202b75C96A61CDb9A99D4e2285E43c6e60e4";

// export const CHAIN_NODE = "wss://rpc-testnet.reefscan.com/ws";
// export const sqwidErc1155Address = "0x1A511793FE92A62AF8bC41d65d8b94d4c2BD22c3";

export function createContractEntity(): ERC1155Contract {
  return new ERC1155Contract({
    id: sqwidErc1155Address,
    mintedTokens: []
  });
}

let contractEntity: ERC1155Contract | undefined;

export async function getContractEntity(store: Store): Promise<ERC1155Contract> {
  if (contractEntity == null) {
    contractEntity = await store.get(ERC1155Contract, sqwidErc1155Address);
    if (contractEntity == null) {
      contractEntity = createContractEntity();
      await store.insert(contractEntity);
    }
  }
  return contractEntity;
}