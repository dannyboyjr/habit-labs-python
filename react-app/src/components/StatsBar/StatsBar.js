import { useState, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux'
import './StatsBar.css'
import { editJournalById } from '../../store/journal';


const StatsBar = () => {
return(
<div className='stats-bar-container'>
    <h1>Stats Component</h1>
</div>
)
}

export default StatsBar