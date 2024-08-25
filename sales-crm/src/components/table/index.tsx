import {tableProps} from "./model";
import {useMemo} from "react";
import "./index.scss"

const Table = (props: tableProps) => {
    const {headers, data} = props;
    const tableHeaders = useMemo(() => headers, []);

    return (
        <div className="table-container">
            <table className="table">
                <thead className="table__header">
                    <tr className="table__row">
                        {
                            tableHeaders.map((header) => (
                                <th key={header.id} className="table__header--cell">{header.name}</th>
                            ))
                        }
                    </tr>
                </thead>

                <tbody className="table__body">
                {
                    data && data?.length && data?.map((row, index) => (
                        <tr key={`${row.name}-${row.company}-${index}`} className="table__row">
                            <td className="table__cell">{row.name}</td>
                            <td className="table__cell">{row.company}</td>
                            <td className="table__cell">{row.status}</td>
                            <td className="table__cell">{row.priority}</td>
                            <td className="table__cell">{row.estimated_value}</td>
                            <td className="table__cell">{row.account_owner}</td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    )
}
export default Table;
