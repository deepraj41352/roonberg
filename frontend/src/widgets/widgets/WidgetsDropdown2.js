import React, { useState, useEffect, useContext } from 'react';
import {
  CCard,
  CRow,
  CCol,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CCardHeader,
  CCardBody,
  CTable,
  CWidgetStatsA,
  CTableBody,
} from '@coreui/react';
import { getStyle } from '@coreui/utils';
import { CChartBar, CChartLine } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilPeople } from '@coreui/icons';
import axios from 'axios';
import { Store } from '../../Store';
import { CChartDoughnut } from '@coreui/react-chartjs';
// import UserDataWidget from './UserDataWidget';
import ProjectDataWidget from './ProjectDataWidget';

const WidgetsDropdown = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [admin, setAdmin] = useState([]);
  const [adminDates, setAdminDates] = useState([]);
  const [contractor, setContractor] = useState([]);
  const [agent, setAgent] = useState([]);

  const [userData, setUserData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [activeProject, setActiveProject] = useState([]);
  const [quedProject, setQuedProject] = useState([]);
  const [completedProject, setCompletedProject] = useState([]);

  useEffect(() => {
    const fatchUserData = async () => {
      try {
        const { data } = await axios.get(
          `/api/project/getproject/${userInfo._id}`
        );
        const projectData = data.projects;
        console.log('projectData', projectData);
        const activeProject = projectData.filter(
          (el) => el.projectStatus == 'active'
        );
        const quedProject = projectData.filter(
          (el) => el.projectStatus == 'qued'
        );
        const completedProject = projectData.filter(
          (el) => el.projectStatus == 'completed'
        );
        setActiveProject(activeProject);
        setQuedProject(quedProject);
        setCompletedProject(completedProject);
        setProjectData(projectData);
      } catch (error) {
        console.log(error);
      }
    };
    fatchUserData();
  }, []);

  const dataChartDoughnut = {
    labels: ['Active', 'Qued', 'Completed'],
    datasets: [
      {
        data: [
          activeProject.length,
          quedProject.length,
          completedProject.length,
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <>
      <CRow>
        {/* <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4"
            color="primary"
            value={
              <>
                {admin.length <= 0 ? `0` : admin.length}
              //   {/* <span className="fs-6 fw-normal">
              //   (-12.4% <CIcon icon={cilArrowBottom} />)
              // </span> 
              </>
            }
            title="Total Admin"
            chart={
              <CChartLine
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: adminDates.map((date) =>
                    new Date(date).toLocaleDateString()
                  ),
                  datasets: [
                    {
                      label: 'Registered On',
                      backgroundColor: 'transparent',
                      borderColor: 'rgba(255,255,255,.55)',
                      pointBackgroundColor: getStyle('--cui-primary'),
                      data: ['18', '59', '84', '84', '51', '55', '40'],
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: {
                        display: false,
                        drawBorder: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                    y: {
                      min: 10,
                      max: 89,
                      display: false,
                      grid: {
                        display: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 1,
                      tension: 0.4,
                    },
                    point: {
                      radius: 4,
                      hitRadius: 10,
                      hoverRadius: 4,
                    },
                  },
                }}
              />
            }
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4"
            color="info"
            value={<>{contractor.length <= 0 ? `0` : contractor.length}</>}
            title="Total Contractor"
            chart={
              <CChartLine
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                  ],
                  datasets: [
                    {
                      label: 'My First dataset',
                      backgroundColor: 'transparent',
                      borderColor: 'rgba(255,255,255,.55)',
                      pointBackgroundColor: getStyle('--cui-info'),
                      data: [1, 18, 9, 17, 34, 22, 11],
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: {
                        display: false,
                        drawBorder: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                    y: {
                      min: -9,
                      max: 39,
                      display: false,
                      grid: {
                        display: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 1,
                    },
                    point: {
                      radius: 4,
                      hitRadius: 10,
                      hoverRadius: 4,
                    },
                  },
                }}
              />
            }
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4"
            color="warning"
            value={<>{agent.length <= 0 ? `0` : agent.length}</>}
            title="Total Agent"
            chart={
              <CChartLine
                className="mt-3"
                style={{ height: '70px' }}
                data={{
                  labels: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                  ],
                  datasets: [
                    {
                      label: 'My First dataset',
                      backgroundColor: 'rgba(255,255,255,.2)',
                      borderColor: 'rgba(255,255,255,.55)',
                      data: [78, 81, 80, 45, 34, 12, 40],
                      fill: true,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      display: false,
                    },
                    y: {
                      display: false,
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 2,
                      tension: 0.4,
                    },
                    point: {
                      radius: 0,
                      hitRadius: 10,
                      hoverRadius: 4,
                    },
                  },
                }}
              />
            }
          />
        </CCol> */}
        <CCol>
          <CWidgetStatsA
            className="mb-4"
            color="danger"
            value={<>{projectData.length <= 0 ? `0` : projectData.length}</>}
            title="Total Projects"
            chart={
              <CChartBar
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                    'January',
                    'February',
                    'March',
                    'April',
                  ],
                  datasets: [
                    {
                      label: 'My First dataset',
                      backgroundColor: 'rgba(255,255,255,.2)',
                      borderColor: 'rgba(255,255,255,.55)',
                      data: [
                        78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84,
                        67, 82,
                      ],
                      barPercentage: 0.6,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false,
                        drawTicks: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                    y: {
                      grid: {
                        display: false,
                        drawBorder: false,
                        drawTicks: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            }
          />
        </CCol>
      </CRow>

      <CRow>
        <CCol sm={4} lg={4}>
          <CCard className="mh-100 mb-4">
            <CCardHeader>Projects</CCardHeader>
            <CChartDoughnut data={dataChartDoughnut} />
          </CCard>
        </CCol>
        <CCol sm={8} lg={8}>
          <CCard className="mh-100 mb-4">
            <CCardHeader>Users</CCardHeader>
            <CCardBody>
              <ProjectDataWidget projectData={projectData} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {/* <CRow>
        <CCol sm={12} lg={12}>
          <CCard className="mh-100">
            <CCardHeader>Users</CCardHeader>
            <CCardBody>
              <UserDataWidget userData={userData} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow> */}
    </>
  );
};

export default WidgetsDropdown;
