
export enum OrchestratorState {
    BOOTING = "BOOTING",
    RUNNING = "RUNNING",
    STOPPING = "STOPPING",
}

export interface ServerStatus {
    state: OrchestratorState,
    uptime: number,
    tickrate: number,
    version: string,
}

