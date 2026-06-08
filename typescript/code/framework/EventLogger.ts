import { mkdir, writeFile } from "fs/promises";
import { dirname } from "path";

interface LoggedEvent {
  timestamp: Date;
  message: string;
  enventType: "message" | "narrative" | "failure" | "stackTrace";
}

export class EventLogger {
  private readonly events: LoggedEvent[] = [];

  public addMessage(message: string): void {
    this.addEvent(message, "message");
  }

  public addNarrative(message: string): void {
    this.addEvent(message, "narrative");
  }

  public addFailure(message: string): void {
    this.addEvent(message, "failure");
  }

  public addStackTrace(stackTrace: string): void {
    this.addEvent(stackTrace, "stackTrace");
  }

  private addEvent(message: string, enventType: LoggedEvent["enventType"]): void {
    const normalizedMessage = message.trim();

    if (!normalizedMessage) {
      throw new Error("EventLogger.addEvent requires a non-empty message.");
    }

    this.events.push({
      timestamp: new Date(),
      message: normalizedMessage,
      enventType,
    });
  }

  public async createDocument(outputPath: string): Promise<void> {
    const normalizedPath = outputPath.trim();

    if (!normalizedPath) {
      throw new Error(
        "EventLogger.createDocument requires a non-empty output path."
      );
    }

    await mkdir(dirname(normalizedPath), { recursive: true });
    await writeFile(normalizedPath, this.buildMarkdown(), "utf8");
  }

  private buildMarkdown(): string {
    const entries = this.events.length
      ? this.events.map((event) => this.renderEvent(event)).join("\n\n")
      : "- No events logged.";

    return [
      "# Event Log",
      "",
      entries,
      "",
    ].join("\n");
  }

  private renderEvent(event: LoggedEvent): string {
    if (event.enventType === "narrative") {
      const narrativeMessage = this.escapeHtml(event.message).replace(/\r?\n/g, "<br />");

      return [
        '<div style="border: 1px solid #d0d7de; background-color: #f6f8fa; padding: 12px; border-radius: 6px;">',
        narrativeMessage,
        '</div>',
      ].join("\n");
    }

    if (event.enventType === "failure") {
      return `- <span style="color: #cf222e; font-weight: 600;">${this.escapeHtml(event.message)}</span>`;
    }

    if (event.enventType === "stackTrace") {
      return [
        '<pre style="margin: 0; padding: 12px; border: 1px solid #cf222e; background-color: #ffebe9; border-radius: 6px; overflow-x: auto;">',
        this.escapeHtml(event.message),
        '</pre>',
      ].join("\n");
    }

    return `- ${this.escapeMarkdownText(event.message)}`;
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  private escapeMarkdownText(value: string): string {
    return value.replace(/([\\`*_{}\[\]()#+\-.!|>])/g, "\\$1");
  }
}