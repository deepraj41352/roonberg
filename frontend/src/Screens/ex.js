// import React, { useContext, useEffect, useReducer, useState } from 'react';
// // import { Helmet } from 'react-helmet-async';
// // import LoadingBox from '../component/LoadingBox';
// // import MessageBox from '../component/MessageBox';
// // import { Button, Nav } from 'react-bootstrap';
// // import { Link, useNavigate } from 'react-router-dom';
// // import { getError } from '../Utils';
// // import axios from 'axios';
// // import { Store } from '../Store';
// // import { toast } from 'react-toastify';
// // import DeleteIcon from '@mui/icons-material/Delete';
// // import {
// //   DataGrid,
// //   GridToolbarColumnsButton,
// //   GridToolbarContainer,
// // } from '@mui/x-data-grid';
// // import SearchBar from 'material-ui-search-bar';
// // import { Grid } from '@mui/material';

// // const reducer = (state, action) => {
// //   switch (action.type) {
// //     case 'FETCH_REQUEST':
// //       return { ...state, loading: true };
// //     case 'FETCH_SUCCESS':
// //       return {
// //         ...state,
// //         orders: action.payload,
// //         loading: false,
// //       };
// //     case 'FETCH_FAIL':
// //       return { ...state, loading: false, error: action.payload };
// //     case 'DELETE_REQUEST':
// //       return { ...state, loading: true, successDelete: false };
// //     case 'DELETE_SUCCESS':
// //       return {
// //         ...state,
// //         loading: false,
// //         successDelete: true,
// //       };
// //     case 'DELETE_FAIL':
// //       return { ...state, loading: false };
// //     case 'DELETE_RESET':
// //       return { ...state, loading: false, successDelete: false };
// //     default:
// //       return state;
// //   }
// // };

// // const CustomToolbar = (props) => (
// //   <div>
// //     <GridToolbarContainer>
// //       <GridToolbarColumnsButton />
// //     </GridToolbarContainer>
// //     <SearchBar {...props} />
// //   </div>
// // );

// // export default function OrderListScreen() {
// //   const navigate = useNavigate();
// //   const { state } = useContext(Store);
// //   const { userInfo } = state;
// //   const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] =
// //     useReducer(reducer, {
// //       loading: true,
// //       error: '',
// //     });
// //   const [searchText, setSearchText] = useState('');
// //   const [rowData, setrowData] = useState([]);
// //   const [columns] = useState([
// //     {
// //       field: '_id',
// //       headerName: 'ID',
// //       width: 110,
// //       resizable: true,
// //     },
// //     { field: 'userName', headerName: 'USER', width: 110 },
// //     { field: 'createdAt', headerName: 'DATE', width: 110 },
// //     { field: 'totalPrice', headerName: 'TOTAL', width: 110 },
// //     { field: 'paidAt', headerName: 'PAID', width: 110 },
// //     { field: 'isDelivered', headerName: 'DELIVERED', width: 110 },
// //     {
// //       field: '',
// //       headerName: 'ACTIONS',
// //       width: 110,
// //       renderCell: (params) => {
// //         return (
// //           <Grid item xs={8}>
// //             <Button
// //               type="button"
// //               variant="light"
// //               onClick={() => {
// //                 navigate(`/order/${params.id}`);
// //               }}
// //             >
// //               Details
// //             </Button>
// //             <DeleteIcon
// //               onClick={() => {
// //                 deleteHandler(params.id);
// //               }}
// //             />
// //           </Grid>
// //         );
// //       },
// //     },
// //   ]);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         dispatch({ type: 'FETCH_REQUEST' });
// //         const { data } = await axios.get(`/api/orders`, {
// //           headers: { Authorizattion: `Bearer ${userInfo.token}` },
// //         });
// //         const rowDatas = data.map((item) => {
// //           return {
// //             ...item,
// //             userName: item.user ? item.user.name : 'Delete Users',
// //             createdAt: item.createdAt.substring(0, 10),
// //             totalPrice: item.totalPrice.toFixed(2),
// //             paidAt: item.isPaid ? item.paidAt.substring(0, 10) : 'No',
// //             isDelivered: item.isDelivered
// //               ? item.deliveredAt.substring(0, 10)
// //               : 'No',
// //           };
// //         });
// //         setrowData(rowDatas);
// //         dispatch({ type: 'FETCH_SUCCESS', payload: rowDatas });
// //       } catch (err) {
// //         dispatch({
// //           type: 'FETCH_FAIL',
// //           payload: getError(err),
// //         });
// //       }
// //     };
// //     if (successDelete) {
// //       dispatch({ type: 'DELETE_RESET' });
// //     } else {
// //       fetchData();
// //     }
// //   }, [userInfo, successDelete]);

