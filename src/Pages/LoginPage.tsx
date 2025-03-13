import { useState, useEffect } from "react";
import { login } from "../services/login";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {

        localStorage.removeItem("token");
        localStorage.removeItem("userId");
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
            if (!data || !data.token || !data.userId) {
                throw new Error("Invalid response from server");
            }

            const { token, userId } = data;
            message.success("🎉 Login Complete!");
            localStorage.setItem("token", token);
            localStorage.setItem("userId", userId);
            navigate("/booking");
        } catch (error) {
            message.error("Login failed. Please check your credentials.");
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Sign in to your account
                </h1>
                <form className="space-y-5" onSubmit={handleLogin}>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200"
                    >
                        Sign in
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        Don’t have an account yet?{" "}
                        <a href="/register" className="text-indigo-600 hover:underline">
                            Sign up
                        </a>
                    </p>
                </form>
            </div>
        </section>
    );
};

export default Login;