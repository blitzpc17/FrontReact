import React from 'react'

import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from "axios";
import { Password } from 'primereact/password';
import swal from 'sweetalert';
import md5 from 'md5';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';

import { ServicioUsuarios } from '../../services/Josean/ServicioUsuarios';
import { ServicioRolesUsuario } from '../../services/Josean/ServicioRolesUsuario';


const JefeDep = (props) => {

    const [departamentos, setDepartamentos] = useState(null);
    const [depa, setDepa] = useState(null);
    const [visible, setVisible] = useState(false);
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [usuarios, setUsuarios] = useState(null);

    var servicioRoles = new ServicioRolesUsuario();
    var servicioUsuarios = new ServicioUsuarios();


    const [roles2,setRoles2] = useState({
        id_rol_usuario:null,
        id_usuarios:null ,
        rol_desarrollo_academico_departamental:false,
        rol_docente:false,
        rol_jefe_departamento:false,
        rol_jefe_desarrollo_academico:false,
        rol_jefe_laboratorio:false,
        rol_jefe_oficina_servicio_externos_vinculacion:false,
        rol_jefe_oficina_servicio_social_vinculacion:false,
        rol_jefe_vinculacion:false,
        rol_secretaria_departamento:false,
        rol_secretaria_vinculacion:false,
        rol_jefe_proyectos_docencia:false,
        rol_auxiliar_laboratorio:false,
        rol_coordinador_vinculacion:false
    });


    useEffect(() => {
	axios.get("http://localhost:8080/api/v1/consultadepartamento/search").then(res => {
	 setDepartamentos(res.data);

          servicioUsuarios.getAll().then(data => {
            setUsuarios(data);
          });
	});
    }, []);

    const metodoRefresh = () => {
	axios.get("http://localhost:8080/api/v1/consultadepartamento/search").then(res => {
	    setDepartamentos(null);
            setDepartamentos(res.data);
  
            servicioUsuarios.getAll().then(data => {
                setUsuarios(null);
              setUsuarios(data);
            });
	});
    }
 
    const agregarUsuario = () => {

        
        if(nombre ===null || nombre === "" || 
        correo === null || correo === "" ||
        depa === null){
            setVisible(true);
            swal({
                title: "¡Atención!",
                text: "¡Rellena todos los campos!",
                icon: "warning",
                button: "Aceptar",
                timer: "3000"
              });
              
        }
        else{
            
            const usuario = {
                id_Departamento: depa,
                id_Usuarios: null,
                user_Nombre: nombre,
                user_Correo: correo,
                user_Password: password === ""? md5("12345") : md5(password),
                user_tipo_maestro: 6,
                user_horas: 0,
            };

            agregar(usuario);
            
        }
        
    }

    const agregar =  (usuario) => {
        
            servicioUsuarios.checkcorreo(usuario.user_Correo).then((data) =>{

                console.log(data);

                if(data.length !== 0){

                    setVisible(true);

                    swal({
                        title: "¡Atención!",
                        text: "¡Ya existe un usuario con ese correo!",
                        icon: "warning",
                        button: "Aceptar",
                        timer: "3000"
                    });
                    
                }
                else{
                    
                    servicioUsuarios.save(usuario).then(usuario=>{

                        setUsuarios(null); 

                        swal({
                        title: "¡Atención!",
                        text: "¡Se ha agregado al Usuario con Exito!",
                        icon: "success",
                        button: "Aceptar",
                        timer: "3000"
                        });

                     
                        roles2.id_usuarios=usuario.id_Usuarios;
                        console.log(roles2);
                        
                        servicioRoles.save(roles2).then(data => {
                            
                            metodoRefresh();
                        });
                    });
            
                    setRoles2({
                        id_rol_usuario:null,
                        id_usuarios:null ,
                        rol_desarrollo_academico_departamental:false,
                        rol_docente:false,
                        rol_jefe_departamento:false,
                        rol_jefe_desarrollo_academico:false,
                        rol_jefe_laboratorio:false,
                        rol_jefe_oficina_servicio_externos_vinculacion:false,
                        rol_jefe_oficina_servicio_social_vinculacion:false,
                        rol_jefe_vinculacion:false,
                        rol_secretaria_departamento:false,
                        rol_secretaria_vinculacion:false,
                        rol_jefe_proyectos_docencia:false,
                        rol_auxiliar_laboratorio:false,
                        rol_coordinador_vinculacion:false
                    });
                    
                }
            });
        
    }    

    const lista = (rowData) => {
        return(
            <DropDownVisible
                valor={rowData.id_Usuarios}                   
                data={rowData}     
                users={rowData.usuarios}
                servicio={servicioRoles}
                refresh={metodoRefresh}
            />
        )
    }

    const onHide = () => {
        setVisible(false);
    }

    const renderFooter = () => {
        return (
            <div>
                <Button label="Agregar" icon="pi pi-user-plus"  iconPos="left"  onClick={() => { onHide(); agregarUsuario() }} />
            </div>
        );
    } 

    const onDepaChange = (e) => {
        setDepa(e.value);
    }

    return (
        <div>
	<Dialog visible={props.visible} header="Gestión Jefes de Departamento" onHide={props.onHide}>
	<div style={{ display: "flex"}}>
                <Button onClick={()=>{setVisible(true) ; console.log(departamentos) ;setNombre("") ; setCorreo("") ; setPassword("") ; setDepa(null)}}
                style={{ marginLeft: "auto" , marginBottom:"1em", backgroundColor:"red", borderColor:"red"}} label="Agregar Usuario" icon="pi pi-user-plus" iconPos="left" />
            </div>

            <DataTable value={departamentos}  scrollHeight="480px"  responsiveLayout="scroll">
                <Column header="#" field='id_Departamento'  exportable={false} ></Column>
                <Column header="Departamento" field='dep_nombre'  exportable={false} ></Column>
                <Column header="Jefe de Departamento" body={lista} exportable={false} ></Column>
            </DataTable>

            <Dialog visible={visible} onHide={() => {onHide()}} header="Agregar Usuario" footer={renderFooter}>
                <br/>              
                <br/>
                <span className="p-float-label">
                <InputText id="nombre" value={nombre} style={{ width:"20vw" }} onChange={(e) => setNombre(e.target.value)} />
                <label htmlFor="nombre">Nombre</label>
                </span>
                <br/>
                <br/>
                <span className="p-float-label">
                    <InputText id="correo" value={correo} style={{ width:"20vw" }}  onChange={(e) => setCorreo(e.target.value)}/>
                    <label htmlFor="correo">Correo</label>
                </span>
                <br/>
                <br/>
                <span className="p-float-label">
                    <Password type="password" id="password" value={password} style={{ width: "14rem" }}  onChange={(e) => setPassword(e.target.value)} toggleMask feedback={false}/>
                    <label htmlFor="password">Contraseña</label>
                </span>
                <br/>
                <br/>
                <span className="p-float-label">
                    <Dropdown value={depa} options={departamentos} onChange={onDepaChange} style={{ width:"20vw" }} optionLabel="dep_nombre" optionValue='id_Departamento'/>
                    <label htmlFor="depa">Departamento</label>
                </span>
            </Dialog>
	</Dialog>
            
        </div>
    )
}

