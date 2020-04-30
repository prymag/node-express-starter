import Service from '../services/user.service';

class UserController {

    constructor() {
        this._service = new Service();
        this.store = this.store.bind(this);
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

    show(req, res) {

    }

    update(req, res) {

    }

    delete(req, res) {

    }

}

export default UserController;