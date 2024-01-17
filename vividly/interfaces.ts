export interface Genre {
    id: string,
    name: string,
    tags: []
}

export interface Customer {
    [key: string]: any

    id: string,
    isGold: boolean,
    name: string,
    phone: string
}