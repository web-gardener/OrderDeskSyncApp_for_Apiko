import orderDeskApi from "./externalAPIs/OrderDesk.api";
import express from "express"

require("dotenv").config();

class App {
    public app: express.Application;
    public port: number;

    constructor(port: number) {
        this.app = express();
        this.port = port;
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }

    public useOD() {
        orderDeskApi.init(process.env.STORE_ID as string, process.env.API_KEY as string);
    }
}

export default App;
