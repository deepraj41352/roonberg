import React from 'react'
import Form from 'react-bootstrap/Form';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
export default function ForgetPassword() {
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
                            <Form className='formWidth d-flex flex-column'>
                                <Form.Label className='textLeft text-left'>Email Address</Form.Label>
                                <Form.Control className='px-2  py-1 mb-3' type='email' required />
                                <Button className='globalbtnColor px-5 py-1'>Submit</Button>
                            </Form>
                        </Card></Col>
                </Row>


            </Container>
        </>
    )
}