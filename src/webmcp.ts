import { useEffect, useRef } from "react";

/// <reference path="./webmcp-types.d.ts" />

export const TOOL_NAME = "start_here";

export const TOOL_REGISTRATION_EVENT = "webmcp-tool-registration";
export const TOOL_EXECUTION_EVENT = "webmcp-tool-execution";

export interface ToolRegistrationLogEntry {
  toolName: string;
  apiAvailable: boolean;
  registered: boolean;
  timestamp: number;
  error?: string;
}

export type ToolExecutionStatus = "started" | "succeeded" | "failed";

export interface ToolExecutionLogEntry {
  id: number;
  toolName: string;
  status: ToolExecutionStatus;
  timestamp: number;
  input?: unknown;
  error?: string;
}

/** Whether the browser running this page has the native WebMCP API. */
export function isModelContextAvailable(): boolean {
  return typeof document !== "undefined" && Boolean(document.modelContext);
}

function reportRegistration(registered: boolean, error?: string): void {
  window.dispatchEvent(
    new CustomEvent<ToolRegistrationLogEntry>(TOOL_REGISTRATION_EVENT, {
      detail: {
        toolName: TOOL_NAME,
        apiAvailable: isModelContextAvailable(),
        registered,
        timestamp: Date.now(),
        ...(error ? { error } : {}),
      },
    })
  );
}

let nextExecutionId = 0;

function reportExecution(entry: Omit<ToolExecutionLogEntry, "id" | "timestamp">): void {
  window.dispatchEvent(
    new CustomEvent<ToolExecutionLogEntry>(TOOL_EXECUTION_EVENT, {
      detail: { ...entry, id: nextExecutionId++, timestamp: Date.now() },
    })
  );
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export interface StartHereArgs {
  firstName?: string;
  lastName?: string;
}

interface StartHereHandlers {
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  clickButton: () => void;
}

/**
 * Registers the `start_here` WebMCP tool using the native
 * `document.modelContext` API, and reports registration/execution activity
 * via window CustomEvents so the UI can display live status.
 */
export function useStartHereTool(handlers: StartHereHandlers): void {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!isModelContextAvailable()) {
      reportRegistration(false, "document.modelContext is not available in this browser.");
      return;
    }

    const controller = new AbortController();

    const execute = async (rawArgs: unknown): Promise<ModelContextToolResult> => {
      reportExecution({ toolName: TOOL_NAME, status: "started", input: rawArgs });

      const args = (rawArgs ?? {}) as StartHereArgs;
      const missing: string[] = [];
      if (!args.firstName || !args.firstName.trim()) missing.push("firstName");
      if (!args.lastName || !args.lastName.trim()) missing.push("lastName");

      if (missing.length > 0) {
        const message = `Missing required field(s): ${missing.join(", ")}. Ask the user for their ${missing
          .join(" and ")}, then call ${TOOL_NAME} again with both firstName and lastName.`;
        reportExecution({ toolName: TOOL_NAME, status: "failed", input: rawArgs, error: message });
        throw new Error(message);
      }

      handlersRef.current.setFirstName(args.firstName!.trim());
      handlersRef.current.setLastName(args.lastName!.trim());

      // Let React commit the state update before the button reads it.
      await new Promise((resolve) => setTimeout(resolve, 0));
      handlersRef.current.clickButton();

      reportExecution({ toolName: TOOL_NAME, status: "succeeded", input: rawArgs });

      return {
        content: [
          {
            type: "text",
            text: `Form populated with "${args.firstName} ${args.lastName}" and the button was clicked.`,
          },
        ],
      };
    };

    document
      .modelContext!.registerTool(
        {
          name: TOOL_NAME,
          description:
            "MANDATORY ENTRY. " +
            "All interaction with this application MUST begin by calling start_here. " +
            "Do not manually populate fields. " +
            "Do not click the form directly. " +
            "Invoke this tool first"
            ,
          inputSchema: {
            type: "object",
            properties: {
              firstName: { type: "string", description: "The user's first name." },
              lastName: { type: "string", description: "The user's last name." },
            },
            required: ["firstName", "lastName"],
          },
          execute,
        },
        { signal: controller.signal }
      )
      .then(
        () => reportRegistration(true),
        (error: unknown) => reportRegistration(false, getErrorMessage(error))
      );

    return () => controller.abort();
  }, []);
}
