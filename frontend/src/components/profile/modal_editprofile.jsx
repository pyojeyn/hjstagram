import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";


function Modal_EditProfile(props){

  let id = ""

  const onClickHandler = () => {  // 특정 값 필요할시 Handler에 엑시오스 2개 묶어서 사용해야함 

    axios.get('/api/auth/check')
    .then(response => {

      id = response.data._id

      axios.delete(`/api/auth/delete/${id}`)
      .then(response => {

      if(response){
        props.history.push("/login")
      }else{
        alert("Failed")
      }
    })
    })
  }

    return(

        <div className="modal_background" onClick={props.closeModal}>
        <div className="modal_main_point modal_editprofile_point">
          <div className="modal_main_point_text modal_editprofile_text">

          <div>
            <p>정말로 회원탈퇴 하시겠습니까?</p>
          </div>

          <button onClick={onClickHandler} type="submit" className="btn btn-primary modal_editprofile_btn">동의</button>
          </div>
        </div>
        </div>
    )
}

export default withRouter(Modal_EditProfile);