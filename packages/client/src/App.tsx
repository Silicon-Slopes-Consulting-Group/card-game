import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdminEditGamePage } from './pages/admin-edit-game-page/admin-edit-game-page';
import { AdminPage } from './pages/admin-page/admin-page';
import { GamePage } from './pages/game-page/game-page';
import { HomePage } from './pages/home-page/home-page';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/game/:id' element={<GamePage />} />
            <Route path='/admin' element={<AdminPage />} />
            <Route path='/admin/game/:id' element={<AdminEditGamePage />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
