jest.mock('@framework/libs/error-builder/mongoose', () => ({
   __esModule: true,
   default: jest.fn(() => 'mongoose')
}));

import buildError from "@framework/libs/error-builder/error-builder";

describe('Lib/error-builder', () => {
    //
    it('Should call correctly', () => {
        //
        expect(buildError('mongoose', {})).toBe('mongoose');
    });

    it('Should throw error on unknown params', () => {
        //
        expect(() => buildError('')).toThrowError(Error);
    });
    
});