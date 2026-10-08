import { useEffect, useRef } from "react";
import type { FormData } from "./components/ContactForm";

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
  dob?: string;
  addressLine?: string;
  city?: string;
  zip?: string;
  state?: string;
  phone?: string;
  email?: string;
  vin?: string;
  make?: string;
  model?: string;
  year?: string;
  hasAutoInsurance?: "yes" | "no";
  gender?: "male" | "female";
  maritalStatus?: "single" | "married" | "widowed";
  militaryService?: "yes" | "no";
  licenseAge?: string;
  movingViolations?: "yes" | "no";
  consent?: "yes" | "no";
  ownership?: "own" | "finance" | "lease";
  parkedAtAddress?: "yes" | "no";
  purchasedLast90Days?: "yes" | "no";
  drivewiseInterest?: "yes" | "no";
}

interface StartHereHandlers {
  setField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  getFormData: () => FormData;
  clickButton: () => void;
}

interface FieldDef {
  key: keyof StartHereArgs;
  question: string;
  options?: readonly string[];
}

const FIELD_DEFS: FieldDef[] = [
  { key: "firstName", question: "What is your first name?" },
  { key: "lastName", question: "What is your last name?" },
  { key: "dob", question: "What is your date of birth? (YYYY-MM-DD)" },
  { key: "addressLine", question: "What is your street address?" },
  { key: "city", question: "What city do you live in?" },
  { key: "zip", question: "What is your zip code?" },
  { key: "state", question: "What state do you live in?" },
  { key: "phone", question: "What is your phone number?" },
  { key: "email", question: "What is your email address?" },
  { key: "vin", question: "What is your vehicle's VIN?" },
  { key: "make", question: "What is your vehicle's make?" },
  { key: "model", question: "What is your vehicle's model?" },
  { key: "year", question: "What year is your vehicle?" },
  { key: "hasAutoInsurance", question: "Do you currently have auto insurance?", options: ["yes", "no"] },
  { key: "gender", question: "What is your gender?", options: ["male", "female"] },
  { key: "maritalStatus", question: "What is your marital status?", options: ["single", "married", "widowed"] },
  { key: "militaryService", question: "Are you or were you in the US military?", options: ["yes", "no"] },
  { key: "licenseAge", question: "What age did you get your driver's license?" },
  { key: "movingViolations", question: "Any moving violations in the last 5 years?", options: ["yes", "no"] },
  {
    key: "consent",
    question:
      "Do you consent to receive marketing communications about this quote? (required to proceed)",
    options: ["yes", "no"],
  },
  { key: "ownership", question: "Do you own, finance, or lease the vehicle?", options: ["own", "finance", "lease"] },
  {
    key: "parkedAtAddress",
    question: "Is the vehicle parked at your address when it isn't being driven?",
    options: ["yes", "no"],
  },
  {
    key: "purchasedLast90Days",
    question: "Did you purchase the vehicle in the last 90 days?",
    options: ["yes", "no"],
  },
  { key: "drivewiseInterest", question: "Are you interested in Drivewise?", options: ["yes", "no"] },
];

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

      // Validate any supplied enum values before applying anything.
      const invalid: string[] = [];
      for (const def of FIELD_DEFS) {
        const value = args[def.key];
        if (value === undefined || !def.options) continue;
        if (!def.options.includes(value)) {
          invalid.push(`${def.key} must be one of: ${def.options.join(", ")} (got "${value}")`);
        }
      }
      if (invalid.length > 0) {
        const message = `Invalid field value(s): ${invalid.join("; ")}.`;
        reportExecution({ toolName: TOOL_NAME, status: "failed", input: rawArgs, error: message });
        throw new Error(message);
      }

      // Apply whatever fields were supplied in this call. Fields already
      // saved from a previous call are left untouched.
      for (const def of FIELD_DEFS) {
        const value = args[def.key];
        if (value === undefined) continue;
        if (def.key === "consent") {
          handlersRef.current.setField("consent", value === "yes");
        } else {
          handlersRef.current.setField(def.key as Exclude<keyof FormData, "consent">, value as string);
        }
      }

      // Let React commit the state updates before reading them back.
      await new Promise((resolve) => setTimeout(resolve, 0));

      const current = handlersRef.current.getFormData();
      const missing = FIELD_DEFS.filter((def) => {
        if (def.key === "consent") return current.consent !== true;
        return !current[def.key as Exclude<keyof FormData, "consent">];
      });

      if (missing.length > 0) {
        const message =
          `Form updated, but ${missing.length} field(s) are still missing. Ask the user the following ` +
          `question(s), then call ${TOOL_NAME} again with just the new answer(s) (previously provided ` +
          `fields are already saved and don't need to be resent): ` +
          missing
            .map((def) => `${def.key} ("${def.question}"${def.options ? ` — options: ${def.options.join("/")}` : ""})`)
            .join("; ");
        reportExecution({ toolName: TOOL_NAME, status: "failed", input: rawArgs, error: message });
        throw new Error(message);
      }

      handlersRef.current.clickButton();

      reportExecution({ toolName: TOOL_NAME, status: "succeeded", input: rawArgs });

      return {
        content: [
          {
            type: "text",
            text: "All fields were populated and the quote form was submitted.",
          },
        ],
      };
    };

    document
      .modelContext!.registerTool(
        {
          name: TOOL_NAME,
          description:
            "Populates the auto insurance quote form and submits it. Accepts partial input: any field you " +
            "don't know can be omitted, and the tool will report back exactly which fields still need to be " +
            "collected from the user. Call it again with just the newly collected answers once you have them " +
            "— fields you already provided are saved between calls.",
          inputSchema: {
            type: "object",
            properties: {
              firstName: { type: "string", description: "The user's first name." },
              lastName: { type: "string", description: "The user's last name." },
              dob: { type: "string", description: "Date of birth, YYYY-MM-DD." },
              addressLine: { type: "string", description: "Street address." },
              city: { type: "string", description: "City." },
              zip: { type: "string", description: "Zip code." },
              state: { type: "string", description: "State." },
              phone: { type: "string", description: "Phone number." },
              email: { type: "string", description: "Email address." },
              vin: { type: "string", description: "Vehicle identification number." },
              make: { type: "string", description: "Vehicle make." },
              model: { type: "string", description: "Vehicle model." },
              year: { type: "string", description: "Vehicle year." },
              hasAutoInsurance: {
                type: "string",
                enum: ["yes", "no"],
                description: "Whether the user currently has auto insurance.",
              },
              gender: { type: "string", enum: ["male", "female"], description: "The user's gender." },
              maritalStatus: {
                type: "string",
                enum: ["single", "married", "widowed"],
                description: "The user's marital status.",
              },
              militaryService: {
                type: "string",
                enum: ["yes", "no"],
                description: "Whether the user is or was in the US military.",
              },
              licenseAge: { type: "string", description: "Age the user got their driver's license." },
              movingViolations: {
                type: "string",
                enum: ["yes", "no"],
                description: "Whether the user has had moving violations in the last 5 years.",
              },
              consent: {
                type: "string",
                enum: ["yes", "no"],
                description: "Whether the user consents to receive marketing communications.",
              },
              ownership: {
                type: "string",
                enum: ["own", "finance", "lease"],
                description: "Whether the user owns, finances, or leases the vehicle.",
              },
              parkedAtAddress: {
                type: "string",
                enum: ["yes", "no"],
                description: "Whether the vehicle is parked at the user's address when not driven.",
              },
              purchasedLast90Days: {
                type: "string",
                enum: ["yes", "no"],
                description: "Whether the vehicle was purchased in the last 90 days.",
              },
              drivewiseInterest: {
                type: "string",
                enum: ["yes", "no"],
                description: "Whether the user is interested in Drivewise.",
              },
            },
            required: [
              "firstName",
              "lastName",
              "dob",
              "addressLine",
              "city",
              "zip",
              "state",
              "phone",
              "email",
              "vin",
              "make",
              "model",
              "year",
              "hasAutoInsurance",
              "gender",
              "maritalStatus",
              "militaryService",
              "licenseAge",
              "movingViolations",
              "consent",
              "ownership",
              "parkedAtAddress",
              "purchasedLast90Days",
              "drivewiseInterest",
            ],
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

