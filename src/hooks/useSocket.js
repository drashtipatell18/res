// import { useEffect, useState } from "react";
// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js';

// const useSocket = () => {
//     const [echo, setEcho] = useState(null);

//     useEffect(() => {
//         window.Pusher = Pusher;

//         const newEcho = new Echo({
//             broadcaster: "pusher",
//             key: "4fc8a6c3a8bed22b1439",
//             cluster: "mt1",
//             wsHost: window.location.hostname,
//             forceTLS: true, // Ensure this is true for wss
//             disableStats: false,
//             wsPort: 6001, // Ensure this port is correct
//             // wssPort: 6001, // Ensure this port is correct
//             // encrypted: true,
//             // enabledTransports: ['ws', 'wss'],
//             auth: {
//                 headers: {
//                     'Authorization': 'Bearer ' + localStorage.getItem('token')
//                 }
//             }
//         });

//         // Add connection error logging
//         newEcho.connector.pusher.connection.bind('error', (error) => {
//             console.error('WebSocket connection error:', error);
//         });

//         // Log successful connection
//         newEcho.connector.pusher.connection.bind('connected', () => {
//             console.log('WebSocket connected successfully');
//         });

//         setEcho(newEcho);

//         return () => {
//             newEcho.disconnect(); // Clean up on unmount
//         };
//     }, []);

//     return echo;
// };

// export default useSocket;

import { useEffect, useState, useRef } from "react";
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const useSocket = () => {
    const [echo, setEcho] = useState(null);
    const reconnectTimer = useRef(null);
    const pusherInstance = useRef(null);

    useEffect(() => {
        // Prevent multiple instances
        if (echo || pusherInstance.current) return;

        // Configure Pusher
        window.Pusher = Pusher;
        Pusher.logToConsole = false; // Disable logging

        // Configure Pusher with reduced activity timeout
        const pusher = new Pusher('4fc8a6c3a8bed22b1439', {
            cluster: 'mt1',
            forceTLS: true,
            enabledTransports: ['ws', 'wss'],
            disableStats: true,
            // activityTimeout: 120000, // 2 minutes
            // pongTimeout: 30000,      // 30 seconds
            // maxReconnectionAttempts: 3,
            // maxReconnectGap: 10000,  // 10 seconds max between reconnects
        });

        pusherInstance.current = pusher;

        const newEcho = new Echo({
            broadcaster: "pusher",
            client: pusher,
            wsHost: window.location.hostname,
            wsPort: 6001,
            auth: {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }
        });

        // Handle connection states
        pusher.connection.bind('connected', () => {
            console.log('WebSocket connected');
            if (reconnectTimer.current) {
                clearTimeout(reconnectTimer.current);
                reconnectTimer.current = null;
            }
        });

        pusher.connection.bind('disconnected', () => {
            console.log('WebSocket disconnected');
        });

        pusher.connection.bind('error', (err) => {
            console.error('WebSocket error:', err);
        });

        setEcho(newEcho);

        // Cleanup
        return () => {
            if (reconnectTimer.current) {
                clearTimeout(reconnectTimer.current);
            }
            if (pusherInstance.current) {
                pusherInstance.current.disconnect();
                pusherInstance.current = null;
            }
            if (newEcho) {
                newEcho.disconnect();
            }
            setEcho(null);
        };
    }, []);

    return echo;
};

export default useSocket;

// import { useEffect } from "react";
// import Echo from "laravel-echo";

// const useSocket = () => {
//     useEffect(() => {
//         window.Echo = new Echo({
//             broadcaster: "pusher",
//             key: "7ae046560a0ed83ad8c7",
//             //  key: "GoofNBCH",
//             cluster: "mt1",
//             wsHost: window.location.hostname,
//             wsPort: 6001,
//             forceTLS: false, 
//             disableStats: false,
//             useTls: true, 
//             auth: {
//                 headers: {
//                     'Authorization': 'Bearer ' + localStorage.getItem('token')
//                 }
//             }
//         });

//         // Optional: Add any event listeners or additional setup here

//         return () => {
//             // Optional: Clean up if necessary
//             window.Echo.disconnect();
//         };
//     }, []);

//     return null; // This component does not render anything
// };

// export default useSocket;
