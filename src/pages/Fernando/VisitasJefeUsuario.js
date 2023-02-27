import React, { useState, useEffect, useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown } from 'primereact/dropdown';
import { UsuariosVisitas } from '../../services/Fernando/UsuariosVisitas';
import { ServicioPeriodos } from '../../services/Fernando/ServicioPeriodos';
import { CarreraServicio } from '../../services/Fernando/CarrerasServicio';
import swal from 'sweetalert';
import { VisitasService } from '../../services/Fernando/VisitasService';
import { DocumentosVisitasServicio } from '../../services/Fernando/DocumentosVisitasServicio';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import BreadCrumbContext from '../../context/BreadCrumbContext';

const cookies = new Cookies();
export const VisitasJefeUsuario = () => {

    const navigate = new useNavigate();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    const {idreg, titulo, nom, iddep} = new useParams();

    const idDepReg = parseInt(iddep);

    const idUsReg = parseInt(idreg);//Necesita id visita del registro    

    const idPer= useState(cookies.get('id_Periodo')); 
    const lblPer= useState(cookies.get('lblPeriodo')); 


    

    //Servicios
    const [value, setValue] = useState([]);
    const UsVisitas = new UsuariosVisitas();  
    
    const [periodo, setPeriodo] = useState([]);
    const getPer  = new ServicioPeriodos();

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_vinculacion)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Docentes Visita'){
                UsVisitas.search(idUsReg).then(data => setValue(data));
                getPer.getAll().then(data => setPeriodo(data));
            }
            else{
                navigate('/plataforma/menuvinculacion');
            }
        }
        
        
    }, []);

    const doc=(rowData)=>{  
         //idDepReg
        //titulo
        //rowData.vst_docente
        //rowData.id_Usuarios    
        return (                       
            <Button icon="pi pi-chevron-right" className="p-button-rounded p-button-info" 
            onClick={() => {
                cambiarBreadLocal('Documentos');
                navigate('/plataforma/documentosvisitajefe/'+ titulo + '/' + nom  + '/' + rowData.id_visita);
            }} />
    );
    }

    const cambiarBreadLocal = (lblActual) => {
        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/docentevisitajefe/' + idreg + '/' + titulo + '/' + nom + '/' + iddep });

        cambiarBread(direccionesTemp, lblActual);
    }

   
    return (
        <div>
            <Panel>                
                <center>                    
                    <table border="0">
                        <tbody>                        
                            <tr>
                                <td><center><h1>Visitas de {nom}</h1></center></td>
                            </tr> 
                            <tr>
                                <td><center><h3>{lblPer}</h3></center></td>                                
                            </tr>                           
                        </tbody>    
                    </table>
                </center>
                <br></br>
                <DataTable value={value} responsiveLayout="scroll">
                    <Column field="vst_tipo_visita" header="Tipo de Visita"></Column>
                    <Column field="vst_empresa" header="Empresa"></Column>
                    <Column field="vst_carrera" header="Carrera"></Column>
                    <Column header="Documentos" body={doc}></Column>
                </DataTable>
            </Panel>

           
        </div>
    )
};
export default VisitasJefeUsuario;
