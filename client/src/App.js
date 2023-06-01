import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import LoginPage from './pages/LoginPage/LoginPage';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import Payment from './pages/Payment/Payment';
import StartContestPage from './pages/StartContestPage/StartContestPage';
import Dashboard from './pages/Dashboard/Dashboard';
import PrivateHoc from './components/PrivateHoc/PrivateHoc';
import NotFound from './components/NotFound/NotFound';
import Home from './pages/Home/Home';
import HowItWorksPage from './pages/HowItWorksPage/HowItWorksPage';
import OnlyNotAuthorizedUserHoc from './components/OnlyNotAuthorizedUserHoc/OnlyNotAuthorizedUserHoc';
import ContestPage from './pages/ContestPage/ContestPage';
import UserProfile from './pages/UserProfile/UserProfile';
import 'react-toastify/dist/ReactToastify.css';
import ContestCreationPage from './pages/ContestCreation/ContestCreationPage';
import CONSTANTS from './constants';
import ChatContainer from './components/Chat/ChatComponents/ChatContainer/ChatContainer';
import Events from './pages/Events/Events';
import ModeratorHoc from './components/ModeratorHoc/ModeratorHoc';
import OffersPage from './pages/OffersPage/OffersPage';
import CustomerOrCreatorHoc from './components/CustomerOrCreatorHoc/CustomerOrCreatorHoc';
import RegistrationModeratorPage from './pages/RegistrationModeratorPage/RegistrationModeratorPage';
import AdminHoc from './components/AdminHoc/AdminHoc';

class App extends Component {
  render () {
    return (
      <Router>
        <ToastContainer
          position='top-center'
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route
            exact
            path='/login'
            component={OnlyNotAuthorizedUserHoc(LoginPage)}
          />
          <Route
            exact
            path='/registration'
            component={OnlyNotAuthorizedUserHoc(RegistrationPage)}
          />
          <Route exact path='/howItWorks' component={HowItWorksPage} />
          <Route exact path='/events' component={PrivateHoc(Events)} />
          <Route
            exact
            path='/offersApprove'
            component={ModeratorHoc(OffersPage)}
          />
          <Route
            exact
            path='/createModerator'
            component={AdminHoc(RegistrationModeratorPage)}
          />
          <Route exact path='/payment' component={PrivateHoc(Payment)} />
          <Route
            exact
            path='/startContest'
            component={CustomerOrCreatorHoc(StartContestPage)}
          />
          <Route
            exact
            path='/startContest/nameContest'
            component={CustomerOrCreatorHoc(ContestCreationPage, {
              contestType: CONSTANTS.NAME_CONTEST,
              title: 'Company Name',
            })}
          />
          <Route
            exact
            path='/startContest/taglineContest'
            component={CustomerOrCreatorHoc(ContestCreationPage, {
              contestType: CONSTANTS.TAGLINE_CONTEST,
              title: 'TAGLINE',
            })}
          />
          <Route
            exact
            path='/startContest/logoContest'
            component={CustomerOrCreatorHoc(ContestCreationPage, {
              contestType: CONSTANTS.LOGO_CONTEST,
              title: 'LOGO',
            })}
          />
          <Route
            exact
            path='/dashboard'
            component={CustomerOrCreatorHoc(Dashboard)}
          />
          <Route
            exact
            path='/contest/:id'
            component={CustomerOrCreatorHoc(ContestPage)}
          />
          <Route exact path='/account' component={PrivateHoc(UserProfile)} />
          <Route component={NotFound} />
        </Switch>
        <ChatContainer />
      </Router>
    );
  }
}

export default App;
