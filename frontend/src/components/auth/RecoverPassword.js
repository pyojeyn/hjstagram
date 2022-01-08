import React, {useState} from "react"
import { Link } from "react-router-dom"
import { Button } from "./styledComponents"
import styled from "styled-components"
import axios from "axios"

export const RecoverPasswordStyles = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  form {
    width: 300px;
  }
  p,
  input {
    margin-bottom: 0.625rem;
    font-size: 1.125rem;
  }
  input,
  button {
    width: 100%;
  }
  p {
    font-size: 1.125rem;
  }
  a {
    margin-top: 1rem;
  }
  .reset-password-form-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 430px;
    margin: 0 auto;
  }
  .reset-password-form-sent-wrapper {
    max-width: 360px;
    text-align: center;
    p {
      text-align: left;
      margin-top: 1rem;
      margin-bottom: 0.75rem;
    }
  }
  .password-reset-btn {
    padding: 0.625rem 1.25rem;
    font-size: 1.125rem;
  }
`

function RecoverPassword(){

  const[Email, setEmail] = useState("");
  const[submitted, setSubmitted] = useState(false);

   // 유효성 메세지 state
   const[EmailMsg, setEmailMsg] = useState("")

   
  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
}


    // 이메일 유효성 검사
    const checkEmail = (e) => {
      var regExp = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
      // 형식에 맞는 경우 true 리턴
      if(!regExp.test(e.target.value)){
          setEmailMsg('이메일 형식을 확인해주세요.')
      }else{
          setEmailMsg('') // 정규식이 맞다면 ''공백으로 처리
      }
  }


const sendPasswordResetEmail = (event) => {
        event.preventDefault(); // 페이지 새로고침 방지
        
        let body = {
            email: Email,
        }
        
        axios.post("/api/auth/sendemail", body)
        .then(response => {
            if(response){
                setSubmitted(true);
                console.log(response);
            }else{
                console.log("error");
            }
        })
        
}

    return (

      <div className="auth-wrapper">
      <div className="auth-inner auth-inner-recoverpassword">

    <img className="auth-mail-logo" src="img/email.png"/>
    <div className="sendmail-text">
      <h3 className="sendmail-text">링크를 받을 이메일을 입력하세요</h3>
    </div>
        {submitted ? (
          <div className="reset-password-form-sent-wrapper">

            <p className="pw_text">
              비밀번호를 재설정하기 위한 링크를 이메일로 보냈습니다.
            </p>

              <p className="login text-right text-right_pw">
                <Link to="/login">돌아가기</Link>
              </p>

          </div>
        ) : (
          <div className="reset-password-form-wrapper">
        
            <form onSubmit={sendPasswordResetEmail}>

    
              <div className="form-group">
                  <input type="text" className="form-control" placeholder="이메일 주소"
                  onChange={onEmailHandler} value={Email} onBlur={checkEmail} />
                  <p className="Msg">{EmailMsg}</p>
              </div>

              <Button className="btn btn-primary btn-block">
                다음
              </Button>


              <p className="login text-right text-right_pw">
                비밀번호가 기억났나요? <Link to="/login">로그인</Link>
              </p>

            </form>
      
          </div>
        )}

      </div>
      </div>
    )
  }


export default RecoverPassword;