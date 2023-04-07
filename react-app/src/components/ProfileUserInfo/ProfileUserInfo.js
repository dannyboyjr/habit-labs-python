import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import editIcon  from '../../assets/pencil.png'
import './ProfileUserInfo.css';

const ProfileUserInfo = () => {

    const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(true);
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    // dispatch(getIncompleteStats()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    isLoaded && (
      <>
        <div className="profile-container cool-bg">
          <div >
            <img className="edit-icon" src={editIcon} />
          </div>
          <h2 className="profile-header">{user.first_name} {user.last_name}</h2>
          <p className="profile-label">Username:</p>
          <p className="profile-info">{user.username}</p>
          <p className="profile-label">Email:</p>
          <p className="profile-info">{user.email}</p>
          <p className="profile-label">Timezone:</p>
          <p className="profile-info">{user.timezone}</p>
        </div>
      </>
    )
  );
  
};

export default ProfileUserInfo;
