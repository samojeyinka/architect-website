import './App.css';
import {Routes,Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' exact element={<Home/>} />
        <Route path='/login' exact element={<Login/>} />
        <Route path='/sign-up' exact element={<SignUp/>} />


      </Routes>
    </>
  );
}

export default App;
