export interface Source {
  title: string;
  url: string;
  snippet?: string;
  content?: string;
}

export interface AgentStep {
  iteration: number;
  tool: string;
  arguments: Record<string, unknown>;
}

export interface ResearchResult {
  task_id: number;
  question: string;
  report: string;
  sources: Source[];
  steps: AgentStep[];
}

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function runResearch(
  question: string,
): Promise<ResearchResult> {
  const response = await fetch(`${API_URL}/research`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    let detail = `Research request failed (${response.status})`;

    try {
      const data = await response.json();
      if (typeof data?.detail === "string") {
        detail = data.detail;
      }
    } catch {
      // Response body is not JSON; keep the default message.
    }

    throw new Error(detail);
  }

  return (await response.json()) as ResearchResult;
}
