import React, {useState, useEffect} from "react";
import axios from "axios";


function Modal_Profile_Follow(props){


const [followerPeople, setfollowerPeople] = useState([]);
let [Profile, setProfile] = useState([]);

const myfollower = [];
useEffect(() => {

  axios.get(`/api/auth/check`)
  .then(response => {
    setfollowerPeople(response.data.followerPeople);
    const follower = response.data.followerPeople;
    for(let i=0; i<follower.length; i++){
      axios.patch('/api/auth/getF4Fprofile', {username:follower[i]})
      .then(response => {
        myfollower[i] = response.data.profileurl;
        setProfile([...myfollower]);
      })
    }
  })


}, []);

    return(

        <div className="modal_background modal_background_white">
        <div className="modal_profile_follow">
        <img className="CloseButton" src="img/close.png" onClick={props.closeFollow}/>
          <div className="modal_profile_follow_text">

          <p className="following_text">팔로워</p>


          {
            followerPeople.map((a,i) => {
              return(
                <div className="modal_profile_follow_in">
                  <p>
                    <div className="main_profileImage_box main_profileImage_heart_box">
                      <img className="main_profileImage main_profileImage_heart" src={Profile[i]} />
                    </div>
                    <div className="main_username main_username_heart">{a}</div>
                  </p>
              </div>
              )
            })
          }
          </div>
        </div>
        </div>

    )
}

export default Modal_Profile_Follow;
