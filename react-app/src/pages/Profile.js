import { useEffect, useState} from 'react'
import { useSelector, useDispatch } from "react-redux"
import { getIncompleteStats } from "../store/incomplete_log"
import ProfileStats from "../components/ProfileStats/ProfileStats";
import ProfileUserInfo from '../components/ProfileUserInfo/ProfileUserInfo'
import ProfileCreditCard from '../components/ProfileCreditCard/ProfileCreditCard'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Footer from '../components/Footer/Footer'
import './Profile.css'

const stripePromise = loadStripe('pk_test_51MRsbnKjQQj6FDkFdswvvgQHKPd9FikpeTwVIxeGyvDuLFqvcmqRvNq7f3SxBO04DqIvd3PrEcKePAa4Yb6PWzfK004l1twuBq');

const Profile = () => {
    const dispatch = useDispatch()

    useEffect(()=>{


    }, [])

    return (
        <div className='profile-Page-container'>
            <ProfileStats/>
            <ProfileUserInfo/>
            <Elements stripe={stripePromise}>
            {/* <ProfileCreditCard /> */}
        </Elements>
        <Footer />
        </div>
    )
}

export default Profile