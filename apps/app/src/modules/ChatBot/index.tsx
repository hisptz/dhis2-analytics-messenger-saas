import React from "react";
import EmptyChatBotList from "./components/EmptyChatBotList";

function onAddChatBotTrigger() {
    console.log("Adding chat bot trigger");
}

export default function ChatBot(): React.ReactElement {
    return (
        <EmptyChatBotList/>
    );
}
