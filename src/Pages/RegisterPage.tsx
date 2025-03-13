import { useEffect, useState } from "react";
import { message } from "antd";
import { register } from "../services/register";
import { useNavigate } from "react-router-dom";
import { validator, passwordRequirements } from "../utils/passwordValidator";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [emailValid, setEmailValid] = useState(false);
    const [pwdMatch, setPwdMatch] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
        setErrors(validator.validate(password1, { list: true }) as string[]);
        setPwdMatch(password1 === password2);
    }, [email, password1, password2]);

    useEffect(() => {
        localStorage.setItem("token", '');
        localStorage.setItem("userId", '');
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailValid || !pwdMatch || errors.length) {
            message.error("Please fix the errors before registering.");
            return;
        }
        try {
            const data = await register(email, password1, firstName, lastName);
            message.success("🎉 Registration Complete!");
            console.log("Registration Complete", data);
            navigate("/");
        } catch (error) {
            if (error instanceof Error) {
                message.error((error as any).response?.data?.message);
            } else {
                message.error("An unknown error occurred");
            }
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
            <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-xl relative">
                <button
                    onClick={() => navigate("/")}
                    className="absolute top-4 left-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                >
                    <ArrowLeft className="text-gray-600" size={20} />
                </button>
                <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Create an Account</h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">First Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Enter your first name"
                                className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <span className={firstName ? "text-green-600" : "text-red-600"}>
                            {firstName ? "✅ complete" : "❌ Please enter your first name"}
                        </span>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Last Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Enter your last name"
                                className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}


                            />
                        </div>
                        <span className={lastName ? "text-green-600" : "text-red-600"}>
                            {lastName ? "✅ complete" : "❌ Please enter your last name"}
                        </span>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <span className={emailValid ? "text-green-600" : "text-red-600"}>
                            {emailValid ? "✅ Valid email" : "❌ Invalid email"}
                        </span>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                                value={password1}
                                onChange={(e) => setPassword1(e.target.value)}
                            />
                        </div>
                        <ul className="text-sm mt-2">
                            {Object.keys(passwordRequirements).map((rule) => (
                                <li key={rule} className={errors.includes(rule) ? "text-red-600" : "text-green-600"}>
                                    {errors.includes(rule) ? "❌" : "✅"} {passwordRequirements[rule]}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="password"
                                placeholder="Confirm your password"
                                className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}
                            />
                        </div>
                        <span className="text-red-600">
                            {!pwdMatch && "❌ Passwords do not match"}
                        </span>
                    </div>

                    <button
                        type="submit"
                        className={`w-full p-3 rounded-lg font-bold text-white transition ${emailValid && pwdMatch && errors.length === 0 && firstName && lastName
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-gray-400 cursor-not-allowed"
                            }`}
                        disabled={!emailValid || !pwdMatch || errors.length > 0 || !firstName || !lastName}
                    >
                        Register
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Register;