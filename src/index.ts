import {startServ} from "./server/server.js";

let PORT:number = Number(process.env.PORT);

startServ(3000);