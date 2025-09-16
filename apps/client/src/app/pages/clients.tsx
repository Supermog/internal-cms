import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function Clients() {
  return (
    <div>
      <PageTitle title="Clients" description="Client overview and status" />
      <div className="flex justify-end">
        <Button leadingIcon={<Plus className="w-4 h-4" />}>Add Client</Button>
      </div>
    </div>
  );
}

export { Clients };
