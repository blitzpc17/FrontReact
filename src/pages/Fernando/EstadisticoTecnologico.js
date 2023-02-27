import React, { useState, useEffect, useContext } from 'react';
import { TecnologicoProductosServicio } from '../../services/Fernando/TecnologicoProductosServicio';
import { DataTable } from 'primereact/datatable';
import { Panel } from 'primereact/panel';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import './estilos/tablaA.css';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import BreadCrumbContext from '../../context/BreadCrumbContext';

const cookies = new Cookies();

const EstadisticoTecnologico =()=>{
    const navigate = new useNavigate();

    const {idPeriodo} = new useParams();

    const { actual, direcciones, cambiarBread } = useContext(BreadCrumbContext);

    const depRegistro = parseInt(cookies.get('id_Departamento'));
    const idPer = parseInt(idPeriodo);

    const [value, setValue] = useState([]);
    const GetPrincipal = new TecnologicoProductosServicio();

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_desarrollo_academico_departamental)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Estadístico Desarrollo Tecnológico')
                GetPrincipal.search(depRegistro, idPer).then(data => setValue(data));
            else
                navigate('/plataforma/periodosjefeinvestigacion');
        }
        
    }, []); 

    const residencia =(rowData)=>{
        let comp = rowData.comp_residencia;
        let int = rowData.in_residencia;
        return(
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <h5 className='textodiv2'>{comp}</h5>                 
                            </td>
                            <td>
                                <h5 className='textodiv'>{int}</h5>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    const tesis =(rowData)=>{
        let comp = rowData.comp_tesis;
        let int = rowData.in_tesis;
        return(
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <h5 className='textodiv2'>{comp}</h5>                 
                            </td>
                            <td>
                                <h5 className='textodiv'>{int}</h5>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    const articulos =(rowData)=>{
        let comp = rowData.comp_articulo;
        let int = rowData.in_articulo;
        return(
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <h5 className='textodiv2'>{comp}</h5>                 
                            </td>
                            <td>
                                <h5 className='textodiv'>{int}</h5>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    

    const investigacion =(rowData)=>{
        let comp = rowData.comp_investigacion;
        let int = rowData.in_investigacion;
        return(
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <h5 className='textodiv2'>{comp}</h5>                 
                            </td>
                            <td>
                                <h5 className='textodiv'>{int}</h5>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    const computo =(rowData)=>{
        let comp = rowData.comp_computo;
        let int = rowData.in_computo;
        return(
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <h5 className='textodiv2'>{comp}</h5>                 
                            </td>
                            <td>
                                <h5 className='textodiv'>{int}</h5>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    const docente =(rowData)=>{
        let name = rowData.nombre_producto_doc;
        return(
            <Button label={name} className="p-button-link" onClick={() => {
                cambiarBreadLocal('Retroalimentación', rowData);
                navigate('/plataforma/retrotecnologico/'+rowData.nombre_producto_doc + '/' + rowData.id_producto_doc);
            }}/>
        )
    }

    const cambiarBreadLocal = (lblActual) => {
        let direccionesTemp = direcciones;
        direccionesTemp.push({ label: actual, url: '/plataforma/estadisticotecnologico/' + idPer });

        cambiarBread(direccionesTemp, lblActual);
    }

    return(
        <div>
            <center>
                <h1>Estadistico General Desarrollo Tecnologico</h1>
            </center>
            <br></br>
            <Panel>
                <DataTable value={value} responsiveLayout="scroll" showGridlines>
                    <Column header="Nombre Docente" body={docente}></Column>
                    <Column header="Residencia" body={residencia} style={{ width: '15%'}} ></Column>                    
                    <Column header="Tesis" body={tesis} style={{ width: '15%'}}></Column>                    
                    <Column header="Articulos" body={articulos} style={{ width: '15%'}} ></Column>                   
                    <Column header="Proyectos de Investigación" body={investigacion} style={{ width: '15%'}}></Column>                    
                    <Column header="Programas de Computo" body={computo} style={{ width: '15%'}}></Column>
                </DataTable>
            </Panel>
        </div>
    )
}

export default EstadisticoTecnologico;
