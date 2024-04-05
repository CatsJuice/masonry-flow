import { HTMLAttributes } from "react";

export interface TestButtonProps extends HTMLAttributes<HTMLButtonElement> {}

export const TestButton = (attrs: TestButtonProps) => (
  <button className="bg-slate-500 border-1 rounded-2" {...attrs}>
    TestButton
  </button>
);
