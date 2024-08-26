self.addEventListener("install", () => {
    console.log("👻service worker installed");
});

const activateEvent = () => {
    self.addEventListener("activate", () => {
        console.log("👻service worker activated");
    });
};
activateEvent();

let communicationPort;

self.addEventListener("message", (event) => {
    if (event.data) {
        if (event.data.type === "INIT_PORT") {
            communicationPort = event.ports[0];

            // Send a message back to the main thread to confirm the connection
            communicationPort.postMessage({
                type: "INIT_ACK",
                message: "👻Service worker connected",
            });
        } else {
            // Optionally listen for messages from the main thread here

            console.log(`👻Service worker received message: `, event.data);
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
    communicationPort.postMessage({
        type: "HEART_BEAT",
        message: "👻are you there?",
    });
}, 1000);
