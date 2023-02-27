import React, { useEffect, useState, useContext, useRef } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import axios from "axios";
import BreadCrumbContext from '../../context/BreadCrumbContext';
import { Toast } from 'primereact/toast';
import FileService from '../../services/FileService';
import DialogSUbidaDocumentos from '../../components/Orozco/DialogSUbidaDocumentos';

const cookies = new Cookies();

const PeriodosDesarrolloAcademico = () => {
    const navigate = new useNavigate();

    const [periodos, setPeriodos] = useState([]);
    const [periodo, setPeriodo] = useState([]);
    const [visible, setVisible] = useState(false);
    const [desarrolloAcademico, setDesarrolloAcademico] = useState({desac_pdf_Programa_Institucional: null});

    const toast = useRef(null);

    var fileService = new FileService();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_desarrollo_academico)
            navigate('/plataforma/menu');
        else{
            cambiarBread([], 'Periodos Desarrollo Académico');
            datosPeriodo();
        }
    }, []);

    const datosPeriodo = async () => {
        await axios.get("http://localhost:8080/api/v1/periodos/all").then(res => setPeriodos(res.data));
    }

    const redireccionTemplate = (rowData) => {
        return <Button icon="pi pi-chevron-circle-right" className="p-button-rounded p-button-info" onClick={() => cambiarBreadLocal(rowData)}/>;
    }

    const concat =(rowData) =>{
        let per = meslbl(rowData.per_Mes_Inicio) + ' - ' + meslbl(rowData.per_Mes_Fin) ;

        return(per);
    }

    const cambiarBreadLocal = async(rowData) => {
        cookies.set('id_Periodo', rowData.id_Periodo, {path: "/"});
        cookies.set('lblPeriodo',meslbl(rowData.per_Mes_Inicio) + ' - ' + meslbl(rowData.per_Mes_Fin) + ' ' + rowData.per_Year , {path: "/"});

        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/periodosdesarrollo' });

        cambiarBread(direccionesTemp, 'Departamentos');

        var id_Desarrollo_Academico = 0;
        await axios.get("http://localhost:8080/api/v1/desarrolloacademicoinst/periodo/" + rowData.id_Periodo).then(res => {
            if(res.data.id_Desarrollo_Academico != null)
                id_Desarrollo_Academico = res.data.id_Desarrollo_Academico;
        });

        if(id_Desarrollo_Academico === 0){
            var desaTemp = {
                id_Desarrollo_Academico: null,
                id_Periodo: rowData.id_Periodo,
                desac_pdf_Programa_Institucional: null,
                desac_creado_por: "Orozco",
                desac_fecha_creacion: new Date(),
                desac_actualizado_por: null,
                desac_fecha_actualizacion: null
            };
    
            await axios.post("http://localhost:8080/api/v1/desarrolloacademicoinst/save" , desaTemp).then(res2 =>{
                id_Desarrollo_Academico = res2.data.id_Desarrollo_Academico;
            });
        }
        

        navigate('/plataforma/departamentosdesarrollo/'+id_Desarrollo_Academico)
    }

    const meslbl = (mes) =>{
        switch(mes){
            case 1: return "ENE";
            case 2: return "FEB";
            case 3: return "MAR";
            case 4: return "ABR";
            case 5: return "MAY";
            case 6: return "JUN";
            case 7: return "JUL";
            case 8: return "AGO";
            case 9: return "SEP";
            case 10: return "OCT";
            case 11: return "NOV";
            case 12: return "DIC";
            default: return "Error";
        }
    }

    const estado = (rowData) => {
        if(rowData.per_Estado === true){
            return (
                <>
                    <Button label='Cursando' className="p-button-rounded"></Button>
                </>
            );
        }else{
            return (
                <>
                    <Button label='Cerrado' className="p-button-rounded p-button-secondary"></Button>
                </>
            );
        }
    }

    const subirBodyTemplate = (rowData) => {
        return <Button icon={rowData.actdoc_pdf_actividad != null ? "pi pi-sync" : "pi pi-cloud-upload"} className="p-button-rounded p-button-danger" onClick={() => subirPdf(rowData)}/>;
    }

    const subirPdf = async(rowData) =>{
        setPeriodo(rowData);
        await axios.get("http://localhost:8080/api/v1/desarrolloacademicoinst/periodo/" + rowData.id_Periodo).then(res => {
            if(res.data.id_Desarrollo_Academico != null)
                setDesarrolloAcademico(res.data);
            else
                setDesarrolloAcademico({
                    id_Desarrollo_Academico: null,
                    id_Periodo: rowData.id_Periodo,
                    desac_pdf_Programa_Institucional: null,
                    desac_creado_por: "Orozco",
                    desac_fecha_creacion: new Date(),
                    desac_actualizado_por: null,
                    desac_fecha_actualizacion: null
                });
        });
        setVisible(true);
    }

    const onChangeInputFile = (file) =>{
        guardarDocumentoAlCargar(file);
    }

    const guardarDocumentoAlCargar = async(file) => {
        if(file !== null){
            let per = meslbl(periodo.per_Mes_Inicio) + ' - ' + meslbl(periodo.per_Mes_Fin) + ' ' + periodo.per_Year;

            var formdata = new FormData();

            let ruta = 'DESARROLLO ACADÉMICO\\' + per;
            
            formdata.append('file', file);
            formdata.append('ruta', ruta);
            formdata.append('nombrearch', 'Programa Institucional de FyADyP.pdf');
            
            await fileService.upload(formdata).then(data => {
                if(data.status === 200){
                    let objetoConDocumento = {
                        ...desarrolloAcademico, 
                        desac_pdf_Programa_Institucional: data.message,
                    }

                    axios.post("http://localhost:8080/api/v1/desarrolloacademicoinst/save", objetoConDocumento).then(res => {
                        axios.get("http://localhost:8080/api/v1/periodos/all").then(res => setPeriodos(res.data));
                        axios.get("http://localhost:8080/api/v1/desarrolloacademicoinst/find/" + desarrolloAcademico.id_Desarrollo_Academico).then(res => setDesarrolloAcademico(res.data));
                        toast.current.show({severity:'success', summary: '¡Atención!', detail:'Documento Agregado Correctamente', life: 3000});
                    });

                }else{
                    if(data.status === 501){
                        toast.current.show({severity:'error', summary: '¡Atención!', detail:'No se ha podido agregar el Documento', life: 3000});
                    }
                }
            });

        }
    }

    const eliminarPDF = async() =>{
        let objetoConDocumento = {
            ...desarrolloAcademico, 
            desac_pdf_Programa_Institucional: null,
        }

        await fileService.delete(desarrolloAcademico.desac_pdf_Programa_Institucional).then(data => {

            if(data.status === 200){
                axios.post("http://localhost:8080/api/v1/desarrolloacademicoinst/save", objetoConDocumento).then(res => {
                    axios.get("http://localhost:8080/api/v1/periodos/all").then(res => setPeriodos(res.data));
                    axios.get("http://localhost:8080/api/v1/desarrolloacademicoinst/find/" + desarrolloAcademico.id_Desarrollo_Academico).then(res => setDesarrolloAcademico(res.data));
                    toast.current.show({severity:'success', summary: '¡Atención!', detail:'Documento Eliminado Correctamente', life: 3000});
                });

            }else{
                if(data.status === 501){
                    toast.current.show({severity:'error', summary: '¡Atención!', detail:data.message, life: 3000});
                }
            }

        });
    }

    return <div>
        <h1 style={{ textAlign: 'center' }}>PERIODOS DE GESTIÓN</h1>
        <DataTable value={periodos} responsiveLayout="scroll">
            <Column header="Periodo" body={concat} style={{ width: '35%' }}></Column>
            <Column field="per_Year" header="Año" style={{ width: '15%' }}></Column>
            <Column header="Estado" body={estado} style={{ width: '20%' }}  ></Column>
            <Column header="Diagnóstico y Necesidades de FyADyP" body={ redireccionTemplate } style={{ width: '15%', textAlign: 'center' }}></Column>
            <Column header="Programa Institucional de FyADyP" body={subirBodyTemplate} style={{ width: '15%', textAlign: 'center' }}></Column>
        </DataTable>

        <DialogSUbidaDocumentos urlDoc = { desarrolloAcademico.desac_pdf_Programa_Institucional } eliminarPDF= {eliminarPDF} header="Programa Institucional de FyADyP" visible={visible} onChangeInputFile= {onChangeInputFile} onHide={() => setVisible(false)}/>
        <Toast ref={toast} />
    </div>;
};

export default PeriodosDesarrolloAcademico;
