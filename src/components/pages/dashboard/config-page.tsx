"use client";
import { Button } from "@/components/ui/button";
import { TabsTrigger, Tabs, TabsList, TabsContent } from "@/components/ui/tabs";
import useAuthStore from "@/store/use-auth";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  StarIcon,
  TrashIcon,
} from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const ConfigPage = () => {
  const { username, defaultOrg } = useAuthStore();
  const [showAiConfig, setShowAiConfig] = React.useState(false);
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
        <Tabs defaultValue="org-settings">
          <TabsList>
            <TabsTrigger value="org-settings">Org Settings</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>
          <TabsContent value="org-settings">
            <div className="w-full p-4 border cursor-pointer">
              <span
                onClick={() => setShowAiConfig(!showAiConfig)}
                className="flex items-center justify-between"
              >
                <h1 className="font-bold text-2xl">AI Tone</h1>
                {showAiConfig ? (
                  <ChevronDownIcon className="rotate-180 transition-all duration-300" />
                ) : (
                  <ChevronDownIcon className="rotate-0 transition-all duration-300" />
                )}
              </span>
              {showAiConfig && <ManageAITones />}
            </div>
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
  const [tones, setTones] = React.useState<
    { title: string; description: string }[]
  >([]);
  const [title, setTitle] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTones([...tones, { title, description }]);
    setTitle("");
    setDescription("");
    setOpen(false); // close dialog
  };

  return (
    <div className="mt-4 bg-card flex flex-col justify-around gap-2 p-4 rounded-lg">
      <div className="text-sm text-muted-foreground flex items-center justify-between">
        <span>
          Manage the tones that AI will use while generating code reviews for
          this organization.
        </span>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            className="px-4 py-2 bg-primary text-foreground font-bold rounded"
            onClick={() => setOpen(true)}
          >
            Add New Tone
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add new tone</DialogTitle>
                <DialogDescription>
                  Describe the tone in which you want AI to generate code
                  reviews.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="tone-title">Title</Label>
                  <Input
                    id="tone-title"
                    name="tone-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="tone-description">Tone Description</Label>
                  <Textarea
                    id="tone-description"
                    name="tone-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button variant="default" type="submit">
                  Add Tone
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {tones.length ? (
        tones.map((tone, idx) => (
          <div
            key={idx}
            className="p-4 border bg-background rounded-md relative"
          >
            <span className="absolute top-2 right-2 flex gap-2 text-muted-foreground">
              <StarIcon className="size-4 text-orange-200 cursor-pointer" />
              <PencilIcon className="size-4 text-blue-500  cursor-pointer" />
              <TrashIcon className="size-4 text-destructive cursor-pointer" />
            </span>
            <h3 className="font-semibold pb-2 border-b">
              {tone?.title || `Tone ${idx + 1}`}
            </h3>
            <p className="text-sm text-muted-foreground italic mt-2">
              {tone?.description ||
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt obcaecati sapiente explicabo iste neque a velit voluptatum! Odit, assumenda quos!"}
            </p>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground italic">
          No tones added yet. Click on {`"Add New Tone"`} to get started.
        </p>
      )}
    </div>
  );
};

export const ManageIntegrations = () => {
  return <div>Manage Integrations</div>;
};
