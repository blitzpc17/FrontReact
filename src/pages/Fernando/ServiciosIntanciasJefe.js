import React, { useState, useEffect, useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import BreadCrumbContext from '../../context/BreadCrumbContext';
import { DepsSocialService } from '../../services/Fernando/SocialDepsService';
const cookies = new Cookies();

const ServicioInstanciasJefe = (props) => {
    const navigate = new useNavigate();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    const idPer = parseInt(cookies.get('id_Periodo'));

    const {depRegistro, iddep} = new useParams();

    const idDepReg = parseInt(iddep);
    
    //Servicios
    const [value, setValue] = useState([]);
    const serSocial = new DepsSocialService();
    //Servicios
    
    useEffect(() => {  
        if(!cookies.get('rolesUsuario').rol_jefe_vinculacion)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Instancias Social')
                serSocial.search(idDepReg, idPer).then(data => setValue(data));
            else{
                navigate('/plataforma/menuvinculacion');
            }
        }      
                
    }, []);
    
    
    const doc=(rowData)=>{ 
        let nombre = rowData.serv_nombre_alumno;
        let control = rowData.serv_no_control;
        let conjunto = nombre + " - " + control;
        let servicioRegistro = rowData.id_Servicio;
        //idDepReg
        //depRegistro
        return(            
            <Button icon="pi pi-angle-right" className="p-button-rounded" 
                onClick={() => {
                    cambiarBreadLocal('Documentos Alumno');
                    navigate('/plataforma/documentosocialjefe/'+ depRegistro + '/' + conjunto + '/' + servicioRegistro);   
                }}
            />            
        )
    }
    
    const cambiarBreadLocal = (lblActual) => {
        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/instanciasocialjefe/' + depRegistro + '/' + idDepReg });

        cambiarBread(direccionesTemp, lblActual);
    }
    
    return (
        <div>
            
            <Panel>
            <center>
                <table border="0" >
                    <tbody>
                        <tr>
                            <td style={{paddingRight: '5rem'}}>
                                <div className="textoA">Alumnos en Servicio Social</div>
                                <div className="textoA">{depRegistro}</div>
                            </td>                                                        
                        </tr>                    
                    </tbody>
                </table>
            </center>
            <br></br>
                <div className="card">
                    <DataTable value={value}  scrollable>
                        <Column field="serv_no_control" header="No.Control"></Column>
                        <Column field="serv_nombre_alumno" header="Nombre del Estudiante"></Column>
                        <Column field="serv_carrera" header="Carrera"></Column>
                        <Column field="" body={doc} header="Documentos"></Column>
                    </DataTable>
                </div>
            </Panel>            
               
        </div>
    )
}

export default ServicioInstanciasJefe;
