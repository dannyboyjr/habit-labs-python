import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getIncompleteStats, getSavedStats } from "../../store/incomplete_log";
import './ProfileStats.css'
const ProfileStats = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const stats = useSelector((state) => state.incomplete_logs.stats);

  useEffect(() => {

    dispatch(getIncompleteStats()).then(()=> dispatch(getSavedStats())).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <div className="stats-container profile-bg">
        {isLoaded && (
          <>
            <h1 className="profile-header">User Stats</h1>
            <div>
            <h3 className="profile-header">💸 Money Saved</h3>
            <div className="money-stats-container">
            <div className="money-lost-stats profile-stats-grid">
              <div className="profile-stats-item">
                
                <span className="profile-stats-value">${stats.total_saved_all_time}</span>
                <p className="profile-stats-timeframe">All time</p>
              </div>
              <div className="profile-stats-item">
                <span className="profile-stats-value">${stats.total_saved_year}</span>
                <p className="profile-stats-timeframe">this year</p>
              </div>
              <div className="profile-stats-item">
                <span className="profile-stats-value">${stats.total_saved_month}</span>
                <p className="profile-stats-timeframe">this month</p>
              </div>
              <div className="profile-stats-item">
                <span className="profile-stats-value">${stats.total_saved_week}</span>
                <p className="profile-stats-timeframe">this week</p>
              </div>
              <div className="profile-stats-item">
                <span className="profile-stats-value">${stats.total_saved_today}</span>
                <p className="profile-stats-timeframe">today</p>
              </div>
            </div>
            </div>
            </div>
            <div>

            <h3 className="profile-header">💸 Money Lost</h3>
            <div className="money-stats-container">
            <div className="money-lost-stats profile-stats-grid">
              <div className="profile-stats-item">
                
                <span className="profile-stats-value">${stats.total_lost_all_time}</span>
                <p className="profile-stats-timeframe">All time</p>
              </div>
              <div className="profile-stats-item">
                <span className="profile-stats-value">${stats.total_saved_year}</span>
                <p className="profile-stats-timeframe">this year</p>
              </div>
              <div className="profile-stats-item">
                <span className="profile-stats-value">${stats.total_lost_month}</span>
                <p className="profile-stats-timeframe">this month</p>
              </div>
              <div className="profile-stats-item">
                <span className="profile-stats-value">${stats.total_lost_week}</span>
                <p className="profile-stats-timeframe">this week</p>
              </div>
              <div className="profile-stats-item">
                <span className="profile-stats-value">${stats.total_lost_today}</span>
                <p className="profile-stats-timeframe">today</p>
              </div>
              </div>
            </div>
            </div>

          </>
        )}
      </div>
    </>
  );
  
  
};

export default ProfileStats;
