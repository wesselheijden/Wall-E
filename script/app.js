document.addEventListener("DOMContentLoaded", (event) => {
  window.botpressWebChat.init({
    composerPlaceholder: "Chat with bot",
    botConversationDescription:
      "This chatbot was built surprisingly fast with Botpress",
    botId: "72cce4b8-1ae0-4610-bddf-ee43acbc33a5",
    hostUrl: "https://cdn.botpress.cloud/webchat/v1",
    messagingUrl: "https://messaging.botpress.cloud",
    clientId: "72cce4b8-1ae0-4610-bddf-ee43acbc33a5",
    webhookId: "f74a49e5-bb26-459b-8197-6d0a74b03eb6",
    containerWidth: "100%25",
    layoutWidth: "100%25",
    lazySocket: true,
    themeName: "prism",
    hideWidget: true,
    useSessionStorage: true,
    disableAnimations: true,
    showCloseButton: false,
    closeOnEscape: false,
    enableConversationDeletion: true,
    showPoweredBy: true,
    theme: "prism",
    themeColor: "#2563eb",
    allowedOrigins: [],
    stylesheet: "https://i432778.hera.fhict.nl/botpress.css",
  });

  console.log("skele");

  window.botpressWebChat.onEvent(
    (event) => {
      if (event.type === "TRIGGER" && event.value.botResponse) {
        console.log(event.value.botResponse);
        streamAudio(event.value.botResponse);
      } else {
        window.botpressWebChat.sendEvent({ type: "show" });
      }
    },
    ["TRIGGER", "LIFECYCLE.LOADED"]
  );
});

function streamAudio(text) {
  const options = {
    method: "POST",
    headers: {
      "xi-api-key": "f2ac8beef377fdfd616cc0fc09693348",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text,
      voice_settings: {
        stability: 0.8,
        similarity_boost: 0.6,
      },
    }),
  };

  fetch(
    "https://api.elevenlabs.io/v1/text-to-speech/prkETcVHAEVKlK6PbGaE/stream?optimize_streaming_latency=0&output_format=mp3_44100_128",
    options
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.arrayBuffer();
    })
    .then((data) => {
      playAudio(data);
    })
    .catch((err) => console.error("Fetch error: ", err));
}

function playAudio(arrayBuffer) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    console.log(`Audio duration: ${source.buffer.duration} seconds`);
    source.start(0);

    startAnimation();

    source.onended = () => {
      stopAnimation();
    };
  });
}

function startAnimation() {
  const bars = document.querySelectorAll(".bar");
  bars.forEach((each) => {
    each.style.animationDuration = `${Math.random() * (0.75 - 0.25) + 0.25}s`;
    each.style.animationPlayState = "running";
  });
}

function stopAnimation() {
  const bars = document.querySelectorAll(".bar");
  bars.forEach((each) => {
    each.style.animationPlayState = "paused";
  });
}

window.addEventListener("load", () => {});
