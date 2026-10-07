import { useEffect, useState } from "react";
import {
  TOOL_EXECUTION_EVENT,
  TOOL_REGISTRATION_EVENT,
  isModelContextAvailable,
  type ToolExecutionLogEntry,
  type ToolRegistrationLogEntry,
} from "../webmcp";

const MAX_LOG_ENTRIES = 10;

export default function WebMCPStatus() {
  const [registration, setRegistration] = useState<ToolRegistrationLogEntry | null>(null);
  const [executions, setExecutions] = useState<ToolExecutionLogEntry[]>([]);

  useEffect(() => {
    const handleRegistration = (event: Event) => {
      setRegistration((event as CustomEvent<ToolRegistrationLogEntry>).detail);
    };
    const handleExecution = (event: Event) => {
      const entry = (event as CustomEvent<ToolExecutionLogEntry>).detail;
      setExecutions((current) => [entry, ...current].slice(0, MAX_LOG_ENTRIES));
    };

    window.addEventListener(TOOL_REGISTRATION_EVENT, handleRegistration);
    window.addEventListener(TOOL_EXECUTION_EVENT, handleExecution);
    return () => {
      window.removeEventListener(TOOL_REGISTRATION_EVENT, handleRegistration);
      window.removeEventListener(TOOL_EXECUTION_EVENT, handleExecution);
    };
  }, []);

  const apiAvailable = registration ? registration.apiAvailable : isModelContextAvailable();
  const toolRegistered = registration?.registered ?? false;
  const invoked = executions.length > 0;
  const lastExecution = executions[0];

  return (
    <section className="card">
      <h2>WebMCP status</h2>
      <ul className="status-list">
        <li className={apiAvailable ? "ok" : "fail"}>
          {apiAvailable ? "✅" : "❌"} WebMCP is available
        </li>
        <li className={toolRegistered ? "ok" : "fail"}>
          {toolRegistered ? "✅" : "❌"} Your tool was registered
          {registration?.error ? ` — ${registration.error}` : ""}
        </li>
        <li className={invoked ? "ok" : "fail"}>
          {invoked ? "✅" : "❌"} An agent actually invoked your tool
          {lastExecution ? ` — last call ${lastExecution.status}` : ""}
        </li>
      </ul>

      <h3>Recent tool calls</h3>
      {executions.length === 0 ? (
        <p className="muted">No tool calls yet.</p>
      ) : (
        <ul className="log-list">
          {executions.map((entry) => (
            <li key={entry.id} className={entry.status}>
              {new Date(entry.timestamp).toLocaleTimeString()} — <strong>{entry.toolName}</strong>: {entry.status}
              {entry.error ? ` — ${entry.error}` : ""}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
