import React, {useState, useEffect} from "react";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";


function ChangePassword(props){

    let [Profile,setProfile] = useState("");

    const[OldPassword, setOldPassword] = useState("")
    const[NewPassword, setNewPassword] = useState("")
    const[confirmPassword, setconfirmPassword] = useState("");


    // 유효성 메세지 state
    const[CheckExPwMsg, setCheckExPwMsg] = useState("")
    const[PassWordMsg, setPassWordMsg] = useState("")
    const[CheckPassWordMsg, setCheckPassWordMsg] = useState("")
    
    const onOldPasswordHandler = (event) => {
        setOldPassword(event.currentTarget.value)
    }

    const onNewPasswordHandler = (event) => {
        setNewPassword(event.currentTarget.value)
    }

    const onconfirmPassword = (event) => {
        setconfirmPassword(event.currentTarget.value)
      }
    

    const onSubmitHandler = (event) => {
        event.preventDefault(); // 페이지 새로고침 방지
    }

    let id = ""

    let body = {
        Oldpassword:OldPassword,
        newPassword:NewPassword
    }
    
    // 이전 비밀번호 DB값 비교
    const OldcheckPassword = (e) => {
        axios.get('/api/auth/check')
        .then(response => {

                id = response.data._id

                axios.post(`api/auth/expwCheck/${id}`, {password:OldPassword})
                .then(response => {
                    
                if(response.data.expw === "틀림"){
                    setCheckExPwMsg('비밀번호가 일치하지 않습니다.')
                }else{
                    setCheckExPwMsg('');
                }
            })
        })
    }


    useEffect(() => {
    axios.get('/api/auth/check')
    .then(response =>  {
        setProfile(response.data.profileurl)
        }
    )}, []);





        //비밀번호 유효성 검사
        const checkPassword = (e) => {

            axios.get('/api/auth/check')     // 입력한 비밀번호와 내 기존 비밀번호가 일치한지비교?
            .then(response => {
                console.log(response.data);
            })
        
            //  8 ~ 15자 영문, 숫자 조합
            var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,15}$/
            // 형식에 맞는 경우 true 리턴
            if(!regExp.test(e.target.value)){   
                setPassWordMsg('8 ~ 15자 영문 또는 숫자로 입력해주세요.')
            }else{
                setPassWordMsg('') // 정규식이 맞다면 ''공백으로 처리
            }
        }
      
        
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
      
            if(NewPassword != confirmPassword){  // 입력된 두 state값을 서로 비교해준다.
              setCheckPassWordMsg('비밀번호가 다릅니다.')
            }else{
              setCheckPassWordMsg('')
            }
        }

        
  
  const onClickHandler = () => {  // 특정 값 필요할시 Handler에 엑시오스 2개 묶어서 사용해야함 

    axios.get('/api/auth/check')
    .then(response => {

      id = response.data._id
    if(PassWordMsg !== '8 ~ 15자 영문 또는 숫자로 입력해주세요.'){
        axios.patch(`/api/auth/changePassword/${id}`, body)
        .then(response => {
  
        if(response){
          props.history.push("/login")
        }else{
          alert("Failed")
        }
      })
    }
    })
  }
  

    const [DataUsername, setDataUsername] = useState("")  // state에 데이터바인딩할 response값 담아서 뿌리기


    useEffect(() => {
        axios.get('/api/auth/check')
        .then(response =>  (setDataUsername(response.data.username))
      
    )}, []);

    
    const username = <div className="profile_username editprofile_username">{DataUsername}</div>;

    const main_profileImage = <div className="closefriends_profileImage_box editprofile_profileImage_box">
    <img className="profile_profileImage" src={Profile} /></div>

    return(
        <div className="auth-wrapper">
        <div className="auth-inner editprofile_div">

        <div className="profile_profile_div editprofile_profile_div"> 
        <div className="profile_profile editprofile_profile"> 
        {main_profileImage}{username}
        </div>
        </div>

        <form onClick={onSubmitHandler}>

            <div className="form-group editprofile_form">
                <label className="editprofile_label">이전 비밀번호</label>
                <input type="password" className="form-control" placeholder="이전 비밀번호"
                value={OldPassword} onChange={onOldPasswordHandler} onBlur={OldcheckPassword}/>
            </div>
            <p className="Msg2">{CheckExPwMsg}</p>

            <div className="form-group editprofile_form">
                <label className="editprofile_label">새 비밀번호</label>
                <input type="password" className="form-control" placeholder="새 비밀번호"
                value={NewPassword} onChange={onNewPasswordHandler} onBlur={checkPassword}/>              
            </div>
            <p className="Msg2">{PassWordMsg}</p>

            <div className="form-group editprofile_form">
                <label className="editprofile_label">비밀번호 확인</label>
                <input type="password" className="form-control" placeholder="비밀번호 확인"
                 onBlur={Check_checkPassword} onChange={onconfirmPassword}/>             
            </div>
            <p className="Msg2">{CheckPassWordMsg}</p>

            <div className="form-group">
            </div>

                <button type="submit" className="btn btn-primary editprofile_btn" onClick={onClickHandler}>
                    비밀번호변경
                </button>  

            <p className=" text-right editprofile_forgot_password">
                 <Link to="/recover_password">비밀번호를 잊으셨나요?</Link>
            </p>
            
        </form>
    </div>
</div>
    )
}

export default withRouter(ChangePassword);