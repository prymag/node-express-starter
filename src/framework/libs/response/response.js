function success(res, data, msg, statusCode = 200) {
    const response ={
        success: true,
        message: msg,
        data: data,
    };

    if (!statusCode) {
        statusCode = 200;
    }

    res.status(statusCode);

    return res.json(response);
}

function failed(res, data, msg, statusCode = 500) {
    const response = {
        success: false,
        message: msg,
        data: data,
    };

    if (!statusCode) {
        statusCode = 500;
    }

    res.status(statusCode);

    return res.json(response);
}

export {success, failed};