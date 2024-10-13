import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout.jsx';
import Home from './pages/Home.jsx';
import Explore from './pages/Explore.jsx';
import Notifications from './pages/Notifications.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={<Layout />}
        >
          <Route
            index
            element={<Home />}
          />
          <Route
            path='/explore'
            element={<Explore />}
          />
          <Route
            path='/notifications'
            element={<Notifications />}
          />
          <Route
            path='/profile'
            element={<Profile />}
          />
          <Route
            path='/settings'
            element={<Settings />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
