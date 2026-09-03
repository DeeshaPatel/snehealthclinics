export default function ChatMessage({
    message
}) {

    return (

        <div
            className={
                message.sender === "bot"
                    ? "bot-message"
                    : "user-message"
            }
        >

            {String(message.text)
                .split("\n")
                .map((line, index) => (

                    <span key={index}>

                        {line}

                        {index <
                            String(message.text)
                                .split("\n")
                                .length - 1 && (
                            <br />
                        )}

                    </span>

                ))}

        </div>

    );

}