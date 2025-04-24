import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Chat from './pages/Chat';
import NotFound from './pages/404';
import MainLayout from './layout/MainLayout/MainLayout';

export default function Router() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path='' element={<Home />} />
        <Route path='login'>
          <Route path='' element={<Login />} />
        </Route>
        <Route path='chat'>
          <Route path='' element={<Chat />} />
        </Route>

        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
}
