
export function GetEnvironmentVariable(env_name: String) {
    // @ts-ignore: Ignore TypeScript error for this line
    return window.env[env_name];
}

