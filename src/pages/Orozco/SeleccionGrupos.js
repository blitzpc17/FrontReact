import React, { useState, useEffect, useContext } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import swal from 'sweetalert';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText  } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import BreadCrumbContext from '../../context/BreadCrumbContext';

const cookies = new Cookies();

const SeleccionGrupos = () => {

    const navigate = new useNavigate();

    const [grupos, setGrupos] = useState([]);
    const [visible, setVisible] = useState(false);
    const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
    const [grupo, setGrupo] = useState({
        id_grupo: null,
        id_materia: null,
        id_docper: null,
        grp_grupo: null
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
            if(cookies.get('actualTemp').includes('Grupos de '))
                datosTabla();
            else
                navigate('/plataforma/periodosecretaria');
        }
    }, []);

    const datosTabla = async () => {
        await axios.get("http://localhost:8080/api/v1/materiasgrupos/secretaria/" + id_docper).then(res => setGrupos(res.data));

        await axios.get("http://localhost:8080/api/v1/materias/searchbydep/" + cookies.get('id_Departamento')).then(res => setGruposCombo(res.data));
    }

    const eliminarTemplate = (rowData) => {
        return <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => eliminarGrupo(rowData.id_grupo)}/>;
    }

    const eliminarGrupo = (id) => {
        swal({
            title: "¿Deseas Desasignar este Grupo?",
            text: "¡Los cambios no se podrán recuperar!",
            icon: "warning",
            buttons: ["Cancelar","Aceptar"],
            dangerMode: true
          }).then((OK) => {
    
            if(OK){
              
                axios.get("http://localhost:8080/api/v1/grupos/delete/" + id).then( dataElim => {
                axios.get("http://localhost:8080/api/v1/materiasgrupos/secretaria/" + id_docper).then(res => setGrupos(res.data));
                setVisible(false);

                swal({
                  title: "¡Atención!",
                  text: "¡Se ha Desasignado el Grupo!",
                  icon: "success",
                  button: "Aceptar",
                  timer: "3000"
                });
              })
            }else{
              swal({
                title: "¡Atención!",
                text: "¡No se ha Desasignado el Grupo!",
                icon: "info",
                button: "Aceptar",
                timer: "3000"
              });
            }
    
          });
    }

    const abrirDialogNuevo = () => {
        setGrupo({
            id_grupo: null,
            id_materia: null,
            id_docper: null,
            grp_grupo: null
        });
        setGrupoSeleccionado(null);
        setVisible(true);
    }

    const footer = () => {
        return <Button label="Agregar" className="p-button p-button-info" onClick={() => agregarGrupo()} />   
    }

    const agregarGrupo = () => {
        if(grupoSeleccionado !== null && grupo.grp_grupo != null){
            axios.get("http://localhost:8080/api/v1/grupos/comprobargrupo/" + grupoSeleccionado.id_Materia + '/' + grupo.grp_grupo + '/' + id_docper).then(res => {
                if(res.data.id_grupo != null){
                    swal({
                        title: "¡Atención!",
                        text: "¡Este Usuario ya tiene Asignado este Grupo!",
                        icon: "warning",
                        button: "Aceptar",
                        timer: "3000"
                    });
                }else{
                    var grupoTemp = {
                        ...grupo,
                        id_materia: grupoSeleccionado.id_Materia,
                        id_docper: parseInt(id_docper)
                    };
        
                    axios.post("http://localhost:8080/api/v1/grupos/save", grupoTemp).then(res => {
                        axios.get("http://localhost:8080/api/v1/materiasgrupos/secretaria/" + id_docper).then(res => setGrupos(res.data));
                        setVisible(false);

                        swal({
                            title: "¡Atención!",
                            text: "¡Se Agregó el Grupo "+ grupoSeleccionado.mat_Nombre + " " +res.data.grp_grupo +"!",
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
                text: "¡Debes Llenar Correctamente el Formulario!",
                icon: "error",
                button: "Aceptar",
                timer: "3000"
            });
        }
    }

    const cambioGrupos = (e) =>{
        setGrupoSeleccionado(e.value);
    }

    return <div>
        <h1 style={{ textAlign: 'center' }}>{actual.toUpperCase()}</h1>

        <div style={{ textAlign: 'right', marginBottom: '15px', marginTop: '10px' }}>
            <Button label='Agregar Grupo' onClick={() => abrirDialogNuevo()} />
        </div>

        <DataTable value={grupos} responsiveLayout="scroll">
            <Column field="rowmg" header="#" style={{ width: '10%' }}></Column>
            <Column field="clave" header="Clave Materia" style={{ width: '25%' }}></Column>
            <Column field="nombre" header="Materia" style={{ width: '45%' }}  ></Column>
            <Column field="grupo" header="Grupo" style={{ width: '15%' }}></Column>
            <Column header="Eliminar" body={eliminarTemplate} style={{ width: '5%', textAlign: 'center' }}></Column>
        </DataTable>

        <Dialog header="Asignar Nuevo Grupo" footer={footer()} visible={visible} modal={true} style={{width: '550px'}} onHide={() => setVisible(false)}>
                <Dropdown value={grupoSeleccionado} options={gruposCombo} onChange={cambioGrupos} optionLabel="mat_Nombre" placeholder="Materia" style={{ width: '500px' }} />

                <span className="p-float-label" style={{ marginTop: '30px' }}>
                    <InputText id="proc" value={grupo.GRP_Grupo} onChange={(e) => {
                        setGrupo({
                            ...grupo,
                            grp_grupo: e.target.value
                        });
                    }} style={{ width: '500px' }} maxLength={1}/>
                    <label htmlFor="grupo">Grupo</label>
                </span>
            </Dialog>
    </div>;
};

export default SeleccionGrupos;
