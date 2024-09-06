// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
    ipcRenderer: {
        sendMessage(channel: Channels, ...args: unknown[]) {
            ipcRenderer.send(channel, ...args);
        },
        on(channel: Channels, func: (...args: unknown[]) => void) {
            const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => func(...args);
            ipcRenderer.on(channel, subscription);

            // Return a cleanup function to remove the listener
            return () => {
                ipcRenderer.removeListener(channel, subscription);
            };
        },
        once(channel: Channels, func: (...args: unknown[]) => void) {
            ipcRenderer.once(channel, (_event: IpcRendererEvent, ...args: unknown[]) => func(...args));
        },
        invoke(channel: Channels, ...args: unknown[]) {
            return ipcRenderer.invoke(channel, ...args);
        }
    },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

contextBridge.exposeInMainWorld('env', {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',
});

export type ElectronHandler = typeof electronHandler;
