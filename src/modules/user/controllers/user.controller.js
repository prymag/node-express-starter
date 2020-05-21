import * as response from "@framework/libs/response";
import Service from '../services/user.service';

class UserController {

    constructor() {
        this._service = new Service();

        this.index = this.index.bind(this);
        this.store = this.store.bind(this);
        this.update = this.update.bind(this);
        this.show = this.show.bind(this);
        this.delete = this.delete.bind(this);
    }

    index(req, res, next) {
        //
        return this._service
            .all(req.query)
            .then(success => response.success(res, success))
            .catch(fail => next(fail));
    }

    store(req, res, next) {
        //
        return this._service
            .save(req.body)
            .then(data => response.success(res, data))
            .catch(fail => next(fail));   
    }

    show(req, res, next) {
        //
        return this._service
            .get(req.params.id)
            .then(data => response.success(res, data, 'Success'))
            .catch(err => next(err));
    }

    update(req, res, next) {
        //
        return this._service
            .update(req.params.id, req.body)
            .then(data => response.success(res, data, 'Success'))
            .catch(err => next(err));
    }

    delete(req, res, next) {
        //
        return this._service
            .delete(req.id)
            .then(data => response.success(res, data, 'Success'))
            .catch(err => next(err)); 
    }

}

export default UserController;