import { useState } from "react";
import ContactForm from "./components/ContactForm";
import WebMCPStatus from "./components/WebMCPStatus";
import { useStartHereTool } from "./webmcp";
import { APP_VERSION } from "./version";

export default function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastClickedLabel, setLastClickedLabel] = useState<string | null>(null);

  const handleSubmit = () => {
    console.log("Button clicked");
    setLastClickedLabel(`${firstName || "(empty)"} ${lastName || "(empty)"} at ${new Date().toLocaleTimeString()}`);
  };

  useStartHereTool({
    setFirstName,
    setLastName,
    clickButton: handleSubmit,
  });

  return (
    <main className="page">
      <h1>WebMCP Test Page</h1>
      <p className="muted">
        A minimal page for testing whether an AI agent can discover and invoke a WebMCP tool
        (<code>start_here</code>) exposed via <code>document.modelContext</code>.
      </p>

      <ContactForm
        firstName={firstName}
        lastName={lastName}
        onFirstNameChange={setFirstName}
        onLastNameChange={setLastName}
        onSubmit={handleSubmit}
        lastClickedLabel={lastClickedLabel}
      />

      <WebMCPStatus />
      <footer className="version-footer">Version {APP_VERSION}</footer>
    </main>
  );
}
