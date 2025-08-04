import instance from '../apis/app';

class AuthService {
    resetPassword = (data) => {
        return instance.post('/client/reset-password', data);
    };
}

const Auth = new AuthService();
export default Auth;
