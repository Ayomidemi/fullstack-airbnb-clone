import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [details, setDetails] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    try {
      await axios.post("/register", details);

      alert("Registration successful. Now you can log in");
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={details.name}
            onChange={(ev) => setDetails({ ...details, name: ev.target.value })}
          />
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
          <button className="primary my-2">Register</button>
          <div className="text-center py-2 text-gray-500 text-sm">
            Already a member?{" "}
            <Link className="underline text-black" to={"/login"}>
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
