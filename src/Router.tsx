import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Chat from './pages/chat';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
