import { DroneSession, SessionStatus } from "../../domain/Session"

type SessionStateComponentProps = {
    state: SessionStatus
}

export function SessionStateComponent(
    { state }: SessionStateComponentProps
) {
    const style = {
        color: sessionStateToColor(state)
    }
    return (
        <a style={style} className="session-state">{state}</a>
    )
}

export type SessionComponentProps = {
    session: DroneSession;
}

function hexify(value: number) {
    return "0x" + value.toString(16)
}

export function SessionEntryComponent(
    { session }: SessionComponentProps
) {
    return (
        <li className="session">
            <a>System ID: {session.system_id}</a>
            <a>Agent ID: {hexify(session.agent_id)}</a>
            <a>Session ID: {hexify(session.session_id)}</a>
            <SessionStateComponent state={session.session_status} />
        </li>
    );
}

function sessionStateToColor(state: SessionStatus): string {
    switch (state) {
        case SessionStatus.IDLE:
            return "white"
        case SessionStatus.EMERGENCY:
            return "red"
    }
}

