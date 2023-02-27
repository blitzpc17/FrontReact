import React from 'react';
import { BrowserRouter as Router, Routes as Switch, Route } from "react-router-dom";
import { Login } from '../pages/Login';
import { CatalogoCursos } from '../pages/Orozco/CatalogoCursos';
import { RecuperarContra } from '../pages/RecuperarContra';
import { ReestablecerContra } from '../pages/ReestablecerContra';
import { SuperAdmin } from '../pages/SuperAdmin';
import RouteAuth from './RouteAuth';

function Routes() {

  return (
    <div>
      <Router>
          <Switch>
              <Route  path="/" element={<Login/>}/>
              <Route  path="/recuperarcontra" element={<RecuperarContra/>}/>
              <Route  path="/reestablecercontra/:idReset" element={<ReestablecerContra/>}/>

	      <Route  path="/admin" element={<SuperAdmin/>}/>

              <Route  path="/catalogocursos" element={<CatalogoCursos/>}/>

              <Route  path="/plataforma/*" element={<RouteAuth/>}/>

              <Route  path="*" element={<h1>Error 404</h1>}/>
          </Switch>
      </Router>
    </div>
  );
}

export default Routes;
