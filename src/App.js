import './App.css';
import React from 'react';
import axios from 'axios';
import { Col, Row, Container, Table } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarApp from './components/navbar';
import Bodega from './components/bodega';

function App() {

  // const [ordenesCompraRecibidas, setOrdenesCompraRecibidas] = useState([]);
  // const [ordenesCompraRecibidasFTP, setOrdenesCompraRecibidasFTP] = useState([]);
  // const [ordenesCompraSolicitadas, setOrdenesCompraSolicitadas] = useState([]);
  const [OCRAceptadas, setOCRAceptadas] = useState(0);
  const [OCRCumplidas, setOCRCumplidas] = useState(0);
  const [OCRPendientes, setOCRPendientes] = useState(0);
  const [OCRAceptadasFTP, setOCRAceptadasFTP] = useState(0);
  const [OCRCumplidasFTP, setOCRCumplidasFTP] = useState(0);
  const [OCRPedientesFTP, setOCRPedientesFTP] = useState(0);
  const [OCSAceptadas, setOCSAceptadas] = useState(0);
  const [OCSCumplidas, setOCSCumplidas] = useState(0);
  const [OCSPendientes, setOCSPendientes] = useState(0);

  // const [bodegaRecepcion, setBodegaRecepcion] = useState();
  const [bodegaPrincipal, setBodegaPrincipal] = useState();
  // const [bodegaDespacho, setBodegaDespacho] = useState();
  const [bodegaCocina, setBodegaCocina] = useState();
  const [bodegaBuffer, setBodegaBuffer] = useState();
  const [token, setToken] = useState('');
  const [token_ordenes, setTokenOrdenes] = useState('');
  const [isloading, setIsloading] = useState(true);

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await axios.get(`http://lagarto17.ing.puc.cl/token`);
        const token = response.data[0];
        const token_ordenes = response.data[1];
        setToken(`Bearer ${token}`)
        setTokenOrdenes(`Bearer ${token_ordenes}`)
        // console.log(`Token de autenticación: ${token}`);
      } catch (error) {
        console.log(error);
      }
    };
    getToken();
  }, []);

  useEffect(() => {
    const getstores = async () => {
      try {
        const response = await axios.get(`http://lagarto17.ing.puc.cl/stores`)
        const stores = response.data;
        // eslint-disable-next-line array-callback-return
        stores.map((store) => {
          if (store.buffer === false && store.kitchen === false) {
            setBodegaPrincipal(store);
          }
          if (store.buffer === false && store.kitchen === true) {
            setBodegaCocina(store);
          }
          if (store.buffer === true && store.kitchen === false) {
            setBodegaBuffer(store);
          }
        }
        )
        setIsloading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getstores();
  }, [token]);

  const ordenesGeneradas_funcion = async (data) => {
    try {
      const response = await axios.get(`http://lagarto17.ing.puc.cl/ordenesfront?orderId=${data.order_id}`);

      console.log(response.data.estado);

      if (response.data.estado === 'aceptada') {
        setOCSAceptadas((prevCount) => prevCount + 1);
      }
      else if (response.data.estado === 'cumplida') {
        setOCSCumplidas((prevCount) => prevCount + 1);
      }
      else if (response.data.estado === 'creada') {
        setOCSPendientes((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    const ordenesGeneradas = async () => {
      try {
        const response = await axios.get('http://lagarto17.ing.puc.cl/generated_order');
        for (let i = 0; i < response.data.length; i++) {
          await ordenesGeneradas_funcion(response.data[i]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    ordenesGeneradas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token_ordenes]);

  const ordenesRecibidasB2B_funcion = async (data) => {
    try {
      const response = await axios.get(`http://lagarto17.ing.puc.cl/ordenesfront?orderId=${data.id_orden}`);

      console.log(response.data.estado);

      if (response.data.estado === 'aceptada') {
        setOCRAceptadas((prevCount) => prevCount + 1);
      }
      else if (response.data.estado === 'cumplida') {
        setOCRCumplidas((prevCount) => prevCount + 1);
      }
      else if (response.data.estado === 'creada' || response.data.estado === 'pendiente') {
        setOCRPendientes((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    const ordenesRecibidasB2B = async () => {
      try {
        const response = await axios.get('http://lagarto17.ing.puc.cl/ordenes-compra');
        const recived_order = response.data;
  
        for (let i = 0; i < recived_order.length; i++) {
          await ordenesRecibidasB2B_funcion(recived_order[i]);
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    ordenesRecibidasB2B();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token_ordenes]);
  

  const ordenesRecibidasFTP_funcion = async (data) => {
    try {
      const response = await axios.get(`http://lagarto17.ing.puc.cl/ordenesfront?orderId=${data.id_orden}`);

      console.log(response.data.estado);

      if (response.data.estado === 'aceptada') {
        setOCRAceptadasFTP((prevCount) => prevCount + 1);
      }
      else if (response.data.estado === 'cumplida') {
        setOCRCumplidasFTP((prevCount) => prevCount + 1);
      }
      else if (response.data.estado === 'creada') {
        setOCRPedientesFTP((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    const ordenesRecibidasFTP = async () => {
      try {
        const response = await axios.get('http://lagarto17.ing.puc.cl/orders_ftp');
        const recived_order_ftp = response.data;
  
        for (let i = 0; i < recived_order_ftp.length; i++) {
          await ordenesRecibidasFTP_funcion(recived_order_ftp[i]);
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    ordenesRecibidasFTP();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token_ordenes]);
  

  return (
    <div className='App'>
      <NavbarApp />
      <Container>
        {isloading ? <p>Cargando...</p> :
          <>
            <br />
            <div className="table-responsive">
              <Table className="table table-bordered table-hover table-custom">
                <thead>
                  <tr>
                    <th className="fw-bold header-cell">Ordenes de Compra</th>
                    <th className="fw-bold header-cell">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="fw-bold">Generadas aceptadas:</td>
                    <td>{OCSAceptadas}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Generadas pendientes:</td>
                    <td>{OCSPendientes}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Generadas cumplidas:</td>
                    <td>{OCSCumplidas}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Recibidas B2B aceptadas:</td>
                    <td>{OCRAceptadas}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Recibidas B2B pendientes:</td>
                    <td>{OCRPendientes}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Recibidas B2B cumplidas:</td>
                    <td>{OCRCumplidas}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Recibidas sFTP aceptadas:</td>
                    <td>{OCRAceptadasFTP}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Recibidas sFTP pendientes:</td>
                    <td>{OCRPedientesFTP}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Recibidas sFTP cumplidas:</td>
                    <td>{OCRCumplidasFTP}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
            <br />
            <Row>
              <Col>
                <Bodega
                  tipo='Recepción'
                  usado='desconocido'
                  total='desconocido'
                />
              </Col>
              <Col>
                <Bodega
                  tipo='Cocina'
                  usado={bodegaCocina.usedSpace}
                  total={bodegaCocina.totalSpace}
                  idbodega={bodegaCocina._id}
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                <Bodega
                  tipo='Principal'
                  usado={bodegaPrincipal.usedSpace}
                  total={bodegaPrincipal.totalSpace}
                  idbodega={bodegaPrincipal._id}
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                <Bodega
                  tipo='Buffer'
                  usado={bodegaBuffer.usedSpace}
                  total={bodegaBuffer.totalSpace}
                  idbodega={bodegaBuffer._id}
                />
              </Col>
              <Col>
                <Bodega
                  tipo='Despacho'
                  usado='desconocido'
                  total='desconocido'
                />
              </Col>
            </Row>
            <br />
          </>
        }
      </Container>
    </div>
  );
}

export default App;
