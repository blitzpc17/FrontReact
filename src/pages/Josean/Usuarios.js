import React from 'react'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { useState } from 'react';
import { useEffect } from 'react';

import { Password } from 'primereact/password';
import swal from 'sweetalert';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import md5 from 'md5';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';

import { ServicioUsuarios } from '../../services/Josean/ServicioUsuarios';
import { ServicioRolesUsuario } from '../../services/Josean/ServicioRolesUsuario';
import { ServicioConsultaUsuarios } from '../../services/Josean/ServicioConsultaUsuarios';
import { useNavigate } from 'react-router-dom';

import Cookies from 'universal-cookie/es6';

const cookies = new Cookies();

const Usuarios = () => {

    const navigate = new useNavigate();

    const cookiedep=cookies.get('id_Departamento');

    const [nombre, setNombre] = useState("")
    const [correo, setCorreo] = useState("")
    const [password, setPassword] = useState("")
    const [contraant, setContraant] = useState(null);
    const [visible, setVisible] = useState(false)
    const [roles, setRoles] = useState([]);
    const [usuarios, setUsuarios] = useState();
    const [idUsuario, setIdusuario] = useState(null);
    const [estado, setEstado] = useState(false);
    const [tipom, setTipom] = useState(null);
    const [horas, setHoras] = useState(null);
    const [disabled, setDisabled] = useState(false);

    var servicioUsuarios = new ServicioUsuarios();
    var servicioRoles = new ServicioRolesUsuario();
    var servicioconsUsuarios= new ServicioConsultaUsuarios();
   
    const tipomoption = [
        {name:"Profesor de Tiempo Completo", code: 1},
        {name:"Profesor de 3/4", code: 2},
        {name:"Profesor de Medio Tiempo", code: 3},
        {name:"Profesor de Tiempo Parcial", code: 4},
        {name:"Profesor de Honorarios", code: 5},
        {name:"Otros", code: 6},
    ]

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
        if(!cookies.get('rolesUsuario').rol_jefe_departamento)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Usuarios'){
                servicioconsUsuarios.search(cookiedep).then(data =>{
                    setRoles3(data);
                    setUsuarios(data);
                });
            }
            else
                navigate('/plataforma/menudepartamental');
        }
        
    },[]);
    

    const onRolChange = (e) => {
        let selectedRoles = [...roles];
        
        selectedRoles.push(e.value);
            setRoles2({...roles2,
                [e.value]: e.checked
            });


        setRoles(selectedRoles);
    }


    const onHide = () => {
        setVisible(false);
    }

    const botonModificar = (rowData) => {


        return (
            //<React.Fragment> Fragmento simplificado abajo
            <>
          
                <Button icon="pi pi-pencil " className="p-button-rounded p-button-success" onClick={()=> {setVisible(true) ;console.log(rowData)
                ; setNombre(rowData.user_Nombre);  setEstado(true) ; setContraant(rowData.user_Password); setCorreo(rowData.user_Correo) ; setPassword('') ; setRoles2(rowData) ; setIdusuario(rowData.id_Usuarios)  ; setTipom(rowData.user_tipo_maestro) ; 
                (rowData.user_tipo_maestro) === 1 || (rowData.user_tipo_maestro) === 2 || (rowData.user_tipo_maestro) === 3? setDisabled(true) : setDisabled(false) ;
                (rowData.user_tipo_maestro) === 1 ? setHoras(40) : (rowData.user_tipo_maestro) === 2? setHoras(30) : (rowData.user_tipo_maestro) === 3? setHoras(20) : setHoras(rowData.user_horas)}} />
                
            </>
            //</React.Fragment>
        );
    }

    const botonEliminar = (rowData) => {
        
        return (
            //<React.Fragment> Fragmento simplificado abajo
            <>
               
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => {eliminar(rowData)}} />
               
                
            </>
            //</React.Fragment>
        );
    }

    const agregarUsuario = () => {

        if(nombre ===null || nombre === "" || 
        correo === null || correo === "" ||
        tipom === null || horas === null){

            swal({
                title: "¡Atención!",
                text: "¡Rellena todos los campos!",
                icon: "warning",
                button: "Aceptar",
                timer: "3000"
              });
              setVisible(true);
        }
        else{

            const usuario = {
                id_Departamento:cookiedep,
                id_Usuarios: idUsuario,
                user_Nombre:nombre,
                user_Correo:correo,
                user_Password: contraant !== null && password === ""? contraant : (password !== ""? md5(password) :  md5("12345")),
                user_tipo_maestro: tipom,
                user_horas: horas,
            };

            agregar(usuario,estado);
            
          }
        }

    const agregar = (usuario,estado) => {
        if(estado){

            servicioUsuarios.checkcorreo(correo).then((data) =>{
                console.log("Desde modificar");
                console.log(data);
                if(usuario.id_Usuarios === data.id_Usuarios){
        
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
                            
                            servicioconsUsuarios.search(cookiedep).then(data =>{
                                setRoles3(data);
                                setUsuarios(data);
                            });
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
                else{
                
                    if(data.id_Usuarios !== undefined){
                        swal({
                            title: "¡Atención!",
                            text: "¡Ya existe un usuario con ese correo!",
                            icon: "warning",
                            button: "Aceptar",
                            timer: "3000"
                        });

                        setVisible(true);
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
                                
                                servicioconsUsuarios.search(cookiedep).then(data =>{
                                    setRoles3(data);
                                    setUsuarios(data);
                                });
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
                
                }
        })
        }
        else{
            servicioUsuarios.checkcorreo(usuario.user_Correo).then((data) =>{
                console.log("Desde nuevo");
                console.log(data);
                if(data.length !== 0){
                    swal({
                        title: "¡Atención!",
                        text: "¡Ya existe un usuario con ese correo!",
                        icon: "warning",
                        button: "Aceptar",
                        timer: "3000"
                    });

                    setVisible(true);
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
                            
                            servicioconsUsuarios.search(cookiedep).then(data =>{
                                setRoles3(data);
                                setUsuarios(data);
                            });
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
    }
    

    const eliminar = (data) => {
        
    swal({
        title: "¿Deseas Eliminar al Usuario?",
        text: "¡Los cambios no se podrán recuperar!",
        icon: "warning",
        buttons: ["Cancelar","Aceptar"],
        dangerMode: true
      }).then((OK) => {
  
        if(OK){
  
          servicioUsuarios.delete(data.id_Usuarios).then(data=>{
         
              swal({
                title: "¡Atención!",
                text: "¡Se ha Eliminado al Usuario!",
                icon: "success",
                button: "Aceptar",
                timer: "3000"
              });
            

              servicioconsUsuarios.search(cookiedep).then(data =>{
                setRoles3(data);
                setUsuarios(data);
            });
     
  
            
          });
          
        }else{
          swal({
            title: "¡Atención!",
            text: "¡No se ha Eliminado al Usuario!",
            icon: "info",
            button: "Aceptar",
            timer: "3000"
          });
        }
  
      });
    }

    const [roles3, setRoles3] = useState([{
        id_rol_usuario:null,
        id_usuarios:null ,
        rol_desarrollo_academico_departamental:null,
        rol_docente:null,
        rol_jefe_departamento:null,
        rol_jefe_desarrollo_academico:null,
        rol_jefe_laboratorio:null,
        rol_jefe_oficina_servicio_externos_vinculacion:null,
        rol_jefe_oficina_servicio_social_vinculacion:null,
        rol_jefe_vinculacion:null,
        rol_secretaria_departamento:null,
        rol_secretaria_vinculacion:null,
        rol_jefe_proyectos_docencia:null,
        rol_auxiliar_laboratorio:null,
        rol_coordinador_vinculacion:null
    }]);


    const camporoles = (rowData) => {
       
        for(var x = 0; x<roles3.length ; x++){
            if(roles3[x].id_Usuarios === rowData.id_Usuarios){
                var acum=0;
            
                    if(roles3[x].rol_desarrollo_academico_departamental){
                        acum++;
                    }
                    if(roles3[x].rol_docente){
                        acum++;
                    }
                    if(roles3[x].rol_jefe_departamento){
                        acum++;
                    }
                    if(roles3[x].rol_jefe_desarrollo_academico){
                        acum++;
                    }
                    if(roles3[x].rol_jefe_laboratorio){
                        acum++;
                    }
                    if(roles3[x].rol_jefe_oficina_servicio_externos_vinculacion){
                        acum++;
                    }
                    if(roles3[x].rol_jefe_oficina_servicio_social_vinculacion){
                        acum++;
                    }
                    if(roles3[x].rol_jefe_vinculacion){
                        acum++;
                    }
                    if(roles3[x].rol_secretaria_departamento){
                        acum++;
                    }
                    if(roles3[x].rol_secretaria_vinculacion){
                        acum++;
                    }
                    if(roles3[x].rol_jefe_proyectos_docencia){
                        acum++;
                    }
                    if(roles3[x].rol_auxiliar_laboratorio){
                        acum++;
                    }
                    if(roles3[x].rol_coordinador_vinculacion){
                        acum++;
                    }
                    
         

                return <ul style={{paddingLeft:"0"}}>
                    {(roles3[x].rol_desarrollo_academico_departamental)? <li>Investigación de Proyectos</li>:<div></div>}
                    {(roles3[x].rol_docente)?<li>Docente</li>:<div></div>}
                    {(roles3[x].rol_jefe_departamento)?<li>Jefe Departamento</li> :<div></div>}
                    {(roles3[x].rol_jefe_desarrollo_academico)?<li>Jefe Desarrollo Academico</li>:<div></div>}
                    {(roles3[x].rol_jefe_laboratorio)?<li>Jefe Laboratorio</li>:<div></div>}
                    {(roles3[x].rol_jefe_oficina_servicio_externos_vinculacion)?<li>Jefe Oficina Servicios Externos Vinc.</li>:<div></div>}
                    {(roles3[x].rol_jefe_oficina_servicio_social_vinculacion)?<li>Jefe Oficina Servicio Social Vinc.</li>:<div></div>}
                    {(roles3[x].rol_jefe_vinculacion)?<li>Jefe Vinculacion</li>:<div></div>}
                    {(roles3[x].rol_secretaria_departamento)?<li>Secretaria Departamento</li>:<div></div>}
                    {(roles3[x].rol_secretaria_vinculacion)?<li>Secretaria Vinculacion</li>:<div></div>}
                    {(roles3[x].rol_jefe_proyectos_docencia)?<li>Jefe Proyectos Docencia</li>:<div></div>}
                    {(roles3[x].rol_auxiliar_laboratorio)?<li>Auxiliar Laboratorio</li>:<div></div>}
                    {(roles3[x].rol_coordinador_vinculacion)?<li>Coordinador Vinculacion</li>:<div></div>}
                    {(acum===0)? <div>Sin Roles</div>:<div></div>}
                    </ul>;
            }
        }
    }
   

    const renderFooter = () => {
        return (
            <div>
                <Button label="Agregar" icon="pi pi-user-plus"  iconPos="left"  onClick={() => {onHide() ; agregarUsuario()}} />
            </div>
        );
    }    
   
     
    return (
        <div>
            <div className="card">
            <h1>Usuarios</h1>
                <div style={{ display: "flex"}}>
                    <Button onClick={() => {setVisible(true) ;setEstado(false) ; setContraant(null) ; setIdusuario(null) ; setRoles2({
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
                        setNombre("") ; setCorreo("") ; setPassword("") ;setHoras(null) ; setTipom(null); setDisabled(false) }}  style={{ marginLeft: "auto" , marginBottom:"1em", backgroundColor:"blue-400", borderColor:"blue-400"}} label="Agregar Usuario" icon="pi pi-user" iconPos="left">
                    </Button>
                </div>

                <DataTable value={usuarios} scrollable scrollHeight="500px"  responsiveLayout="scroll">
                    <Column header="Nombre de Usuario" field='user_Nombre' exportable={false} ></Column>
                    <Column header="Roles" body={camporoles} exportable={false} ></Column>
                    <Column header="Correo" field='user_Correo' exportable={false} ></Column>
                    <Column header="Modificar Usuario" body={botonModificar} exportable={false} ></Column>
                    <Column header="Eliminar Usuario" body={botonEliminar} exportable={false} ></Column>
                
                </DataTable>
                
                <Dialog visible={visible} onHide={() => {onHide()}} header="Agregar Usuario"   footer={renderFooter}>
                    
                            <td style={{paddingRight: '5rem' , paddingLeft:'2rem'}}>
                                <th>Información</th>
                                <br/>
                                <br/>
                                <span className="p-float-label">
                                <InputText id="nombre" value={nombre} style={{ width:"280px" }} onChange={(e) => setNombre(e.target.value)} />
                                <label htmlFor="nombre">Nombre</label>
                                </span>
                                <br/>
                                <br/>
                                <span className="p-float-label">
                                    <InputText id="correo" value={correo} style={{ width:"280px" }}  onChange={(e) => setCorreo(e.target.value)}/>
                                    <label htmlFor="correo">Correo</label>
                                </span>
                                <br/>
                                <br/>
                                <span className="p-float-label">
                                    <Password type="password" id="password" value={password} toggleMask onChange={(e) => setPassword(e.target.value)} feedback={true}/>
                                    <label htmlFor="password">Contraseña</label>
                                </span>
                                <br/>  
                                <br/>  
                                <span>
                                <Dropdown id="drop" value={tipom} optionValue='code' options={tipomoption} 
                                onChange={(e) => 
                                {
                                    setTipom(e.value) ; 
                                    (e.value) === 1 || (e.value) === 2 || (e.value) === 3? setDisabled(true) : setDisabled(false) ;
                                    (e.value) === 1 ? setHoras(40) : (e.value) === 2? setHoras(30) : (e.value) === 3? setHoras(20) : setHoras(null) ;
                                }} optionLabel="name" placeholder="Nombramiento" style={{width:"20vw" }}/>
                                </span>              

                                <h5>Horas</h5>
                                <InputNumber id="minmax-buttons" value={horas} style={{width:"15em"}} onValueChange={(e) => {setHoras(e.value)}} mode="decimal" showButtons min={0} max={50} disabled={disabled} />  
                            </td>
                            <td style={{paddingRight: '2rem'}}>
                                <th>Roles</th>

                                <br/>
                                <div className="p-field-checkbox">
                                    <Checkbox inputId="docente" name="docente" value="rol_docente" onChange={onRolChange} checked={roles2.rol_docente} />
                                    <label htmlFor="docente">&nbsp;&nbsp;Docente </label>
                                </div>
                                <br/>
                                <div className="p-field-checkbox">
                                    <Checkbox inputId="desarrollo_academico_departamental" name="desarrollo_academico_departamental" value="rol_desarrollo_academico_departamental" onChange={onRolChange} checked={roles2.rol_desarrollo_academico_departamental} />
                                    <label htmlFor="desarrollo_academico_departamental">&nbsp;&nbsp;Investigación de Proyectos</label>
                                </div>
                                <br/>
                                <div className="p-field-checkbox">
                                    <Checkbox inputId="jefe_lab" name="jefe_lab" value="rol_jefe_laboratorio" onChange={onRolChange} checked={roles2.rol_jefe_laboratorio} />
                                    <label htmlFor="jefe_lab">&nbsp;&nbsp;Jefe Laboratorio </label>
                                </div>
                                <br/>
                                
                                    <div className="p-field-checkbox">
                                    <Checkbox inputId="coord_vinc" name="coord_vinc" value="rol_coordinador_vinculacion" onChange={onRolChange} checked={roles2.rol_coordinador_vinculacion}/>
                                    <label htmlFor="coord_vinc">&nbsp;&nbsp;Coordinador Vinculacion </label>
                                    </div>
                                    <br/>  

				<div className="p-field-checkbox">
                                    <Checkbox inputId="aux_lab" name="aux_lab" value="rol_auxiliar_laboratorio" onChange={onRolChange} checked={roles2.rol_auxiliar_laboratorio}/>
                                    <label htmlFor="aux_lab">&nbsp;&nbsp;Auxiliar Laboratoio</label>
                                    </div>
                                    <br/>  

				<div className="p-field-checkbox">
                                    <Checkbox inputId="jefe_proy_doc" name="jefe_proy_doc" value="rol_jefe_proyectos_docencia" onChange={onRolChange} checked={roles2.rol_jefe_proyectos_docencia}/>
                                    <label htmlFor="jefe_proy_doc">&nbsp;&nbsp;Jefe de Proyectos de Docencia</label>
                                    </div>
                                    <br/>  

				<div className="p-field-checkbox">
                                    <Checkbox inputId="secre_dep" name="secre_dep" value="rol_secretaria_departamento" onChange={onRolChange} checked={roles2.rol_secretaria_departamento}/>
                                    <label htmlFor="secre_dep">&nbsp;&nbsp;Secretaria Departamental</label>
                                    </div>
                                    <br/>  
                                
                            </td> 
                </Dialog>
            </div>
        </div>
    )
}

export default Usuarios
