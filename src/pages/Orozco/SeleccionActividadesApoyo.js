import React, { useState, useEffect, useContext } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import swal from 'sweetalert';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import BreadCrumbContext from '../../context/BreadCrumbContext';

const cookies = new Cookies();

const SeleccionActividadesApoyo = () => {

    const navigate = new useNavigate();

    const [actividades, setActividades] = useState([]);
    const [visible, setVisible] = useState(false);
    const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
    const [actividad, setActividad] = useState({
        id_actividaddocenteperiodo: null,
        id_docper: null,
        id_actividades_docencia: null,
        actdoc_pdf_actividad: null,
        actdoc_comentario: null,
        actdoc_estadocomentario: 0
    });
    const [gruposCombo, setGruposCombo] = useState([
        {name: 'Hola', code: 1}
    ]);

    const {id_docper} = new useParams();
    
    const { actual } = useContext(BreadCrumbContext);

    useEffect(() => {

        if(!cookies.get('rolesUsuario').rol_secretaria_departamento)
            navigate('/plataforma/periodosecretaria');
        else{
            if(cookies.get('actualTemp').includes('Actividades en Apoyo a la Docencia '))
                datosTabla();
            else
                navigate('/plataforma/periodosecretaria');
        }
    }, []);

    const datosTabla = async () => {
        await axios.get("http://localhost:8080/api/v1/secretaria/actividades/" + id_docper).then(res => setActividades(res.data));

        await axios.get("http://localhost:8080/api/v1/actividades/" + cookies.get('id_Departamento')).then(res => setGruposCombo(res.data));
    }

    const eliminarTemplate = (rowData) => {
        return <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => eliminarAct(rowData.id_actividaddocenteperiodo)}/>;
    }

    const eliminarAct = (id) => {
        swal({
            title: "¿Deseas Desasignar esta Actividad?",
            text: "¡Los cambios no se podrán recuperar!",
            icon: "warning",
            buttons: ["Cancelar","Aceptar"],
            dangerMode: true
          }).then((OK) => {
    
            if(OK){
              
                axios.get("http://localhost:8080/api/v1/seleccionapoyo/delete/" + id).then( dataElim => {
                axios.get("http://localhost:8080/api/v1/secretaria/actividades/" + id_docper).then(res => setActividades(res.data));
                setVisible(false);

                swal({
                  title: "¡Atención!",
                  text: "¡Se ha Desasignado la Actividad!",
                  icon: "success",
                  button: "Aceptar",
                  timer: "3000"
                });
              })
            }else{
              swal({
                title: "¡Atención!",
                text: "¡No se ha Desasignado la Actividad!",
                icon: "info",
                button: "Aceptar",
                timer: "3000"
              });
            }
    
          });
    }

    const abrirDialogNuevo = () => {
        setActividad({
            id_actividaddocenteperiodo: null,
            id_docper: null,
            id_actividades_docencia: null,
            actdoc_pdf_actividad: null,
            actdoc_comentario: null,
            actdoc_estadocomentario: 0
        });
        setGrupoSeleccionado(null);
        setVisible(true);
    }

    const footer = () => {
        return <Button label="Agregar" className="p-button p-button-info" onClick={() => agregarGrupo()} />   
    }

    const agregarGrupo = () => {
        if(grupoSeleccionado !== null){
            axios.get("http://localhost:8080/api/v1/seleccionapoyo/busca/" + id_docper + '/' + grupoSeleccionado.id_Actividades_Docencia).then(res => {
                if(res.data.id_actividaddocenteperiodo != null){
                    swal({
                        title: "¡Atención!",
                        text: "¡Este Usuario ya tiene Asignada esta Actividad!",
                        icon: "warning",
                        button: "Aceptar",
                        timer: "3000"
                    });
                }else{
                    var actividadTemp = {
                        ...actividad,
                        id_actividades_docencia: grupoSeleccionado.id_Actividades_Docencia,
                        id_docper: parseInt(id_docper)
                    };
        
                    axios.post("http://localhost:8080/api/v1/seleccionapoyo/save", actividadTemp).then(res => {
                        axios.get("http://localhost:8080/api/v1/secretaria/actividades/" + id_docper).then(res => setActividades(res.data));
                        setVisible(false);

                        swal({
                            title: "¡Atención!",
                            text: "¡Se Agregó la Actividad!",
                            icon: "success",
                            button: "Aceptar",
                            timer: "3000"
                        });
                    });
                    
                }
            });
            
        }else{
            swal({
                title: "¡Atención!",
                text: "¡Debes Seleccionar una Actividad!",
                icon: "error",
                button: "Aceptar",
                timer: "3000"
            });
        }
    }

    const cambioGrupos = (e) =>{
        setGrupoSeleccionado(e.value);
    }

    const rowTemplate = (rowData) => {
        return actividades.indexOf(rowData) + 1;
    }

    return <div>
        <h1 style={{ textAlign: 'center' }}>{actual.toUpperCase()}</h1>

        <div style={{ textAlign: 'right', marginBottom: '15px', marginTop: '10px' }}>
            <Button label='Agregar Actividad' onClick={() => abrirDialogNuevo()} />
        </div>

        <DataTable value={actividades} responsiveLayout="scroll">
            <Column header="#" body={rowTemplate} style={{ width: '20%' }}></Column>
            <Column field="actdoc_nombre_actividad" header="Materia" style={{ width: '75%' }}  ></Column>
            <Column header="Eliminar" body={eliminarTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
        </DataTable>

        <Dialog header="Asignar Nuevo Grupo" footer={footer()} visible={visible} modal={true} style={{width: '550px'}} onHide={() => setVisible(false)}>
            <Dropdown value={grupoSeleccionado} options={gruposCombo} onChange={cambioGrupos} optionLabel="actdoc_Nombre_Actividad" placeholder="Actividades" style={{ width: '500px' }} />

        </Dialog>
    </div>;
};

export default SeleccionActividadesApoyo;
