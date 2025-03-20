import React from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CLEAR_USER, SIGNOUT_SUCCESS } from 'redux/constants/Auth';

const Home = () => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);

    const handleLogout = () => {
        // Remove token from localStorage
        localStorage.removeItem('auth_token');

        // Clear user state in Redux
        dispatch({ type: CLEAR_USER });
        dispatch({ type: SIGNOUT_SUCCESS });
    };

    return (
        <div>
            Home component works!
            {token ? (
                <button onClick={handleLogout}>Logout</button>
            ) : (
                <p><Link to="/login">Login</Link></p>
            )}
        </div>
    );
};

export default Home;
