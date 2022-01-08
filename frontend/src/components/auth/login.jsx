import React, {useState} from "react";
import { Link, withRouter } from "react-router-dom";
import {useDispatch} from 'react-redux';
import {LoginUser}  from '../../_actions/user_action';
import axios from "axios";

    function Login(props){

        const dispatch = useDispatch();

        // 서버에 보내고자 하는 값들을 state에서 가지고 있는것
        const[Username, setUsername] = useState("");
        const[Password, setPassword] = useState("");

        // 유효성 메세지 state
        const[UserNameMsg, setUserNameMsg] = useState("");
        const[PassWordMsg, setPassWordMsg] = useState("");

        const onUsernameHandler = (event) => {
            setUsername(event.currentTarget.value)
        }

        const onPasswordHandler = (event) => {
            setPassword(event.currentTarget.value)
        }


        const onSubmitHandler = (event) => {
            event.preventDefault(); // 페이지 새로고침 방지

            
        // 아이디 유효성 검사
        axios.post('/api/auth/idAndPassWordCheck', {username:Username, password:Password})
        .then(response => {           
            if(response.data.person === "없다고"){
                setUserNameMsg('사용자이름이 존재하지 않습니다.')
            }else if(response.data.pw === "틀림"){
                setUserNameMsg('비밀번호를 잘못 입력하셨습니다.')
            }else{
                setUserNameMsg('') // 정규식이 맞다면 ''공백으로 처리    
            }
        }) 

            

            let body = {
                username: Username,
                password: Password
            }
    
                dispatch(LoginUser(body))
                .then(response => {

                    console.log(response);
                    console.log(response.payload._id);
                    console.log(response.payload.LoginSuccess);

                    if(response.payload) { 
                        props.history.push('/main');
                    } else{
                        alert('Error');
                    }
                })
                
        }

        return (

            <div className="auth-wrapper">
            <div className="auth-inner">

            <form onSubmit={onSubmitHandler}>

                <div className="login-instagram-logo">
                    <img className="login-instagram-logo" src="img/instagramlogo.png"/>
                </div>

                <div className="form-group">
                    <input type="text" className="form-control" placeholder="사용자 이름"
                    value={Username} onChange={onUsernameHandler}/>
                </div>

                <div className="form-group">
                    <input type="password" className="form-control" placeholder="비밀번호"
                     value={Password} onChange={onPasswordHandler} />
                </div>

                <div className="form-group">
            
                </div>

                    <button type="submit" className="btn btn-primary btn-block">로그인</button>
                    <p className="Msg3">{UserNameMsg}</p>
                
                <p className="forgot-password text-right">
                     <Link to="/recover_password">비밀번호를 잊으셨나요?</Link>
                </p>
                <p className="sign-up text-right">
                     계정이 없으신가요? <Link to="/signup">가입하기</Link>
                </p>
                
            </form>
        </div>
    </div>
    
        );
    }


export default withRouter(Login);