import { useSelector } from 'react-redux';
import JournalCard from '../JournalCard/JournalCard';

const JournalContainer = ({journals}) => {

    const journalArray = Object.values(journals);
  
    return (
      <div>
        {journalArray.map((journal) => (
          <JournalCard key={journal.id} journal={journal} />
        ))}
      </div>
    );
  };

  export default JournalContainer;