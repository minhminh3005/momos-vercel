import { useEffect, useState } from 'react';
import Table from "./components/table";
import axios from 'axios';
import { useLoading } from './contexts/LoadingContext';
import { IMomomsTableCommmanbar } from './components/table/model';
import FilterBuilder from './components/filter';
import { FilterGroup } from './components/filter/model';
import { Button } from '@mui/material';


axios.defaults.baseURL = 'http://localhost:8000/';

function App() {
    const { showLoading, hideLoading } = useLoading();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState<FilterGroup | null>(null);

    useEffect(() => {
        getData();
    }, [])

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleSaveFilters = (newFilters: any) => {
        setFilters(newFilters);
        const conditionArray = newFilters.filters.map((item: any) => {
            return {
                property: item.property,
                [item.type]: {
                    [item.condition]: item.value
                }
            }
        })
        const body = {
            filter: {
                [newFilters.operator]: [...conditionArray]
            }
        }
        console.log('Saved filters:', newFilters);
        console.log('Saved body:', body);
        handleCloseDialog();
        getData({
            filter: body.filter
        })
    };

    const getData = async (command?: IMomomsTableCommmanbar) => {
        showLoading('Loading data...');
        try {
            const result = await axios.post('/database', {
                command
            });
            setData(result.data);
            hideLoading();
        } catch {
            setData([])
            hideLoading();
        }

    }

    const columns: { Header: string, accessor: any, id: string }[] = [
        { Header: "Name", accessor: "name", id: "name" },
        { Header: "Company", accessor: "company", id: "company" },
        { Header: "Status", accessor: "status", id: "status" },
        { Header: "Priority", accessor: "priority", id: "priority" },
        { Header: "Estimated Value", accessor: "estimated_value", id: "estimated_value" },
        { Header: "Account Owner", accessor: "account_owner", id: "account_owner" }
    ]
    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div>
                    <Button style={{ margin: 20 }} variant='outlined' color='secondary' onClick={handleOpenDialog}>Open Filter Builder</Button>
                </div>
                {isDialogOpen && (
                    <FilterBuilder
                        maxNestingLevel={4}
                        onSave={handleSaveFilters}
                        onCancel={handleCloseDialog}
                    />
                )}
            </div>
            {<Table<any> fetchData={getData} columns={columns} data={data} />}
        </>
    );
}

export default App;
