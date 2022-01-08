import React from "react";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";

function Modal_main_profile(props){

    const onClickHandler = () => {
      axios.post('/api/auth/logout')
      .then(response => {
        if(response){
          props.history.push("/login")
        }else{
          alert("Failed to logout")
        }
      })
    }

    return(

        <div className="modal_background_white" onClick={props.closeModal}>
        <div className="modal_main_profile">
          <div className="modal_main_profile_text">

          <div>
          <Link to="/profiles" className="modal_text_blue"><p>프로필</p></Link>
          </div>
        
          <div onClick={onClickHandler}>
          <p className="modal_text_blue">로그아웃</p>
          </div>

          </div>
        </div>
        </div>

    )
}

export default withRouter(Modal_main_profile);

