export interface Genre {
    id: number;
    name: string;
}

export interface Customer {
    [key: string]: any

    isGold: boolean,
    name: string,
    phone: string
}