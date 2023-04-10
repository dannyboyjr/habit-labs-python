import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getIncompleteStats } from "../../store/incomplete_log";
import './ProfileStats.css'
const ProfileStats = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const stats = useSelector((state) => state.incomplete_logs.stats);

  useEffect(() => {
    dispatch(getIncompleteStats()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <div className="stats-container profile-bg">
        {isLoaded && (
          <>
            <h1 className="profile-header">User Stats</h1>
            <div>
            <h3 className="profile-stats-header" id="saved-stats">💸 Money Saved</h3>
            <div className="money-lost-stats profile-stats-grid">
              <div className="profile-stats-item">
                
                <span className="profile-stats-value">${stats.total_amount}</span>
                <p className="profile-stats-timeframe">All time</p>
              </div>
              <div className="profile-stats-item">
                <span className="profile-stats-value">${stats.total_year}</span>
                <p className="profile-stats-timeframe">this year</p>
              </div>
              <div className="profile-stats-item">
                <span className="profile-stats-value">${stats.total_month}</span>
                <p className="profile-stats-timeframe">this month</p>
              </div>
              <div className="profile-stats-item">
                <span className="profile-stats-value">${stats.total_week}</span>
                <p className="profile-stats-timeframe">this week</p>
              </div>
              <div className="profile-stats-item">
                <span className="profile-stats-value">${stats.total_today}</span>
                <p className="profile-stats-timeframe">today</p>
              </div>
            </div>
            </div>
            <div>
            <h3 className="profile-stats-header" id="lost-stats">💸 Money Lost</h3>
            <div className="money-lost-stats profile-stats-grid">
              <div className="profile-stats-item">
                
                <span className="profile-stats-value">${stats.total_amount}</span>
                <p className="profile-stats-timeframe">All time</p>
              </div>
              <div className="profile-stats-item">
                <span className="profile-stats-value">${stats.total_year}</span>
                <p className="profile-stats-timeframe">this year</p>
              </div>
              <div className="profile-stats-item">
                <span className="profile-stats-value">${stats.total_month}</span>
                <p className="profile-stats-timeframe">this month</p>
              </div>
              <div className="profile-stats-item">
                <span className="profile-stats-value">${stats.total_week}</span>
                <p className="profile-stats-timeframe">this week</p>
              </div>
              <div className="profile-stats-item">
                <span className="profile-stats-value">${stats.total_today}</span>
                <p className="profile-stats-timeframe">today</p>
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
