import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import {
  Avatar,
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
// import { AiFillDelete } from 'react-icons/ai';
// import { MdEdit } from 'react-icons/md';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Form } from 'react-bootstrap';
import { FormControl } from '@mui/material';
import { BiPlusMedical } from 'react-icons/bi';
import { Store } from '../Store';
import { useContext, useEffect, useReducer, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AvatarImage from '../Components/Avatar';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FATCH_REQUEST':
      return { ...state, loading: true };
    case 'FATCH_SUCCESS':
      return { ...state, categoryData: action.payload, loading: false };
    case 'FATCH_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'DELETE_SUCCESS':
      return { ...state, successDelete: action.payload };

    case 'DELETE_RESET':
      return { ...state, successDelete: false };

    case 'UPDATE_SUCCESS':
      return { ...state, successUpdate: action.payload };

    case 'UPDATE_RESET':
      return { ...state, successUpdate: false };
    case "CATEGORY_CRATED_REQ":
      return { ...state, isSubmiting: true };
    case "FATCH_SUBMITTING":
      return { ...state, submitting: action.payload };
    default:
      return state;
  }
};

const columns = [
  { field: '_id', headerName: 'ID', width: 250 },
  {
    field: 'categoryName',
    headerName: 'category',
    width: 100,
  },
  {
    field: 'categoryDescription',
    headerName: 'Description',
    width: 150,
  },
  {
    field: 'categoryImage',
    headerName: 'Image',
    width: 100,
    renderCell: (params) => {
      function generateColorFromAscii(str) {
        let color = '#';
        const combination = str
          .split('')
          .map((char) => char.charCodeAt(0))
          .reduce((acc, value) => acc + value, 0);
        color += (combination * 12345).toString(16).slice(0, 6);
        return color;
      }

      const name = params.row.categoryName[0].toLowerCase();
      const color = generateColorFromAscii(name);
      return (
        <>
          {params.row.categoryImage !== 'null' ? (
            <Avatar src={params.row.categoryImage} />
          ) : (
            <AvatarImage name={name} bgColor={color} />
          )}
        </>
      );
    },
  },
  {
    field: 'categoryStatus',
    headerName: 'Status',
    width: 100,
  },
];

const getRowId = (row) => row._id;

export default function AdminContractorListScreen() {
  const navigate = useNavigate();
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCatogry] = useState('');
  const [status, setStatus] = useState('');
  const [categoryDesc, setCatogryDesc] = useState('');
  const [
    { loading, error, categoryData, successDelete, successUpdate, isSubmiting, submitting },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    categoryData: [],
    successDelete: false,
    successUpdate: false,
    isSubmiting: false,
    submitting: false
  });

  const handleEdit = (rowId) => {
    navigate(`/adminEditCategory/${rowId}`);


    // setSelectedRowData(params);
    // setIsModelOpen(true);
    // setIsNewCategory(false);
  };

  const handleCloseRow = () => {
    setIsModelOpen(false);
  };

  const handleNew = () => {
    setSelectedRowData(null);
    setIsModelOpen(true);
    setIsNewCategory(true);
  };
  const handleSubmitNewCategory = () => {
    setIsModelOpen(false);
  };

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? 'dark' : 'light';

  useEffect(() => {
    const FatchcategoryData = async () => {
      try {
        dispatch('FATCH_REQUEST');
        const response = await axios.get(`/api/category/`);
        const datas = response.data;
        console.log(datas);
        const rowData = datas.map((items) => {
          return {
            ...items,
            _id: items._id,
            categoryName: items.categoryName,
            categoryDescription: items.categoryDescription == '' ? 'No description' : items.categoryDescription,
            categoryImage: items.categoryImage,
            categoryStatus:
              items.categoryStatus == true ? 'Active' : 'Inactive',
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
      FatchcategoryData();
    }
  }, [successDelete, successUpdate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: "FATCH_SUBMITTING", payload: true })
    const formDatas = new FormData();

    formDatas.append('categoryImage', selectedFile);
    formDatas.append('categoryName', category);
    formDatas.append('categoryDescription', categoryDesc);
    formDatas.append('categoryStatus', status);

    try {
      dispatch({ type: 'CATEGORY_CRATED_REQ' });
      const { data } = await axios.post(`/api/category/`, formDatas, {
        headers: {
          'content-type': 'multipart/form-data',

          authorization: `Bearer ${userInfo.token}`,
        },
      });
      console.log(data.message);
      toast.success("Category Created Successfully !");
      dispatch({ type: "UPDATE_SUCCESS" })
      dispatch({ type: "FATCH_SUBMITTING", payload: false })
      setCatogry('');
      setCatogryDesc('');
      setSelectedFile(null)
      setStatus('')
    } catch (err) {
      toast.error(err.response?.data?.message);
      dispatch({ type: "FATCH_SUBMITTING", payload: false })
    } finally {
      setIsModelOpen(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const deleteHandle = async (userid) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        const response = await axios.delete(`/api/category/${userid}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        if (response.status === 200) {
          toast.success('Category deleted successfully!');
          dispatch({
            type: 'DELETE_SUCCESS',
            payload: true,
          });
        } else {
          toast.error('Failed to delete constractor data.');
        }
      } catch (error) {
        console.error(error);
        toast.error('An error occurred while deleting constractor data.');
      }
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        className=" m-2 d-flex globalbtnColor"
        onClick={handleNew}
      >
        <BiPlusMedical className="mx-2" />
        Add Category
      </Button>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          className={
            theme == 'light'
              ? `${theme}DataGrid mx-2`
              : `tableBg ${theme}DataGrid mx-2`
          }

          rows={categoryData}
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
          getRowId={getRowId}
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
      <Modal open={isModelOpen} onClose={handleCloseRow}>
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
            p: 4,
          }}
        >
          <Form>

            <h4 className="d-flex justify-content-center">
              Add Category
            </h4>

            <TextField
              className="mb-3"
              value={category}
              label="Category Name"
              fullWidth
              onChange={(e) => setCatogry(e.target.value)}
            />
            <TextField
              className="mb-3"
              value={categoryDesc}
              label="Add description"
              fullWidth
              onChange={(e) => setCatogryDesc(e.target.value)}
            />
            <FormControl className="mb-3">
              <InputLabel>Select Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value={true} >Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </Select>
            </FormControl>
            <TextField
              className="mb-3"
              type="file"
              fullWidth
              onChange={handleFileChange}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={submitHandler}
              disabled={submitting}
            >
              {submitting ? 'submitting' : 'Submit'}
            </Button>
          </Form>
        </Box>
      </Modal>
    </>
  );
}
