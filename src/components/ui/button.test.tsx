import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import { Button } from "./button";

describe("Button", () => {
  it("renders button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });
});
