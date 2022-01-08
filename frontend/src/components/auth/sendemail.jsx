import React from "react";
import { Link, useHistory  } from "react-router-dom";

    function SendEmail(){

        let history = useHistory();

        return (

            <div className="auth-wrapper">
            <div className="auth-inner">

            <form>

                <div className="auth-mail-logo">
                    <img className="auth-mail-logo" src="img/email.png"/>
                </div>

                <div className="sendmail-text">
                <h3 className="sendmail-text">인증코드를 받을 이메일을 입력하세요</h3>
                </div>

                <div className="form-group">
                    <input type="email" className="form-control" placeholder="이메일 주소" />
                </div>

                <div className="form-group">
            
                </div>

                <button type="submit" className="btn btn-primary btn-block"
                onClick={()=>{ history.push('/auth') }}>다음</button>   
                
                <p className="auth-return text-right">
                     <Link to="/login">돌아가기</Link>
                </p>

                <p className="login text-right">
                     계정이 있신가요? <Link to="/login">로그인</Link>
                </p>
                
            </form>
        </div>
    </div>
    
        );
    }

export default SendEmail;