import './App.css';
import {Routes,Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' exact element={<Home/>} />
        <Route path='/login' exact element={<Login/>} />
      </Routes>
    </>
  );
}

export default App;
