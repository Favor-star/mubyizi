import React from "react";

export const ProjectSummary = () => {
  return (
    <section className="p-3 bg-sidebar border">
      <h1 className="font-bold ">Project Summary</h1>
      <p className="line-clamp-3 text-sm font-light">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestiae tempora mollitia minus saepe dolores iste
        nemo officiis consequatur animi placeat! A at assumenda accusamus delectus ratione nulla sint similique nemo
        magni! Culpa impedit quas iure, voluptates libero error harum, minima id dolorem deserunt eius laboriosam illum
        vitae distinctio esse saepe.
      </p>
      <div className="flex gap-2 mt-3">
        {[
          { title: "Location", description: "123 Main St, City, Country" },
          { title: "Start Date", description: "January 1, 2024" },
          { title: "End Date", description: "December 31, 2024" },
          { title: "Est. Completion", description: "36%" }
        ].map((item, index) => (
          <SubCard key={item.title.replaceAll(/\s+/g, "-")} title={item.title} description={item.description} />
        ))}
      </div>
    </section>
  );
};

const SubCard = ({ title, description }: { title: string; description: string }) => {
  return (
    <section className="p-3 bg-background space-y-1 border border-muted ">
      <h2 className="uppercase font-medium text-muted-foreground  text-sm">{title}</h2>
      <p className=" font-bold ">{description}</p>
    </section>
  );
};
