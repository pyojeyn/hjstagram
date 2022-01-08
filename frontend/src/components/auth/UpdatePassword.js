import React, { useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { Button } from "./styledComponents"

function UpdatePassword(match) {

  
  const[password, setpassword] = useState("");
  const[confirmPassword, setconfirmPassword] = useState("");
  const[submitted, setsubmitted] = useState(false);

  // 유효성 메세지 state
  const[PassWordMsg, setPassWordMsg] = useState("")
  const[CheckPassWordMsg, setCheckPassWordMsg] = useState("")

  const onpassword = (event) => {
    setpassword(event.currentTarget.value)
  }

  const onconfirmPassword = (event) => {
    setconfirmPassword(event.currentTarget.value)
  }


    //비밀번호 유효성 검사
    const checkPassword = (e) => {
      //  8 ~ 15자 영문, 숫자 조합
      var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,15}$/
      // 형식에 맞는 경우 true 리턴
      if(!regExp.test(e.target.value)){   
          setPassWordMsg('8 ~ 15자 영문 또는 숫자로 입력해주세요.')
      }else{
          setPassWordMsg('') // 정규식이 맞다면 ''공백으로 처리
      }
  }

  console.log("1"+PassWordMsg);
  
    //비밀번호 확인 검사
    const Check_checkPassword = (e) => {
      //  8 ~ 15자 영문, 숫자 조합
      var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,15}$/
      // 형식에 맞는 경우 true 리턴
      if(!regExp.test(e.target.value)){   
        setCheckPassWordMsg('8 ~ 15자 영문 또는 숫자로 입력해주세요.')
      }else{
        setCheckPassWordMsg('') // 정규식이 맞다면 ''공백으로 처리
      }

      if(password != confirmPassword){  // 입력된 두 state값을 서로 비교해준다.
        setCheckPassWordMsg('비밀번호가 다릅니다.')
      }else{
        setCheckPassWordMsg('')
      }
  }

  


  const updatePassword = (event) => {

    event.preventDefault(); // 페이지 새로고침 방지

    const { userId, token } = match;
    console.log(match);

    let body = {
      password: password,
    }

    // state 입력값이 같을경우만 post
    if(password === confirmPassword && PassWordMsg !=='8 ~ 15자 영문 또는 숫자로 입력해주세요.'){ 
      axios
      .post(`/api/auth/receive_new_password/${userId}/${token}`, body)
      .then(() => {
            setsubmitted(true);    
      })
      .catch(err => console.warn("ERROR FROM SERVER UPDATING PASSWORD:", err))
      setsubmitted({ submitted: !submitted })
    }
    
  }

    return (

            <div className="auth-wrapper">
      <div className="auth-inner auth-inner-recoverpassword">
        <img className="auth-mail-logo" src="/img/email.png"/>
          <div className="sendmail-text">
            <h3 className="sendmail-text">변경할 비밀번호를 입력하세요</h3>
          </div>
        {submitted ? (
          <div className="reset-password-form-sent-wrapper">

            <p className="pw_text">
              비밀번호 변경이 완료되었습니다. 다시 로그인해주세요.
            </p>

            <p className="login text-right text-right_pw">
                <Link to="/login">로그인하기</Link>
            </p>

          </div>
        ) : (
          <div className="reset-password-form-wrapper">
            <form onSubmit={updatePassword} style={{ paddingBottom: "1.5rem" }}>

   
              <div className="form-group">
                <input className="form-control" onChange={onpassword} value={password} onBlur={checkPassword}
                placeholder="새 비밀번호" type="password"/>
                <p className="Msg">{PassWordMsg}</p>
              </div>

              <div className="form-group">
                <input className="form-control" onChange={onconfirmPassword} value={confirmPassword}
                 onBlur={Check_checkPassword} placeholder="비밀번호 확인" type="password"/>
                 <p className="Msg">{CheckPassWordMsg}</p>
              </div>
              <Button className="btn btn-primary btn-block">
                확인
              </Button>

            </form>

            <p
              style={{
                fontSize: "1rem",
                maxWidth: "420px",
                paddingLeft: "0.5rem"
              }}
            >

            </p>
          </div>
        )}
        </div>
      </div>
    )
  }

export default UpdatePassword;