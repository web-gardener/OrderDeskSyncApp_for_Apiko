export interface IAuth<T> {
    status: number,
    statusText: string,
    data: T
}

export interface IAuthData {
    status: string,
    message: string
}

export interface INewData {
    status: string,
    orders: IOrder[]
}

export interface IOrder {
    id: string,
    shipping: IShipping
}

export interface IShipping {
    address: string,
    address1: string,
    address2: string,
    address3: string,
    address4: string,
    city: string,
    state: string,
    postal_code: string,
    country: string,
    first_name: string,
    last_name: string
}

export enum Types {
    API_STATUS = 200,
    API_STATUS_TEXT = 'OK',
    STATUS = 'success',
    MESSAGE = 'Connection Successful'
}
