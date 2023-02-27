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

const DesarrolloAcademicoJefeDepartamento = () => {
    const navigate = new useNavigate();

    const [periodos, setPeriodos] = useState([]);
    const [periodo, setPeriodo] = useState([]);
    const [visible, setVisible] = useState(false);
    const [desarrolloAcademico, setDesarrolloAcademico] = useState({per_actualizado_por: null});

    const toast = useRef(null);

    var fileService = new FileService();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);
 var iddepdesa =null;
    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_departamento)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Periodos Desarrollo Académico')
                datosPeriodo();
            else
                navigate('/plataforma/menudepartamental');
        }
    }, []);

    const datosPeriodo = async () => {
        await axios.get("http://localhost:8080/api/v1/periodos/desarrollo/" + cookies.get('id_Departamento')).then(res => setPeriodos(res.data));
    }

    const redireccionTemplate = (rowData) => {
        return <Button disabled = {rowData.per_actualizado_por == null} icon="pi pi-chevron-circle-right" className="p-button-rounded p-button-info" onClick={() => cambiarBreadLocal(rowData)}/>;
    }

    const descargarBodyTemplate = (rowData) => {
        return <a href={rowData.per_creado_por} download={"Programa Institucional de FyADyP"} style={{ textDecoration: 'none' }}><Button icon="pi pi-cloud-download" disabled={rowData.per_creado_por == null} className="p-button-rounded p-button-success"/></a>;
    }

    const concat =(rowData) =>{
        let per = meslbl(rowData.per_Mes_Inicio) + ' - ' + meslbl(rowData.per_Mes_Fin) ;

        return(per);
    }

    const cambiarBreadLocal = async(rowData) => {
        cookies.set('id_Periodo', rowData.id_Periodo, {path: "/"});
        cookies.set('lblPeriodo',meslbl(rowData.per_Mes_Inicio) + ' - ' + meslbl(rowData.per_Mes_Fin) + ' ' + rowData.per_Year , {path: "/"});

        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/periodoscapacitacionesdep' });

        cambiarBread(direccionesTemp, 'Capacitaciones');

         iddepdesa = getIdDepDesa(rowData);
        
        if(iddepdesa == null){
            var desaTemp = {
                id_Dep_Desa: iddepdesa,
                id_desarrollo_academico: getIdDesaAca(rowData),
                id_departamento: parseInt(cookies.get('id_Departamento')),
                depac_pdf_diagnostico_necesidades: null
            };
    
            await axios.post("http://localhost:8080/api/v1/departamentoacademico/save" , desaTemp).then(res2 =>{
                iddepdesa = res2.data.id_Dep_Desa;
            });
        }

        navigate('/plataforma/capacitacionesjefedep/'+iddepdesa)
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

        var iddesa = getIdDesaAca(rowData);

        if(iddesa == null){
            var desaTemp = {
                id_Desarrollo_Academico: null,
                id_Periodo: parseInt(cookies.get('id_Periodo')),
                desac_pdf_Programa_Institucional: null,
                desac_creado_por: "Orozco",
                desac_fecha_creacion: new Date(),
                desac_actualizado_por: null,
                desac_fecha_actualizacion: null
            };
    
            await axios.post("http://localhost:8080/api/v1/desarrolloacademicoinst/save" , desaTemp).then(res2 =>{
                iddepdesa = res2.data.id_Desarrollo_Academico;
            });

        }

        setDesarrolloAcademico({
            id_Dep_Desa: getIdDepDesa(rowData),
            id_desarrollo_academico: iddesa,
            id_departamento: parseInt(cookies.get('id_Departamento')),
            depac_pdf_diagnostico_necesidades: rowData.per_actualizado_por
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

            let ruta = 'DESARROLLO ACADÉMICO\\' + per + '\\' + cookies.get('nombre_Departamento');
            
            formdata.append('file', file);
            formdata.append('ruta', ruta);
            formdata.append('nombrearch', 'Diagnóstico y Necesidades de FyADyP.pdf');
            
            await fileService.upload(formdata).then(data => {
                if(data.status === 200){
                    let objetoConDocumento = {
                        ...desarrolloAcademico, 
                        depac_pdf_diagnostico_necesidades: data.message,
                    }

                    axios.post("http://localhost:8080/api/v1/departamentoacademico/save", objetoConDocumento).then(res => {
                        axios.get("http://localhost:8080/api/v1/periodos/desarrollo/" + cookies.get('id_Departamento')).then(res => setPeriodos(res.data));
                        toast.current.show({severity:'success', summary: '¡Atención!', detail:'Documento Agregado Correctamente', life: 3000});
                    });

                    setDesarrolloAcademico(objetoConDocumento);
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
            depac_pdf_diagnostico_necesidades: null,
        }

        await fileService.delete(desarrolloAcademico.depac_pdf_diagnostico_necesidades).then(data => {

            if(data.status === 200){
                axios.post("http://localhost:8080/api/v1/departamentoacademico/save", objetoConDocumento).then(res => {
                    axios.get("http://localhost:8080/api/v1/periodos/desarrollo/" + cookies.get('id_Departamento')).then(res => setPeriodos(res.data));
                    toast.current.show({severity:'success', summary: '¡Atención!', detail:'Documento Eliminado Correctamente', life: 3000});
                });

                setDesarrolloAcademico(objetoConDocumento);
            }else{
                if(data.status === 501){
                    toast.current.show({severity:'error', summary: '¡Atención!', detail:data.message, life: 3000});
                }
            }

        });
    }

    const getIdDesaAca = (rowdata) =>{
        var doc = rowdata.per_lbl_Periodo.split('-');
        return doc[0] === '0'? null : parseInt(doc[0]);
    }

    const getIdDepDesa = (rowdata) =>{
        var doc = rowdata.per_lbl_Periodo.split('-');
        return doc[1] === '0'? null : parseInt(doc[1]);
    }

    return <div>
        <h1 style={{ textAlign: 'center' }}>PERIODOS DE GESTIÓN</h1>
        <DataTable value={periodos} responsiveLayout="scroll">
            <Column header="Periodo" body={concat} style={{ width: '35%' }}></Column>
            <Column field="per_Year" header="Año" style={{ width: '15%' }}></Column>
            <Column header="Estado" body={estado} style={{ width: '20%' }}  ></Column>
            <Column header="Diagnóstico y Necesidades de FyADyP" body={subirBodyTemplate} style={{ width: '15%', textAlign: 'center' }}></Column>
            <Column header="Programa Institucional de FyADyP" body={descargarBodyTemplate} style={{ width: '15%', textAlign: 'center' }}></Column>
            <Column header="Gestión de Capacitaciones" body={redireccionTemplate} style={{ width: '15%', textAlign: 'center' }}></Column>
        </DataTable>

        <DialogSUbidaDocumentos urlDoc = { desarrolloAcademico.depac_pdf_diagnostico_necesidades } usuario = {meslbl(periodo.per_Mes_Inicio) + ' - ' + meslbl(periodo.per_Mes_Fin) + ' ' + periodo.per_Year} eliminarPDF= {eliminarPDF} header="Diagnóstico y Necesidades de FyADyP" visible={visible} onChangeInputFile= {onChangeInputFile} onHide={() => setVisible(false)}/>
        <Toast ref={toast} />
    </div>;
};

export default DesarrolloAcademicoJefeDepartamento;
