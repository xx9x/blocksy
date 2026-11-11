"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { BrickBuilder } from "@/components/builder/BrickBuilder";

export default function BuildPage() {
  return (
    <>
      <PageHeader
        title="My Blocksy Build"
        badge="Your digital protection, one brick at a time"
        color="orange"
        description="Every brick here is something you learned or a habit you built. Pick one from your inventory, then snap it onto the baseplate."
      />
      <BrickBuilder />
    </>
  );
}
