import { AppError } from "@framework/libs/error-builder/application";
import HttpStatus from "http-status-codes";

describe("@framework/libs/error-builder/application", () => {
    //
    it('Should build app error chained', () => {
        //
        const data = {
            eType: 'notFound',
            eDetail: 'userNotFound',
        };

        const error = new AppError()
            .setStatusCode(HttpStatus.UNAUTHORIZED)
            .setMsg('User not found')
            .setData(data);
        
        expect(error).toBeInstanceOf(AppError);
        expect(error.data).toEqual(data);
        expect(error.statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(error.msg).toBe('User not found');
    });

    it('Should test defaults', () => {
        //
        const error = new AppError();

        expect(error.setStatusCode()).toBeInstanceOf(AppError);
        expect(error.setMsg()).toBeInstanceOf(AppError);
        expect(error.setData()).toBeInstanceOf(AppError);

        expect(error.statusCode).toBe(500);
        expect(error.msg).toBe('Application Error');
        expect(error.data).toEqual({});

    });
});