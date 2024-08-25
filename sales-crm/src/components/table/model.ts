export interface tableProps {
    headers: tableHeader[];
    data?: any[]
}

export interface tableHeader {
    name: string,
    id: string
}
