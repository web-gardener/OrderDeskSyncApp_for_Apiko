import axios, {AxiosInstance} from "axios";
import {IAuth, IAuthData, INewData, IOrder, Types} from "../interfaces/orders.interfaces";

class OrderDeskApi {
    private callInterval = 3600000;
    // private callInterval = 10000; // for test
    private axiosClient: AxiosInstance;
    private timeOffset = new Date().getTimezoneOffset() * 60000;

    constructor() {
    }

    public init(STORE_ID: string, API_KEY: string) {
        this.axiosClient = axios.create({
            headers: {
                "ORDERDESK-STORE-ID": STORE_ID,
                "ORDERDESK-API-KEY": API_KEY,
                "Content-Type": "application/json"
            }
        })
        this.register().then((regData: IAuth<IAuthData>) => {
            if (!regData) throw new Error("No reg data");
            if (!this.fetchReg(regData)) throw new Error("Bad reg data");
            console.warn(`Successfully auth! Get new data every ${(this.callInterval / 1000)}sec...`)
            this.makeIteration();
        }).catch((reason) => {
            console.error("Auth error");
            console.error(reason.message);
        })
    }

    private async register() {
        return this.axiosClient.get("https://app.orderdesk.me/api/v2/test");
    }

    makeIteration = () => {
        this.newDataCall();
        setTimeout(this.makeIteration, this.callInterval);
    };

    private async newDataCall() {
        const searchDate = new Date(Date.now() + this.timeOffset - this.callInterval).toISOString();
        const qParams = `?search_start_date=${searchDate}`;
        const data: IAuth<INewData> = await this.axiosClient.get(`https://app.orderdesk.me/api/v2/orders${qParams}`)
        if (!this.fetchData(data)) return;
        data.data = this.mapAddress(data.data);
        data.data.orders.forEach((item: IOrder) => {
            console.log(`${item.id} shipped to ${item.shipping.country}, ${item.shipping.state}, ${item.shipping.city},
             ${item.shipping.address} for ${item.shipping.first_name} ${item.shipping.last_name}`)
        })
        if (data.data.orders.length === 0) console.warn(`No orders last ${(this.callInterval / 1000)}sec`)
        return;
    }

    private fetchReg(regResp: IAuth<IAuthData>) {
        if (!this.checkRequestStatus(regResp)) return false;
        return regResp.data.message === Types.MESSAGE && regResp.data.status === Types.STATUS;

    }

    private fetchData(data: any) {
        if (!data) return false;
        return this.checkRequestStatus(data);

    }

    private checkRequestStatus(req: any) {
        return req.status === Types.API_STATUS && req.statusText === Types.API_STATUS_TEXT;

    }

    private mapAddress(data: INewData) {
        data.orders = data.orders.map((value) => {
            value.shipping.address = '${value.shipping.address1} ${value.shipping.address2} ${value.shipping.address3} ${value.shipping.address4}';
            return value;
        })
        return data;
    }
}

const orderDeskApi = new OrderDeskApi();
export default orderDeskApi;