// //   const deleteHandler = async (orderId) => {
// //     if (window.confirm('Are you sure to delete?')) {
// //       try {
// //         dispatch({ type: 'DELETE_REQUEST' });
// //         await axios.delete(`/api/orders/${orderId}`, {
// //           headers: { Authorizattion: `Bearer ${userInfo.token}` },
// //         });
// //         toast.success('order deleted successfully');
// //         dispatch({ type: 'DELETE_SUCCESS' });
// //       } catch (err) {
// //         toast.error(getError(error));
// //         dispatch({
// //           type: 'DELETE_FAIL',
// //         });
// //       }
// //     }
// //   };

// //   const requestSearch = (searchValue) => {
// //     const searchRegex = new RegExp(`.${searchValue}.`, 'ig');
// //     const filteredRows = orders.filter((o) => {
// //       return Object.keys(o).some((k) => {
// //         return searchRegex.test(o[k].toString());
// //       });
// //     });
// //     setrowData(filteredRows);
// //   };

// //   const cancelSearch = () => {
// //     setSearchText('');
// //     requestSearch(searchText);
// //   };

// //   return (
// //     <div className="site-container active-cont d-flex flex-column full-box">
// //       <div className="active-nav side-navbar d-flex justify-content-between flex-wrap flex-column side-top">
// //         <Nav className="flex-column text-white w-100 p-3">
// //           {userInfo && userInfo.isAdmin && (
// //             <div>
// //               <h3>Dashbord</h3>
// //               <li>
// //                 <Link to="/admin/dashbord">Home</Link>
// //               </li>
// //               <li>
// //                 <Link to="/admin/productlist">Product</Link>
// //               </li>
// //               <li>
// //                 <Link to="/admin/orders">Order</Link>
// //               </li>
// //               <li>
// //                 <Link to="/admin/users">Users</Link>
// //               </li>
// //             </div>
// //           )}
// //         </Nav>
// //       </div>
// //       <Helmet>
// //         <title>Orders</title>
// //       </Helmet>
// //       <h1>Orders</h1>
// //       {loadingDelete && <LoadingBox></LoadingBox>}
// //       {loading ? (
// //         <LoadingBox></LoadingBox>
// //       ) : error ? (
// //         <MessageBox variant="danger">{error}</MessageBox>
// //       ) : (
// //         <>
// //           <div style={{ height: 500, width: '100%', backgroundColor: 'white' }}>
// //             <DataGrid
// //               components={{ Toolbar: CustomToolbar }}
// //               rows={rowData}
// //               columns={columns}
// //               getRowId={(row) => row._id}
// //               initialState={{
// //                 pagination: {
// //                   paginationModel: { page: 0, pageSize: 5 },
// //                 },
// //               }}
// //               componentsProps={{
// //                 toolbar: {
// //                   value: searchText,
// //                   onChange: (searchVal) => requestSearch(searchVal),
// //                   onCancelSearch: () => cancelSearch(),
// //                 },
// //               }}
// //               pageSizeOptions={[5, 10]}
// //               checkboxSelection
// //             />
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   );
// // }

import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';

const MultiSelectDropdown = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

  const handleChange = (event) => {
    setSelectedOptions(event.target.value);
  };

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel>Choose Options</InputLabel>
        <Select
          multiple
          value={selectedOptions}
          onChange={handleChange}
          renderValue={(selected) => (
            <div>
              {selected.map((value) => (
                <span key={value}>{value}, </span>
              ))}
            </div>
          )}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" onClick={() => console.log(selectedOptions)}>
        Save
      </Button>
    </div>
  );
};

export default MultiSelectDropdown;
