import {UserRoutes} from './modules/user/user';

function load(app) {
    app.use('/users', UserRoutes);
}

export default { load: load};