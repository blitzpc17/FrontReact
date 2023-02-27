import React, { useState, useEffect } from 'react';

import { consultaMensajes } from '../../services/Fernando/consultaMensaje';
import { EnviadosServicio } from '../../services/Fernando/EnviadosServicio';
import { ServicioMensajes } from '../../services/Fernando/MensajesServicios';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';

import SeparadorMensajes from '../../components/Fernando/SeparadorMensajes';

import MensajesEnviados from '../../components/Fernando/MensajesEnviados';
import MensajesRecividos from '../../components/Fernando/MensajesRecividos';


const cookies = new Cookies();
const GestionMensajes = () => {

  const navigate = new useNavigate();

    //Servicios
    const [mensajes, setMensajes] = useState([]);

    const [enviados,setEnviados] = useState([]);
    const MensajesEnv = new EnviadosServicio();

    const [message, setMessage] = useState();
    const GetMessage = new ServicioMensajes();

    const {iddep, nombredep} = new useParams();

    //Servicios

    //Variables iniciales
    const depActivo = parseInt(cookies.get('id_Departamento'));
    const nameActivo = nombredep;    
    const registro = parseInt(iddep); //Necesita el id del departamento del que quiere ver sus mensajes
    //Variables iniciales

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_vinculacion)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Gestión Mensajes'){
              //MensajesM.search(registro).then(data => setMensajes(data));  
              MensajesEnv.search(depActivo,registro).then(data => setEnviados(data));  
              MensajesEnv.search(registro,depActivo).then(data => setMensajes(data)); 
            }else{
                navigate('/plataforma/menuvinculacion');
            }
        }

    }, []); // eslint-disable-line react-hooks/exhaustive-deps  

    const columnasMensajes = [
        {field: "men_fecha_envio", header: "Fecha"},
        {field: "men_asunto", header: "Asunto"},
        {field: "informacion", header: "Información"},      
        {field: "detalles", header: "Detalles"},      
        {field: "visto", header: "Visto"}
    ]; 

    const guardarRespuesta=(data)=>{
        GetMessage.save(data).then( data => {
            
            GetMessage.getAll().then(data => setMessage(data));
        });  
    }

    

    const cambioVisto=(data)=>{
        GetMessage.save(data).then( data => {
            GetMessage.getAll().then(data => setMessage(data));
          });
    }
    return (
        <div>                                    
            <SeparadorMensajes
              titulo={nameActivo}
              recibidos={
                <MensajesRecividos
                  columnas={columnasMensajes}         
                  value={mensajes}      
                  metodoRespuesta={guardarRespuesta} 
                  actualizar={cambioVisto}
                  departamento={registro}   
                />
              }
              enviados={
                <MensajesEnviados
                  value={enviados}
                />
              }
            />
        </div>
    )
}

export default GestionMensajes