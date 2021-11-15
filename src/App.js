import React from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Chat from "./components/Chat"
import useAuthUser from "./hooks/useAuthUser";
import useWindowSize from "./hooks/useWindowSize";
import {Route ,Redirect} from "react-router-dom"

export default function App() {
  const page = useWindowSize();
  
  const user=useAuthUser();

  if(!user){
    return <Login />;
  }
  
  return (
    <div className="app" style={{ ...page }}>
      <Redirect to={page.isMobile?'/chats':'/'}/>
     <div className="app__body">
       <Sidebar page={page} user={user}/>
       <Route path="/room/:roomId">
         <Chat user={user} page={page}/>
       </Route>
     </div>
    </div>
 );
}
