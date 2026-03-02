import { ModeToggle } from "@/components/mode-toggle";
import { TestData } from "@/components/test-data";
import { Button } from "@workspace/ui/components/button";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <ModeToggle />

        <h1 className="text-2xl font-bold">Hello World</h1>
        <div className="flex gap-2">
          <Button>Button</Button>
          <Button variant="outline">Outline</Button>
        </div>
        <TestData />
      </div>
    </div>
  );
}
