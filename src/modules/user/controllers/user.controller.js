import Service from '../services/user.service';
import * as response from "../../../libs/response/response";


class UserController {

    constructor() {
        this._service = new Service();

        this.store = this.store.bind(this);
        this.update = this.update.bind(this);
        this.show = this.show.bind(this);
    }

    index(req, res) {
        return res.send('test');
    }

    store(req, res, next) {
        //
        this._service
            .save(req.body)
            .then(success => res.send(success))
            .catch(fail => next(fail));   
    }

    show(req, res, next) {
        //
        this._service
            .get(req.params.id)
            .then(data => response.success(res, data, 'Success'))
            .catch(err => next(err));
    }

    update(req, res, next) {
        //
        this._service
            .update(req.params.id, req.body)
            .then(data => response.success(res, data, 'Success'))
            .catch(err => next(err));
    }

    delete(req, res) {

    }

}

export default UserController;