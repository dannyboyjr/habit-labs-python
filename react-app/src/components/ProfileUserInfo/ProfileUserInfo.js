import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import editIcon from "../../assets/pencil.png";
import {editUserById} from '../../store/session'
import "./ProfileUserInfo.css";

const ProfileUserInfo = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [timezone, setTimezone] = useState("");
  const user = useSelector((state) => state.session.user);

  const timezones = [
    "America/Los_Angeles",
    "America/Denver",
    "America/Chicago",
    "America/New_York",
    "America/Anchorage",
    "Pacific/Honolulu",
  ];

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setUsername(user.username);
      setEmail(user.email);
      setTimezone(user.timezone);
    }
    // dispatch(getIncompleteStats()).then(() => setIsLoaded(true));
  }, [dispatch, user]);

  const handleEditMode = () => {
    setEditMode(!editMode);
  };


  const handleUpdate = async () => {

  let updatedUser = {
    first_name: firstName,
    last_name: lastName,
    username,
    email,
    timezone
  }
  
  await dispatch(editUserById(user.id, updatedUser)).then(()=>setEditMode(false))

  };

  return (
    isLoaded && (
      <>
        <div className="profile-container profile-bg">
          <div className="edit-buttons-container">
  {editMode ? (
    <button className="submit-button" id="save-btn" onClick={handleUpdate}>
      Save
    </button>
  ):(
  <img className="edit-icon" src={editIcon} onClick={handleEditMode} />
  )}
</div>
  
          
          <h2 className="profile-header">
            {editMode ? (
              <>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />{" "}
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </>
            ) : (
              `${firstName} ${lastName}`
            )}
          </h2>
          <p className="profile-label">Username:</p>
          <p className="profile-info">
            {editMode ? (

              
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            ) : (
              username
            )}
          </p>
          <p className="profile-label">Email:</p>
          <p className="profile-info">
            {editMode ? (
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            ) : (
              email
            )}
          </p>
          <p className="profile-label">Timezone:</p>
          <p className="profile-info">
            {editMode ? (
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            ) : (
              timezone
            )}
          </p>
        </div>
      </>
    )
  );
};

export default ProfileUserInfo;
