import React from "react";
import { Link } from "react-router-dom";

function Modal_main_point(props) {

  const id = props.NamID;
  console.log(id);

    return(

 <div className="modal_background">
<div className="modal_main_point">
  <div className="modal_main_point_text">

  <div>
    <Link to={{pathname: `/namprofiles/${id}`}} className="modal_text_blue"><p>게시물로 이동</p></Link>
  </div>


  <div>
    <p onClick={props.closeModal}>취소</p>
  </div>
  </div>
</div>
</div>
    )
}


export default Modal_main_point;



