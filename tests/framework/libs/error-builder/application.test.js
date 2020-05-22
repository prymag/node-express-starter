import { AppError } from "@framework/libs/error-builder/application";
import HttpStatus from "http-status-codes";

describe("@framework/libs/error-builder/application", () => {
    //
    it('Should build app error chained', () => {
        //
        const error = new AppError()
            .setTitle('Unauthorized')
            .setStatusCode(HttpStatus.UNAUTHORIZED)
            .setMsg('Access not allowed!');

        expect(error).toBeInstanceOf(AppError);
        expect(error.title).toBe('Unauthorized');
        expect(error.statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(error.msg).toBe('Access not allowed!');
    });

    it('Should test defaults', () => {
        //
        const error = new AppError();

        expect(error.setTitle()).toBeInstanceOf(AppError);
        expect(error.setStatusCode()).toBeInstanceOf(AppError);
        expect(error.setMsg()).toBeInstanceOf(AppError);

        expect(error.title).toBe('Application Error');
        expect(error.statusCode).toBe(500);
        expect(error.msg).toBe('');

    });
});