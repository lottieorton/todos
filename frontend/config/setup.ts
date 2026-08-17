import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";

// remove anything from the dom after each test, so that we always start with a clean slate
afterEach(() => {
  cleanup();
});
