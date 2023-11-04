import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

import {
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { Form, Toast } from "react-bootstrap";
import { BiPlusMedical } from "react-icons/bi";
import axios from "axios";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { ImCross } from "react-icons/im";
import { ColorRing, ThreeDots } from 'react-loader-spinner';
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useReducer, useState } from "react";
import Validations from "../Components/Validations";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FATCH_REQUEST':
            return { ...state, loading: true };
        case 'FATCH_SUCCESS':
            return { ...state, AgentData: action.payload, loading: false };
        case 'FATCH_ERROR':
            return { ...state, error: action.payload, loading: false };
        case 'FATCH_SUBMITTING':
            return { ...state, submitting: action.payload };
        case 'DELETE_SUCCESS':
            return { ...state, successDelete: action.payload };

        case 'DELETE_RESET':
            return { ...state, successDelete: false };
        case 'FATCH_CATEGORY':
            return { ...state, categoryData: action.payload };
        case 'UPDATE_SUCCESS':
            return { ...state, successUpdate: action.payload };

        case 'UPDATE_RESET':
            return { ...state, successUpdate: false };

        default:
            return state;
    }
};

const columns = [
    { field: '_id', headerName: 'ID', width: 150 },
    {
        field: 'first_name',
        headerName: 'Admin Name',
        width: 100,
    },
    {
        field: 'email',
        headerName: 'Email',
        width: 100,
    },
    {
        field: 'userStatus',
        headerName: 'Status',
        width: 100,
    },
];

