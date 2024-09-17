import Sidebar from "@/components/Sidebar";
import React from "react";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex gap-2 bg-[#ECF1F3] h-screen w-screen">
        <div>
          <Sidebar />
          <div>
            {/* <w3m-button /> */}
          </div>
        </div>
        <div className="p-4 w-full overflow-x-scroll max-md:p-1">
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
