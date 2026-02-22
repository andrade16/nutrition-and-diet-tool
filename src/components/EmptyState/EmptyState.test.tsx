import { render, screen } from "@testing-library/react";
import EmptyState from "@/components/EmptyState/EmptyState";

describe("EmptyState", () => {
  it("renders the title", () => {
    render(<EmptyState title="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(
      <EmptyState
        title="Nothing here"
        subtitle="Try searching for something"
      />,
    );
    expect(screen.getByText("Try searching for something")).toBeInTheDocument();
  });

  it("does not render subtitle when omitted", () => {
    render(<EmptyState title="Nothing here" />);
    expect(
      screen.queryByText("Try searching for something"),
    ).not.toBeInTheDocument();
  });

  it("renders an action link when provided", () => {
    render(
      <EmptyState
        title="Nothing here"
        action={{ label: "Search foods", href: "/search" }}
      />,
    );
    const link = screen.getByRole("link", { name: "Search foods" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/search");
  });

  it("does not render a link when action is omitted", () => {
    render(<EmptyState title="Nothing here" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders an icon when provided", () => {
    render(<EmptyState title="Nothing here" icon={<span>🌟</span>} />);
    expect(screen.getByText("🌟")).toBeInTheDocument();
  });
});
