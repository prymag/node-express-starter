import { failed, success } from "@framework/libs/response";


describe('Lib/response', () =>{
    //
    it('Should be success', () => {
        //
        const expected = {
            success: true,
            message: 'It Works!',
            data: { property: 'property_value' }
        };

        const res = {};
        res.status = jest.fn();
        res.json = jest.fn().mockImplementation(() => expected);

        const data = {
            property: 'property_value'
        };

        const result = success(res, data, 'It Works!');
        
        expect(res.status).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(expected);

        expect(result).toBe(expected);
    });

    it('Should be able to set success status', () => {
        //
        const res = {};
        res.status = jest.fn();
        res.json = jest.fn();

        const result = success(res, {}, 'Redirected', 301);

        expect(res.status).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(301);
    });

    it('Should be failed', () => {
        //
        const expected = {
            success: false,
            message: 'It doesn\'t work!',
            data: { property: 'some_error_property_value' }
        };

        const res = {};
        res.status = jest.fn();
        res.json = jest.fn().mockImplementation(() => expected);

        const data = {
            property: 'some_error_property_value'
        };

        const result = failed(res, data, 'It doesn\'t work!');
        
        expect(res.status).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(expected);

        expect(result).toBe(expected); 
    });

    it('Should be able to set failed status', () => {
        //
        const res = {};
        res.status = jest.fn();
        res.json = jest.fn();

        const result = failed(res, {}, 'Not Found', 404);

        expect(res.status).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
    });

    it('Should correct status codes', () => {
        //
        const res = {};
        res.status = jest.fn();
        res.json = jest.fn();

        success(res, {}, 'Any Message', 0);
        expect(res.status).toHaveBeenCalledWith(200);

        failed(res, {}, 'Anything', 0);
        expect(res.status).toHaveBeenCalledWith(500);
    });

});