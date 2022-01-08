import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { Container, Nav } from 'react-bootstrap';
import Modal_main_profile from "../main/modal_main_profile";
import axios from "axios";


function Header() {
    // 각 modal마다 다르게 state를 설정해줘야 한다 
    let [modal , modal_change] = useState(false);
    let [modal_heart , modal_change_herat] = useState(false);

    let [Profile,setProfile ] = useState("img/default_profile.png");

    const closeModal = () => {
      modal_change(false);
    }

    const closeModal_herat = () => {
      modal_change_herat(false);
    }


        useEffect(() => {
        axios.get('/api/auth/check')
        .then(response =>  {

            setProfile(response.data.profileurl)
        }
    )}, []);






    const main_profileImage = <div className="main_profileImage_box">
        <img className="main_profileImage" src={Profile}/></div>


    return(
        <>
    <header  className="navber"> 
  <Container>
    <div className="navber_Container">
    <div className="NavbarBrand">
        <Link to="/main"><img className="main-instagram-logo" src="img/instagramlogo.png"/></Link>
    </div>
    <div aria-controls="navbarScroll" />
    <div id="navbarScroll">
      <Nav
        className="me-auto my-2 my-lg-0"
        style={{ maxHeight: '80' }}   
        navbarScroll
      >

      
        <div className="navlink_div">
        <Nav.Link>
            <Link to="/main"><img className="header_home" src="img/header_home.png"/></Link>
        </Nav.Link>

        <Nav.Link>
        <Link to="/main_edit_file"><img className="header_edit" src="img/header_edit.png"/></Link>
        </Nav.Link>

        <div className="navbarScrollingDropdown" onClick={()=>{modal_change(true)}}>{main_profileImage} 
        </div>
        </div>
  
      </Nav>
    
    </div>
    </div>
  </Container>

</header>

{
  modal === true
  ? <Modal_main_profile closeModal={closeModal}/>
  : null
}



</>
    );
}

export default Header;