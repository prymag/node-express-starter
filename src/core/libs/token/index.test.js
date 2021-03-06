import { signJWT, verifyJWT } from "@core/libs/token";

describe('@core/libs/Token', () => {

    const data = {
        _id: 'abcd',
        username: 'testing'
    };

    it('Should return token', () => {
        //
        const jwt = signJWT(data);
        expect(jwt.split('.').length).toEqual(3);
    });

    it('Should be able to verify', () => {
        //
        const jwt = signJWT(data);
        const verified = verifyJWT(jwt);
        
        expect(verified).toMatchObject(data);
    });

    it('Should be an error', () => {
        //
        expect(() => verifyJWT('myotken')).toThrow();
    });

});