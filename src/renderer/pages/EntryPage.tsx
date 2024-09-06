
import React, { useEffect, useRef, useState } from "react";
import logo_large from "../../../assets/logo_large.png";
import { LoginAuthComponent } from "../components/auth/LoginAuth";
import { GetRoot } from "../../api/operations";
import { Navigate } from "react-router-dom";

const DEFAULT_HOST = "localhost"
const DEFAULT_PORT = "8080"

type State =
    | { tag: "PROMPT", host: string, port: string }
    | { tag: "LOADING" }
    | { tag: "ERROR", message: string }
    | { tag: "CHANGE_TO_DASH" };

type Action =
    | { type: "EDIT", new_host: string, new_port: string }
    | { type: "LOAD" }
    | { type: "SUCCESS" }
    | { type: "FAIL", error: string }
    | { type: "RESET" };

function reduce(state: State, action: Action): State {
    switch (action.type) {
        case "EDIT":
            if (state.tag === "PROMPT") {
                return { ...state, host: action.new_host, port: action.new_port };
            }
            return state;
        case "LOAD":
            return { tag: "LOADING" };
        case "SUCCESS":
            return { tag: "CHANGE_TO_DASH" }
        case "FAIL":
            return { tag: "ERROR", message: action.error };
        case "RESET":
            return { tag: "PROMPT", host: DEFAULT_HOST, port: DEFAULT_PORT };  // Reset state to initial state
        default:
            return state;
    }
}

export function EntryPage() {
    const [state, dispatch] = React.useReducer(reduce, {
        tag: "PROMPT",
        host: DEFAULT_HOST,
        port: DEFAULT_PORT,
    });
    const [loadingTime, setLoadingTime] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Handle input change
    function handleChange(ev: React.FormEvent<HTMLInputElement>) {
        if (state.tag !== "PROMPT") return;

        const value = ev.currentTarget.value;
        if (ev.currentTarget.id == "host") {
            dispatch({ type: "EDIT", new_host: value, new_port: state.port });
        } else if (ev.currentTarget.id == "port") {
            dispatch({ type: "EDIT", new_host: state.host, new_port: value });
        }
    }

    // Handle form submission
    function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        if (state.tag !== "PROMPT") return;

        // Start loading and attempt to log in
        dispatch({ type: "LOAD" });
        const port_number = Number(state.port)
        handleLogin(state.host, port_number);
    }

    // Simulate login process
    async function handleLogin(
        host: string,
        port: number,
    ) {
        const result = await GetRoot(
            host, port
        );

        if (result.isOk()) {
            // Save host and port to localStorage
            localStorage.setItem("host", host);
            localStorage.setItem("port", port.toString());

            dispatch({ type: "SUCCESS" })
        } else {
            dispatch({ type: "FAIL", error: result.error.message })
        }
    }

    // Start the timer when in the LOADING state
    useEffect(() => {
        if (state.tag === "LOADING") {
            setLoadingTime(0); // Reset the loading time
            intervalRef.current = setInterval(() => {
                setLoadingTime(prev => prev + 1);
            }, 1000);
        } else {
            // Clear the timer when leaving the LOADING state
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        // Cleanup on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [state.tag]);

    // Render different UI based on state
    if (state.tag === "PROMPT") {
        return (
            <div className="page-entry">
                <img width="400" src={logo_large} />
                <LoginAuthComponent
                    host={state.host}
                    port={state.port}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                />
            </div>
        );
    } else if (state.tag === "LOADING") {
        return (
            <div className="page-entry">
                <a>Reaching...</a>
                <a>{loadingTime}s</a>
            </div>
        );
    } else if (state.tag === "CHANGE_TO_DASH") {
        return (
            <Navigate to="/dashboard" />
        );
    } else if (state.tag === "ERROR") {
        return (
            <div className="page-entry">
                <div>
                    <p>Error: {state.message}</p>
                    <button onClick={() => dispatch({ type: "RESET" })}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }
}

