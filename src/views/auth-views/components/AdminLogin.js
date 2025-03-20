import React, { useState, useEffect } from 'react';
import { auth } from 'auth/FirebaseAuth';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SET_USER, CLEAR_USER, SIGNOUT_SUCCESS } from 'redux/constants/Auth';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();

    // Получение токена из состояния Redux
    const token = useSelector(state => state.auth.token);

    useEffect(() => {
        if (token) {
            // Если токен существует, перенаправляем на /app/home
            history.push('/app/home');
        } else {
            // Если токена нет, остаемся на /login
            history.push('/login');
        }
    }, [token, history]);

    const toggleMode = () => {
        setIsRegistering(!isRegistering);
    };

    const registerUser = async (email, password) => {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            console.log('User registered:', user);
            return user;
        } catch (error) {
            console.error('Error registering user:', error);
            throw error;
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const user = await registerUser(email, password);
            console.log('User registered:', user);
            // После регистрации можно автоматически входить в систему или перенаправлять пользователя
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            const idTokenResult = await user.getIdTokenResult();
            const isAdmin = idTokenResult.claims.admin || false;
            const token = idTokenResult.token;

            // Сохранение токена в localStorage
            localStorage.setItem('auth_token', token);

            // Обновление состояния пользователя в Redux
            dispatch({ type: SET_USER, payload: { user, isAdmin } });

            if (isAdmin) {
                console.log('User is an admin');
                history.push('/app/home');
            } else {
                console.log('User is not an admin');
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    const handleLogout = () => {
        // Очистка токена из localStorage
        localStorage.removeItem('auth_token');

        // Очистка состояния пользователя в Redux
        dispatch({ type: CLEAR_USER });
        dispatch({ type: SIGNOUT_SUCCESS });

        // Перенаправление на страницу входа
        history.push('/login');
    };

    return (
        <div>
            {token ? (
                <button onClick={handleLogout}>Logout</button>
            ) : (
                <form onSubmit={isRegistering ? handleRegister : handleLogin}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
                </form>
            )}
            {!token && (
                <button onClick={toggleMode}>
                    {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
                </button>
            )}
        </div>
    );
};

export default AdminLogin;