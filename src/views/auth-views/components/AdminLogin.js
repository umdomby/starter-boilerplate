import React, { useState, useEffect } from 'react';
import { auth } from 'auth/FirebaseAuth';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SET_USER, CLEAR_USER, SIGNOUT_SUCCESS } from 'redux/constants/Auth';
import { Card, Row, Col } from 'antd';

const backgroundStyle = {
    backgroundImage: 'url(/img/others/img-17.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    height: '100vh'
};

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();

    const token = useSelector(state => state.auth.token);
    const theme = useSelector(state => state.theme.currentTheme);

    console.log('Dispatching SET_USER with token:', token);
    useEffect(() => {
        if (token) {
            // Redirect to /app/home if token exists
            history.push('/app/home');
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
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            const idTokenResult = await user.getIdTokenResult();
            const token = idTokenResult.token;

            // Сохранение токена в localStorage
            localStorage.setItem('auth_token', token);

            // Обновление состояния пользователя в Redux
            dispatch({ type: SET_USER, payload: { user, isAdmin: false, token } });

            // Перенаправление на /app/home после успешной регистрации
            history.push('/app/home');
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

            // Save token in localStorage
            localStorage.setItem('auth_token', token);

            // Update user state in Redux
            dispatch({ type: SET_USER, payload: { user, isAdmin, token } });

            // Redirect to /app/home after successful login
            history.push('/app/home');
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        dispatch({ type: CLEAR_USER });
        dispatch({ type: SIGNOUT_SUCCESS });

        // Redirect to login page after logout
        history.push('/login');
    };

    return (
        <div style={backgroundStyle}>
            <div className="container d-flex flex-column justify-content-center h-100">
                <Row justify="center">
                    <Col xs={20} sm={20} md={20} lg={7}>
                        <Card>
                            <div className="my-4">
                                <div className="text-center">
                                    <img className="img-fluid" src={`/img/${theme === 'light' ? 'logo.png' : 'logo-white.png'}`} alt="Logo" />
                                    <p>
                                        {isRegistering ? 'Already have an account?' : "Don't have an account yet?"}
                                        <a href="#" onClick={toggleMode}>
                                            {isRegistering ? ' Login' : ' Sign Up'}
                                        </a>
                                    </p>
                                </div>
                                <Row justify="center">
                                    <Col xs={24} sm={24} md={20} lg={20}>
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
                                                    style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ccc' }}
                                                />
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Password"
                                                    required
                                                    style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ccc' }}
                                                />
                                                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                                    {isRegistering ? 'Register' : 'Login'}
                                                </button>
                                            </form>
                                        )}
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default AdminLogin;