import { DroneSession, SessionStatus } from "../../domain/Session";
import { SessionEntryComponent } from "./SessionEntryComponent";


export type SessionListComponentProps = {
    sessions: Array<DroneSession>;
}

export function SessionListComponent(
    {sessions}: SessionListComponentProps
) {
    return (
        <ul className="session-list">
        {
            sessions.map((session) =>
                (<SessionEntryComponent session={session} />)
            )
        }
        </ul>
    )
}


