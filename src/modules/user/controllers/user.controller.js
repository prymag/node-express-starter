import Service from '../services/user.service';

class UserController {

    constructor() {
        this._service = new Service();
        this.store = this.store.bind(this);
    }

    index(req, res) {
        return res.send('test');
    }

    store(req, res) {
        //
        return this._service
            .save(req.body)
            .then(result => res.send(result))
            .catch(err => res.send(err));
    }

    show(req, res) {

    }

    update(req, res) {

    }

    delete(req, res) {

    }

}

export default UserController;