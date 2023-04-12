import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import "./SplashPage.css"



function SplashPage({isLoaded}) {
    const sessionUser = useSelector(state => state.session.user);
    const history = useHistory()
    const dispatch = useDispatch()

    useEffect(() => {
        if (sessionUser){
                history.push(`/home`)
        }
    }, [dispatch, history, sessionUser])

    return (
        <>
            <div className='splash-container'>
                <p className='splash-welcome-text'>
                    Welcome to Habit Labs! Change your life by putting your money where your mouth is!
                </p>
                
                <div  className='splash-container-links'>
                    <NavLink to='/login' className="login-button" activeClassName="active">Log In</NavLink>
                    <NavLink to='/signup' className="signup-button" activeClassName="active">Sign Up</NavLink>
                   
                </div>
              
        
            </div>
        </>
    )
}

export default SplashPage