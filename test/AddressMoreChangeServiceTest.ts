import { expect } from "chai";

import { AddressMoreChangeService } from "src/services/AddressMoreChangeService/AddressMoreChangeService";

describe('AddressMoreChangeServiceTest', () => {
    let addressMoreChangeService: AddressMoreChangeService;

    beforeEach('AddressMoreChangeService', () => {
        addressMoreChangeService = new AddressMoreChangeService;
    })

    it('should method AddressMoreChangeServiceTest.getAddressMoreChange', async () => {
        const { wallet } = await addressMoreChangeService.getAddressMoreChange();

        expect('string').to.equals(typeof wallet);
    })
})