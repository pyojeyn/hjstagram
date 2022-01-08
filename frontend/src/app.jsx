import React from 'react';
import './app.scss';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginPage from './pages/loginPage';
import SignUpPage from './pages/signupPage';
import SendEmailPage from './pages/sendemailPage';
import AuthPage from './pages/authPage';
import MainPage from './pages/mainPage';
import ProfilePage from './pages/profilePage';
import EditProfilePage from './pages/editprofilePage';
import ChangePasswordPage from './pages/changepasswordPage';
import MainEditFile from './pages/mainEditFile';
import Profile_changePage from './pages/profile_changePage';
import RecoverPassword from './components/auth/RecoverPassword';
import UpdatePassword from './components/auth/UpdatePassword';
import Other_Profile from './components/profile/other_profile';
import Other_Profile_Post from './components/profile/other_profile_post';
import NamHeader from './components/common/namheader';

function App() {
  return (
  <Router>
    <div className="App">
          <Switch>
            {/* [ ] 배열처리는 /@username 이나 / 으로 url입력했을때 둘중 하나로 해도 보이도록 하는것 */}
            <Route path={['/login', '/']} component={LoginPage} exact />
            <Route path="/signup" component={SignUpPage} />
            <Route path="/sendemail" component={SendEmailPage} />
            <Route path="/auth" component={AuthPage} />
            <Route path="/main" component={MainPage} />
            <Route path="/profiles" component={ProfilePage} />
            <Route path="/editprofile" component={EditProfilePage} />
            <Route path="/changepassword" component={ChangePasswordPage} />
            <Route path="/main_edit_file" component={MainEditFile} />
            <Route path="/profile_change" component={Profile_changePage}/>
            <Route path="/recover_password" component={RecoverPassword} />

            <Route
                path="/update-password/:userId/:token"
                render={({ match }) => (
                  <UpdatePassword userId={match.params.userId} token={match.params.token} />
                )}
              />
            <Route
              path="/namprofiles/:id"
              render={({ match }) => (
                <>
                <NamHeader/>
                <Other_Profile id={match.params.id}/>
                <Other_Profile_Post id={match.params.id}/>
                </>
              )}
            />
          </Switch>
        </div>
    </Router>
  );
}

export default App;