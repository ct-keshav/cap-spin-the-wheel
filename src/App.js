import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Form from './Pages/Form';
import Game from './Pages/Game';
import Notfound from './Pages/NotFound';


const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/play/*" element={<Game />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </>
  )
}

export default App;