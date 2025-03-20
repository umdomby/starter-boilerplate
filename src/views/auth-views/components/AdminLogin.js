import React, { useState } from 'react';
import { auth } from 'auth/FirebaseAuth';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SET_USER } from 'redux/constants/Auth'; // Предполагается, что вы добавили это действие в ваши константы

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();

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

            // Обновление состояния пользователя в Redux
            dispatch({ type: SET_USER, payload: { user, isAdmin } });

            if (isAdmin) {
                console.log('User is an admin');
                history.push('/home');
            } else {
                console.log('User is not an admin');
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div>
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
            <button onClick={toggleMode}>
                {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
            </button>
        </div>
    );
};

export default AdminLogin;
