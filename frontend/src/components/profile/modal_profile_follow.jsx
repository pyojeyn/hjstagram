import React, {useState, useEffect} from "react";
import axios from "axios";


function Modal_Profile_Follow(props){

  const [followingPeople, setfollowingPeople] = useState([]);
  let [Profile, setProfile] = useState([]);
  const myfollow = [];
  useEffect(() => {

    axios.get(`/api/auth/check`)
    .then(response => {
      setfollowingPeople(response.data.followingPeople);
      const follow = response.data.followingPeople;
      for(let i=0; i<follow.length; i++){
        axios.patch('/api/auth/getF4Fprofile', {username:follow[i]})
        .then(response => {
          myfollow[i] = response.data.profileurl;
          setProfile([...myfollow]);
        })
      }
    })


  }, []);

    return(
      <div className="modal_background modal_background_white">

        <div className="modal_profile_follow">
        <img className="CloseButton" src="img/close.png" onClick={props.closeFollow}/>
          <div className="modal_profile_follow_text">

          <p className="following_text">팔로잉</p>
          {
            followingPeople.map((a,i) => {
              return(
                <div className="modal_profile_follow_in"> 
                  <p>
                    <div className="main_profileImage_box main_profileImage_heart_box">
                      <img className="main_profileImage main_profileImage_heart" src={Profile[i]} />
                    </div>
                    <div className="main_username main_username_heart">
                        {a}
                    </div>
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
