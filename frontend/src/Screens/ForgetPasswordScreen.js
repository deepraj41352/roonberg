import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import Validations from '../Components/Validations';

export default function ForgetPassword() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

    }
    return (
        <>
            <Container className='fullContainer d-flex flex-column justify-content-center align-items-center'>
                <Row>
                    <Col>
                        <h4 className='mb-3 heading4'>Forget Password</h4>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card className='p-4 formColor'>
                            <Form onSubmit={handleSubmit} className='formWidth d-flex flex-column'>
                                <Form.Label className='textLeft text-left' >Email Address</Form.Label>

                                <Form.Control className='px-2  py-1 mb-3' type='email' onChange={(e) => setEmail(e.target.value)} required />
                                <Validations type="email" value={email} />
                                <Button type='submit' className='globalbtnColor px-5 py-1'>Submit</Button>
                            </Form>
                        </Card></Col>
                </Row>


            </Container>
        </>
    )
}