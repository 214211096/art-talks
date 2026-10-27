import { useCallback, useEffect, useState } from 'react';
import { getSocket } from '../socket';

// Joins the socket room for one picture and keeps its message list in sync
export function useDiscussion(pictureId) {
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (pictureId == null) return undefined;

        const socket = getSocket();
        setMessages([]);
        setConnected(socket.connected);

        const join = () => {
            setConnected(true);
            socket.emit('joinPicture', pictureId);
        };
        const onDisconnect = () => setConnected(false);
        const onHistory = (history) => setMessages(history);
        const onMessage = (message) => {
            if (message.pictureId === pictureId) {
                setMessages(prev => [...prev, message]);
            }
        };

        socket.on('connect', join);
        socket.on('disconnect', onDisconnect);
        socket.on('history', onHistory);
        socket.on('newMessage', onMessage);
        if (socket.connected) join();

        return () => {
            socket.emit('leavePicture', pictureId);
            socket.off('connect', join);
            socket.off('disconnect', onDisconnect);
            socket.off('history', onHistory);
            socket.off('newMessage', onMessage);
        };
    }, [pictureId]);

    const sendMessage = useCallback((text, author) => {
        getSocket().emit('newMessage', { pictureId, text, author });
    }, [pictureId]);

    return { messages, connected, sendMessage };
}
