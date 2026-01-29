import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase";

function Dashboard() {
  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div>
      <PageHeader>
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button onClick={logout}>Logout</Button>
        </div>
      </PageHeader>
    </div>
  );
}

export { Dashboard };
