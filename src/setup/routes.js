import UserRoutes from '@modules/user/user.routes';
import AuthRoutes from '@modules/auth/auth.routes';
import {jwtVerify} from '@core/middlewares/jwt-verify';

export default function(app) {
    // 
    console.log('Setting up routes...');
    try {
        app.get('/', (req, res) => res.json({}));
        app.use('', AuthRoutes);
        app.use('/users', jwtVerify, UserRoutes);
    } catch (e) {
        console.error(e);
    }
}