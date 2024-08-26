self.addEventListener("install", () => {
    console.log("👻service worker installed");
});

const activateEvent = () => {
    self.addEventListener("activate", () => {
        console.log("👻service worker activated");
    });
};
activateEvent();

const heartbeatCheckBySessionId = new Map();
const communicationPortBySessionId = new Map();

self.addEventListener("message", (event) => {
    if (event.data) {
        if (event.data.type === "INIT_PORT") {
            const communicationPort = event.ports[0];
            communicationPortBySessionId.set(
                event.data.sessionId,
                communicationPort,
            );

            // Send a message back to the main thread to confirm the connection
            communicationPort.postMessage({
                type: "INIT_ACK",
                message: "👻Service worker connected",
            });

            console.log(
                "👻 communicationPortBySessionId",
                communicationPortBySessionId,
            );
        } else if (event.data.type === "HEART_BEAT_ACK") {
            heartbeatCheckBySessionId.set(event.data.sessionId, true);
            console.log(
                `👻Service worker received heartbeat ack: `,
                event.data.sessionId,
            );
        } else {
            // Optionally listen for messages from the main thread here
            console.log(`👻Service worker received message: `, event.data);

            const communicationPort = communicationPortBySessionId.get(
                event.data.sessionId,
            );
            // Respond back if needed
            communicationPort.postMessage({
                type: "ACK",
                message: "👻Acknowledged your message",
            });
        }
    }
});

setInterval(() => {
    console.log(`👻 ----------setInterval 1000----------`);
    communicationPortBySessionId.forEach((check, sessionId) => {
        heartbeatCheckBySessionId.set(sessionId, false);
    });

    communicationPortBySessionId.forEach((communicationPort, sessionId) => {
        communicationPort.postMessage({
            type: "HEART_BEAT",
            message: "👻are you there?",
        });
    });

    setTimeout(() => {
        heartbeatCheckBySessionId.forEach((check, sessionId) => {
            if (!check) {
                fetch(`api/session_swhb_dead/${sessionId}`, {
                    method: "POST",
                }).then();

                heartbeatCheckBySessionId.delete(sessionId);
                communicationPortBySessionId.delete(sessionId);
            }
        });
    }, 900);
}, 1000);