export default JefeDep;


function DropDownVisible (props){
    const [estado, setEstado] = useState(props.valor);
    const [users, setUsers] = useState(props.users);


    const cambiar = (value) =>{

        if(props.data.id_Usuarios !== 0){

            props.servicio.setjefefalse(props.data.id_Usuarios).then(data => {

                props.servicio.selectroles(value).then(data => {
                    data.rol_jefe_departamento = true;
        
                    props.servicio.save(data).then(data =>{
                        setEstado(value);
        
                        swal({
                            title: "¡Atención!",
                            text: "¡Se ha cambiado al Jefe de Departamento con exito!",
                            icon: "success",
                            button: "Aceptar",
                            timer: "3000"
                            });
        
                            props.refresh();
                    })
                })

            })
        }
        else{

            props.servicio.selectroles(value).then(data => {
                data.rol_jefe_departamento = true;
    
                props.servicio.save(data).then(data =>{
                    setEstado(value);
    
                    swal({
                        title: "¡Atención!",
                        text: "¡Se ha cambiado al Jefe de Departamento con exito!",
                        icon: "success",
                        button: "Aceptar",
                        timer: "3000"
                        });
    
                        props.refresh();
                })
            })
        }        
    }


    if(props.data.user_nombre !== "N/A"){   
        return (
            //<React.Fragment> Fragmento simplificado abajo
            <>
            <Dropdown value={estado} optionValue='id_Usuarios' options={users} onChange={(e) => {cambiar(e.target.value)}} optionLabel="user_Nombre" placeholder="Sin Jefe Asignado" style={{width:"20vw" , backgroundColor:"var(--green-500)"}}/>
            </>
            //</React.Fragment>
            );  
    }
    else{
        return (
            //<React.Fragment> Fragmento simplificado abajo
            <>
            <Dropdown value={estado} optionValue='id_Usuarios' options={users} onChange={(e) => {cambiar(e.target.value)}} optionLabel="user_Nombre" placeholder="Sin Jefe Asignado" style={{width:"20vw" }}/>
            </>
            //</React.Fragment>
            );  
    }

} 
