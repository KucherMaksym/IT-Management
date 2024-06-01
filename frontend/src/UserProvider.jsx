import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [company, setCompany] = useState(
        {
            company: null,
            isAdmin: false
        }
    );

    const getProfile = async () => {
        try {
            const response = await axios.get("http://localhost:8000/profile", { withCredentials: true });
            //console.log(response.data);
            setUser(response.data);
            if (response.data.isAuthenticated === false) {
                setUser(null);
                setIsAuthenticated(false);
                throw new Error("User is not authenticated");
            }
            setIsAuthenticated(true);
            await findUserCompany(); // Вызов функции поиска компании
        } catch (error) {
            //console.error("Failed to fetch user profile:", error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const findUserCompany = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/companies/companyByAdmin", { withCredentials: true });
            if (response.data) {
                setCompany({company: response.data, isAdmin: true});
                //console.log(company);
            } else {
                const isEmployee = await axios.get("http://localhost:8000/api/companies/findUserCompany", { withCredentials: true }).then((response) => {
                    setCompany({company: response.data, isAdmin: false})
                    console.log(company);
                });
            }
        } catch (error) {
            console.error("Failed to fetch company data:", error);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, isAuthenticated, company, getProfile }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
