/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    console.log("fetching profile");
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("/profile", {
          withCredentials: true,
        });
        setUser(data);
        setReady(true);
      } catch (error) {
        console.log("failed, error:", error);

        if (error.response && error.response.status === 401) {
          alert("Session expired. Please log in again.");
          setUser(null);
          navigate("/login");
        } else {
          console.error("Error fetching profile:", error);
        }
      }
    };

    if (
      !user &&
      location.pathname !== "/login" &&
      location.pathname !== "/register"
    ) {
      fetchProfile();
    }
  }, [location.pathname, navigate, user]);

  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}
