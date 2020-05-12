import { mqpp } from "@framework/libs/mongoose-query-parser/mongoose-query-parser";

describe('Lib/mongoose-query-parser', () => {

    let qP, opts, expected;
    
    beforeEach(() => {
        qP = {
            s: 'search string'
        };
        opts = {
            fields_to_search: ['field_name_1', 'field_name_2']
        };
    
        expected = {
            query: {
                $or: [
                    { field_name_1: new RegExp(qP.s, 'g') }, 
                    { field_name_2: new RegExp(qP.s, 'g') }
                ]
            }
        };
    });
   
    it('Should render query', () => {
        //
        const {query, limit, page} = mqpp(qP, opts);
        
        expect(query).toEqual(expected.query);
        expect(limit).toBe(10);
        expect(page).toBe(1);
    });

    it('Should render query with single field', () => {
        //
        opts = {
            fields_to_search: ['field_name']
        };
        expected = {
            query: {
                field_name: new RegExp(qP.s, 'g')                 
            }
        };

        const {query} = mqpp(qP, opts);
        
        expect(query).toEqual(expected.query);
    });

    it('Should be able to set attributes', () => {
        //
        qP.page = 2;
        qP.limit = 15;

        const {query, limit, page} = mqpp(qP, opts);

        expect(page).toBe(2);
        expect(limit).toBe(15);
    });

    it('Should throw error', () => {
        //
        const {query} = mqpp({}, opts);

        expect(query).toEqual({});
        expect(() => mqpp(qP)).toThrowError('No `options` specified');
        expect(() => mqpp(qP, {unknown_value: 'dummy'})).toThrowError('`fields_to_search` field for `options` not specified');
    });

});