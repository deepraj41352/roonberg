import React from 'react'
import Form from 'react-bootstrap/Form';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';

export default function ResetPasswordScreen() {
    return (
        <>
            <Container className='fullContainer d-flex flex-column justify-content-center align-items-center'>
                <Row>
                    <Col>
                        <h4 className='mb-3 heading4'>Reset Password</h4>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card className='p-4 formColor'>
                            <Form className='formWidth d-flex flex-column'>
                                <Form.Label className='textLeft text-left'>Email Address</Form.Label>
                                <Form.Control className='px-2  py-1 mb-3' type='email' required />
                                <Form.Label className='textLeft text-left'>Password</Form.Label>
                                <Form.Control className='px-2  py-1 mb-3' type='password' required />
                                <Form.Label className='textLeft text-left'>Confirm Password</Form.Label>
                                <Form.Control className='px-2  py-1 mb-3' type='password' required />
                                <Button className='globalbtnColor px-2 py-1'>Submit</Button>
                            </Form>
                        </Card></Col>
                </Row>
            </Container>
        </>
    )
}
