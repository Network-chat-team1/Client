class EmergencyMessageHandler {
    static isEmergency(message) {
        return message.includes("비상") || message.includes("응급");
    }

    static createEmergencyMessage(originalMessage) {
        return {
            id: `${Date.now()}-${Math.random()}`,
            sender: "emergency",
            text: originalMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: "emergency",
        };
    }
}

export default EmergencyMessageHandler;
