import React, { useState, useEffect } from 'react';
import { InfoCurso } from '../../services/Fernando/InfoServicioCurso';
import { ServicioPeriodos } from '../../services/Fernando/ServicioPeriodos';
import swal from 'sweetalert';
import { DatosCursoService } from '../../services/Fernando/DatosCursoService';
import { ServicioICursos } from '../../services/Fernando/ServicioICursos';
import IntanciasCatalogo from '../../components/Fernando/IntanciasCatalogo';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const IntanciasGestionCatalogo = () => {    
    const navigate = new useNavigate();

    //Necesita id del curso del registro
    const { idCurso } = new useParams();
     
    //Servicios
    const [periodo, setPeriodo] = useState([]);
    const ServicioPer = new ServicioPeriodos();

    const [instanciaI, setIntanciaI] = useState([]);
    const ServicioInst = new InfoCurso();

    const [guardar, setGuardar] = useState([]);
    const saveDatos = new ServicioICursos();


    //DATOS DEL CURSO
    const [curso, setCurso] = useState([]);
    const ServCurso = new DatosCursoService();
    //Servicios

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_oficina_servicio_externos_vinculacion)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Instancias Cursos'){
                ServicioPer.getAll().then(data => setPeriodo(data));
                ServicioInst.search(idCurso).then(data => setIntanciaI(data));

                //DATOS DEL CURSO
                ServCurso.search(idCurso).then(data => setCurso(data));
            }
            else
                navigate('/plataforma/serviciosexternos');
        }
        
    }, []);

    const crearInstancia=(data)=>{
        saveDatos.save(data).then(data => {
            
            ServicioInst.search(idCurso).then(data => setIntanciaI(data));
            swal({
              title: "¡Atención!",
              text: "¡Registro Guardado!",
              icon: "success",
              button: "Aceptar",
              timer: "3000"
            });
          })
    }

    

    return (
        <div>
            <IntanciasCatalogo
                idCurso={idCurso}
                periodo={periodo}
                crear={crearInstancia}
                value={instanciaI}
                z={curso}
            />            
        </div>
    )
}

export default IntanciasGestionCatalogo
