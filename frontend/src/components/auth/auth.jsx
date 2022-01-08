import React from "react";
import { Link, useHistory } from "react-router-dom";

    function Auth(){

        let history = useHistory();

        return (

            <div className="auth-wrapper">
            <div className="auth-inner">

            <form>

                <div className="auth-mail-logo">
                    <img className="auth-mail-logo" src="img/email.png"/>
                </div>

                <div className="sendmail-text">
                <h3 className="sendmail-text">인증 코드를 입력하세요</h3>
                </div>

                <div className="form-group">
                    {/* <label>Password</label> */}
                    <input type="text" className="form-control" placeholder="인증 코드" />
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

export default Auth;