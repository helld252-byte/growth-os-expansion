import CommandCenter from "./(dashboard)/page";
import DashboardLayout from "./(dashboard)/layout";

export default function Home() {
  return (
    <DashboardLayout>
      <CommandCenter />
    </DashboardLayout>
  );
}