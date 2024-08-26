self.addEventListener("install", () => {
    console.log("👻service worker installed");
});

const activateEvent = () => {
    self.addEventListener("activate", () => {
        console.log("👻service worker activated");
    });
};
activateEvent();

setInterval(() => {
    console.log(`👻 setInterval 1000`);
}, 1000);
