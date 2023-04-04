import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllJournals } from '../store/journal';
import JournalContainer from '../components/JournalContainer/JournalContainer';

const JournalsPage = () => {

  const journals = useSelector((state) => state.journals);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAllJournals());
      }, [dispatch]);
      
    return (
      <div className="journals-page">
        <h1>Journals Page</h1>
        <JournalContainer journals={journals} />
      </div>
    );
  };
  
  export default JournalsPage;