import React, { useState, useEffect, useRef, useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { RolesServiceQ } from '../../services/Fernando/RolesServiceQ';
import { UsuariosDepService } from '../../services/Fernando/UsuariosDepService';
import { RolesUsuarioService } from '../../services/Fernando/RolesUsuarioService';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import md5 from 'md5';
import { ServicioUsuarios } from '../../services/Fernando/ServicioUsuarios';
import swal from 'sweetalert';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import BreadCrumbContext from '../../context/BreadCrumbContext';
import axios from "axios";

const cookies = new Cookies();

const RolesInicio =()=>{

    const navigate = new useNavigate();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    const [dep, setDep] = useState(0);

    const [value, setValue] = useState([]);
    const rolesq = new RolesServiceQ();

    const [usuario, setUsuario] = useState([]);
    const [opcionesUsuarios, setOpcionesUsuarios] = useState([]);
    const users = new UsuariosDepService();

    
    
    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_vinculacion)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Configuración de Roles'){
               
		axios.get("http://localhost:8080/api/v1/departamento/vinculacion" ).then(res => {
			  	
				setDep(res.data.id_Departamento);
				 rolesq.search().then(data => {setValue(data); 
				users.search(res.data.id_Departamento).then(data => {
						    getUsers(data);
						    setUsuario(data);
					});

		});
						
                });  
                saveService.getAll ().then(data => setGuardar(data));
            }else{
                navigate('/plataforma/menuvinculacion');
            }
        }
        
    }, []); 

    //INPUTTEXT
    const [nomUser, setNomUser] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [user,SetUser] = useState({
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

    const [newRol,SetNewRol] = useState({
        id_rol_usuario: null,
        id_usuarios: null,
        rol_desarrollo_academico_departamental: false,
        rol_docente: false,
        rol_jefe_departamento: false,
        rol_jefe_desarrollo_academico: false,
        rol_jefe_laboratorio: false,
        rol_jefe_oficina_servicio_externos_vinculacion: false,
        rol_jefe_oficina_servicio_social_vinculacion: false,
        rol_jefe_vinculacion: false,
        rol_secretaria_departamento: false,
        rol_secretaria_vinculacion: false,
        rol_jefe_proyectos_docencia: false,
        rol_auxiliar_laboratorio: false
    }); 
    //INPUTTEXT

    //Dialog
    const [displayBasic, setDisplayBasic] = useState(false);

    const dialogFuncMap = {
        'displayBasic': setDisplayBasic,
    }

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    }

    const renderFooter = (name) => {
        return (
            <div>
                <Button label="Guardar" 
                onClick={() => {onHide(name);
                    user.user_Nombre = nomUser;
                    user.user_Correo = email;
		    user.id_Departamento = dep;
                    user.user_Password = md5(password);
                    guardaUsuario(user);
                }} 
                className="p-button-text" />
            </div>
        );
    }
    //Dialog

    
    const getUsers =(usuario) =>{	
        const arreglo=[{
            name:"",code:null
        }];
           
        let per="";                
        var nummes;
        for (var i = 0; i < usuario.length; i++) { 
            per="";    
            per+=usuario[i].user_nombre;
            nummes=usuario[i].id_Usuarios;            
            arreglo.push({name:""+per,code:nummes});
        } 
        arreglo.shift();
        
        setOpcionesUsuarios(arreglo);
    }

    const [guardar, setGuardar] = useState([]);
    const saveService = new RolesUsuarioService();

    const saveUser = new ServicioUsuarios();


    const onCityChange2 = (e, rowData) => {
        cambiarestado(e.value, rowData);
    }

    const showSuccess = () => {
        toast.current.show({severity:'info', summary: '¡Excelente!', detail:'Rol Asignado', life: 3000});
    }

    const guardaUsuario=async(data)=>{
console.log(data);
        await saveUser.save(data).then(data =>{
            newRol.id_usuarios = data.id_Usuarios;
            console.log(newRol);
            saveService.save(newRol).then(data =>{
                rolesq.search().then(data => setValue(data));
            });    

        }); 
        
        swal({
            title:"Registro generado!",
            text:"Consultelo en el boton Ver Usuarios",
            icon:"success",
            button:"Aceptar",
            timer:"3000"
          }); 
        
    }
    

    const toast = useRef(null);
    const cambiarestado = async(e, rowData) =>{
        await saveService.find(rowData.id_rol_usuario).then(data =>{
            const var1 = {
                ...data,
                [rowData.nombre_rol]: 0            
            }

            saveService.save(var1).then();
        });

        await saveService.selectroles(e.code).then(data =>{
            const var2 = {
                ...data,
                [rowData.nombre_rol]: 1            
            }
            saveService.save(var2).then(data2 => {
                rolesq.search().then(data => setValue(data));
                showSuccess();
            });
        });

    }

    const usuarios=(rowData)=>{

        let objeto = {name: rowData.rol_user_nombre,code:rowData.id_usuario};   
        return <Dropdown value={objeto} options={opcionesUsuarios} onChange={(e)=> onCityChange2(e, rowData)} 
        optionLabel="name" placeholder="Selecciona un Usuario" style={{ width: '550px'}}/>;
    }

    const cambiarBreadLocal = () => {
        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/rolesvinculacion' });

        cambiarBread(direccionesTemp, 'Usuarios');

        navigate('/plataforma/usuariosvinculacion');
        
    }

    return(
        <div>
            <Panel>
                <Toast ref={toast} />
                <div className="card">                
                    <center>
                        <div><h1>Asiganción de Roles</h1></div>
                    </center>
                    <div className="p-d-flex p-ai-rigth">
                        <Button label="Crear Usuario" icon="pi pi-user-plus" onClick={()=>{setDisplayBasic(true)}} />            
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;                        
                        <Button label="Ver Usuario" icon="pi pi-user"  onClick={()=>{
                            cambiarBreadLocal();
                        }} />                        
                    </div>
                    <br></br>
                    <DataTable  value={value}  showGridlines>
                        <Column field="rol_nombre" header="Rol" style={{ width: '60%'}}></Column>
                        <Column field="" header="Nombre" body={usuarios}></Column>
                    </DataTable>
                </div>
            </Panel>

            <Dialog header="Nuevo Usuario" visible={displayBasic} style={{ width: '50vw' }} footer={renderFooter('displayBasic')} onHide={() => onHide('displayBasic')}>
                <center>
                    <div>
                        <table>
                            <tbody>
                                <tr>                                    
                                    <td style={{padding: '1rem', paddingRight: '7rem'}}><h4>Nombre de Usuario:</h4></td>
                                    <td>
                                    <span className="p-input-icon-left p-float-label">
                                        <i className="pi pi-user"/>
                                        <InputText id="username" value={nomUser} onChange={(e) => setNomUser(e.target.value)} maxLength="255"/>
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
                                <tr>
                                    <td style={{padding: '1rem', paddingRight: '7rem'}}><h4>Contraseña:</h4></td>
                                    <td>
                                        <Password value={password} onChange={(e) => setPassword(e.target.value)} toggleMask maxLength="255" />
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
export default RolesInicio;
