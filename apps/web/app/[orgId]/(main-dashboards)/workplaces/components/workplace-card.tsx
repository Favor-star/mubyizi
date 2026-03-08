import { IconChecks, IconExternalLink, IconMapPin, IconPointFilled, IconUsers } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { Progress } from "@workspace/ui/components/progress";
import Image from "next/image";
import React from "react";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Workplace } from "@/data/mock";
import Link from "next/link";

export const WorkplaceCard = ({ workplace, orgId }: { workplace: Workplace; orgId: string }) => {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35 ">
        <CardTitle className="w-full  absolute bottom-2 left-3 ">
          <span className="text-white text-lg font-bold tracking-wider">{workplace.name}</span>
          <div className="flex justify-start items-center gap-1 text-xs text-white/80 ">
            <IconMapPin strokeWidth={1.5} size={18} />
            <span className="w-full line-clamp-1 tracking-wide ">{workplace.location}</span>
          </div>
        </CardTitle>
      </div>
      <Image
        width={300}
        height={150}
        src="https://images.unsplash.com/photo-1771845630625-43c6b807ffb5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />
      <Badge variant="outline" className="absolute z-30 top-2 right-2 text-success border-success">
        <IconPointFilled data-icon="inline-start" />
        Active
      </Badge>
      <CardHeader>
        <CardAction></CardAction>
        <CardDescription className="flex-col">
          <div className="">
            <span className="text-xs text-muted-foreground"> Budget spent</span>
            <div className="flex gap-1 items-center">
              <Progress value={75} className="h-2 text-secondary rounded-none" indicatorClassName="bg-chart-1" />
              30%
            </div>
          </div>
        </CardDescription>
      </CardHeader>

      <CardFooter>
        <Badge variant={"outline"}>
          <IconUsers data-icon="inline-start" />
          12 workers
        </Badge>
        <Button className="ml-auto" variant={"outline"} asChild>
          <Link href={`/${orgId}/workplaces/${workplace.id}`}>
            View Site <IconExternalLink />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
