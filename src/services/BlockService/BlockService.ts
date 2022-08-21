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
        return await this._getRequest(
            `https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${id}&boolean=true&apikey=${env.API_KEY}`
        ) as BlockType;
    }

    /**
     * @description method getMoreBlockByIds create list async function
     * for init array for method Promis.all()
     * @param {strimg[]} ids for mapping multiple queries 
     * @returns {Promise<BlockType[]>} promise of type BlockType[]
     */
    async getMoreBlockByIds(ids: string[]): Promise<BlockType[]> {
        const createRequestsList = ids.map((id) => async () => (await this.getBlockById(id)));
                
        return await Promise.all([...createRequestsList.map(item => item())]);
    }

    /**
     * @description get last block
     * @returns {Promise<LastBlockType>} proise LastBlockType
     */
    async getLastBlock(): Promise<LastBlockType> {
        return await this._getRequest(
            `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${env.API_KEY}`
        ) as LastBlockType;
    }

    /**
     * @description method to request this service
     * @param {string} url  string to request
     * @returns {Promise<LastBlockType | BlockType>} Promise<LastBlockType | BlockType>
     */
    private async _getRequest(url: string): Promise<LastBlockType | BlockType> {
            return await axios.get<LastBlockType | BlockType>(url)
                .then(data => data.data)
                .catch(err => err );
    }
}
