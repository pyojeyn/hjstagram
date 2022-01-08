import React, {useState} from "react";
import { Link, withRouter } from "react-router-dom";
import {useDispatch} from 'react-redux';
import {registerUser}  from '../../_actions/user_action';
import axios from "axios";

function SignUp(props){

    const dispatch = useDispatch();

    // 서버에 보내고자 하는 값들을 state에서 가지고 있는것
    const[Email, setEmail] = useState("")
    const[Name, setName] = useState("")
    const[Username, setUsername] = useState("")
    const[Password, setPassword] = useState("")

    // 유효성 메세지 state
    const[EmailMsg, setEmailMsg] = useState("")
    const[UserNameMsg, setUserNameMsg] = useState("")
    const[PassWordMsg, setPassWordMsg] = useState("")
    

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onNameHandler = (event) => {
        setName(event.currentTarget.value)
    }

    const onUsernameHandler = (event) => {
        setUsername(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }


    // 이메일 유효성 검사
    const checkEmail = (e) => {

        axios.post('/api/auth/emailCheck', {email:Email})
        .then(response => {
            if(response.data.email){
                setEmailMsg('이미 존재하는 이메일입니다.')
            }else{
                setEmailMsg('')
            }
        })


        var regExp = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
        // 형식에 맞는 경우 true 리턴
        if(!regExp.test(e.target.value)){
            setEmailMsg('이메일 형식을 확인해주세요.')
        }else{
            setEmailMsg('') // 정규식이 맞다면 ''공백으로 처리
        }
    }


    // 아이디 유효성 검사
    const checkUserName = (e) => {
        axios.post('/api/auth/idCheck', {username:Username})
        .then(response => {           
            if(response.data.username){
                console.log("1=" + response.data.username);
                setUserNameMsg('이미 존재하는 사용자이름입니다.')
            }else{
                setUserNameMsg('') // 정규식이 맞다면 ''공백으로 처리
            }
        }) 
    //  2 ~ 10자 한글, 영문, 숫자 조합
    var regExp = /^([a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]).{2,10}$/;
    // 형식에 맞는 경우 true 리턴
    if(!regExp.test(e.target.value)){
        setUserNameMsg('사용자이름은 한글, 영문, 숫자만 가능하며 2-10자리 가능합니다')
    }else{
        setUserNameMsg('') // 정규식이 맞다면 ''공백으로 처리
    }
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
    


    const onSubmitHandler = (event) => {
        event.preventDefault(); // 페이지 새로고침 방지

        let body = {
            email: Email,
            name: Name,
            username: Username,
            password: Password,
        }
        
        if(PassWordMsg !=='8 ~ 15자 영문 또는 숫자로 입력해주세요.'){
            dispatch(registerUser(body))
            .then(response => {
                if(response.payload){
                    props.history.push('/main')
                }else{
                    alert("Failed to sign up")
                }
            })
        }
            
    }

    return (

        <div className="auth-wrapper">
        <div className="auth-inner">

        <form onSubmit={onSubmitHandler}>

            <div className="login-instagram-logo">
                <img className="login-instagram-logo" src="img/instagramlogo.png"/>
            </div>

            
            <h3 className="signup-text">친구들의 사진과 동영상을 보려면 가입하세요</h3>
            <div className="signup-text-div"/>

         
            <div className="form-group">
                <input autoFocus type="text" className="form-control" placeholder="이메일 주소"
                value={Email} onChange={onEmailHandler} onBlur={checkEmail}/>
                <p className="Msg">{EmailMsg}</p>
            </div>

            <div className="form-group">
                <input type="text" className="form-control" placeholder="성명"
                value={Name} onChange={onNameHandler} />
            </div>

            <div className="form-group">
                <input type="text" id="username"  className="form-control" placeholder="사용자 이름"
                value={Username} onChange={onUsernameHandler} onBlur={checkUserName} />
                <p className="Msg">{UserNameMsg}</p>
            </div>

            <div className="form-group">
                <input type="password" className="form-control" placeholder="비밀번호"
                value={Password} onChange={onPasswordHandler} onBlur={checkPassword} />
                <p className="Msg">{PassWordMsg}</p>
            </div>

            <div className="form-group">
        
            </div>

            <button type="submit" className="btn btn-primary btn-block">가입</button>

            <p className="login text-right">
                     계정이 있신가요? <Link to="/login">로그인</Link>
            </p>
            
            </form>
        </div>
    </div>
    
    );
}


export default withRouter(SignUp);
