import ProfileStats from "../components/ProfileStats/ProfileStats";
import ProfileUserInfo from '../components/ProfileUserInfo/ProfileUserInfo'
import ProfileCreditCard from '../components/ProfileCreditCard/ProfileCreditCard'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Footer from '../components/Footer/Footer'
import './Profile.css'

//!put into env - also found on /components/BuildhabitFroms.js
const stripePromise = loadStripe('pk_test_51MRsbnKjQQj6FDkFdswvvgQHKPd9FikpeTwVIxeGyvDuLFqvcmqRvNq7f3SxBO04DqIvd3PrEcKePAa4Yb6PWzfK004l1twuBq');

const Profile = () => {

    return (
        <div className='profile-Page-container'>
            <ProfileStats/>
            <ProfileUserInfo/>
            <Elements stripe={stripePromise}>
            <ProfileCreditCard />
        </Elements>
        <Footer />
        </div>
    )
}

export default Profile