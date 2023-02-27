import React, { useState, useEffect, useContext } from 'react';

import { consultaMensajes } from '../../services/Josean/consultaMensaje';
import { EnviadosServicio } from '../../services/Josean/EnviadosServicio';
import { ServicioMensajes } from '../../services/Josean/ServicioMensajes';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import BreadCrumbContext from '../../context/BreadCrumbContext';

import Cookies from 'universal-cookie';

import SeparadorMensajes from '../../components/Josean/SeparadorMensajes';
import MensajesRecividos from '../../components/Josean/MensajesRecividos';
import MensajesEnviados from '../../components/Josean/MensajesEnviados';


const cookies = new Cookies();
const GestionMensajesJA = () => {
  const navigate = new useNavigate();

    const { cambiarBread } = useContext(BreadCrumbContext);

    //Servicios
    const [mensajes, setMensajes] = useState([]);

  
    const MensajesEnv = new EnviadosServicio();

    const [message, setMessage] = useState();
    const GetMessage = new ServicioMensajes();

    //Servicios

    //Variables iniciales
    const depActivo = cookies.get('id_Departamento');
    const nameActivo = cookies.get('nombre_Departamento');    
    const [registro, setRegistro] = useState(3); //Necesita el id del departamento del que quiere ver sus mensajes
    //Variables iniciales

    useEffect(() => {
      if(!cookies.get('rolesUsuario').rol_coordinador_vinculacion)
            navigate('/plataforma/menu');
        else{
          cambiarBread([], 'Gestión Mensajes');
          
          buildSegCompareObj();  
          
        }
        
               
    }, []); // eslint-disable-line react-hooks/exhaustive-deps  

    const buildSegCompareObj = async() =>{
      let regtemp = 8;
      await axios.get("http://localhost:8080/api/v1/departamento/vinculacion" ).then(res => {
        regtemp = res.data.id_Departamento;
        setRegistro(res.data.id_Departamento)
      });
      await MensajesEnv.search(regtemp,depActivo).then(data => {setMensajes(data)});
    }

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
         
                />
              }
            />
        </div>
    );
}

export default GestionMensajesJA
