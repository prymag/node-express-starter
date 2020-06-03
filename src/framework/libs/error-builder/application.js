class AppError {

    constructor() {
        //
        this.data = {};
        this.statusCode = '';
        this.msg = '';
        
        return this;
    }

    setStatusCode(code = 500) {
        this.statusCode = code;
        return this;
    }

    setMsg(msg = 'Application Error') {
        this.msg = msg;
        return this;
    }

    setData(data = {}) {
        this.data = {...data};
        return this;
    }

}

export { AppError };