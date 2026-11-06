import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const token = localStorage.getItem("library_token");

        if (!token) {

            setLoading(false);

            return;

        }

        api.get("/auth/me")

            .then((res) => {

                setUser(res.data.user);

            })

            .catch(() => {

                localStorage.removeItem("library_token");

            })

            .finally(() => {

                setLoading(false);

            });

    }, []);

    // LOGIN
    const login = async (credentials) => {

        const res = await api.post(
            "/auth/login",
            credentials
        );

        localStorage.setItem(
            "library_token",
            res.data.token
        );

        setUser(res.data.user);

    };

    // REGISTER
    const register = async (details) => {

        const res = await api.post(
            "/auth/register",
            details
        );

        localStorage.setItem(
            "library_token",
            res.data.token
        );

        setUser(res.data.user);

    };

    // LOGOUT
    const logout = () => {

        localStorage.removeItem("library_token");

        setUser(null);

    };

    return (

        <AuthContext.Provider value={{

            user,
            loading,
            login,
            register,
            logout

        }}>

            {children}

        </AuthContext.Provider>

    );

};