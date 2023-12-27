import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Image, InputGroup, FormControl, Row, Col, Container, Card, ListGroup, Tab, Tabs } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faUsers } from '@fortawesome/free-solid-svg-icons';

import * as constantes from '../../Models/Constantes';
import { Modal, Form } from 'react-bootstrap';
import EditarEmpresa from '../../Components/Empresa/EditarEmpresaComp';
import "../../Styles/detalle.scss"
import CabeceraRegistrar from '../../Components/CabeceraRegistrar';
import PublicarEmpleo from '../../Components/Empresa/PublicarEmpleoComp';
import EditarEmpleoComp from '../../Components/Empresa/EditarEmpleoComp';
import VerPostulaciones from '../../Components/Empresa/VerPostulacionesComp';

function DetalleEmpresa(props) {
  const { id } = useParams();
  const [empresa, setEmpresa] = useState({});
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Estados y manejadores para el modal de editar usuario
  // Estados y manejadores para el modal de editar usuario
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const handleShowEditUserModal = () => setShowEditUserModal(true);
  const handleCloseEditUserModal = () => setShowEditUserModal(false);
  const [showPublicarEmpleoModal, setShowPublicarEmpleoModal] = useState(false);
  const [empleos, setEmpleos] = useState([]);
  ///PUBLICAR  , ELIMINAR Y EDITAR EMPLEO:
  const [empleoAEliminar, setEmpleoAEliminar] = useState(null);
  const [showModalEliminar, setShowModalEliminar] = useState(false);
  ///
  ///
  // ... otros estados ...
  const [showEditEmpleoModal, setShowEditEmpleoModal] = useState(false);
  const [editingEmpleoId, setEditingEmpleoId] = useState(null);
  const [empleoid, setempleoid] = useState([]);

  ///postuklacion
  const [showModal, setShowModal] = useState(false);
  const [postulantes, setPostulantes] = useState([]);

  // Función para mostrar los postulantes de un empleo específico
  const mostrarPostulantes = async (idEmpleo) => {
    try {
      const respuesta = await axios.get(`http://localhost:8000/api/postulations/job/${idEmpleo}`);
      setPostulantes(respuesta.data); // Actualiza el estado con los postulantes obtenidos
      setShowModal(true);             // Muestra el modal
    } catch (error) {
      console.error('Error al obtener postulantes:', error);
    }
  };


  //
  const handleEditEmpleoClick = (experienceId) => {
    setEditingEmpleoId(experienceId);
    setShowEditEmpleoModal(true);
  };

  const handleShowModalEliminar = (empleoId) => {
    setEmpleoAEliminar(empleoId);
    setShowModalEliminar(true);
  };
  const eliminarEmpleo = () => {
    axios.delete(`http://localhost:8000/api/job/${empleoAEliminar}`)
      .then(() => {
        setEmpleos(empleos.filter(empleo => empleo._id !== empleoAEliminar));
        setShowModalEliminar(false);
      })
      .catch(err => console.error(err));
  };



  //INFORMACION DE LA EMPRESA
  const recargarInformacionEmpresa = () => {
    axios.get(`http://localhost:8000/api/company/${id}`)
      .then((res) => {
        setEmpresa({ ...res.data });
      })
      .catch((err) => console.log(err));
  };


  const actualizarListaEmpleos = (nuevoEmpleo) => {
    setEmpleos([...empleos, nuevoEmpleo]);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/company/${id}`)
      .then((res) => {
        setEmpresa({ ...res.data });
        recargarInformacionEmpresa();
        cargarEmpleos();
      })
      .catch((err) => console.error(err));
    axios.get(`http://localhost:8000/api/job/${id}`)
      .then((res) => {
        setempleoid(res.data);
      })
      .catch((err) => console.log(err));

    cargarEmpleoid();
  }, [id]);

  const handleEditClick = () => {
    setNewImageUrl(empresa.foto);
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(`http://localhost:8000/api/company/${id}`, { foto: newImageUrl });
      setEmpresa({ ...empresa, foto: newImageUrl });
      setIsEditing(false);
    } catch (error) {
      console.error('Error al guardar la nueva URL:', error.response.data.error);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setNewImageUrl('');
  };
  const cargarEmpleos = () => {
    axios.get(`http://localhost:8000/api/jobs/company/${id}`)
      .then((res) => {
        setEmpleos(res.data);
      })
      .catch((err) => console.error(err));
  };

  const cargarEmpleoid = () => {
    axios.get(`http://localhost:8000/api/job/${id}`)
      .then((res) => {
        setempleoid(res.data);
      })
      .catch((err) => console.log(err));
  };
  const onEmpleoEditado = (empleoEditado) => {
    // Actualizar la lista de empleos con la información del empleo editado
    const empleosActualizados = empleos.map(empleo => {
      if (empleo._id === empleoEditado._id) {
        return empleoEditado;
      }
      return empleo;
    });
    setEmpleos(empleosActualizados);
  };

  return (
    <div className="App">
      <CabeceraRegistrar></CabeceraRegistrar>
      <Container className="mt-4">
        <Row>
          <Col md={4}>
            <Card>
              <Card.Body>
                <div className="image-container text-center mb-3">
                  {isEditing ? (
                    <InputGroup className="mb-1">
                      <FormControl
                        placeholder="Ingrese la URL de la foto de perfil"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                      />
                    </InputGroup>
                  ) : (
                    <div className="image-container ">
                      <Image src={empresa.foto} alt="Foto de perfil" roundedCircle className="img-fluid" />
                    </div>)}

                  {isEditing ? (
                    <div>
                      <Button variant="success" onClick={handleSaveClick} className="me-2">
                        Guardar
                      </Button>
                      <Button variant="secondary" onCly ick={handleCancelClick}>
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline-info" onClick={handleEditClick}>
                      <i className="fas fa-pencil-alt"></i> Editar Foto
                    </Button>
                  )} </div>

                <hr className="d-md-none" /> {/* Esta línea solo se muestra en pantallas pequeñas */}

                <ListGroup variant="flush">
                  <h3 className="bienvenido-titulo">Datos Personales</h3>
                  <p>Nombre: {empresa.nombreEmpresa} </p>
                  <p>Correo: {empresa.correo}</p>
                  <p>Dirección: {empresa.direccion}</p>
                  <p>Teléfono: {empresa.telefono}</p>
                  <p>Descripción: {empresa.descripcion}</p>

                  <FontAwesomeIcon icon={faEdit} className="edit-icon" onClick={handleShowEditUserModal} style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '1.5em', cursor: 'pointer' }} />

                  <Modal show={showEditUserModal} onHide={handleCloseEditUserModal} size="lg">
                    <Modal.Header closeButton>
                      <Modal.Title className='tituloModal'>Editar Empresa</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <EditarEmpresa id={id} onEmpresaUpdated={recargarInformacionEmpresa} closeEditModal={() => setShowEditUserModal(false)}
                      />
                    </Modal.Body>
                  </Modal>
                </ListGroup>
              </Card.Body>
            </Card>
            <div className="botones-centrados">
              <Button variant="danger" onClick={() => navigate("/empresa")}>
                Salir
              </Button>

            </div>
          </Col>
          <Col md={8}>
            {/* Pestañas para información académica y laboral */}
            <Tabs defaultActiveKey="publicarEmpleo" id="info-tab" className="mb-3">
              <Tab eventKey="publicarEmpleo" title="Publicar Empleo">
                <Card>
                  <Card.Body>
                    {empleos.length > 0 ? (
                      <ListGroup className="empleos-lista">
                        <h3>Empleos publicados</h3>
                        {empleos.map((empleo) => (
                          <ListGroup.Item key={empleo._id} className="mt-4 border p-3 position-relative">
                            <div className="empleo-detalle">
                              <span><strong>Descripción del Empleo:</strong> {empleo.descripcion}</span>
                            </div>
                            <div className="empleo-detalle">
                              <span><strong>Conocimientos Requeridos:</strong> {empleo.conocimientos}</span>
                            </div>
                            <div className="empleo-detalle">
                              <span><strong>Aptitudes Necesarias:</strong> {empleo.aptitudes}</span>
                            </div>
                            <div className="empleo-detalle">
                              <span><strong>Número de Vacantes:</strong> {empleo.numeroVacantes}</span>
                            </div>
                            <FontAwesomeIcon icon={faUsers} onClick={() => mostrarPostulantes(empleo._id)} />


                            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                              <FontAwesomeIcon icon={faEdit} className="text-primary mr-2" style={{ cursor: 'pointer', fontSize: '1.5em', marginRight: '15px' }}
                                onClick={() => handleEditEmpleoClick(empleo._id)}
                              /> <FontAwesomeIcon icon={faTrashAlt} onClick={() => handleShowModalEliminar(empleo._id)} className="text-danger" style={{ cursor: 'pointer', fontSize: '1.5em' }} />
                            </div>
                            <Modal show={showModalEliminar} onHide={() => setShowModalEliminar(false)}>
                              <Modal.Header closeButton>
                                <Modal.Title>Confirmar Eliminación</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                ¿Estás seguro de que deseas eliminar este empleo?
                              </Modal.Body>
                              <Modal.Footer>
                                <Button >
                                  Cancelar
                                </Button>
                                <Button variant="danger" onClick={eliminarEmpleo}>
                                  Eliminar
                                </Button>
                              </Modal.Footer>
                            </Modal>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <p>No hay empleos publicados actualmente.</p>
                    )}

                    <div className='botones-centrados'>
                      <Button variant="primary" onClick={() => setShowPublicarEmpleoModal(true)}>
                        Publicar Empleo
                      </Button>
                    </div>
                    {/* Modal para mostrar postulantes */}
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                      <Modal.Header closeButton>
                        <Modal.Title>Postulantes</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        {/* Asegúrate de que VerPostulaciones maneje correctamente la lista de postulantes */}
                        <VerPostulaciones postulantes={postulantes} />
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                          Cerrar
                        </Button>
                      </Modal.Footer>
                    </Modal>
                    {/* Modal para Publicar Empleo */}
                    <Modal show={showPublicarEmpleoModal} onHide={() => setShowPublicarEmpleoModal(false)} size="lg">
                      <Modal.Header closeButton>
                        <Modal.Title className='tituloModal'>Publicar Empleo</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <PublicarEmpleo idEmpresa={id} onEmpleoPublicado={actualizarListaEmpleos} />
                      </Modal.Body>
                    </Modal>
                    {/* Modal para Editar Empleo */}

                    <Modal show={showEditEmpleoModal} onHide={() => setShowEditEmpleoModal(false)} size="lg">
                      <Modal.Header closeButton>
                        <Modal.Title>Editar Empleo</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        {editingEmpleoId && <EditarEmpleoComp idEmpleo={editingEmpleoId}
                          onEmpleoEditado={onEmpleoEditado} closeEditModal={() => setShowEditEmpleoModal(false)} />}
                      </Modal.Body>

                    </Modal>

                  </Card.Body>
                </Card>
              </Tab>







            </Tabs>
          </Col>
        </Row>
      </Container>

    </div>
  );
}

export default DetalleEmpresa;