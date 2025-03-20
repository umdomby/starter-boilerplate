import React from 'react'
import {Link} from "react-router-dom";
import AdminLogin from "../../auth-views/components/AdminLogin";

const Home = () => {
    return (
        <div>
            Home component works!
            <AdminLogin/>
            <p><Link to="/login">Login</Link></p>
        </div>
    )
}

export default Home
