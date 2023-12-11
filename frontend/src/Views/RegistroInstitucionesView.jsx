import React, { useState, useEffect } from 'react';


import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/loginstyle.css';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Modal, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSchool, faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Cabecera from '../Components/Cabecera';
import TabsAdministracionComp from '../Components/Administracion/TabsAdministracionComp';

const CampoEstado = ({ valido, mensajeError }) => {
  if (mensajeError) {
    return <FontAwesomeIcon icon={faExclamationCircle} className="text-danger" />;
  } else if (valido) {
    return <FontAwesomeIcon icon={faCheckCircle} className="text-success" />;
  } else {
    return null; // No muestra nada si el campo aún no ha sido validado
  }
};
const RegistroInstituciones = (props) => {
  const [nombreInstitucion, setNombreInstitucion] = useState('');


  const [nombreInstitucionError, setNombreInstitucionError] = useState('');

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const esCampoValido = (valor, error) => {
    return valor !== '' && error === '';
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);


  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
  };

  const handleSuccessModalShow = () => setShowSuccessModal(true);

  const handleErrorModalShow = () => setShowErrorModal(true);

  const navigate = useNavigate();




  const handleInputChange = (e, setterFunction, errorSetter) => {
    const { value } = e.target;

    setterFunction(value); // Asegúrate de que esta línea esté actualizando el estado

    if (!value) {
      errorSetter('Este campo es obligatorio');
    } else {
      errorSetter('');
    }
  };






  //edad




  const onsubmitHandler = (e) => {
    e.preventDefault();

    if (!nombreInstitucion) {
      setNombreInstitucionError('El nombre de la institución es obligatorio');
      return; // Evita enviar la solicitud si hay errores de validación
    }

    axios.post('http://localhost:8000/api/school/new', { nombreInstitucion })
      .then((res) => {
        console.log(res);
        handleSuccessModalShow();
        setNombreInstitucion('');
        setNombreInstitucionError('');
      })
      .catch((err) => {
        console.log(err);
        if (err.response) {
          console.log(err.response.data); // Muestra detalles del error del servidor
          // Manejo adicional basado en la respuesta del servidor
        }
        handleErrorModalShow();
      });
  };

  return (

    <div className='App'>
      <TabsAdministracionComp />
      <Form onSubmit={onsubmitHandler} className="mi-formulario">
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <div className="input-icon-wrapper">
                <FontAwesomeIcon icon={faSchool} className="input-icon" />
                <Form.Control
                  type="text"
                  placeholder="Ingrese institucion"
                  value={nombreInstitucion}
                  onChange={(e) => handleInputChange(e, setNombreInstitucion, setNombreInstitucionError)} />
                <CampoEstado valido={esCampoValido(nombreInstitucion, nombreInstitucionError)} mensajeError={nombreInstitucionError} />

              </div>
              {nombreInstitucionError && <p className="text-danger">{nombreInstitucionError}</p>}

            </Form.Group>

          </Col>
        </Row>
        <div className="botones-centrados">
          <Button type="submit" className='btn-primary'>Crear Institucion</Button>

        </div>



      </Form>

    </div>


  );
};

export default RegistroInstituciones;