"use client";

export default function OpenChatButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent("open-chat", { detail: { context: "quote" } })
        )
      }
      className={className}
    >
      {children}
    </button>
  );
}
