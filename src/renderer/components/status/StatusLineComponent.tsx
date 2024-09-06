import React from "react";
import { useEffect, useState } from "react";
import { OrchestratorState, ServerStatus } from "../../../domain/ServerStatus";

function OrchestratorStateColor(state: OrchestratorState): string {
    switch (state) {
        case OrchestratorState.BOOTING:
            return "orange"
        case OrchestratorState.RUNNING:
            return "green"
        case OrchestratorState.STOPPING:
            return "red"
        default:
            return "white";
    }
}

export function StatusLineComponent(
    { status }: { status: ServerStatus }
) {
    return (
        <div className="status-line">
            <a
                className="status-line-status"
                style={{ backgroundColor: OrchestratorStateColor(status.state) }}
            >
                {status.state}
            </a>
            <a>Uptime: {Math.trunc(status.uptime)}s</a>
            <a>Tickrate: {Math.trunc(status.tickrate)} Hz</a>
            <a>Server Version: {status.version}</a>
        </div>
    )
}

