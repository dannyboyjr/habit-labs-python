import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import editIcon from "../../assets/pencil.png";
import {editUserById, deleteUserById} from '../../store/session'
import "./ProfileUserInfo.css";

const ProfileUserInfo = () => {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [timezone, setTimezone] = useState("");
  const [errors, setErrors] = useState([]);
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
  }, [dispatch, user]);

  const handleEditMode = () => {
    setEditMode(!editMode);
  };

  const deleteUser = async (e) => {
    e.preventDefault();
    const confirmation = window.confirm("Are you sure you want to delete your account?");
  
    if (confirmation) {
      const data = await dispatch(deleteUserById(user.id));
      if (data) {
        setErrors(data);
      } else {
        return 
      }
    }
  };

  const handleUpdate = async (e) => {
  e.preventDefault();
  let updatedUser = {
    first_name: firstName,
    last_name: lastName,
    username,
    email,
    timezone
  }
  
  const data = await dispatch(editUserById(user.id, updatedUser))
  if (data) {
    setErrors(data);
  }else{
    setErrors([])
    setEditMode(false)
  }

  };


  return (
   (
      <>
        <div className="profile-container profile-bg">
          <div className="edit-buttons-container">
  {editMode ? (
    <button className="submit-button" id="save-btn" onClick={handleUpdate}>
      Save
    </button>
  ):(
  <img className="edit-icon" src={editIcon} onClick={handleEditMode} alt="Edit Profile" />
  )}
</div>    
        <ul className="error-ul">
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
            ))}
        </ul>
  
          
          <h2 className="profile-header-user">
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
          <button id="delete-user-btn"onClick={deleteUser}>delete account</button>
        </div>
      </>
    )
  );
};

export default ProfileUserInfo;
