import React from "react";
import { withRouter, useHistory } from "react-router-dom";

function Modal_Delete_Posts(props){
    return(

        <div className="modal_background" onClick={props.closeModal}>
        <div className="modal_main_point modal_editprofile_point">
          <div className="modal_main_point_text modal_editprofile_text">

          <div>
            <p>게시물을 삭제 하시겠습니까?</p>
          </div>

          <button className="btn btn-primary modal_editprofile_btn">삭제</button>
          </div>
        </div>
        </div>
    )
}

export default withRouter(Modal_Delete_Posts);
