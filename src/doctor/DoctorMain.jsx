import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChatScreen from './pages/ChatScreen';
import PatientChart from './pages/PatientChart';

function DoctorMain() {
  return (
    <div>
      <Routes>
        <Route path="home" element={<Home />} /> 
        <Route path="chat" element={<ChatScreen />} /> 
        <Route path="chart" element={<PatientChart />} />
      </Routes>
    </div>
  );
}

export default DoctorMain;
