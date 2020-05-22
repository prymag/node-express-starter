class AppError {

    constructor() {
        //
        this.title = '';
        this.statusCode = '';
        this.msg = '';
        
        return this;
    }

    setTitle(title = 'Application Error') {
        this.title = title;
        return this;
    }

    setStatusCode(code = 500) {
        this.statusCode = code;
        return this;
    }

    setMsg(msg = '') {
        this.msg = msg;
        return this;
    }

}

export { AppError };