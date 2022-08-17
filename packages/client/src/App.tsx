import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SessionProvider } from './contexts/session-context';
import { Error404 } from './pages/404/404';
import { AdminEditGamePage } from './pages/admin-edit-game-page/admin-edit-game-page';
import { AdminPage } from './pages/admin-page/admin-page';
import { GamePage } from './pages/game-page/game-page';
import { HomePage } from './pages/home-page/home-page';
import { LoginPage } from './pages/login-page/login-page';
import { UserPage } from './pages/user-page/user-page';
import AdminRoute from './routes/admin-route';
import PrivateRoute from './routes/private-route';
import PublicRoute from './routes/public-route';

function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
          <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/game/:id' element={<GamePage />} />

              <Route path='/user' element={<PrivateRoute resolve={<UserPage />} redirect='/login' />} />
              <Route path='/login' element={<PublicRoute resolve={<LoginPage action='login' />} redirect='/user' />} />
              <Route path='/signup' element={<PublicRoute resolve={<LoginPage action='signup' />} redirect='/user' />} />

              <Route path='/admin' element={<AdminRoute resolve={<AdminPage />} redirect='/404' />} />
              <Route path='/admin/game/:id' element={<AdminRoute resolve={<AdminEditGamePage />} redirect='/404' />} />
              
              <Route path='404' element={<Error404 />} />
              <Route path='*' element={<Navigate to='/404' />} />
          </Routes>
      </BrowserRouter>
    </SessionProvider>
  );
}

export default App;
