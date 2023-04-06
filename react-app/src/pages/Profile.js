import { useEffect, useState} from 'react'
import { useSelector, useDispatch } from "react-redux"
import { getIncompleteStats } from "../store/incomplete_log"
import ProfileStats from "../components/ProfileStats/ProfileStats";


const Profile = () => {
    const dispatch = useDispatch()

    useEffect(()=>{


    }, [])

    return (
        <div>
            <h1>Hello</h1>
            <ProfileStats/>
        </div>
    )
}

export default Profile