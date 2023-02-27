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
import { ServicioUsuarios } from '../../services/ServicioUsuarios';
import { ServicioRolesUsuario } from '../../services/ServicioRolesUsuario';
import { ServicioConsultaUsuarios } from '../../services/ServicioConsultaUsuarios';


const ModalAgregarUsuarios = (props) => {

    const [nombre, setNombre] = useState("")
    const [correo, setCorreo] = useState("")
    const [password, setPassword] = useState("")
    const [visible, setVisible] = useState(false)
    const [roles, setRoles] = useState([]);
    const [usuarios, setUsuarios] = useState();

    var servicioUsuarios = new ServicioUsuarios();
    var servicioRoles = new ServicioRolesUsuario();
    var servicioConsulta= new ServicioConsultaUsuarios();
    

    const [roles2,setRoles2] = useState({
        id_rol_usuario:null,
        id_Usuarios:null ,
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
    })



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
          
                <Button icon="pi pi-pencil " className="p-button-rounded p-button-success" onClick={()=> {setVisible(true) ;
                ; setNombre(rowData.user_Nombre) ; setCorreo(rowData.user_Correo) ; setPassword(rowData.user_Password) ; setRoles2(rowData)}} />
           
                
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

    const eliminar = (data) => {
        
    swal({
        title: "¿Deseas Eliminar al Usuario?",
        text: "¡Los cambios no se podrán recuperar!",
        icon: "warning",
        buttons: ["Cancelar","Aceptar"],
        dangerMode: true
      }).then((OK) => {
  
        if(OK){
  
          servicioRoles.deleteroles(data.id_Usuarios);
          servicioUsuarios.delete(data.id_Usuarios).then(data=>{
         
              swal({
                title: "¡Atención!",
                text: "¡Se ha Eliminado al Usuario!",
                icon: "success",
                button: "Aceptar",
                timer: "3000"
              });
            

              servicioConsulta.search().then(data =>{
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
        id_Usuarios:null ,
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
    }]);

    useEffect(() => {
        servicioConsulta.search().then(data =>{
            setRoles3(data);
            setUsuarios(data);
        });
    },[]);

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
         

                return <ul style={{paddingLeft:"0"}}>
                    {(roles3[x].rol_desarrollo_academico_departamental)? <li>Desarrollo Academico D.</li>:<div></div>}
                    {(roles3[x].rol_docente)?<li>Docente</li>:<div></div>}
                    {(roles3[x].rol_jefe_departamento)?<li>Jefe Departamento</li> :<div></div>}
                    {(roles3[x].rol_jefe_desarrollo_academico)?<li>Jefe Desarrollo Academico</li>:<div></div>}
                    {(roles3[x].rol_jefe_laboratorio)?<li>Jefe Laboratorio</li>:<div></div>}
                    {(roles3[x].rol_jefe_oficina_servicio_externos_vinculacion)?<li>Jefe Oficina Servicios Externos Vinc.</li>:<div></div>}
                    {(roles3[x].rol_jefe_oficina_servicio_social_vinculacion)?<li>Jefe Oficina Servicio Social Vinc.</li>:<div></div>}
                    {(roles3[x].rol_jefe_vinculacion)?<li>Jefe Vinculacion</li>:<div></div>}
                    {(roles3[x].rol_secretaria_departamento)?<li>Secretaria Departamento</li>:<div></div>}
                    {(roles3[x].rol_secretaria_vinculacion)?<li>Secretaria Vinculacion</li>:<div></div>}
                    {(acum===0)? <div>Sin Roles</div>:<div></div>}
                    </ul>;
            }
        }
    }


    const agregarUsuario = () => {

        if(nombre ===null || nombre === "" || 
        correo === null || correo === "" || 
        password === null || password === ""){

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
                id_Departamento:2,
                user_Nombre:nombre,
                user_Correo:correo,
                user_Password:password,
            };
    
           //props.agregar(usuario,roles2);

           servicioUsuarios.save(usuario).then(usuario=>{

            swal({
              title: "¡Atención!",
              text: "¡Se ha agregado al Usuario con Exito!",
              icon: "success",
              button: "Aceptar",
              timer: "3000"
            });
           
            
            roles2.id_Usuarios=usuario.id_Usuarios;
            servicioRoles.save(roles2).then(data => {
                servicioConsulta.search().then(data =>{
                    setRoles3(data);
                    setUsuarios(data);
                });
            });
          });

           setRoles2({
            id_rol_usuario:null,
            id_Usuarios:null ,
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
           });
        }
    }

    const renderFooter = () => {
        return (
            <div>
                <Button label="Agregar" icon="pi pi-user-plus"  iconPos="left"  onClick={() => {onHide() ; agregarUsuario()}} autoFocus />
            </div>
        );
    }


    
   
     
    return (
        <div>
            <div className="card">

                <div style={{ display: "flex"}}>
                    <Button onClick={() => {setVisible(true) ; setRoles2({
                        id_rol_usuario:null,
                        id_Usuarios:null ,
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
                        }) 
                        ; setNombre("") ; setCorreo("") ; setPassword("") }}  style={{ marginLeft: "auto" , marginBottom:"1em", backgroundColor:"blue-400", borderColor:"blue-400"}} label="Agregar Usuario" icon="pi pi-user" iconPos="left">
                    </Button>
                </div>

                <DataTable value={usuarios} scrollable scrollHeight="620px"  responsiveLayout="scroll" style={{width:'80vw'}} >
                    <Column header="Nombre de Usuario" field='user_Nombre' exportable={false} ></Column>
                    <Column header="Roles" body={camporoles} exportable={false} ></Column>
                    <Column header="Correo" field='user_Correo' exportable={false} ></Column>
                    <Column header="Modificar Usuario" body={botonModificar} exportable={false} ></Column>
                    <Column header="Eliminar Usuario" body={botonEliminar} exportable={false} ></Column>
                </DataTable>
                
                <Dialog visible={visible} onHide={() => {onHide()}} header="Agregar Usuario" footer={renderFooter}>
                    
                            <td style={{paddingRight: '5rem' , paddingLeft:'2rem'}}>
                                <th>Información</th>
                                <br/>
                                <br/>
                                <span className="p-float-label">
                                <InputText id="nombre" value={nombre} style={{ width:"300px" }} onChange={(e) => setNombre(e.target.value)} />
                                <label htmlFor="nombre">Nombre</label>
                                </span>
                                <br/>
                                <br/>
                                <span className="p-float-label">
                                    <InputText id="correo" value={correo} style={{ width:"300px" }}  onChange={(e) => setCorreo(e.target.value)}/>
                                    <label htmlFor="correo">Correo</label>
                                </span>
                                <br/>
                                <br/>
                                <span className="p-float-label">
                                    <Password type="password" id="password" value={password} style={{ width: "14rem" }}  onChange={(e) => setPassword(e.target.value)} toggleMask feedback={false}/>
                                    <label htmlFor="password">Contraseña</label>
                                </span>
                               
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
                                    <label htmlFor="desarrollo_academico_departamental">&nbsp;&nbsp;Desarrollo Academico Departamental</label>
                                </div>
                                <br/>
                                <div className="p-field-checkbox">
                                    <Checkbox inputId="jefe_lab" name="jefe_lab" value="rol_jefe_laboratorio" onChange={onRolChange} checked={roles2.rol_jefe_laboratorio} />
                                    <label htmlFor="jefe_lab">&nbsp;&nbsp;Jefe Laboratorio </label>
                                </div>
                                <br/>
                                
                                    <div className="p-field-checkbox">
                                    <Checkbox inputId="jefe_vinc" name="jefe_vinc" value="rol_jefe_vinculacion" onChange={onRolChange} checked={roles2.rol_jefe_vinculacion}/>
                                    <label htmlFor="jefe_vinc">&nbsp;&nbsp;Jefe Vinculacion </label>
                                    </div>
                                    <br/>  
                                
                            </td> 
                </Dialog>
            </div>
        </div>
    )
}

export default ModalAgregarUsuarios
