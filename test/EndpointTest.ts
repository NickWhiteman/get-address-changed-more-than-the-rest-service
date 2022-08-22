import axios from "axios";
import { expect } from "chai";

import { ResponceAddressMoreChangeService } from "src/types/types";

describe('EndpointTest', () => {
    it('should testesting endpoint', async () => {
        const { wallet }: ResponceAddressMoreChangeService = await (
            await axios.get(`http://localhost:${process.env.PORT}`)).data;

        expect('string').to.equals(typeof wallet);
    })
})