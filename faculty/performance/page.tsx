import { redirect } from 'next/navigation';

export default function PlaceholderPage() {
  return (
    <div className="flex flex-col items-center justify-center h-96">
      <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
      <p className="text-muted-foreground">This feature is under development.</p>
    </div>
  );
}
