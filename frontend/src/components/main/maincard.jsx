import React, {useState, useEffect} from "react";
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import Modal_main_point from "./modal_main_point";
import axios from "axios";
import { Carousel } from 'react-bootstrap';
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";


function MainCard() {

    let [Profile,setProfile] = useState([]);

    let [modal , modal_change] = useState(false);

    // 좋아요 이미지변경 state
    let [heart, heart_change] = useState([false]);

    // 좋아요 숫자
    let [heartNum, setHeartNum] = useState([]);

    //팔로우 이미지변경 state
    let [follow, follow_change] = useState([false]);

    let [comment , comment_change] = useState(false);

    const [WhoLogin, setWhoLogin] = useState("");

    // 서버에 보내고자 하는 값들을 state에서 가지고 있는것
    const[comments, setcomments] = useState("")

    // ID값 담을  state
    const [ID, setID] = useState("");

    const [NamID, setNamID] = useState("");

    const saveID = (id) => {
      setID(id);
    };

    const onCommentsHandler = (event) => {
      setcomments(event.currentTarget.value);
    }
  
    const closeModal = () => {
      modal_change(false);
    }
    
    const closecomment = () => {
      comment_change(!comment);
    }

    // state에 데이터바인딩할 response값 담아서 뿌리기
    const [DataUsername, setDataUsername] = useState([])  
    const [Contents, setContents] = useState([])
    const [FileImg, setFileImg] = useState([[]])
    const [CommentOjArr, setCommentOjArr] = useState([]);
 
    // 빈 배열 따로 만들어서 response.data[i] 담아줘야 배열에 하나씩 담겨짐
    const post =[]; // contents
    const user = []; // username
    const file = []; // file
    const LikeBy = []; // 좋아요 리스트 
    const HeartNum = []; // 좋아요 숫자
    const likePost = []; // 각 게시물의 좋아요 여부 
    
    const commentOj = [];
    const writer = [];  // 게시글 쓴사람
    const FollowPost = []; //팔로우 여부
    const eachprofile = [];
    const ismycmt = []; // 각 포스트당 댓글 돌면서 내 댓글인지 확인하고 여부 boolean 값으로 담아주기 
    
    

    // ID값 담을 빈 배열
    let id = [];
   
      useEffect(() => {
        axios.get('/api/posts')
        .then(response => {
          for(let i = 0; i < response.data.length; i += 1){  
            post[i] = response.data[i]
            user[i] = response.data[i].user.username;
            file[i] = response.data[i].fileurls;
            
            LikeBy[i] = response.data[i].likeby; // 좋아요 누른사람
            writer[i] = response.data[i].user.username; // 글쓴이들 (팔로잉 당할것들)
            eachprofile[i] = response.data[i].user.profileurl;
            FollowPost[i] = false;
            likePost[i] = false;
            
            commentOj[i] = response.data[i].comment;
            HeartNum[i] = response.data[i].like;
            setHeartNum([...HeartNum]);

            id[i] = response.data[i]._id;          

            setCommentOjArr([...commentOj]);
            setProfile([...eachprofile]);
            setContents(post);
            setDataUsername(user);
            
            setFileImg([...file]); // file을 setFileImg하면 게시물이 하나만 나옴

        // 내가 좋아요 누른 게시물 
          axios.get('api/auth/check') 
          .then(response => {
          
          const name = response.data.username;
          setWhoLogin(name);

          const following = response.data.followingPeople;

            for(let j = 0; j < LikeBy[i].length; j++){

                if(name === LikeBy[i][j]){ // 로그인한 사람이랑 좋아요 누른사람이 같다면
        
                  likePost[i] = true; // true로 변경   
                }
            }
            heart_change([...likePost]);
                    
            for(let j =0; j<following.length; j++){
              if(following[j] === writer[i]){
                //팔로우 표시 
                FollowPost[i] = true;
              }
            }
            follow_change([...FollowPost]);

            for(let j=0; j<commentOj.length; j++){
              for(let k=0; k<commentOj[i].length; k++){
                if(name === commentOj[i][k].who){
                  ismycmt[k] = true;
                }else{
                  ismycmt[k] = false;
                }
                
              }

            }
          })
      }
  }); 
    }, []);

     // 좋아요 하기
     const On_Heart = (ID) => {

      axios.patch(`/api/posts/${ID}/likeby`)
      .then(response => {

        axios.patch(`/api/posts/${ID}/addlike`)
        .then(response => {
          window.location.reload(); 
        })
      })
    }

    // 좋아요 취소
     const Off_Heart = (ID) => {
       
      axios.patch(`/api/posts/${ID}/cancleLikeby`)
      .then(response => {

        axios.patch(`/api/posts/${ID}/canclelike`)
        .then(response => {
          window.location.reload();   
        })
      })
    }

     // 팔로우 하기
     const On_Follow = (werid, wername) => {
      
      let ingid = ''; // 팔로잉 하는 사람의 _id;
      let whofollow = ''; // 팔로잉 하는 사람의 username
      
      axios.get(`/api/auth/check`)
      .then(response => {
        ingid = response.data._id;
        whofollow = response.data.username;
        let body = {
          whofollowing : wername,
          whofollower : whofollow,
        }

        axios.patch(`api/auth/following/${ingid}/${werid}`,  body)
        .then(res => {
          window.location.reload(); 
        })
      })
    }


    // 팔로우 취소
    const Off_Follow = (werid, wername) => {

      let ingid = ''; // 팔로잉 하는 사람의 _id;
      let whounfollow = ''; // 팔로잉 하는 사람의 username
      
      axios.get(`/api/auth/check`)
      .then(response => {
        ingid = response.data._id;
        whounfollow = response.data.username;
        let body = {
          whounfollowing : wername,
          whounfollower : whounfollow,
        }

        axios.patch(`api/auth/unfollowing/${ingid}/${werid}`,  body)
        .then(res => {
          window.location.reload(); 
        })
      }) 
    }

    // 댓글 게시
    async function onSubmitHandler(e){
      e.preventDefault(); // 페이지 새로고침 방지
        axios.patch(`api/posts/${ID}/givecomment`, {content:comments})
        .then(response =>{
          window.location.reload(); 
        })            
    }

    // 댓글 삭제 
    async function deletecmt(cid, ID){
      axios.patch(`api/posts/${ID}/${cid}/deleteComment`)
      .then(response => {
        window.location.reload(); 
      })
    }

    async function clickPoint(id){
      modal_change(true);
      setNamID(id)
    }
    
      

      return(
      <>    

      { // Contents 배열에 담긴 갯수 기준으로 반복문 돌려서 card retrun해주고 i로 매개변수 따로 만들어줘서
        // 데이터 바인딩 할 곳에 배열 [i]로 뿌려줘야함
        Contents.map(function(a,i){
            return(

            <div style={{ width: '40rem' }} className="main_card" key={a._id}>
              <div className="main_profile_div">
                <div className="main_profile">
                  <div className="profile_div">
                    <div className="main_profileImage_box main_cardprofileImage_box">
                      <img className="main_profileImage" src={Profile[i]} />
                    </div>
                        <Link to={{pathname: `/namprofiles/${a.user._id}`}} className="modal_text_blue">
                          <span className="main_username">{DataUsername[i]}</span></Link>
                  </div>
                  <div className="main_Point_div" onClick={() => { clickPoint(a.user._id) } }>
                    <img className="main_Point" src="img/main_Point.png"/>
                  </div>
                </div>
              </div>

              <Carousel> 
              {

                // [[],[],[]] 으로 뽑으려면 && 연산자 활용
                FileImg[i] && FileImg[i].map((j) => {
                      return(
                        <Carousel.Item>
                        <Card.Img variant="top" src={j} className="edit_img_size_card"/>
                        </Carousel.Item>
                      )
                    })
              }
              </Carousel>

              <ListGroup className="list-group-flush">    
                <ListGroupItem>
                  <div>

                  {/* 좋아요 클릭 취소 삼항연산자 */}
                  {                  
                  heart[i] === false  
                  ?  <img className="main_herat_off" src="img/main_heart_off.png"
                      onClick={() => On_Heart(a._id)}/>

                  : <img className="main_herat_off" src="img/main_heart_on.png"
                      onClick={() => Off_Heart(a._id)}/>
                  } 


                  {
                  follow[i] === false
                  ?  <img className="main_follow" src="img/main_follow_off.png"
                    onClick={()=>On_Follow(a.user._id, a.user.username)}/>

                  :  <img className="main_follow" src="img/main_follow_on.png"
                    onClick={()=>Off_Follow(a.user._id, a.user.username)}/>
                  } 

                  </div>


                {/* 좋아요 숫자 */}
                <div className="like_div">좋아요 {heartNum[i]}개</div>
        
                {/* 게시물 코맨트 */}
                <div className="contents_div" key={i}>{a.contents}</div>

                  {/* 댓글쓴이 & 댓글 */}
                  {
                  CommentOjArr[i] && CommentOjArr[i].map((w,j)=>(
                    <>
                      <div className="contents_div_username">  
                        <Link to={{pathname: `/namprofiles/${w.whoid}`}} className="modal_text_blue">
                          <span className="W_Who">{w.who}</span>
                        </Link>
                        <span className="contents_div_username_span">{w.content}</span>
                  { 
                  w.who === WhoLogin || WhoLogin === a.user.username
                    ?   <span className="contents_div_username_span"><img className="delete_1"
                        src="img/delete_1.png" onClick={() => deletecmt(w._id, a._id)}/></span>
                    : null
                  }
                      </div>
                    </>
                  ))
                  }   

                </ListGroupItem>
                  <ListGroupItem style={{ paddingBottom: '10px' }}>
                {/* 댓글입력창 */}
                <form className="main_card_textarea" onSubmit={onSubmitHandler} onChange={()=> saveID(a._id)}>
                  <img className="main_smile" src="img/smile.png"/>

                  <input type="text" className="main_card_textarea" name="w3review" autoComplete="off" rows="1" cols="80" placeholder="댓글달기..."  onChange={onCommentsHandler}>
                  </input>

                  <button className="main_card_textarea_button">게시</button>
                </form>

                  </ListGroupItem> 
                </ListGroup>
          </div>
                  )
                })
              }
            
            {
            modal === true
            ? <Modal_main_point closeModal={closeModal} NamID={NamID} />
            : null
            }
        </>
        
        )
}
export default withRouter(MainCard);