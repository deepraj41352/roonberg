import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

export default function AdminAssignAgent() {
  const { id } = useParams();
  const { state } = useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? "dark" : "light";

  const [fatchAgent, setfatchAgent] = useState([]);
  const [fatchCategory, setFatchCategory] = useState([]);



  useEffect(() => {

    const FatchAgentData = async () => {
      try {
        const response = await axios.post(`/api/user/`, { role: "agent" });
        const datas = response.data;
        setfatchAgent(datas)

      } catch (error) {
      }
    }
    FatchAgentData();

  }, [])

  useEffect(() => {
    const FatchCategory = async () => {
      try {
        const response = await axios.get(`/api/category/`, { headers: { Authorization: `Bearer ${userInfo.token}` } });
        const datas = response.data;
        setFatchCategory(datas)
      } catch (error) {
        console.log(error)
      }
    }
    FatchCategory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {


      };

      const response = await axios.put(
        `/api/project/assign-project/${id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      if (response.status === 200) {
        toast.success('Project updated Successfully !');
        console.log(response);
      }
    } catch (error) {
      console.error('API Error:', error);
    }
  };



  return (
    <div>
      {/* <Form className='scrollInAdminproject' onSubmit={handleSubmit}>
                    <h4 className="d-flex justify-content-center">
                      Add new Project Details
                    </h4>
                    <TextField
                      required
                      className="mb-2"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      label="Project Name"
                      fullWidth
                    />

                    <TextField
                      required
                      id="outlined-multiline-static"
                      onChange={(e) => setProjectDescription(e.target.value)}
                      label="Project Description"
                      multiline
                      rows={4}
                      fullWidth
                      variant="outlined"
                    />
                    <FormControl >
                      <InputLabel>Choose Contractor</InputLabel>
                      <Select value={projectOwner} onChange={(e) => setProjectOwner(e.target.value)}>
                        <MenuItem onClick={() => { handleRedirectToContractorScreen() }}>  <BiPlusMedical /> add new Contractor</MenuItem>
                        {contractorData.map((items) => (
                          <MenuItem key={items._id} value={items._id} >{items.first_name}</MenuItem>

                        ))}
                      </Select>
                    </FormControl>
                    {agents.map((agent, index) => (
                      <div key={index}>
                        <FormControl>
                          <InputLabel>Choose Category</InputLabel>
                          <Select
                            value={agent.categoryId}
                            onChange={(e) => handleAgentChange(index, 'categoryId', e.target.value)}
                          >
                            <MenuItem disabled={agent.categoryId !== ''}>Select Category</MenuItem>
                            {categoryData.map((category) => (
                              <MenuItem key={category._id} value={category._id}
                                disabled={agents.some((a) => a.categoryId === category._id)}
                              >
                                {category.categoryName}

                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl>
                          <InputLabel>Choose Agent</InputLabel>
                          <Select
                            value={agent.agentId}
                            onChange={(e) => handleAgentChange(index, 'agentId', e.target.value)}
                          >
                            <MenuItem disabled={agent.agentId !== ''}>Select Agent</MenuItem>
                            {assignedAgentByCateHandle(index).map((agent) => (
                              <MenuItem key={agent._id} value={agent._id}
                                disabled={agents.some((a) => a.agentId === agent._id)}
                              >
                                {agent.first_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <div className='d-flex align-items-center'>
                          <GrSubtractCircle color="black" className='mx-2' onClick={() => removeAgent(index)} />
                          <p className='text-dark m-0'>Remove</p>
                        </div>
                      </div>
                    ))}

                    <div className='d-flex align-items-center'>

                      <Button className='mb-2 bg-primary' onClick={addAgent}>
                        <GrAddCircle color="white" className='mx-2' />
                        Add Category and Agent
                      </Button>
                    </div>
                    <FormControl >
                      <InputLabel>Choose Status</InputLabel>
                      <Select value={projectStatus} onChange={(e) => setProjectStatus(e.target.value)}>
                        <MenuItem value=""> Select Status </MenuItem>
                        <MenuItem value="active">  Active </MenuItem>
                        <MenuItem value="inactive">  Inactive </MenuItem>
                        <MenuItem value="queue">  In Proccess </MenuItem>
                      </Select>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateField
                        required
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        format="MM-DD-YYYY"
                      />
                      <DateField
                        required
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        format="MM-DD-YYYY"
                      />
                    </LocalizationProvider>
                    <Button variant="contained" color="primary" type="submit"
                      disabled={isSubmiting}
                    >
                      {isNewProject ? (isSubmiting ? "Adding Project..." : "Add Project") : (isSubmiting ? "Saving Changes..." : "Save Changes")}
                    </Button>
                  </Form> */}
    </div>
  )
}
