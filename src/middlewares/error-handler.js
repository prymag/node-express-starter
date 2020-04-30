class Handler {

    parse(err, req, res, next) {
        //
        if (res.headersSent) {
            return next(err);
        }
        
        res.status(500);
        res.json({ error: err });
    }
}

export let ErrorHandler = new Handler();