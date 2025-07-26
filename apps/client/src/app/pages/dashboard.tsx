import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase";

function Dashboard() {
  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}

export { Dashboard };
