import { React, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import '../stylesheets/AuthStyles.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


const SignUp = () => {
    const navigate = useNavigate();
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [visible, setVisible] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios
            .post(
                `/user/login-user`,
                {
                    email,
                    password,
                },
                { withCredentials: true }
            )
            .then((res) => {
                console.log("Login Success!");
                navigate("/");
                window.location.reload(true);
            })
            .catch((err) => {
                console.error(err.response.data.message);
            });
    };

    return (
        <>
            <Navbar />
            <div className="auth">
                <div className="auth-center">
                    <div>
                        <h2>
                            Register an account with us
                        </h2>
                    </div>
                    <div className="form-con">
                        <div>
                            <form onSubmit={handleSubmit}>
                            <div className="email-input">
                                    <label
                                        htmlFor="fullname"
                                    >
                                        Full Name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="fullname"
                                            autoComplete="fullname"
                                            required
                                            value={fullname}
                                            onChange={(e) => setFullname(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="email-input">
                                    <label
                                        htmlFor="email"
                                    >
                                        Email address
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="email"
                                            name="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="psw-box">
                                    <label
                                        htmlFor="password"
                                    >
                                        Password
                                    </label>
                                    <div className="mt-1 relative">
                                        <div className="psw-input">
                                            <input
                                                type={visible ? "text" : "password"}
                                                name="password"
                                                autoComplete="current-password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            {visible ? (
                                                <i className="psw-icon"><AiOutlineEye
                                                    size={25}
                                                    onClick={() => setVisible(false)}
                                                />
                                                </i>
                                            ) : (
                                                <i className="psw-icon">
                                                    <AiOutlineEyeInvisible
                                                        size={25}
                                                        onClick={() => setVisible(true)}
                                                    />
                                                </i>
                                            )}
                                        </div>
                                    </div>
                                </div>
                               
                                <div>
                                    <button
                                        type="submit"
                                    >
                                        Submit
                                    </button>
                                </div>
                                <div className="auth-link">
                                    <h4>Already have an account?</h4>
                                    <Link to="/login">
                                        Sign In
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SignUp;