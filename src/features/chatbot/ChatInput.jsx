import { useState } from "react";


export default function ChatInput({
    onSend
}) {

    const [text, setText] =
        useState("");


    function submit(e) {

        e.preventDefault();


        const value =
            text.trim();


        if (!value) {
            return;
        }


        onSend(value);

        setText("");

    }


    return (

        <form
            className="chat-input"
            onSubmit={submit}
        >

            <input

                value={text}

                onChange={e =>
                    setText(
                        e.target.value
                    )
                }

                placeholder="Type your answer..."

                autoComplete="off"

            />


            <button
                type="submit"
            >

                Send

            </button>

        </form>

    );

}