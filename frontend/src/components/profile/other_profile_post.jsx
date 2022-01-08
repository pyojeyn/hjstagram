import React, {useState, useEffect} from "react";
import axios from "axios";
import { withRouter, useHistory } from "react-router-dom";




function Other_Profile_Post(match){

    const [Posts, setPosts] = useState([]);

    const PostsArr = [];
    const [ID, setID] = useState("");

    const saveIDandModal = (id) => {
      setID(id);
      modal_change(true);
    };

    useEffect(() => {

        const {id} = match;

        axios.get(`/api/auth/${id}`)
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

    let [modal , modal_change] = useState(false);

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
    </>
    )
}

export default withRouter(Other_Profile_Post);