import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getIncompleteStats } from "../../store/incomplete_log";

const ProfileStats = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const stats = useSelector((state) => state.incomplete_logs.stats);

  useEffect(() => {
    dispatch(getIncompleteStats()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <div className="stats_container">
        {isLoaded && (
          <>
            <h1> User Stats</h1>
            <div className="money-lost-stats">
            <div>
                <h3>Money Lost</h3>
                {stats.total_amount}
                <p>All time</p>
            </div>
            <div>
                {stats.total_year}
                <p>this year</p>
            </div>
              <div>
                {stats.total_month}
                <p>this month</p>
            </div>
            <div>
                {stats.total_week}
                <p>this week</p>
            </div>
            <div>
                {stats.total_today}
                <p>this today</p>
            </div>

            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProfileStats;
