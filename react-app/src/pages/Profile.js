import ProfileStats from "../components/ProfileStats/ProfileStats";
import ProfileUserInfo from '../components/ProfileUserInfo/ProfileUserInfo'
import ProfileCreditCard from '../components/ProfileCreditCard/ProfileCreditCard'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Footer from '../components/Footer/Footer'
import './Profile.css'

//!put into env - also found on /components/BuildhabitFroms.js
const stripePromise = loadStripe('pk_live_51MRsbnKjQQj6FDkFTahjONsHu4fA6Za4RJW8aWTPkN6NNMfbUmlncRe44o3kz6ekptfAPzntRDn8xCvoclcpI4PP00yuIDKRwn');

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