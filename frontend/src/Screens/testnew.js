import React, { useState } from 'react';

function ProjectForm() {
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [agents, setAgents] = useState([{ categoryid: '', agentid: '' }]);
    const [message, setMessage] = useState('');

    // Simulated list of categories and agents. In a real app, you'd fetch them from your backend.
    const categories = [
        { id: '1', name: 'Category 1' },
        { id: '2', name: 'Category 2' },
        { id: '3', name: 'Category 3' },
    ];

    const availableAgents = [
        { id: 'agent1', name: 'Agent 1' },
        { id: 'agent2', name: 'Agent 2' },
        { id: 'agent3', name: 'Agent 3' },
    ];

    const handleAgentChange = (index, key, value) => {
        const updatedAgents = [...agents];
        const updatedAgent = { ...updatedAgents[index], [key]: value };
        const duplicateExists = updatedAgents.some(
            (agent, i) =>
                i !== index &&
                agent.categoryid === updatedAgent.categoryid &&
                agent.agentid === updatedAgent.agentid
        );

        if (!duplicateExists) {
            updatedAgents[index] = updatedAgent;
            setAgents(updatedAgents);
            console.log('Updated Agents:', updatedAgents);
        } else {
            console.log('Duplicate entry. Not updating the agents.');
        }
    };

    const addAgent = () => {
        setAgents([...agents, { categoryid: '', agentid: '' }]);
    };

    console.log(agents)
    const removeAgent = (index) => {
        const updatedAgents = [...agents];
        updatedAgents.splice(index, 1);
        setAgents(updatedAgents);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare the project data to be sent to the server
        const projectData = {
            projectName,
            projectDescription,
            agents,
        };

        console.log("agents", agents, projectData)

        // try {
        //     const response = await fetch('/admin/addproject', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(projectData),
        //     });

        //     if (response.ok) {
        //         setMessage('Project created successfully.');
        //     } else {
        //         setMessage('Error creating the project.');
        //     }
        // } catch (error) {
        //     setMessage('Error creating the project.');
        //     console.error(error);
        // }
    };
    console.log('Agents:', agents);

    return (
        <div>
            <h2>Create a New Project</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Project Name:</label>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Project Description:</label>
                    <textarea
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label>Agents and Categories:</label>
                    {agents.map((agent, index) => (
                        <div key={index}>
                            <select
                                value={agent.categoryid}
                                onChange={(e) => handleAgentChange(index, 'categoryid', e.target.value)}
                            >
                                <option value="">Select a Category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={agent.agentid}
                                onChange={(e) => handleAgentChange(index, 'agentid', e.target.value)}
                            >
                                <option value="">Select an Agent</option>
                                {availableAgents.map((agent) => (
                                    <option key={agent.id} value={agent.id}>
                                        {agent.name}
                                    </option>
                                ))}
                            </select>
                            <button type="button" onClick={() => removeAgent(index)}>
                                Remove Agent
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addAgent}>
                        Add Agent
                    </button>
                </div>
                <button type="submit">Create Project</button>
            </form>
            <div>{message}</div>
        </div>
    );
}

export default ProjectForm;
