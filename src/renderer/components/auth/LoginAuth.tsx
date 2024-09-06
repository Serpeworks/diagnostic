import React from "react";

type LoginAuthComponentProps = {
    host: string;
    port: string;
    onChange: (ev: React.FormEvent<HTMLInputElement>) => void;
    onSubmit: (ev: React.FormEvent<HTMLFormElement>) => void;
};

export function LoginAuthComponent({
    host,
    port,
    onChange,
    onSubmit
}: LoginAuthComponentProps) {
    return (
        <form className="auth-login-form" onSubmit={onSubmit}>
            <input
                key="host"
                id="host"
                name="host"
                type="text"
                value={host}
                onChange={onChange}
            />
            <a> : </a>
            <input
                key="port"
                id="port"
                name="port"
                type="text"
                value={port}
                onChange={onChange}
            />
            <button type="submit">Connect</button>
        </form>
    );
}

