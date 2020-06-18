jest.mock('@core/libs/error-builder/mongoose');
jest.mock("@core/libs/error-builder/application");

import buildError from "@core/libs/error-builder";
import { AppError } from "@core/libs/error-builder/application";
import * as mongoose from "@core/libs/error-builder/mongoose";

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