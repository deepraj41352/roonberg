import React, { useContext, useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { MdQueue, MdTask } from 'react-icons/md';
import { GrCompliance } from 'react-icons/gr';
import { HiUserGroup } from 'react-icons/hi';
import data from '../dummyData';
import Chart from 'react-google-charts';
import { Store } from '../Store';
import WidgetsDropdown from '../widgets/widgets/WidgetsDropdown';
import WidgetsDropdown2 from '../widgets/widgets/WidgetsDropdown2';

import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';

export default function AdminDashboard() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { toggleState, userInfo, } = state;

  const theme = toggleState ? 'dark' : 'light';

  return (
    <>
      {/* {dashboardLoadingUser || dashboardLoadingProject ? (

        <>
          <div className="ThreeDot">
            <ThreeDots
              height="80"
              width="80"
              radius="9"
              className="ThreeDot justi`fy-content-center"
              color="#0e0e3d"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClassName=""
              visible={true}
            />
          </div>
        </>
      ) : ( */}

      <>
        {userInfo.role === 'superadmin' || userInfo.role === 'admin' ? (

          <div className="px-4 mt-3">
            <Row className="px-2 gap-3">
              <Col className=" p-0 ">
                <WidgetsDropdown />
              </Col>
            </Row>

            {/* <Row className="px-2 gap-3">
          <Col className=" p-0 ">
            <Card className={`${theme}CardBody`}>
              <Card.Body>
                <Card.Title className="d-flex justify-content-center align-items-center">
                  <MdQueue className="mx-2" />
                  <span>Project in Queue</span>
                </Card.Title>
                <Card.Text>03</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col className=" p-0 ">
            <Card className={`${theme}CardBody`}>
              <Card.Body>
                <Card.Title className="d-flex justify-content-center align-items-center">
                  <MdTask className="mx-2 " />
                  <span>Completed Projects</span>
                </Card.Title>
                <Card.Text>10/03</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col className=" p-0 ">
            <Card className={`${theme}CardBody`}>
              <Card.Body>
                <Card.Title className="d-flex justify-content-center align-items-center">
                  <HiUserGroup className="mx-2" />
                  <span>Number of Agents</span>
                </Card.Title>
                <Card.Text>10</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col className=" p-0 ">
            <Card className={`${theme}CardBody`}>
              <Card.Body>
                <Card.Title className="d-flex justify-content-center align-items-center">
                  <HiUserGroup className="mx-2" />
                  <span>Number of Contractor</span>
                </Card.Title>
                <Card.Text>10</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="w-100">
          <Col className="my-3">
            <h2>Category</h2>
            {data.categories.length === 0 ? (
              <div>Data not found</div>
            ) : (
              <>
                {/* <Chart width="100%"
                                height="400px"
                                chartType='AreaChart'
                                loader={<div>Loading Chart</div>}
                                data={[
                                    ['Category'],
                                    ...data.categories.map((x) => [x._id, x.count]),
                                ]}
                            >
                            </Chart>
              </>
            )}
          </Col>
        </Row> */}
          </div>
        ) : (
          <>

            <Row>
              <Col className=" p-0 ">
                <WidgetsDropdown2 />
              </Col>
            </Row>


          </>
        )}
      </>

    </>
  );
};
