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
        const error = buildError('app');
        expect(AppError).toHaveBeenCalled();
        expect(error).toBeInstanceOf(AppError);
    });

    it('Should throw error on unknown params', () => {
        //
        expect(() => buildError('')).toThrowError(Error);
    });
    
});