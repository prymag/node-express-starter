jest.mock('@framework/libs/error-builder/mongoose');
jest.mock("@framework/libs/error-builder/application");

import buildError from "@framework/libs/error-builder";
import { AppError } from "@framework/libs/error-builder/application";
import * as mongoose from "@framework/libs/error-builder/mongoose";

describe('Lib/error-builder', () => {
    //
    it('MONGOOSE', () => {
        //
        jest.spyOn(mongoose, 'default').mockReturnValue('mongoose');
        expect(buildError('mongoose', {})).toBe('mongoose');
    });

    it('APPERROR', () => {
        //
        // https://blog.bguiz.com/2017/mocking-chained-apis-jest/
        const mockSetTitle = jest.fn().mockReturnThis();
        const mockSetMsg = jest.fn().mockReturnThis();
        const mockSetStatus = jest.fn().mockReturnThis();

        const mockProps = {
            setTitle: mockSetTitle,
            setMsg: mockSetMsg,
            setStatusCode: mockSetStatus
        };

        AppError.prototype = mockProps;

        buildError('app').setTitle('Unexpected Entity')
            .setMsg('Unexpected entity encountered')
            .setStatusCode(500);

        expect(AppError).toHaveBeenCalled();
        
        expect(mockSetTitle).toHaveBeenCalledWith('Unexpected Entity');
        expect(mockSetMsg).toHaveBeenCalledWith('Unexpected entity encountered');
        expect(mockSetStatus).toHaveBeenCalledWith(500);
    });

    it('Should throw error on unknown params', () => {
        //
        expect(() => buildError('')).toThrowError(Error);
    });
    
});