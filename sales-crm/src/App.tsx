import React, { useEffect, useState } from 'react';
import Table from "./components/table";
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000/';

function App() {
    const [data, setData] = useState([]);

    useEffect(() => {
        getData();
    }, [])

    const getData = async () =>{
        const result = await axios.get('/database');
        setData(result.data)
    }

    const headers = [
        {"name": "Name", "id": "name"},
        {"name": "Company", "id": "company"},
        {"name": "Status", "id": "status"},
        {"name": "Priority", "id": "priority"},
        {"name": "Estimated Value", "id": "estimated_value"},
        {"name": "Account Owner", "id": "account_owner"}
    ]


    return (
      <>{data?.length &&  <Table headers={headers} data={data} />}</>
    );
}

export default App;
