import {UserRoutes} from './modules/user/user';
import {AuthRoutes} from './modules/auth/auth';
import {jwtVerify} from '@framework/middlewares/jwt-verify';

function load(app) {
    app.use('/users', jwtVerify, UserRoutes);
    app.use('/auth', AuthRoutes);
}

export default { load: load};