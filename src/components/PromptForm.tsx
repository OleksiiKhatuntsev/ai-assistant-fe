import { useState } from "react";
import axios from "axios";

interface PromptPostViewModel {
  promptId: string;
  parameters: string;
}

function PromptForm() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload: PromptPostViewModel = {
        promptId: "6b29fc40-ca47-1067-b31d-00dd010662da", // you can make this dynamic if needed
        parameters: text
      };

      const res = await axios.post(
        "https://localhost:7256/api/gemini/index",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      setResponse(JSON.stringify(JSON.parse(res.data), null, 2));
      setText(""); // clear input after send
    } catch (err) {
      console.error(err);
      setResponse("Error sending request");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Enter text:
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            required
          />
        </label>
        <button type="submit">Send</button>
      </form>

      {response && (
        <div>
          <h3>Response:</h3>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
}

export default PromptForm;