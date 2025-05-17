// socket.io 
// temp, chưa bổ sung vào code
import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';


const socket = io('http://localhost:3000', {
    autoConnect: false,
    transports: ['websocket'],
});

export const useSocket = () => {
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        socket.connect();

        socket.on('connect', () => {
            setConnected(true);
            console.log('Connected to server');
        });

        socket.on('disconnect', () => {
            setConnected(false);
            console.log('Disconnected from server');
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return { connected };
};

export const useSocketEvent = (event: string, callback: (data: any) => void) => {
    useEffect(() => {
        socket.on(event, callback);

        return () => {
            socket.off(event, callback);
        };
    }, [event, callback]);
};

export const useSocketEmitWithCallback = (event: string, data: any, callback: (response: any) => void) => {
    useEffect(() => {
        socket.emit(event, data, callback);
    }, [event, data, callback]);
};

export const useSocketEmitWithResponse = (event: string, data: any) => {
    const [response, setResponse] = useState<any>(null);

    useEffect(() => {
        socket.emit(event, data, (res: any) => {
            setResponse(res);
        });
    }, [event, data]);

    return response;
};