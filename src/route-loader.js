import UserRoutes from '@modules/user/user.routes';
import AuthRoutes from '@modules/auth/auth.routes';
import {jwtVerify} from '@core/middlewares/jwt-verify';

function load(app) {
    app.use('/auth', AuthRoutes);
    app.use('/users', jwtVerify, UserRoutes);
}

export default { load: load};