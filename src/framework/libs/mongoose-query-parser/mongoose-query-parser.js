const LIMIT = process.env.PAGINATION_LIMIT || 10;

/**
 * Builds search query
 * 
 * @param {Object} queryParams 
 * @param {opts} opts
 */
function getQuery(queryParams, opts) {
    //
    if (!queryParams.hasOwnProperty('s')) {
        return {};
    }

    if (!opts) {
        throw new Error('No `options` specified');
    }

    if (!opts.hasOwnProperty('fields_to_search')) {
        throw new Error('`fields_to_search` field for `options` not specified');
    }
    
    const fields = opts.fields_to_search;
    const search = new RegExp(queryParams.s, "g");

    const q = fields.reduce((prev, cur) => {
        //
        const obj = {};
        obj[cur] = search;
        prev.push(obj);

        return prev;
    }, []);
    
    if (q.length == 1) {
        return q[0];
    }

    //
    return {$or: q};
}

function limit(queryParams) {
    //
    if (queryParams.hasOwnProperty('limit')) {
        return parseInt(queryParams.limit);
    }

    return LIMIT;
}

function paginate(find, queryParams) {
    const perPage = limit(queryParams);
    
    find.limit(perPage);
    
    // We set the default page.
    queryParams = {...{page: 1}, ...queryParams};

    return find.exec()
        .then((res) => {
            //
            const pageData = {
                items: res,
                perPage: perPage,
                
            };
            return Promise.resolve(pageData);
        })
        .catch(err => Promise.reject);
}

function mqpp(queryParams, opts) {

    return  {
        query: getQuery(queryParams, opts),
        limit: limit(queryParams),
        page: parseInt(queryParams.page) || 1
    };
}

export { mqpp };