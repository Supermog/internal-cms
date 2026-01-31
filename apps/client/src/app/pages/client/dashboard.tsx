import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase";

function ClientDashboard() {
  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div>
      <PageHeader
        title={<h1 className="text-2xl font-bold">Dashboard</h1>}
        actions={<Button onClick={logout}>Logout</Button>}
      />
    </div>
  );
}

export { ClientDashboard };
