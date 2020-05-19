import { encrypt, compare } from "@framework/libs/encryption/encryption";

describe('Lib/encryption/encryption', () => {
    //
    it('ENCRYPT', () => {
        //
        expect(encrypt('randomstring')).resolves.toBeTruthy();
    });

    it('COMPARE', async () => {
        //
        const str = 'stringrandom';
        const encrypted = await encrypt(str);
        expect(compare(encrypted, str)).toBeTruthy();
    });

});