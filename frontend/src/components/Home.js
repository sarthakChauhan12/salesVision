import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GraphsPanel from "./GraphsPanel/GraphsPanel";

function Home() {
  const location = useLocation();
  const [notification, setNotification] = useState("");

  useEffect(() => {
    if (location.state && location.state.id) {
      const emailParts = location.state.id.split("@");
      const emailUsername = emailParts[0];
      if (location.state.signupSuccess) {
        setNotification(`Welcome new user '${emailUsername}'!`);
      } else {
        setNotification(`Successfully logged in to the '${emailUsername}' account`);
      }
      setTimeout(() => {
        setNotification("");
      }, 3000);
    }
  }, [location]);

  return (
    <>
      <GraphsPanel />
      {notification && <div className="notification">{notification}</div>}
    </>
  );
}
export default Home;
