import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllJournals } from '../store/journal';
import JournalContainer from '../components/JournalContainer/JournalContainer';
import Footer from '../components/Footer/Footer'
import './Journals.css'

const JournalsPage = () => {

  const journals = useSelector((state) => state.journals);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAllJournals());
      }, [dispatch]);
      
    return (
      <div className="journals-page">
        <h1>Journals Page</h1>
        <div className='journal-container-page-layout'>
        <div >
        <JournalContainer journals={journals} />
        </div>
        </div>
        <Footer />
      </div>
    );
  };
  
  export default JournalsPage;