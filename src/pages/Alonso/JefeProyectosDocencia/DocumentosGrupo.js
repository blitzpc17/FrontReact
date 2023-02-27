import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState, useEffect,useRef } from 'react';
import { CEProyectosDocencia } from '../../../services/ConsultasEspecificas/Alonso/CEProyectosDocencia';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { ServicioDocenteDocumento } from '../../../services/Alonso/ServicioDocenteDocumento';
import { Toast } from 'primereact/toast';
import swal from 'sweetalert';
import { Panel } from 'primereact/panel';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';

const cookies=new Cookies();

const DocumentosGrupo = () => {
    const navigate = new useNavigate();
    const cEProyectosDocencia=new CEProyectosDocencia();
    const servicioDocente=new ServicioDocenteDocumento();
    const [documentos, setDocumentos] = useState(null);
    const toast = useRef(null);
    const [materiagrupo, setMateriagrupo] = useState("");
  // Parametros para las consultas
  const departamento = parseInt(cookies.get('id_Departamento'));
  const {iddocper, idgrupo} = new useParams();
  const docper = iddocper;
  const grupo = idgrupo;

      useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_proyectos_docencia)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Documentos Grupos'){
                cEProyectosDocencia.getCNombreMateriaDocente(departamento,docper,grupo).then(data=>{
                    setMateriagrupo(data[0].docente+" "+data[0].nombre+" Grupo "+data[0].grupo);
                })
               cEProyectosDocencia.getDocumentosGrupos(departamento,grupo).then(data=>insertDocumentos(data))
            }
            else
                navigate('/plataforma/periodosjefedocencia');
        }
         
   
      }, []);
const insertDocumentos=(data)=>{
        const tempDocumento={
            
            id_documentogrupo:null,
            id_grupo:grupo,
            id_formato: null,
            docgrp_pdf_documento: null,
            docgrp_comentario: "",
            docgrp_estadocomentario: 0
        }
        for (const key in data) {
              if (data[key].id_documentogrupo==0) {
                            
                tempDocumento.id_formato= data[key].id_formato;
                tempDocumento.docgrp_pdf_documento= data[key].docgrp_pdf_documento;
                tempDocumento.docgrp_comentario= data[key].docgrp_comentario;
                tempDocumento.docgrp_estadocomentario= data[key].docgrp_estadocomentario;
                 
                servicioDocente.save(tempDocumento).then(data=>{           
                   
                 });
              }
          }
          cEProyectosDocencia.getDocumentosGrupos(departamento,grupo).then(data=>setData(data))
      }
      //aqui inicia componente
      const [data, setData] = useState(documentos);
     
        const tiposEstados = [
            { label: 'Sin Subir', value: 0 },
            { label: 'Completo', value: 1 },
            { label: 'Incompleto', value: 2 },
            { label: 'Subido', value: 3 }
        ];
    

    const getEstadoLabel = (status) => {
        switch (status) {
            case 1:
                return 'Completo';

            case 2:
                return 'Incompleto';

            case 3:
                return   'Subido';
            default:
                return 'Sin Subir';
        }
    }
   
    const onRowEditComplete = (e) => {
       
        let _data = [...data];
        let { newData, index } = e;

        _data[index] = newData;

        setData(_data);
   
        guardarRetroalimentacion(newData);
       
        
        
    }
    const guardarRetroalimentacion=(retro)=>
    {
        const temRetro={
            
            id_documentogrupo:retro.id_documentogrupo,
            id_grupo:grupo,
            id_formato: retro.id_formato,
            docgrp_pdf_documento: retro.docgrp_pdf_documento,
            docgrp_comentario: retro.docgrp_comentario,
            docgrp_estadocomentario: retro.docgrp_estadocomentario,
            notify: 1
        }
        servicioDocente.save(temRetro).then(data=>{  
           showSuccess();
              setData(null);
              cEProyectosDocencia.getDocumentosGrupos(departamento,grupo).then(data=>setData(data))
        });
    }
    
    const retroalimentacion = (options) => {
        return <InputTextarea value={options.value} onChange={(e) => options.editorCallback(e.target.value)} rows={2} cols={25} maxLength="255" />;
    }

    const editorEstado = (options) => {
        return (
            <Dropdown value={options.value} options={tiposEstados} optionLabel="label" optionValue="value"
                onChange={(e) => onChangeEstado(e,options)} placeholder="Estado Documento"
                itemTemplate={(option) => {
                    return <span className={`product-badge status-${option.value}`}>{option.label}</span>
                }} disabled={options.rowData.docgrp_estadocomentario === 0} />
        );
    }
    const onChangeEstado=(e,options)=>{
       
        if(e.value===3||e.value===0){
            alertaEstado();
        }else{
           options.editorCallback(e.value) 
        }
        
    }
    const estadoBodyTemplate = (estado) => {
        return getEstadoLabel(estado);
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <>            
            {(rowData.docgrp_pdf_documento!=null)?<a href={rowData.docgrp_pdf_documento} target={'_blank'} rel="noreferrer" style={{textDecorationLine : "none"}}> <Button icon="pi pi-eye" className="p-button-rounded p-button-warning"  /> </a>: <Button icon="pi pi-eye" className="p-button-rounded p-button-warning"  disabled/> }
            
            </>
        );
    }
    const showSuccess = () => {
            toast.current.show({severity:'success', summary: 'Retroalimentación', detail:'Guardada', life: 3000});
        }
       //aqui termina componente
       const alertaEstado=()=>{
        swal({
            title: "¡Atención!",
            text: "¡No se puede seleccionar esa opcion!",
            icon: "warning",
            button: "Aceptar",
            timer: "3000"
          });
    }
	const rowTemplate = (rowData) => {
        return data.indexOf(rowData) + 1;
    }
    
    return (
        <div>
          <Toast ref={toast} />  
          <center><h2>Documentos de {materiagrupo}</h2></center>     
                <div className="card">
                    <Panel>
                         <DataTable value={data} editMode="row"   dataKey="id" onRowEditComplete={onRowEditComplete} responsiveLayout="scroll">
                            <Column body={rowTemplate} header={"ID"}></Column>
                            <Column field={"frm_nombre"} header={"Formato"}></Column>
                            <Column field={"docgrp_estadocomentario"} header={"Estado"} body={(rowData) => estadoBodyTemplate(rowData['docgrp_estadocomentario'])} editor={(options) => editorEstado(options)} style={{ width: '10%' }}></Column>
                            <Column field={"docgrp_comentario"} header={"Retroalimentacion"} editor={(options) => retroalimentacion(options)} style={{ width: '15%' }}></Column>                    
                            <Column body={(rowData) => actionBodyTemplate(rowData)} header={"Documento"}></Column>
                        
                            <Column rowEditor headerStyle={{ width: '5%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }} ></Column>
                        </DataTable>
                    </Panel>
               
            </div>
        </div>
    )
}

export default DocumentosGrupo
