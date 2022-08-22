import { expect } from "chai";

import { AddressMoreChangeService } from "src/services/AddressMoreChangeService/AddressMoreChangeService";
import { ResponceAddressMoreChangeService } from "src/types/types";

describe('AddressMoreChangeServiceTest', () => {
    let addressMoreChangeService: AddressMoreChangeService;

    beforeEach('AddressMoreChangeService', () => {
        addressMoreChangeService = new AddressMoreChangeService;
    })

    it('should method AddressMoreChangeService.getAddressMoreChange', async () => {
        const { wallet }: Pick<ResponceAddressMoreChangeService, 'wallet'> = await addressMoreChangeService.getAddressMoreChange();

        expect('string').to.equals(typeof wallet);
    })
})