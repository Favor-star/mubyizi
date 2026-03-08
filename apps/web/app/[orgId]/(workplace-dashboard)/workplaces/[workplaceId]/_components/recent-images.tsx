import { IconArrowRight } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const RecentImages = () => {
  return (
    <section className="mt-4 space-y-2">
      <header className="flex justify-between items-center">
        <h1 className="font-bold text-lg">Recent Images</h1>

        <Button variant={"link"} asChild>
          <Link href={"gallery"}>
            View all
            <IconArrowRight />
          </Link>
        </Button>
      </header>
      <div className=" flex  gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="aspect-square w-full  border border-muted hover:border-border rounded-md overflow-hidden group  p-2">
            <Image
              src={`https://picsum.photos/500?random=${i}`}
              alt={`Recent image ${i}`}
              className="w-full h-full object-cover group-hover:scale-[1.06] transform transition-transform duration-300"
              height={5000}
              width={5000}
            />
          </div>
        ))}
        <Link
          href={"gallery"}
          className="aspect-square w-full  border border-muted hover:border-border rounded-md overflow-hidden group flex justify-center items-center  p-2">
          <span className="text-primary">+12 more</span>
        </Link>
      </div>
    </section>
  );
};
