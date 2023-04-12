import JournalCard from '../JournalCard/JournalCard';
import './JournalContainer.css'

const JournalContainer = ({journals}) => {

    const journalArray = Object.values(journals);
  
    return (
      <div className="journal-container">

        {journalArray.map((journal) => (
          <JournalCard key={journal.id} journal={journal} />
        ))}
      </div>
    );
  };

  export default JournalContainer;