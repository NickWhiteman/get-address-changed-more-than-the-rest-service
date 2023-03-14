export interface IBlockService {
    getMoreBlockByIds: (ids: string[]) => Promise<BlockType[]>;
    getLastBlock: () => Promise<LastBlockType>;
    getBlockById: (id: string) => Promise<BlockType>;
}

export interface IAddressMoreChange {
    getAddressMoreChange: () => Promise<ResponseAddressMoreChangeService>;
}

export type LastBlockType = {
    jsonrpc: string;
    id: number;
    result: string;
};

export type ResponseAddressMoreChangeService = {
    [key: string]: number;
};

export type Transactions = {
    blockHash: string;
    blockNumber: string;
    gas: string;
    gasPrice: string;
    from: string;
    to: string;
    value: string;
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
    hash: string;
    input: string;
    nonce: string;
    transactionIndex: string;
    type: string;
    accessList: [];
    chainId: string;
    v: string;
    r: string;
    s: string;
};

export type ResultBlockType = {
    baseFeePerGas: string;
    difficulty: string;
    extraData: string;
    gasLimit: string;
    gasUsed: string;
    hash: string;
    logsBloom: string;
    miner: string;
    mixHash: string;
    nonce: string;
    number: string;
    parentHash: string;
    receiptsRoot: string;
    sha3Uncles: string;
    size: string;
    stateRoot: string;
    timestamp: string;
    totalDifficulty: string;
    transactions: Transactions[];
    transactionsRoot: string;
    uncles: string[];
};

export type BlockType =
    | {
          jsonrpc: string;
          id: number;
          result: ResultBlockType;
      }
    | {
          status: string;
          message: string;
          result: string;
      };

export type PartiesTransactionsType = Pick<Transactions, "from" | "to" | "value">;

export type WalletListType = {
    [key: string]: number;
};
