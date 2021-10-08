import "./Login.css";
import { Button } from "@material-ui/core";
import { auth, provider } from "../firebase";

export default function Login() {
  function login() {
    return auth.signInWithRedirect(provider);
  }
  return (
    <div className="app">
      <div className="login">
        <div className="login__container">
          <img src="../../public/login-logo.png" alt="Logo"></img>
          <div className="Login_text">
            <h1>Sign in to whatsapp</h1>
          </div>
          <Button onClick={login}>Sign in with google</Button>
        </div>
      </div>
    </div>
  );
}
