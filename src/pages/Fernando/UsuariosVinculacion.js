import React, { useState, useEffect } from 'react';
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { UsuariosDepService } from '../../services/Fernando/UsuariosDepService';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dialog } from 'primereact/dialog';
import { ServicioUsuarios } from '../../services/Fernando/ServicioUsuarios';
import swal from 'sweetalert';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const cookies = new Cookies();

const UsuariosVinculacionGestion=()=>{
    const navigate = new useNavigate();

    const [value, setValue] = useState([]);
    const usuariosq = new UsuariosDepService();
    const [dep, setDep] = useState(0);


    //Dialog
    const [nomUser, setNomUser] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayBasic, setDisplayBasic] = useState(false);
    const [position, setPosition] = useState('center');

    const [cambioUser,setCambioUser] = useState({
        id_Usuarios: null,
        id_Departamento: dep,
        user_Nombre: null,
        user_Correo: null,
        user_Password: null,
        creado_por: null,
        fecha_creacion: null,
        actualizado_por: null,
        fecha_actualizacion: null
    }); 

    const dialogFuncMap = {
        'displayBasic': setDisplayBasic,
    }

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
        cambioUser.id_Usuarios = null;
        setNomUser('');
        setEmail('');
        cambioUser.user_Password = null;
    }

    const renderFooter = (name) => {
        return (
            <div>
                <Button label="Guardar"                
                className="p-button-text" 
                onClick={() => {  
                    cambioUser.user_Nombre = nomUser;
                    cambioUser.user_Correo = email;
                    cambioUser.user_Password = password;
		    cambioUser.id_Departamento = dep;
                    guardaUsuario(cambioUser);                                                          
                    onHide(name);
                }}/>
            </div>
        );
    }
    //Dialog
    const saveUser = new ServicioUsuarios();
    const guardaUsuario=(data)=>{
        saveUser.save(data).then(data =>{
            usuariosq.search(dep).then(data => setValue(data));
        }); 
        
        swal({
            title:"Registro generado!",
            text:"Consultelo en el boton Ver Usuarios",
            icon:"success",
            button:"Aceptar",
            timer:"3000"
          }); 
        
    }
    const eliminarUusario=(data)=>{
        saveUser.delete(data).then(data =>{
            usuariosq.search(dep).then(data => setValue(data));
        }); 
        
        swal({
            title:"Registro Eliminado!",
            text:"Consultelo en el boton Ver Usuarios",
            icon:"success",
            button:"Aceptar",
            timer:"3000"
          }); 
        
    }
    const modificar=(rowData)=>{
        return(
            <Button icon="pi pi-sort-alt" className="p-button-rounded p-button-success" 
            onClick={()=>{
                cambioUser.id_Usuarios = rowData.id_Usuarios;
                setNomUser(rowData.user_nombre);
                setEmail(rowData.user_correo);        
                setPassword(rowData.user_password);
                setDisplayBasic(true)}}
            />
        )
    }
    const eliminar=(rowData)=>{
        return(
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" 
            onClick={()=>{
                eliminarUusario(rowData.id_Usuarios);
            }}
            />
        )        
    }

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_vinculacion)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Usuarios'){
                
		axios.get("http://localhost:8080/api/v1/departamento/vinculacion" ).then(res => {
			  	
				setDep(res.data.id_Departamento);
				usuariosq.search(res.data.id_Departamento).then(data => {setValue(data);
		});
});
            }else{
                navigate('/plataforma/menuvinculacion');
            }
        }
        
    }, []); 
    return(
        <div>
            <center>
                <h1>Gestión de Usuarios</h1>
            </center>
            <Panel>
                <DataTable value={value} responsiveLayout="scroll"  >
                    <Column field="user_nombre" header="Nombre"></Column>
                    <Column field="user_correo" header="Correo"></Column>
                    <Column header="Editar" body={modificar}></Column>
                    <Column header="Eliminar" body={eliminar}></Column>
                </DataTable>
            </Panel>

            <Dialog header="Modificar Usuario" visible={displayBasic} style={{ width: '40vw' }}  footer={renderFooter('displayBasic')} onHide={() => onHide('displayBasic')}>
                <center>
                    <div>
                        <table>
                            <tbody>
                                <tr>                                    
                                    <td style={{padding: '1rem', paddingRight: '7rem'}}><h4>Nombre de Usuario:</h4></td>
                                    <td>
                                    <span className="p-input-icon-left p-float-label">
                                        <i className="pi pi-user"/>
                                        <InputText id="username" value={nomUser} onChange={(e) => setNomUser(e.target.value)} maxLength="255" />
                                        <label htmlFor="username">Nombre del Usuario</label>
                                    </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{padding: '1rem', paddingRight: '7rem'}}><h4>Correo:</h4></td>
                                    <td>
                                    <span className="p-input-icon-left p-float-label">
                                        <i className="pi pi-at"/>
                                        <InputText id="correo" value={email} onChange={(e) => setEmail(e.target.value)} maxLength="255"/>
                                        <label htmlFor="correo">correo@ejemplo.com</label>
                                    </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </center>
            </Dialog>
        </div>
    )
}

export default UsuariosVinculacionGestion;
