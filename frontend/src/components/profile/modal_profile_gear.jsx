import React from "react";
import { Link } from "react-router-dom";

function Modal_profile_gear(props) {

    return(

 <div className="modal_background">
  <div className="modal_profile_gear">
    <div className="modal_profile_gear_text">
      <div>
      <Link to="/changepassword" className="modal_text_blue"><p>비밀번호 변경</p></Link>
      </div>

      <div>
      <Link to="/editprofile" className="modal_text_blue"><p>프로필 편집</p></Link>
      </div>

      <div>
        <Link to="/" className="modal_text_blue"><p>로그아웃</p></Link>
      </div>

      <div>
        <p onClick={props.closeGear}>취소</p>
      </div>
    </div>
  </div>
</div>
    )
}


export default Modal_profile_gear;
