import PromisePool from "@supercharge/promise-pool/dist";
import axios from "axios";
import { env } from 'process';

import { 
    BlockType, 
    IBlockService, 
    LastBlockType, 
} from "src/types/types";

export class BlockService implements IBlockService {
    /**
     * @description method getBlockById returning block
     * @param {string} id for url
     * @returns {Promise<BlockType>} promise of type BlockType
     */
    async getBlockById(id: string): Promise<BlockType> {
        return await this._getRequest<BlockType>(
            `https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${id}&boolean=true&apikey=${env.API_KEY}`
        );
    }

    /**
     * @description method getMoreBlockByIds create list async function
     * for init array for method Promis.all()
     * @param {strimg[]} ids array for multiple queries 
     * @returns {Promise<BlockType[]>} promise of type BlockType[]
     */
    async getMoreBlockByIds(ids: string[]): Promise<BlockType[]> {
        const { results, errors } = await PromisePool
            .for(ids)
            .withConcurrency(ids.length)
            .process((id) => this.getBlockById(id))

        return results;
    }

    /**
     * @description get last block
     * @returns {Promise<LastBlockType>} proise LastBlockType
     */
    async getLastBlock(): Promise<LastBlockType> {
        return await this._getRequest<LastBlockType>(
            `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${env.API_KEY}`
        );
    }

    /**
     * @description method to request this service
     * @param {string} url  string to request
     * @returns {Promise<LastBlockType | BlockType>} Promise<LastBlockType | BlockType>
     */
    private async _getRequest<T>(url: string): Promise<T> {
        return await axios.get<T>(url)
            .then(data => data.data)
            .catch(err => err );
    }
}
