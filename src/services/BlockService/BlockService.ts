import request from "request";
import { env } from 'process';

export type Transactions = {
    blockHash: string
    blockNumber: string
    gas: string
    gasPrice: string
    from: string
    to: string
    value: string
    maxFeePerGas: string
    maxPriorityFeePerGas: string
    hash: string
    input: string
    nonce: string
    transactionIndex: string
    type: string
    accessList: [],
    chainId: string
    v: string
    r: string
    s: string
};

type BlockType = {
    jsonrpc: string;
    id: number;
    result: {
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
};

interface IBlockService {
    getBlockById: (id: string) => Promise<BlockType>;
}

export class BlockService implements IBlockService {
    async getBlockById(id: string): Promise<BlockType> {
        return new Promise((resolve, reject) => {
            request(
                `https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${id}&boolean=true&apikey=${env.API_KEY}`,
                (err, response) => {
                    if (err) reject({ message: err });

                    resolve({...JSON.parse(response.body)});
                }
            );
        });
    }
}
