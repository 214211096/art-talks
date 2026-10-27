import { io } from 'socket.io-client';
import { API_URL } from './config';

let socket;

// Created lazily so the connection opens only when a discussion is first used
export function getSocket() {
    if (!socket) {
        socket = io(API_URL);
    }
    return socket;
}
