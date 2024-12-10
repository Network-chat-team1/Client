import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DoctorMain from './doctor/DoctorMain';
import PatientMain from './patient/PatientMain';
import Login from './common/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* 의사 페이지 라우팅 */}
        <Route path="/doctor/*" element={<DoctorMain />} />
        {/* 환자 페이지 라우팅 */}
        <Route path="/patient/*" element={<PatientMain />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
