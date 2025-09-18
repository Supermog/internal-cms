import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function Clients() {
  // const {
  //   data: clients,
  //   isLoading,
  //   isError,
  // } = useGetClients({
  //   page: 1,
  //   limit: 10,
  // });

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
