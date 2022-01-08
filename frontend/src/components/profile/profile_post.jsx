import React, {useState, useEffect} from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";




function Profile_Post(props){
    let [modal , modal_change] = useState(false);

    const closeModal = () => {
        modal_change(false);
      }

    const [Posts, setPosts] = useState([]);

    const PostsArr = [];
    const [ID, setID] = useState("");

    const saveIDandModal = (id) => {
      setID(id);
      modal_change(true);
    };

    useEffect(() => {
        axios.get('/api/auth/check')
        .then(response => {
            const logusername = response.data.username;
            axios.get(`/api/posts?username=${logusername}`)
            .then(response => {
                for(let i=0; i<response.data.length; i++){
                    PostsArr[i] = response.data[i];
                    setPosts([...PostsArr]);
                }
            })
        })
    },[]);



    const deletePost = (ID) => {
        axios.delete(`/api/posts/${ID}`)
        .then(response => {
            axios.patch('/api/auth/removePost')
            .then(res => {
                window.location.reload();
            })
        })
    }
    
    return(
        <>
        <hr className="profile_hr"></hr>

    
        <div className="profile_div_box">
            {
                Posts && Posts.map((a) => {
                    return(
                        <div className="profile_div_imgbox">
                        <img className="profile_div_img" src={a.fileurls[0]} onClick={()=>{saveIDandModal(a._id)}}/>
                        </div>
                    )
                })
            }
        </div>


    {
    modal === true
    ? <div className="modal_background" onClick={closeModal}>
      <div className="modal_main_point modal_editprofile_point">
      <div className="modal_main_point_text modal_editprofile_text">

      <div>
        <p>게시물을 삭제 하시겠습니까?</p>
      </div>

      <button type="submit" onClick={() => deletePost(ID)} className="btn btn-primary modal_editprofile_btn">삭제</button>
      </div>
      </div>
      </div>
    : null
    }


      </>
    )
}

export default withRouter(Profile_Post);