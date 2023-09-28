import React from 'react'
import { Card, Col, Row } from 'react-bootstrap';
import { MdQueue } from 'react-icons/md';
import { GrCompliance } from 'react-icons/gr';
import { HiUserGroup } from 'react-icons/hi';
import data from '../dummyData';
import Chart from 'react-google-charts';

export default function AdminDashboard() {
    return (
        <>
            <Row className='m-2'>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title className='d-flex justify-content-center align-items-center'>
                                <MdQueue className='mx-2' />
                                <span>Project in Queue</span>
                            </Card.Title>
                            <Card.Text>03</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title className='d-flex justify-content-center align-items-center'>
                                <GrCompliance className='mx-2' />
                                <span>Completed Projects</span>

                            </Card.Title>
                            <Card.Text>10/03</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title className='d-flex justify-content-center align-items-center'>
                                <HiUserGroup className='mx-2' />
                                <span>Number of Agents</span>

                            </Card.Title>
                            <Card.Text>10</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title className='d-flex justify-content-center align-items-center'>
                                <HiUserGroup className='mx-2' />
                                <span>Number of Contractor</span>
                            </Card.Title>
                            <Card.Text>10</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className='w-100'>
                <Col>
                    <h2>Category</h2>
                    {data.categories.length === 0 ? <div>Data not found</div>
                        : (<>
                            <Chart width="100%"
                                height="400px"
                                chartType='AreaChart'
                                loader={<div>Loading Chart</div>}
                                data={[
                                    ['Category'],
                                    ...data.categories.map((x) => [x._id, x.count]),
                                ]}
                            >
                            </Chart>
                        </>)}
                </Col>
            </Row>
        </>
    )
}
