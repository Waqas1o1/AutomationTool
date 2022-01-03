import React, { useState } from "react";
import { connect } from "react-redux";
import { authLogin } from "../store/actions/auth";
// import "./styles/authLogin.css";

function Authenticate() {
  const initialFields = {
    username: "",
    password: "",
  };
  const [fields, setFiedls] = useState(initialFields);
  const handleOnChange = (e) => {
    setFiedls({
      ...fields,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="main">
      <input type="checkbox" id="chk" aria-hidden="true" />

      <div className="signup">
        <form>
          <label for="chk" aria-hidden="true">
            Sign up
          </label>
          <input
            type="text"
            onChange={handleOnChange}
            name="username"
            placeholder="User name"
            required=""
          />
          <input
            type="email"
            onChange={handleOnChange}
            name="email"
            placeholder="Email"
            required=""
          />
          <input
            type="password"
            name="pswd"
            placeholder="Password"
            required=""
          />
          <button>Sign up</button>
        </form>
      </div>

      <div className="login">
        <form>
          <label for="chk" aria-hidden="true">
            Login
          </label>
          <input
            type="string"
            onChange={handleOnChange}
            name="username"
            placeholder="Email"
            required
          />
          <input
            type="password"
            onChange={handleOnChange}
            name="password"
            placeholder="Password"
            required
          />
          <button>Login</button>
        </form>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    authenticated: state.token !== null,
    error: state.error,
    loading: state.loading,
  };
};
const mapDispacthToProps = (dispacth) => {
  return {
    login: (username, password) => dispacth(authLogin(username, password)),
  };
};
export default connect(mapStateToProps, mapDispacthToProps)(Authenticate);
