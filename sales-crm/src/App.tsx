import React, { useEffect, useState } from 'react';
import Table from "./components/table";
import axios from 'axios';
import { Column } from "react-table";
import { useLoading } from './contexts/LoadingContext';


axios.defaults.baseURL = 'http://localhost:8000/';

function App() {
    const { showLoading, hideLoading } = useLoading();
    const [data, setData] = useState([]);

    useEffect(() => {
        getData();
    }, [])

    const getData = async (sort?: any) =>{
        showLoading('Loading data...');
        const result = await axios.post('/database', {
            sortBy: sort?.sortBy,
            sortOrder: sort?.sortOrder,
        });
        setData(result.data);
        hideLoading();
    }

    const columns: {Header: string, accessor: any, id: string}[] = [
        {Header: "Name", accessor: "name", id : "name"},
        {Header: "Company", accessor: "company",  id : "company"},
        {Header: "Status", accessor: "status", id : "status"},
        {Header: "Priority", accessor: "priority", id : "priority"},
        {Header: "Estimated Value", accessor: "estimated_value", id : "estimated_value"},
        {Header: "Account Owner", accessor: "account_owner", id : "account_owner"}
    ]
    return (
      <>
      {data && data?.length ?  <Table<any> fetchData={getData} columns={columns} data={data} /> : null}</>
    );
}

export default App;
