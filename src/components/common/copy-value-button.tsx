"use client";

import { useState } from "react";

export function CopyValueButton({ value }: Readonly<{ value: string }>) {
  const [status, setStatus] = useState("");

  async function copyValue() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("Copied");
    } catch (error) {
      console.error("Afterglow clipboard write failed:", error);
      setStatus("Copy unavailable; select the code to copy it.");
    }
  }

  return (
    <span className="copy-value-wrap">
      <button className="button button-secondary" onClick={copyValue} type="button">
        Copy code
      </button>
      {status ? (
        <span aria-live="polite" className="copy-value-status">
          {status}
        </span>
      ) : null}
    </span>
  );
}
