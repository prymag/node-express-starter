import UserRoutes from '@modules/user/user.routes';
import AuthRoutes from '@modules/auth/auth.routes';
import {jwtVerify} from '@core/middlewares/jwt-verify';

function defaultRoute(req, res) {
    return res.json({});
}

export default function(app) {
    // 
    console.info('Setting up routes...');
    try {
        app.get('/', defaultRoute);
        app.use('', AuthRoutes);
        app.use('/users', jwtVerify, UserRoutes);
    } catch (e) {
        console.error(`Routes Setup Error: ${e}`);
    }
}