import { Route, Routes, Navigate } from 'react-router-dom';
import Main from './components/Main/index';
import Signup from './components/Signup';
import Login from './components/Login';
import DataProvider from './DataProvider';

import ProtectedRoute from './ProtectedRoute.js';

function App() {
  const user = localStorage.getItem("token");
  
  return (
    <DataProvider>
    <Routes>
      <Route path="/" exact element={<ProtectedRoute><Main /></ProtectedRoute>} />
      <Route path="/signup" exact element={<Signup/>}/>
      <Route path="/login" exact element={<Login />} />
        
      {/* <Route path="/" exact element={<Navigate replace to="/login"/>}/> */}
      </Routes>
    </DataProvider>
  );
}

export default App;
