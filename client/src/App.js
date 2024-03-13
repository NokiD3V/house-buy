import {BrowserRouter, Routes, Route} from 'react-router-dom'
import StartPage from './pages/StartPage/StartPage';
import './pages/_GlobalStyle/style.scss'
import LoginPage from './pages/LoginPage/LoginPage';
import ProfilePage from './pages/Profile/ProfilePage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import RequireAuth from './utilities/RequireAuth/RequireAuth';
import Catalog from './pages/Catalog/Catalog';
import Contact from './pages/Contact/Contact';
import Offer from './pages/Offer/Offer';
import Admin from './pages/Admin/Admin';


function App() {
  // Redirecting user in paths
  // Path 'ADRESS/' gets StartPage (Info page)
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={StartPage}/>
        <Route path='/login' Component={LoginPage}  />
        <Route path='/profile' Component={() => <RequireAuth><ProfilePage/></RequireAuth>}/>
        <Route path='/register' Component={RegisterPage} />
        <Route path='/catalog' Component={Catalog} />
        <Route path='/contact' Component={Contact} />

        <Route path='/offers/:id' Component={Offer} />

        <Route path='/admin' Component={() => <RequireAuth><Admin/></RequireAuth>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;