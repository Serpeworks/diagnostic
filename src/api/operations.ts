import { ENVIRONMENT, HOME, SESSIONS } from "./URIs";
import { Result, ok, err } from 'neverthrow';
import { ServerStatus } from "../domain/ServerStatus";
import { Environment } from "../domain/Environment";
import { SessionList } from "../domain/Session";

export async function DoFetch<T>(
    host: string,
    port: number,
    path: string
): Promise<Result<T, Error>> {
    try {
        const url = `http://${host}:${port}${path}`;
        const response = await fetch(url);

        if (!response.ok) {
            return err(new Error(`HTTP error! status: ${response.status}`));
        }

        const data: T = await response.json();
        return ok(data);
    } catch (error) {
        return err(new Error(error instanceof Error ? error.message : String(error)));
    }
}

export async function GetRoot(
    host: string,
    port: number
): Promise<Result<ServerStatus, Error>> {
    return await DoFetch<ServerStatus>(host, port, HOME);
}

export async function GetEnvironment(
    host: string,
    port: number
): Promise<Result<Environment, Error>> {
    return await DoFetch<Environment>(host, port, ENVIRONMENT);
}

export async function GetSessionList(
    host: string,
    port: number
): Promise<Result<SessionList, Error>> {
    return await DoFetch<SessionList>(host, port, SESSIONS);
}
