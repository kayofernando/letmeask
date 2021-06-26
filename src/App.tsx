
//import { createContext, useState, useEffect } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
//import { auth, firebase } from './services/firebase';

import { AuthContextProvider } from './contexts/AuthContext'
import { Room } from './pages/Room';
import { AdminRoom } from './pages/AdminRoom';

//import { Home } from "./pages/Home";
function App() {

  return (

    <BrowserRouter>

      <AuthContextProvider>
        <switch>

          <Route path="/" exact component={Home} />
          <Route path="/rooms/new" component={NewRoom} />
          <Route path="/rooms/:id" component={Room} />
          <Route path="/admin/rooms/:id" component={AdminRoom} />

        </switch>


      </AuthContextProvider>


    </BrowserRouter>
    //<Home />
    //<NewRoom />




  );
}

export default App;
