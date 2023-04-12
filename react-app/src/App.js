import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SplashPage from "./components/SplashPage/index";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import HomePage from "./pages/Home";
import JournalsPage from "./pages/Journals";
import Profile from "./pages/Profile";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        
        <Switch >
          <Route path="/" exact>
            <SplashPage />
          </Route>
          <Route path="/login" >
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <ProtectedRoute>
          <Route exact path="/home">
            <HomePage />
          </Route>
          <Route path="/journals">
            <JournalsPage />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          </ProtectedRoute>
          
        </Switch>
      )}
    </>
  );
}

export default App;