export default function SuperadminAdminList() {
    const { state } = useContext(Store);
    const { toggleState, userInfo } = state;
    const navigate = useNavigate();
    const role = 'admin';
    const theme = toggleState ? 'dark' : 'light';
    const [isModelOpen, setIsModelOpen] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState();
    const [password, setPassword] = useState('');
    const [selectcategory, setSelectCategory] = useState();

    const [
        {
            loading,
            submitting,
            categoryData,
            error,
            AgentData,
            successDelete,
            successUpdate,
        },
        dispatch,
    ] = useReducer(reducer, {
        loading: true,
        error: '',
        AgentData: [],
        successDelete: false,
        categoryData: [],
        successUpdate: false,
        submitting: false,
    });

    useEffect(() => {
        const FatchCategory = async () => {
            try {
                dispatch('FATCH_REQUEST');
                const response = await axios.get(`/api/category/`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                const datas = response.data;
                dispatch({ type: "FATCH_CATEGORY", payload: datas });
            } catch (error) {
                console.log(error);
            }
        };
        FatchCategory();
    }, []);

    const handleCloseRow = () => {
        setIsModelOpen(false);
    };

    const handleNew = () => {

        setIsModelOpen(true);

    };

    useEffect(() => {
        const FatchAgentData = async () => {
            try {
                dispatch('FATCH_REQUEST');
                const response = await axios.post(`/api/user/`, { role: role });
                const datas = response.data;
                const rowData = datas.map((items) => {
                    const categoryName = categoryData.find((category) => category._id === items.agentCategory);
                    return {
                        ...items,
                        _id: items._id,
                        first_name: items.first_name,
                        email: items.email,
                        userStatus: items.userStatus ? "Active" : "Inactive",
                        agentCategory: categoryName ? categoryName.categoryName : '',
                    };
                });
                dispatch({ type: 'FATCH_SUCCESS', payload: rowData });
            } catch (error) {
                console.log(error);
            }
        };
        if (successDelete) {
            dispatch({ type: 'DELETE_RESET' });
        } else if (successUpdate) {
            dispatch({ type: 'UPDATE_RESET' });
        } else {
            FatchAgentData();
        }
    }, [successDelete, successUpdate, categoryData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: 'FATCH_SUBMITTING', payload: true });
        try {
            const response = await axios.post(
                `/api/user/add`,
                {
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    role: role,
                    userStatus: status,
                    agentCategory: selectcategory,
                },
                { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );
            console.log(response);
            if (response.status === 200) {
                toast.success('Admin Created Successfully !');
                setIsModelOpen(false);
                setFirstName('');
                setLastName('');
                setStatus('');
                setEmail('');
                setSelectCategory('');
                dispatch({ type: 'UPDATE_SUCCESS', payload: true });
                dispatch({ type: 'FATCH_SUBMITTING', payload: false });
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
            dispatch({ type: 'FATCH_SUBMITTING', payload: false });
        }
    };

    const deleteHandle = async (userid) => {
        if (window.confirm('Are You Sure To Delete?')) {
            try {
                const response = await axios.delete(`/api/user/${userid}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });

                if (response.status === 200) {
                    toast.success('Admin Deleted Successfully!');
                    dispatch({
                        type: 'DELETE_SUCCESS',
                        payload: true,
                    });
                } else {
                    toast.error('Failed To Delete Admin.');
                }
            } catch (error) {
                console.error(error);
                toast.error('An Error Occurred While Deleting Admin.');
            }
        }
    };

    // const handleCloseRow = () => {
    //   setIsModelOpen(false);
    // };

    const handleModel = () => {
        setIsModelOpen(true);
    };

    const handleEdit = (userid) => {
        navigate(`/superadmineditadmin/${userid}`)
    };
    console.log("selectcategory", selectcategory)
    return (
        <>
            {loading ? (
                <>
                    <div className='ThreeDot' >
                        <ThreeDots
                            height="80"
                            width="80"
                            radius="9"
                            className="ThreeDot justify-content-center"
                            color="#0e0e3d"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClassName=""
                            visible={true}
                        />
                    </div>

                </>
            ) : (error ? (
                <div>{error}</div>
            ) : (
                <>
                    <Button
                        variant="outlined"
                        className=" m-2 d-flex globalbtnColor"
                        onClick={handleModel}
                    >
                        <BiPlusMedical className="mx-2" />
                        Add Admin
                    </Button>
                    <Box sx={{ height: 400, width: "100%" }}>
                        <DataGrid
                            className={`tableBg mx-2 ${theme}DataGrid`}
                            rows={AgentData}
                            columns={[
                                ...columns,
                                {
                                    field: "action",
                                    headerName: "Action",
                                    width: 250,
                                    renderCell: (params) => {
                                        return (
                                            <Grid item xs={8}>
                                                <Button
                                                    variant="contained"
                                                    className="mx-2 tableEditbtn"
                                                    onClick={() => handleEdit(params.row._id)}

                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    className="mx-2 tableDeletebtn"
                                                    onClick={() => deleteHandle(params.row._id)}

                                                >
                                                    Delete
                                                </Button>
                                            </Grid>
                                        );
                                    },
                                },
                            ]}
                            getRowId={(row) => row._id}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 5,
                                    },
                                },
                            }}
                            pageSizeOptions={[5]}
                            checkboxSelection
                            disableRowSelectionOnClick
                        />
                    </Box>
                    <Modal open={isModelOpen} onClose={handleCloseRow} className='overlayLoading'>
                        <Box
                            className="modelBg"
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: 400,
                                bgcolor: "background.paper",
                                boxShadow: 24,
                                p: submitting ? 0 : 4,
                            }}
                        >

                            <>
                                <div className="overlayLoading" >
                                    {submitting && (
                                        <div className="overlayLoadingItem1">
                                            <ColorRing
                                                visible={true}
                                                height="40"
                                                width="40"
                                                ariaLabel="blocks-loading"
                                                wrapperStyle={{}}
                                                wrapperClass="blocks-wrapper"
                                                colors={["rgba(0, 0, 0, 1) 0%", "rgba(255, 255, 255, 1) 68%", "rgba(0, 0, 0, 1) 93%"]}
                                            />
                                        </div>
                                    )}


                                    <Form onSubmit={handleSubmit} className={submitting ? 'scrollInAdminproject p-4 ' : 'scrollInAdminproject px-1'}>
                                        <ImCross
                                            color="black"
                                            className="formcrossbtn"
                                            onClick={handleCloseRow}
                                        />
                                        <h4 className="d-flex justify-content-center text-dark">
                                            Add Admin
                                        </h4>
                                        <TextField
                                            className="mb-3"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            label="First Name"
                                            fullWidth
                                            required
                                        />
                                        <TextField
                                            className="mb-3"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            label="Last Name"

                                            fullWidth
                                        />
                                        <TextField
                                            className="mb-3"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            label="Email"
                                            type="email"
                                            fullWidth
                                            required

                                        />
                                        <Validations type="email" value={email} />
                                        {/* <TextField
                  className="mb-3"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label="Password"
                  type="password"
                  fullWidth
                />
                <Validations type="password" value={password} /> */}
                                        <FormControl className="mb-3">
                                            <InputLabel>Select Status</InputLabel>
                                            <Select
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                                required
                                            >
                                                <MenuItem value={true} >Active</MenuItem>
                                                <MenuItem value={false}>Inactive</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <br></br>
                                        <Button
                                            className="mt-2 formbtn globalbtnColor"
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                            disabled={submitting}
                                        >
                                            {submitting ?
                                                "SUBMITTING"
                                                : "SUBMIT "}
                                        </Button>
                                    </Form>
                                </div>
                            </>

                        </Box>
                    </Modal>
                </>
            ))}
        </>
    );
}
