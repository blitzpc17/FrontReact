import React, { useState, useEffect } from 'react';
import MensajesDep from '../../components/Fernando/MensajesDep';
import ModalEnviarMensaje from '../../components/Fernando/ModalEnviarMensaje';
import { DepartamentoServicio } from '../../services/Fernando/DepartamentoServicio';
import swal from 'sweetalert';
import { ServicioMensajes } from '../../services/Fernando/MensajesServicios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const DepsMensajes = () => {  
    const navigate = new useNavigate();
        
    const [departamentos, setDepartamentos] = useState([]);
    
    const [mensajes, setMensajes] = useState([]);
    const idDep = parseInt(cookies.get('id_Departamento'));

    //Servicios
    const departamentoServicio = new DepartamentoServicio();
    const servicioMensajes = new ServicioMensajes();
    //Servicios
    
    const [visible, setVisible] = useState(false);

    useEffect(() => {     
        if(!cookies.get('rolesUsuario').rol_jefe_vinculacion)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Mensajes'){
                departamentoServicio.getAll().then(data => setDepartamentos(data));
                servicioMensajes.getAll().then(data => setMensajes(data));
            }else{
                navigate('/plataforma/menuvinculacion');
            }
        }                   
        
    }, []);
    
    const enviarMensaje=(msj)=>{
        console.log(msj);
        servicioMensajes.save(msj).then(data=>{
        swal({
            title:"!Atencion",
            text:"!Registro guardado correctamente",
            icon:"success",
            button:"Aceptar",
            timer:"3000"
        });         
        setVisible(false);
        servicioMensajes.getAll().then(data => setMensajes(data));
        });
        
    }

    const verModalenvio=()=>{
        setVisible(true);
    }
    const visibleOnHide=()=>{
        setVisible(false)
    }
    
    return (
        <div>
            <ModalEnviarMensaje
                visible={visible}
                modal={true} 
                style={{width: '950px'}}
                enviarMsg={enviarMensaje}
                onHide={visibleOnHide}
                valordep={idDep}
            />
            <MensajesDep
                value={departamentos}          
                ver={verModalenvio}
            />
        </div>
    )
}

export default DepsMensajes
