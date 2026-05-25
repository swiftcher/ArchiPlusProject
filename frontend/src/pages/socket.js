import { io } from "socket.io-client";

const socket = io("http://172.20.10.12:5000");

export default socket;