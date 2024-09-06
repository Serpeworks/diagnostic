import { Coordinates } from "./Coordinates";

export enum SessionStatus {
    IDLE = "IDLE",
    EMERGENCY = "EMERGENCY",
}

export enum ConnectionStatus {
    CONNECTED = "CONNECTED",
    DISCONNECTED = "DISCONNECTED",
}

export interface DroneSession {
    agent_id: number;
    system_id: number;
    session_id: number;
    session_status: SessionStatus;
    coordinates: Coordinates;
    connection_status: ConnectionStatus;
}

export interface SessionList {
    sessions: Array<DroneSession>
}
