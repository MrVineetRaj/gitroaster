"use client";
import { TabsTrigger, Tabs, TabsList, TabsContent } from "@/components/ui/tabs";
import useAuthStore from "@/store/use-auth";
import { PencilIcon, StarIcon, TrashIcon } from "lucide-react";
import React from "react";

export const ConfigPage = () => {
  const { username, defaultOrg } = useAuthStore();
  return (
    <div>
      <div className="sticky top-0 z-10 bg-card border-b h-18">
        <div className="flex items-center justify-between p-2">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-3">
              Hello there
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground italic">
              Here you can manage configuration related to your organization
            </p>
          </div>
        </div>
      </div>

      <div className="mt-2 p-4">
        <Tabs defaultValue="ai-tone">
          <TabsList>
            <TabsTrigger value="ai-tone">AI Tone</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>
          <TabsContent value="ai-tone">
            {" "}
            <ManageAITones />{" "}
          </TabsContent>
          <TabsContent value="integrations">
            <ManageIntegrations />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export const ManageAITones = () => {
  return (
    <div className="mt-4 bg-card flex flex-col justify-around gap-2 p-4 rounded-lg">
      {Array.from({ length: 5 })
        .fill(0)
        .map((_, idx) => (
          <div
            key={idx}
            className="p-4  border  bg-background rounded-md relative"
          >
            <span className="absolute top-2 right-2 flex gap-2 text-muted-foreground">
              <StarIcon className="size-4 text-orange-200 cursor-pointer" />
              <PencilIcon className="size-4 text-blue-500  cursor-pointer" />
              <TrashIcon className="size-4 text-destructive cursor-pointer" />
            </span>
            <h3 className="font-semibold pb-2 border-b">Tone {idx + 1}</h3>
            <p className="text-sm text-muted-foreground italic mt-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt
              obcaecati sapiente explicabo iste neque a velit voluptatum! Odit,
              assumenda quos!
            </p>
          </div>
        ))}
    </div>
  );
};

export const ManageIntegrations = () => {
  return <div>Manage Integrations</div>;
};
