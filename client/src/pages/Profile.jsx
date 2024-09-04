import { useContext, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";

import { UserContext } from "../components/UserContext";
import AccountNav from "../components/AccountNav";
import Places from "./Places";
import Bookings from "./Bookings";

const Profile = () => {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);

  const { pathname } = useLocation();

  let subpage = pathname.split("/")?.[2];
  if (subpage === undefined) {
    subpage = "profile";
  }

  async function logout() {
    await axios.post("/logout");
    setRedirect("/");
    setUser(null);
  }

  if (!ready) {
    return "Loading...";
  }

  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      <AccountNav />
      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user?.name} ({user?.email})<br />
          <button onClick={logout} className="primary max-w-sm my-4">
            Logout
          </button>
        </div>
      )}

      {subpage === "places" && <Places />}

      {subpage === "bookings" && <Bookings />}
    </div>
  );
};

export default Profile;
