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
      <div className="stats-container cool-bg">
        {isLoaded && (
          <>
            <h1 className="cool-header">User Stats🚀</h1>
            <div className="money-lost-stats cool-stats-grid">
              <div className="cool-stats-item">
                <h3 className="cool-stats-header">💸 Money Lost</h3>
                <span className="cool-stats-value">${stats.total_amount}</span>
                <p className="cool-stats-timeframe">All time</p>
              </div>
              <div className="cool-stats-item">
                <span className="cool-stats-value">${stats.total_year}</span>
                <p className="cool-stats-timeframe">this year</p>
              </div>
              <div className="cool-stats-item">
                <span className="cool-stats-value">${stats.total_month}</span>
                <p className="cool-stats-timeframe">this month</p>
              </div>
              <div className="cool-stats-item">
                <span className="cool-stats-value">${stats.total_week}</span>
                <p className="cool-stats-timeframe">this week</p>
              </div>
              <div className="cool-stats-item">
                <span className="cool-stats-value">${stats.total_today}</span>
                <p className="cool-stats-timeframe">today</p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
  
};

export default ProfileStats;
