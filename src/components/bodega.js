import React from 'react';
import { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import axios from 'axios';

const Bodega = ({tipo, usado, total, idbodega}) => {
    const [storesinventory, setStoresinventory] = useState();
    const [isshow, setIsShow] = useState(false);
    
    const handleButtonMostrar = () => {
        if (idbodega === undefined) {
            return;
        }
        axios
            .get(`http://lagarto17.ing.puc.cl/storesinventory?storeId=${idbodega}`)
            .then(response => {
                setStoresinventory(response.data);
                setIsShow(true);
            })
            .catch(error => {
                console.error(error);
            });
        }

    const handleButtonOcultar = () => {
        setIsShow(false);
    }

    return (
        <Card>
            <Card.Header className='text-center fw-bold'>Bodega {tipo}</Card.Header>
            <Card.Body className='text-center'>
                <p>Espacio usado: {usado}</p>
                <p>Total Espacio: {total}</p>
            </Card.Body>
            {isshow ? <p><Button variant="primary" onClick={(e) => handleButtonOcultar()}>Ocultar</Button></p> : <p><Button variant="primary" onClick={(e) => handleButtonMostrar()}>Ver Recursos</Button></p>}
            {isshow ? 
            <table style={{ margin: '0 auto' }}>
                <thead>
                    <tr>
                    <th style={{ padding: '1rem' }}>SKU</th>
                    <th style={{ padding: '1rem' }}>Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    {storesinventory.map((item, index) => (
                    <tr key={index}>
                        <td>{item.sku}</td>
                        <td>{item.quantity}</td>
                    </tr>
                    ))}
                </tbody>
            </table> 
            : <p></p>}
            <br/>
        </Card>
    );
};

export default Bodega;