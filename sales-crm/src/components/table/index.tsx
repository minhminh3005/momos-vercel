import { IMomosHeaderProps, IMomosTableProps } from "./model";
import { useEffect, useMemo, useState } from "react";
import "./index.scss";
import { Column, HeaderGroup, useTable } from "react-table";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

const ResizableHeader: React.FC<IMomosHeaderProps> = ({ width, children, onResize, onClick, sortOrder }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={onClick}>
      <ResizableBox
      width={width}
      height={20}
      axis="x"
      resizeHandles={['e']}
      onResizeStop={(e, data) => onResize(data.size.width)}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <div style={{
                      display: 'inline-block',
                      width: '100%',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
      {children} {sortOrder && (sortOrder === 'ascending' ? '▲' : '▼')}
      </div>
    </ResizableBox>
    </div>
  );
};

const Table = <T extends object>({ columns: initialColumns, data, fetchData }: IMomosTableProps<T>) => {
  const [columns, setColumns] = useState(
    initialColumns.map(column => ({
      ...column,
      width: column.width || 180,
    }))
  );
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending' | null>(null);
  const defaultColumn = useMemo(
    () => ({
      // When using the useResizeColumns plugin, all columns need this.
      minWidth: 30,
      width: 150,
      maxWidth: 400,
    }),
    []
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
      defaultColumn,
    });

 
    const handleResize = (index: number, width: number) => {
      setColumns(oldColumns => {
        const newColumns = [...oldColumns];
        newColumns[index] = { ...newColumns[index], width };
        return newColumns;
      });
    };

    const handleSortChange = (columnId: string) => {
      if (sortBy === columnId) {
        setSortOrder(sortOrder === 'ascending' ? 'descending' : 'ascending');
      } else {
        setSortBy(columnId);
        setSortOrder('ascending');
      }
    };

  const formatNumber = (q: number) => {
    if (!q) return;
    return q.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };
  useEffect(() => {
    if (sortBy && sortOrder) {
      fetchData({
        sortBy, sortOrder
      });
    }
  }, [sortBy, sortOrder]);

  return (
    <div className="table-container">
      <table className="table" {...getTableProps()}>
      <thead className="table__header">
        {headerGroups.map((headerGroup: HeaderGroup<T>, headerGroupIndex) => (
          <tr  {...headerGroup.getHeaderGroupProps()} key={`headerGroup-${headerGroupIndex}`}>
            {headerGroup.headers.map((column, columnIndex) => {
              const { key, ...columnProps } = column.getHeaderProps();

              return (
                <th className="table__header--cell" key={`header-${columnIndex}`}>
                     <ResizableHeader
                     sortOrder={sortBy === column.id ? sortOrder : null}
                     onClick={() => handleSortChange(column?.id as string)}
                  width={columns[columnIndex].width as number}
                  onResize={width => handleResize(columnIndex, width)}
                >
                  {column.render('Header')}
                </ResizableHeader>
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody className="table__body"  {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={row.id}>
              {row.cells.map((cell) => {
                const { key, ...cellProps } = cell.getCellProps();
                return (
                  <td className="table__cell"  {...cellProps} key={key}>
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
    </div>
  );
};
export default Table;
