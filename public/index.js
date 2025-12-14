window.addEventListener("load", () => {
    const tempEl = document.getElementById("temp");
    const warningEl = document.getElementById("warning");

    const LIMIT = 30;
    const socket = new WebSocket("ws://localhost:3000");

    socket.onopen = () => {
        console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received:", data);

        tempEl.textContent = `${data.value} °C`;

        if (data.value > LIMIT) {
            warningEl.textContent = "High temperature!";
            console.log("Warning triggered");
        } else {
            warningEl.textContent = "";
        }
    };
});
