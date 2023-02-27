import React from 'react';

import { useState, useContext } from 'react';
import { useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import swal from 'sweetalert';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { useNavigate } from 'react-router-dom';
import BreadCrumbContext from '../../context/BreadCrumbContext';
import {ServicioLaboratorios} from '../../services/Josean/ServicioLaboratorios';
import {ServicioConsultaLaboratorios} from '../../services/Josean/ServicioConsultaLaboratorios';
import {ServicioUsuarios} from '../../services/Josean/ServicioUsuarios';
import Cookies from 'universal-cookie/es6';

const cookies = new Cookies();

const Laboratorios = () => {
    const navigate = new useNavigate();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    const [visible, setVisible] = useState(false);
    const [laboratorios, setLaboratorios] = useState(null);
    const [nombre, setNombre] = useState("");
    const [clave, setClave] = useState("");
    const [capacidad, setCapacidad] = useState(null);
    const [horaini, setHoraini] = useState(null);
    const [horafin, setHorafin] = useState(null);
    const [profesor, setProfesor] = useState(null);
    const [profesores, setProfesores] = useState(null);
    const [idLab, setIdLab] = useState(null);

    const cookiedep=cookies.get('id_Departamento');

    var servicioLaboratorios = new ServicioLaboratorios();
    var servicioconsLaboratorios = new ServicioConsultaLaboratorios();
    var servicioUsuarios= new ServicioUsuarios();

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_departamento)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Laboratorios'){
                servicioconsLaboratorios.search(cookiedep).then(data => {
			setLaboratorios(data);
			servicioUsuarios.docentes(cookiedep).then(data => setProfesores(data));
		});
                
            }
            else
                navigate('/plataforma/menudepartamental');
        }
      
    }, []);

    const eliminar = (data) => {
        swal({
            title: "¿Deseas el Laboratorio?",
            text: "¡Los cambios no se podrán recuperar!",
            icon: "warning",
            buttons: ["Cancelar","Aceptar"],
            dangerMode: true
          }).then((OK) => {
              
      
            if(OK){
                
               
                    
                    console.log(data);
        
                    servicioLaboratorios.deletelab(data.id_Laboratorio).then(data=>{
                    
                        setLaboratorios(null);
                        
                        servicioconsLaboratorios.search(cookiedep).then( data => {setLaboratorios(data)});

                        swal({
                            title: "¡Atención!",
                            text: "¡Se ha Eliminado el Laboratorio!",
                            icon: "success",
                            button: "Aceptar",
                            timer: "3000"
                        });
                        
                    });
                
                }else{
                swal({
                    title: "¡Atención!",
                    text: "¡No se ha Eliminado el Laboratorio!",
                    icon: "info",
                    button: "Aceptar",
                    timer: "3000"
                });
                }
          });
    }

    const jefe = (rowData) => {
        var nom="";

        if(rowData.user_Nombre != null){
            nom=rowData.user_Nombre;
        }
        else{
            nom="N/A";
        }

        return nom;
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

    const botonModificar = (rowData) => {
        
        return (
            //<React.Fragment> Fragmento simplificado abajo
            <>
                <Button icon="pi pi-pencil " className="p-button-rounded p-button-success" onClick={() => {
                    setVisible(true); 
                    setIdLab(rowData.id_Laboratorio) ; 
                    setNombre(rowData.lab_Nombre);
                    setClave(rowData.lab_Clave);
                    setCapacidad(rowData.lab_Capacidad);
                    setProfesor(rowData.id_Usuarios);
                    setHoraini(new Date(rowData.lab_Horario.substring(rowData.lab_Horario.indexOf("/"),0)));
                    setHorafin(new Date(rowData.lab_Horario.substring(rowData.lab_Horario.length,rowData.lab_Horario.indexOf("/")+1))) }} />
            </>
            //</React.Fragment>
        );
    }


    const botonRedireccion = (rowData) => {
        
        return (
            //<React.Fragment> Fragmento simplificado abajo
            <>
                <Button icon="pi pi-angle-right" className="p-button-rounded p-button-primary" onClick={() => {
                    cambiarBreadLocal('Periodos de Gestión');
                    navigate('/plataforma/periodosgestionlab/'+rowData.id_Laboratorio);
                }} />
            </>
            //</React.Fragment>
        );
    }

    const cambiarBreadLocal = (lblActual) => {
        //cookies.set('id_Periodo', rowData.id_Periodo, {path: "/"});
        //cookies.set('lblPeriodo',meslbl(rowData.per_Mes_Inicio) + ' - ' + meslbl(rowData.per_Mes_Fin) + ' ' + rowData.per_Year , {path: "/"});

        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/laboratorios' });

        cambiarBread(direccionesTemp, lblActual);
    }

    const getHorario = (rowData) => {
        var c1=rowData.lab_Horario;
        let date1= new Date(c1.substring(c1.indexOf("/"),0));
        let date2= new Date(c1.substring(c1.length,c1.indexOf("/")+1));
        var c4=date1.getHours()+":"+(date1.getMinutes()<10?"0":"")+date1.getMinutes();
        var c5=date2.getHours()+":"+(date2.getMinutes()<10?"0":"")+date2.getMinutes();
    
        return c4+" - "+c5;
    }

    const agregar = () => {
        
        if(nombre === "" || nombre === null ||
        clave === "" || clave === null ||
        capacidad === "" || capacidad === null ||
        horaini === "" || horaini === null ||
        horafin === "" || horafin === null ){

            swal({
                title: "¡Atención!",
                text: "¡Rellena todos los campos!",
                icon: "info",
                button: "Aceptar",
                timer: "3000"
            });

            setVisible(true);

        }else{

            if(horaini>horafin){
                swal({
                    title: "¡Atención!",
                    text: "¡La horas no estan seleccionadas de manera correcta!",
                    icon: "info",
                    button: "Aceptar",
                    timer: "3000"
                });

                setVisible(true);
            }
            else{
                
                const lab={

                    id_Laboratorio: idLab,
                    id_Usuarios: profesor,
                    id_Departamento: cookiedep,
                    lab_Nombre: nombre,
                    lab_Clave: clave,
                    lab_Capacidad: capacidad,
                    lab_Horario: horaini +"/"+ horafin,
                    lab_creado_por: null,
                    lab_fecha_creacion: null,
                    lab_actualizado_por: null,
                    lab_fecha_actualizacion: null

                }

                servicioLaboratorios.save(lab).then(data => {
                    setLaboratorios(null);

                    swal({
                        title: "¡Atención!",
                        text: "¡Se ha Guardado el Laboratorio!",
                        icon: "success",
                        button: "Aceptar",
                        timer: "3000"
                      });

                    servicioconsLaboratorios.search(cookiedep).then(data => setLaboratorios(data));
                });

            }
        }
        
    }
    

    const renderFooter = () => {
        return (
            <div>
                <Button label="Agregar" icon="pi pi-user-plus"  iconPos="left" style={{backgroundColor:"var(--purple-500)", borderColor:"var(--purple-500)"}} onClick={() => {setVisible(false) ; agregar()}}  />
            </div>
        );
    }

    const onHide = () => {
        setVisible(false);
    }

  return (
    <div className="card">
        <h1>Laboratorios</h1>

            <div className="card" >
                <div style={{ display: "flex"}}>
                    <Button onClick={()=>{setVisible(true) ; setNombre("") ; setClave("") ; setCapacidad(null) ; setHoraini(null) ; setHorafin(null) ; setProfesor(null) ; setIdLab(null) }} 
                    style={{ marginLeft: "auto" , marginBottom:"1em", backgroundColor:"var(--purple-500)", borderColor:"var(--purple-500)"}} label="Nuevo Laboratorio" icon="pi pi-building" iconPos="left" />
                </div>
                
                    <DataTable value={laboratorios}  scrollHeight="480px"  responsiveLayout="scroll" >
                    <Column header="Jefe Asignado" body={jefe} field='user_Nombre'  exportable={false} ></Column>
                    <Column header="Nombre"  field='lab_Nombre' exportable={false} ></Column>
                    <Column header="Clave"  field='lab_Clave' exportable={false} ></Column>
                    <Column header="Capacidad"  field='lab_Capacidad' exportable={false} ></Column>
                    <Column header="Horario" body={getHorario} field='lab_Horario' exportable={false} ></Column>
                    <Column header="Documentos" body={botonRedireccion} exportable={false}  ></Column>
                    <Column header="Modificar" body={botonModificar} exportable={false}  ></Column>
                    <Column header="Eliminar" body={botonEliminar} exportable={false}  ></Column>
                    </DataTable>
            </div>
    
        
            <Dialog header="Agregar LAboratorio" visible={visible} onHide={onHide} modal={true} footer={renderFooter}>
                <table>
                    <tbody>
                    <tr>
                        <td style={{paddingRight: '5rem'}}>

                                <h5>Nombre</h5>
                                <InputText  type="text" 
                                value={nombre} onChange={(e) => {setNombre(e.target.value)}} style={{width:"15em"}}  />

                                <h5>Clave ISO</h5>
                                <InputText  type="text" 
                                value={clave} onChange={(e) => {setClave(e.target.value)}} style={{width:"15em"}}  />

                                <h5>Capacidad</h5>
                                <InputNumber inputId="minmax-buttons" value={capacidad} style={{width:"15em"}} onValueChange={(e) => setCapacidad(e.value)} mode="decimal" showButtons min={0} max={100} />     

                        </td>
                        <td style={{paddingRight: '5rem'}}>

                                <h5 style={{marginBottom:"2em"}}>Horario</h5>
                                <p className='p-float-label'>
                                <Calendar id="horaini" value={horaini} onChange={(e) => setHoraini(e.value)} timeOnly hourFormat="12"  showIcon />
                                <label htmlFor="horaini" >Hora Inicio</label>
                                </p>
                                <br></br>
                                <p className='p-float-label'>
                                <Calendar id="horafin" value={horafin} onChange={(e) => setHorafin(e.value)} timeOnly hourFormat="12"  showIcon />
                                <label htmlFor="horafin">Hora Fin</label>
                                </p>
                                <h5>Profesor Asignado</h5>
                                <Dropdown value={profesor} optionValue='id_Usuarios' options={profesores} onChange={(e) => {setProfesor(e.target.value)}} optionLabel="user_Nombre" placeholder="Seleccione un Profesor"
                                style={{width:"15em"}}  />
                        </td>
                    </tr>
                    </tbody>
                </table>
            </Dialog>
    </div>
  );
};

export default Laboratorios;
