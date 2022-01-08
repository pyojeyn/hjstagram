import React from "react";
import { Link } from "react-router-dom";

function Modal_Profile_Change(props) {

    return(

 <div className="modal_background">
<div className="modal_main_profilechange">
  <div className="modal_main_point_text">

  <div>
    <Link to="/profile_change" className="modal_text_blue"><p className="modal_text_blue2">프로필 사진 변경</p></Link>
  </div>

  <div>
    <p onClick={props.closeProfile}>취소</p>
  </div>
  </div>
</div>
</div>
    )
}


export default Modal_Profile_Change;