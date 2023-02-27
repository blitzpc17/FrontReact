import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState, useEffect,useRef } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import swal from 'sweetalert';
import { Panel } from 'primereact/panel';
import { UserTecnologicosService } from '../../services/Fernando/UserTecnologicosService';
import { TecnologicoService } from '../../services/Fernando/TecnologicoService';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';

const cookies = new Cookies();

const RetroalimentacionTecnologico =()=>{
    const navigate = new useNavigate();
    
    const [documentos, setDocumentos] = useState(null);
    const toast = useRef(null);
  // Parametros para las consultas
    const [grupo, setGrupo] = useState(1);
      useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_desarrollo_academico_departamental)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Retroalimentación')
                GetPrincipal.search(idPerDoc).then(data => setData(data));
            else
                navigate('/plataforma/periodosjefeinvestigacion');
        }
            
   
      }, []);

        //Variable periodo
        var readonly = false;

      //aqui inicia componente
      const {iddocper , nombreusuario} = new useParams();
      //aqui inicia componente
      const idPerDoc = parseInt(iddocper);
      const nomReg = nombreusuario;

      const GetPrincipal = new UserTecnologicosService();
      const servicioDocente=new TecnologicoService();
      const [data, setData] = useState(documentos);
     
        const tiposEstados = [
            { label: 'Completo', value: 1 },
            { label: 'Incompleto', value: 2 }
        ];
    

    const getEstadoLabel = (estado) => {
        switch (estado) {
            case 1:
                return   'Completo';
            case 2:
                return   'Incompleto';
            case 3:
                return   'Subido';
            default:
                return   'Sin Subir';
        }
    }
   
    const onRowEditComplete = (e) => {
        if(readonly == false){
            console.log(e);
            let _data = [...data];
            let { newData, index } = e;

            _data[index] = newData;

            setData(_data);
            guardarRetroalimentacion(newData);
        }else{
            swal({
                title: "¡No se puede modificar!",
                text: "¡El periodo ya no esta activo!",
                icon: "warning",
                button: "Aceptar",
                timer: "3000"
              }); 
        }
    }
    const guardarRetroalimentacion=(retro)=>
    {
        const temRetro={
            
            /*id_documentogrupo:retro.id_documentogrupo,
            id_grupo:grupo,
            id_formato: retro.id_formato,
            docgrp_pdf_documento: retro.docgrp_pdf_documento,
            docgrp_comentario: retro.docgrp_comentario,
            docgrp_estadocomentario: retro.docgrp_estadocomentario*/

            id_docper: idPerDoc,
            prodestec_nombre_producto: retro.prodestec_nombre_producto,
            prodestec_procedencia: retro.prodestec_procedencia,
            prodestec_estado: retro.prodestec_estado,
            prodestec_pdf_producto: retro.prodestec_pdf_producto,
            prodestec_comentario: retro.prodestec_comentario,
            prodestec_retroalimentacion:retro.prodestec_retroalimentacion,
            id_productos_desa_tec: retro.id_productos_tecnologico,
            notify: 1

        }
        console.log(temRetro);
        servicioDocente.save(temRetro).then(data=>{           
           showSuccess();
              setData(null);
              GetPrincipal.search(idPerDoc).then(data => setData(data));
        });
    }
    
    const retroalimentacion = (options) => {
        return <InputTextarea value={options.value} onChange={(e) => options.editorCallback(e.target.value)} rows={2} cols={10}  maxLength="255"/>;
    }

    const editorEstado = (options) => {
        return (
            <Dropdown value={options.value} options={tiposEstados} optionLabel="label" optionValue="value"
                onChange={(e) => onChangeEstado(e,options)} placeholder="Selecciones Estado"
                itemTemplate={(option) => {
                    return <span className={`product-badge status-${option.value}`}>{option.label}</span>
                }} disabled={options.rowData.prodoc_retroalimentacion === 0} />
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
            {(rowData.prodestec_pdf_producto!=null)?<a href={rowData.prodestec_pdf_producto}  target="_blank" rel="noreferrer" style={{textDecorationLine : "none"}}> <Button icon="pi pi-eye" className="p-button-rounded p-button-warning"  /> </a>: <Button icon="pi pi-eye" className="p-button-rounded p-button-warning"  disabled/> }
            
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

    const Tableestado = (rowData)=>{
        let estadoActual;
        if(rowData.prodestec_estado == 0){
            estadoActual = "En proceso"
        }else{
            estadoActual = "Completo"
        }
        return(
            <div>
                <h4>{estadoActual}</h4>
            </div>
        )
    }
    return (
        <div>
          <Toast ref={toast} />  
          <center><h1>Desarrollo Tecnologico de {nomReg}</h1></center>  
          <br></br>   
                <div className="card">
                    <Panel>
                         <DataTable value={data} editMode="row"   dataKey="id" onRowEditComplete={onRowEditComplete} responsiveLayout="scroll">
                            <Column field={"prodestec_nombre_producto"} header={"Producto Realizado"}></Column>
                            <Column field={"prodestec_procedencia"} header={"Procedencia"}></Column>
                            <Column header="Estado" body={Tableestado}></Column>
                            <Column field={"prodestec_retroalimentacion"} header={"Retroalimentación"} body={(rowData) => estadoBodyTemplate(rowData['prodestec_retroalimentacion'])} editor={(options) => editorEstado(options)}></Column>
                            <Column field={"prodestec_comentario"} header={"Comentarios"} editor={(options) => retroalimentacion(options)}></Column>                    
                            <Column body={(rowData) => actionBodyTemplate(rowData)} header={"Ver"}></Column>                        
                            <Column rowEditor headerStyle={{ width: '5%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                        </DataTable>
                    </Panel>
               
            </div>
        </div>
    )

}

export default RetroalimentacionTecnologico;
