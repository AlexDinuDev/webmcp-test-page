// Minimal ambient type declarations for the experimental WebMCP API
// (document.modelContext). This proposal is still evolving — see
// https://github.com/webmachinelearning/webmcp — so these types only cover
// the subset of the surface this project uses.

export {};

declare global {
  interface ModelContextToolResultContent {
    type: "text";
    text: string;
  }

  interface ModelContextToolResult {
    content: ModelContextToolResultContent[];
  }

  interface ModelContextToolDefinition {
    name: string;
    description: string;
    inputSchema?: Record<string, unknown>;
    execute: (args: unknown) => ModelContextToolResult | Promise<ModelContextToolResult>;
  }

  interface ModelContextRegisterToolOptions {
    signal?: AbortSignal;
  }

  interface ModelContext extends EventTarget {
    registerTool: (
      tool: ModelContextToolDefinition,
      options?: ModelContextRegisterToolOptions
    ) => Promise<void>;
  }

  interface Document {
    modelContext?: ModelContext;
  }
}
