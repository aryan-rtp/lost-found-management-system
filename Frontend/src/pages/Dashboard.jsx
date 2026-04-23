import { useState, useEffect } from 'react';
import { Container, Button, Navbar, Nav, Form, Card, Row, Col, Modal, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ itemName: '', description: '', type: 'Lost', location: '', contactInfo: '', id: null });

    const fetchItems = async () => {
        try {
            const url = searchTerm ? `/api/items/search?name=${searchTerm}` : '/api/items';
            const { data } = await axios.get(url);
            setItems(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const bounce = setTimeout(() => {
           fetchItems();
        }, 300);
        return () => clearTimeout(bounce);
    }, [searchTerm]);

    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to delete this item?")) {
            try {
                await axios.delete(`/api/items/${id}`);
                fetchItems();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) {
                await axios.put(`/api/items/${formData.id}`, formData);
            } else {
                await axios.post('/api/items', formData);
            }
            setShowModal(false);
            setFormData({ itemName: '', description: '', type: 'Lost', location: '', contactInfo: '', id: null });
            fetchItems();
        } catch (error) {
            console.error(error);
        }
    };

    const openEdit = (item) => {
        setFormData({ ...item, id: item._id });
        setShowModal(true);
    };

    return (
        <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
            <Navbar expand="lg" className="glass-nav mb-5 sticky-top">
                <Container>
                    <Navbar.Brand className="fw-bold fs-4">?? Lost<span style={{color: '#764ba2'}}>&</span>Found</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto align-items-center gap-3">
                            <span className="nav-text">Hi, {user?.name?.split(' ')[0]} ??</span>
                            <Button variant="danger" className="shadow-sm rounded-pill px-4" onClick={logout}>
                                Logout
                            </Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="flex-grow-1 d-flex flex-column pb-5">
                <Row className="align-items-center mb-5 g-4">
                    <Col lg={7} md={6}>
                        <h2 className="mb-1" style={{fontWeight: 800, fontSize: '2.5rem', color: '#2c3e50'}}>Discover Items.</h2>
                        <p className="text-secondary fs-5" style={{fontWeight: 400}}>Find what you lost or report what you found.</p>
                    </Col>
                    <Col lg={5} md={6} className="d-flex flex-column flex-sm-row gap-3 justify-content-md-end">
                        <div className="position-relative flex-grow-1" style={{maxWidth: '350px'}}>
                            <Form.Control 
                                type="text" 
                                placeholder="Search records..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pe-5 w-100 rounded-pill shadow-sm"
                                style={{paddingLeft: '20px'}}
                            />
                            <span className="position-absolute top-50 translate-middle-y end-0 pe-3 text-muted">??</span>
                        </div>
                        <Button 
                            className="btn-gradient rounded-pill text-nowrap px-4" 
                            onClick={() => {
                                setFormData({ itemName: '', description: '', type: 'Lost', location: '', contactInfo: '', id: null });
                                setShowModal(true);
                            }}>
                            + Post Item
                        </Button>
                    </Col>
                </Row>

                <Row className="g-4">
                    {items.length === 0 ? (
                        <Col className="text-center py-5">
                            <div className="glass-card p-5 mx-auto" style={{maxWidth: '500px'}}>
                                <h3 className="text-muted mb-3">No Items Found ??</h3>
                                <p className="text-secondary">Be the first to post a lost or found item to help the community.</p>
                            </div>
                        </Col>
                    ) : (
                        items.map(item => (
                            <Col xl={3} lg={4} md={6} sm={12} key={item._id}>
                                <Card className="glass-card h-100 border-0 flex-column">
                                    <Card.Body className="d-flex flex-column p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <Card.Title className="fs-5 fw-bold mb-0 text-truncate pe-2" title={item.itemName}>
                                                {item.itemName}
                                            </Card.Title>
                                            <span className={item.type === 'Lost' ? 'badge-lost text-white fw-bold' : 'badge-found text-white fw-bold'}>
                                                {item.type}
                                            </span>
                                        </div>
                                        
                                        <Card.Text className="text-secondary flex-grow-1" style={{fontSize: '0.95rem', lineHeight: '1.5'}}>
                                            {item.description || <span className="text-muted fst-italic">No Description</span>}
                                        </Card.Text>
                                        
                                        <div className="mt-3 pt-3" style={{borderTop: '1px solid rgba(0,0,0,0.05)'}}>
                                            <div className="d-flex align-items-center mb-2" style={{color: '#4a5568'}}>
                                                <small className="fw-semibold"><span className="me-2">??</span> {item.location || 'Unknown'}</small>
                                            </div>
                                            <div className="d-flex align-items-center mb-3" style={{color: '#4a5568'}}>
                                                <small className="fw-semibold"><span className="me-2">??</span> {item.contactInfo || 'N/A'}</small>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between text-muted" style={{fontSize: '0.8rem'}}>
                                                <span>By {item.user?.name?.split(' ')[0]}</span>
                                                <span title={new Date(item.date).toLocaleString()}>
                                                    {new Date(item.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </Card.Body>
                                    
                                    {user?._id === item.user?._id && (
                                        <Card.Footer className="bg-transparent p-3 d-flex gap-2" style={{borderTop: '1px solid rgba(0,0,0,0.05)'}}>
                                            <Button variant="link" className="btn-outline-custom text-decoration-none py-1 flex-grow-1" onClick={() => openEdit(item)}>Edit</Button>
                                            <Button variant="link" className="btn-danger-custom text-decoration-none py-1 flex-grow-1" onClick={() => handleDelete(item._id)}>Delete</Button>
                                        </Card.Footer>
                                    )}
                                </Card>
                            </Col>
                        ))
                    )}
                </Row>

                <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static" className="border-0">
                    <Modal.Header closeButton className="border-0 pb-0 pt-4 px-4">
                        <Modal.Title className="fw-bold fs-3" style={{color: '#2c3e50'}}>{formData.id ? '? Edit Posting' : '? New Posting'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="px-4 py-4">
                        <Form onSubmit={handleSave}>
                            <Row>
                                <Col md={8}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold text-secondary mb-1 rounded">Item Headline</Form.Label>
                                        <Form.Control required type="text" placeholder="E.g. Blue Wallet" value={formData.itemName} onChange={e => setFormData({...formData, itemName: e.target.value})} />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold text-secondary mb-1">Status</Form.Label>
                                        <Form.Select className="fw-bold" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                            <option value="Lost">Lost ??</option>
                                            <option value="Found">Found ?</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold text-secondary mb-1">Detailed Description</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="Provide features, color, brand, etc." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            </Form.Group>
                            
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold text-secondary mb-1">Location ??</Form.Label>
                                        <Form.Control type="text" placeholder="E.g. Central Library" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-bold text-secondary mb-1">Contact Details ??</Form.Label>
                                        <Form.Control type="text" placeholder="Phone or Email" value={formData.contactInfo} onChange={e => setFormData({...formData, contactInfo: e.target.value})} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Button type="submit" className="w-100 btn-gradient py-3 text-uppercase fw-bold fs-6">
                                {formData.id ? 'Save Changes' : 'Publish to Community'}
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
};

export default Dashboard;
