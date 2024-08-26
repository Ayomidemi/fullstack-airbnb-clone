import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const [details, setDetails] = useState({
    email: "",
    password: "",
  });

  const [redirect, setRedirect] = useState(false);

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    try {
      const res = await axios.post("/login", details);

      if (res.status === 200) {
        setUser(res.data);
        setRedirect(true);
      }
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  //   how did this redirect without a use effect?
  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="your@email.com"
            value={details.email}
            onChange={(ev) =>
              setDetails({ ...details, email: ev.target.value })
            }
          />
          <input
            type="password"
            placeholder="password"
            value={details.password}
            onChange={(ev) =>
              setDetails({ ...details, password: ev.target.value })
            }
          />
          <button className="primary my-2">Login</button>
          <div className="text-center py-2 text-gray-500 text-sm">
            Don&apos;t have an account yet?{" "}
            <Link className="underline text-black" to={"/register"}>
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
