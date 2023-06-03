import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import OnlyNotAuthorizedUserHoc from './components/Hoc/OnlyNotAuthorizedUserHoc/OnlyNotAuthorizedUserHoc';
import ModeratorHoc from './components/Hoc/ModeratorHoc/ModeratorHoc';
import PrivateHoc from './components/Hoc/PrivateHoc/PrivateHoc';
import CustomerOrCreatorHoc from './components/Hoc/CustomerOrCreatorHoc/CustomerOrCreatorHoc';
import RegistrationModeratorPage from './pages/RegistrationModeratorPage/RegistrationModeratorPage';
import AdminHoc from './components/Hoc/AdminHoc/AdminHoc';
import CustomerHoc from './components/Hoc/CustomerHoc/CustomerHoc';
import LoginPage from './pages/LoginPage/LoginPage';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import Payment from './pages/Payment/Payment';
import StartContestPage from './pages/StartContestPage/StartContestPage';
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Home/Home';
import HowItWorksPage from './pages/HowItWorksPage/HowItWorksPage';
import ContestCreationPage from './pages/ContestCreation/ContestCreationPage';
import ContestPage from './pages/ContestPage/ContestPage';
import UserProfile from './pages/UserProfile/UserProfile';
import Events from './pages/Events/Events';
import OffersPage from './pages/OffersPage/OffersPage';
import NotFound from './components/NotFound/NotFound';
import ChatContainer from './components/Chat/ChatComponents/ChatContainer/ChatContainer';
import CONSTANTS from './constants';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

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
            component={CustomerHoc(StartContestPage)}
          />
          <Route
            exact
            path='/startContest/nameContest'
            component={CustomerHoc(ContestCreationPage, {
              contestType: CONSTANTS.NAME_CONTEST,
              title: 'Company Name',
            })}
          />
          <Route
            exact
            path='/startContest/taglineContest'
            component={CustomerHoc(ContestCreationPage, {
              contestType: CONSTANTS.TAGLINE_CONTEST,
              title: 'TAGLINE',
            })}
          />
          <Route
            exact
            path='/startContest/logoContest'
            component={CustomerHoc(ContestCreationPage, {
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
