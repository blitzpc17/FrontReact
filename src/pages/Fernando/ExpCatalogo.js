import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { ExpCursoServicio } from '../../services/Fernando/ExpCursoServicio';
import { Panel } from 'primereact/panel';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const ExpCatalogo = (props) => {
    const navigate = new useNavigate();

    const {depName, iddep} = new useParams();

    const idActivo = parseInt(iddep);

    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const dt = useRef(null);
    const productService = new ExpCursoServicio();

    const cols = [
        { field: 'inst_Nombre_Curso', header: 'Servicio' },
        { field: 'inst_Empresa', header: 'Instancia' },
        { field: 'inst_Periodo', header: 'Periodo Impartido' },
        { field: 'inst_Asistentes', header: 'No.Asistentes' },
        { field: 'inst_Tipo', header: 'Tipo de Servicio' },
        { field: 'inst_docente_imparte', header: 'Docente' },
        { field: 'inst_Cupo', header: 'Cupo' },
        { field: 'inst_Horas', header: 'Horas' }
    ];

    const exportColumns = cols.map(col => ({ title: col.header, dataKey: col.field }));

    useEffect(() => {
        if(!cookies.get('rolesUsuario').rol_jefe_vinculacion)
            navigate('/plataforma/menu');
        else{
            if(cookies.get('actualTemp') === 'Exportar Información')
                productService.search(idActivo).then(data => setProducts(data));
            else{
                navigate('/plataforma/menuvinculacion');
            }
        }
        
    }, []);

    
    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    }


    const header = (
        <div className="p-d-flex p-ai-center export-buttons">
            <h4>Exportar: </h4>
            <Button type="button" label="FORMATO EXCEL" icon="pi pi-file-excel" onClick={() => exportCSV(false)} className="p-button-success p-mr-2" data-pr-tooltip="CSV" /> 
            
            
        </div>
    );
    return (
        <div>
            <div className="card">
                <h1>{"Catalogo de Servicios de " + depName}</h1>
                <Panel>
                    <Tooltip target=".export-buttons>button" position="bottom" />
                    <DataTable ref={dt} value={products} header={header} dataKey="id" responsiveLayout="scroll" showGridlines
                        selectionMode="multiple" selection={selectedProducts}>
                        {
                            cols.map((col, index) => <Column key={index} field={col.field} header={col.header} />)
                        }
                    </DataTable>
                </Panel>
            </div>
        </div>
    );
}

export default ExpCatalogo;
