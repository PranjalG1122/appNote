import React, { PropsWithChildren } from "react";

export default function Container({ children }: PropsWithChildren<{}>) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-white bg-black">
      <div className="flex flex-col items-center">{children}</div>
    </main>
  );
}
