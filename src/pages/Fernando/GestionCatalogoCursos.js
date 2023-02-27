import React, { useState, useEffect, useContext } from 'react';
import GestionCatalogo from '../../components/Fernando/GestionCatalogo';
import { CursoUsuarioServicio } from '../../services/Fernando/CursosUsuarioServicio';
import { ServicioCursos } from '../../services/Fernando/ServicioCursos';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const GestionCatalogoCursos = () => {
    const navigate = new useNavigate();

    //Servicios
    const [cursoU, setCursoU] = useState([]);
    const CursosU = new CursoUsuarioServicio();
    var data;

    const [curso, setCurso] = useState([]);
    const Cursos = new ServicioCursos();
    //Servicios

    //Variables
    const {depName, idActiv} = new useParams();

    //Variables

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_oficina_servicio_externos_vinculacion)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Gestión Cursos')
                CursosU.search(idActiv).then(data => setCursoU(data));
            else
                navigate('/plataforma/serviciosexternos');
        }
        
    }, []);

    const visibilidadCurso=(data)=>{
        Cursos.save(data).then(data => {
            Cursos.getAll().then(data => setCurso(data));
          })
    }

    return (
        <div>
            <GestionCatalogo
                value={cursoU}          
                visibilidad={visibilidadCurso}
                departamento = {depName}
                selectionMode="single" 
                selection={data}
                idActiv = {idActiv}
                onSelectionChange={e => this.setState({ selectedCursoU: e.value })} 
            />
        </div>
    )
}

export default GestionCatalogoCursos
