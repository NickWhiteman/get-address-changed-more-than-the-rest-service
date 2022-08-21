import axios from "axios";
import { env } from 'process';

import { 
    BlockType, 
    IBlockService, 
    LastBlockType, 
} from "src/types/types";

export class BlockService implements IBlockService {
    async getBlockById(id: string): Promise<BlockType> {
        return await this._getRequest(
            `https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${id}&boolean=true&apikey=${env.API_KEY}`
        ) as BlockType;
    }

    async getMoreBlockByIds(ids: string[]): Promise<BlockType[]> {
        const createRequestsList = () => 
            ids.map(async id => (await this.getBlockById(id)));
                
        return await Promise.all(createRequestsList());
    }

    async getLastBlock(): Promise<LastBlockType> {
        return await this._getRequest(
            `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${env.API_KEY}`
        ) as LastBlockType;
    }

    private async _getRequest(url: string): Promise<LastBlockType | BlockType> {
            return await axios.get<LastBlockType | BlockType>(url)
                .then(data => data.data)
                .catch(err => err );
    }
}
