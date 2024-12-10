import { Routes, Route } from 'react-router-dom';
// import Login from '../common/Login';
import Home from './pages/Home';
import NoticeChat from './pages/NoticeChat';
import SuggestionChat from './pages/SuggestionChat';

function PatientMain() {
  return (
    <div>
      <Routes>
        {/* <Route path="login" element={<Login />} />  */}
        <Route path="home" element={<Home />} /> 
        <Route path="notice-chat" element={<NoticeChat />} /> 
        <Route path="suggestion-chat" element={<SuggestionChat />} />
      </Routes>
    </div>
  );
}

export default PatientMain;

