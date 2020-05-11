import { failed, success } from "@framework/libs/response/response";


describe('Lib/response', () =>{

    
    
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

});