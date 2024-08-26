import { Column } from "react-table";

export interface IMomomsTableCommmanbar {
  filter? : any | undefined,
  sort? : {
    sortOrder: string,
    sortBy: string
  }
}

export interface IMomosTableProps<T extends object> {
    columns: Column<T>[];
    data: T[];
    fetchData: (sort?: any) => Promise<void>;
  }
  
  export interface IMomosHeaderProps {
    width: number;
  children: React.ReactNode;
  onResize: (width: number) => void;
  onClick: () => void;
  sortOrder: 'ascending' | 'descending' | null;
  }