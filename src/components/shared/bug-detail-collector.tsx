"use client";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BugIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";

export function BugDetailCollector() {
  return (
    <Dialog >
      <form>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="fixed bottom-4 right-4 !bg-primary rounded-full !text-black font-bold h-12 w-12 border border-black hover:scale-105 active:scale-95 transition-transform z-50 flex items-center justify-center cursor-pointer"
          >
            <BugIcon className="size-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Report new Bug</DialogTitle>
            <DialogDescription>
              Make sure to include steps to reproduce the issue.
            </DialogDescription>
          </DialogHeader>
          <span className="mb-4 grid grid-cols-1 gap-1">
            <Label htmlFor="name" className="mb-2 col-span-1 h-full">
              Steps {"(to reproduce)"}
            </Label>
            <Textarea
              rows={20}
              id="email"
              name="name"
              placeholder={"- Step 1 : Go to... \n- step 2 : then ..."}
              className="col-span-1"
            />
          </span>
          <span className="mb-4 grid grid-cols-1 gap-1">
            <Label htmlFor="name" className="mb-2 col-span-1 h-full">
              Message {"(Optional)"}
            </Label>
            <Textarea
              rows={20}
              id="email"
              name="name"
              placeholder="Hey there... "
              className="col-span-1"
            />
          </span>
          <span className="mb-4 grid grid-cols-1 gap-1">
            <Label htmlFor="name" className="mb-2 col-span-1 h-full">
              Screen shots {"(Optional)"}
            </Label>
            <Input  type="file" className="col-span-1" />
          </span>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
