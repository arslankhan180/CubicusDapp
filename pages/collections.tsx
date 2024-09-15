import NewCollections from "@/components/NewCollections";
import DefaultLayout from "@/layouts/default";
import React from "react";

export default function Collections() {
  return (
    <DefaultLayout>
      <div className="w-full">
        <NewCollections />
      </div>
    </DefaultLayout>
  );
}
