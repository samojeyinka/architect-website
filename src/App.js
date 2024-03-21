import './App.css';
import {Routes,Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Articles from './pages/Articles';
import Services from './pages/Services';
import About from './pages/About';
import Portfolio from './pages/Portfolio';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' exact element={<Home/>} />
        <Route path='/login' exact element={<Login/>} />
        <Route path='/sign-up' exact element={<SignUp/>} />
        <Route path='/articles' exact element={<Articles/>} />
        <Route path='/services' exact element={<Services/>} />
        <Route path='/about-us' exact element={<About/>} />
        <Route path='/portfolio' exact element={<Portfolio/>} />
      </Routes>
    </>
  );
}

export default App;
