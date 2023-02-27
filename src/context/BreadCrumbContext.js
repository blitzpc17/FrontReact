import { createContext, useState, useEffect } from "react";
import React, { Component }  from 'react';
import Cookies from 'universal-cookie';

const BreadCrumbContext = createContext();

const cookies = new Cookies();

const BreadCrumbProvider = ({children}) => {

    const [direcciones, setDirecciones] = useState([]);
    const [actual, setActual] = useState('na');
    const [readonly, setReadonly] = useState(true);

    useEffect(() => {
        setDirecciones(cookies.get('direccionesTemp'));
        setActual(cookies.get('actualTemp'));
    }, []);

    const cambiarBread = (direccionesB, actualB) =>{
        setDirecciones(direccionesB);
        setActual(actualB);
        cookies.set('actualTemp', actualB, {path: "/"});
        cookies.set('direccionesTemp', direccionesB, {path: "/"});
    }

    const data = { direcciones, actual, cambiarBread, readonly, setReadonly };

    return (
        <BreadCrumbContext.Provider value={data}>{children}</BreadCrumbContext.Provider>
    )
}

export { BreadCrumbProvider };
export default BreadCrumbContext;