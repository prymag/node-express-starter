import {UserRoutes} from './modules/user/user';
import {AuthRoutes} from './modules/auth/auth';

function load(app) {
    app.use('/users', UserRoutes);
    app.use('/auth', AuthRoutes);
}

export default { load: load};