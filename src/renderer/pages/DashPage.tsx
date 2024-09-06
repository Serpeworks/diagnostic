import React, { useEffect } from "react";
import { StatusLineComponent } from "../components/status/StatusLineComponent";
import { ServerStatus } from "../../domain/ServerStatus";
import { GetRoot, GetSessionList, GetEnvironment } from "../../api/operations"; // Added GetEnvironment
import { SessionListComponent } from "../components/SessionListComponent";
import { SessionList } from "../../domain/Session";
import { MapComponent } from "../components/map/MapComponent";
import { Environment } from "../../domain/Environment";

type State =
    | { tag: "NORMAL", status: ServerStatus, session_list: SessionList, environment: Environment }
    | { tag: "LOADING" }
    | { tag: "ERROR", message: string };

type Action =
    | { type: "LOAD_ALL", status: ServerStatus, session_list: SessionList, environment: Environment }
    | { type: "UPDATE_STATUS", new_status: ServerStatus }
    | { type: "UPDATE_SESSION", new_session_list: SessionList }
    | { type: "UPDATE_ENVIRONMENT", new_environment: Environment }
    | { type: "SET_ERROR", message: string };

function reduce(state: State, action: Action): State {
    switch (action.type) {
        case "LOAD_ALL":
            return {
                tag: "NORMAL",
                status: action.status,
                session_list: action.session_list,
                environment: action.environment,
            };
        case "UPDATE_STATUS":
            if (state.tag === "NORMAL") {
                return { ...state, status: action.new_status };
            }
            return state;
        case "UPDATE_SESSION":
            if (state.tag === "NORMAL") {
                return { ...state, session_list: action.new_session_list };
            }
            return state;
        case "UPDATE_ENVIRONMENT":
            if (state.tag === "NORMAL") {
                return { ...state, environment: action.new_environment };
            }
            return state;
        case "SET_ERROR":
            return { tag: "ERROR", message: action.message };
        default:
            return state;
    }
}

const STATUS_INTERVAL = 200;

export function DashPage() {
    const host = "localhost";
    const port = 8080;


    const [state, dispatch] = React.useReducer(reduce, {
        tag: "LOADING", // Initial state set to LOADING before fetching data
    });

    useEffect(() => {
        // Initial data fetching
        initialize();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            updateStatus();
            updateSessions();
        }, STATUS_INTERVAL);

        return () => clearInterval(intervalId);
    }, []);


    async function initialize() {
        try {
            const statusResult = GetRoot(host, port);
            const sessionResult = GetSessionList(host, port);
            const envResult = GetEnvironment(host, port);

            const status = await statusResult;
            const session = await sessionResult;
            const environment = await envResult;

            if (status.isOk() && session.isOk() && environment.isOk()) {
                dispatch({
                    type: "LOAD_ALL",
                    status: status.value,
                    session_list: session.value,
                    environment: environment.value,
                });
            } else {
                dispatch({ type: "SET_ERROR", message: "Error fetching information." });
            }
        } catch (error) {
            dispatch({ type: "SET_ERROR", message: "An error occurred while initializing." });
        }
    }


    async function updateStatus() {
        const result = await GetRoot(host, port);
        if (result.isOk()) {
            dispatch({ type: "UPDATE_STATUS", new_status: result.value });
        } else {
            dispatch({ type: "SET_ERROR", message: "An error occurred!" });
        }
    }

    async function updateSessions() {
        const result = await GetSessionList(host, port);
        if (result.isOk()) {
            dispatch({ type: "UPDATE_SESSION", new_session_list: result.value });
        } else {
            dispatch({ type: "SET_ERROR", message: "An error occurred!" });
        }
    }

    if (state.tag === "LOADING") {
        return (
            <div className="page-entry">
                <p>Loading...</p>
            </div>
        );
    }

    if (state.tag === "ERROR") {
        return (
            <div className="page-entry">
                <p>Error: {state.message}</p>
            </div>
        );
    }

    return (
        <div className="page-dash">
            <div className="page-dash-interior">
                <SessionListComponent sessions={state.session_list.sessions} />
                <MapComponent environment={state.environment} session_list={state.session_list} />             </div>
            <StatusLineComponent status={state.status} />
        </div>
    );
}
