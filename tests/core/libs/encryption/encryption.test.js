import { encrypt, compare } from "@core/libs/encryption";

describe('@core/libs/encryption', () => {
    //
    it('ENCRYPT', () => {
        //
        return expect(encrypt('randomstring')).resolves.toBeTruthy();
    });

    it('COMPARE', async () => {
        //
        expect.assertions(1);
        const str = 'stringrandom';
        const encrypted = await encrypt(str);
        return expect(compare(encrypted, str)).resolves.toBeTruthy();
    });

    it('Should not be able to compare', async () => {
        //
        expect.assertions(1);
        const str = 'justrandomstring';
        const encrypted = await encrypt(str);
        return expect(compare(encrypted, 'invalidstring')).resolves.toBeFalsy();
    });

});