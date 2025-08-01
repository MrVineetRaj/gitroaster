"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useTRPC } from "@/trpc/client";

import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
import { TrashIcon } from "lucide-react";

const planFormSchema = z.object({
  isYearly: z.boolean(),
  planName: z.string().min(1, "Plan name required"),
  amount: z.number(),
  currency: z.string(),
  description: z.string().min(1, "Plan description required"),
  features: z
    .array(
      z.object({
        label: z.string(),
      })
    )
    .min(1, "Features are required"),
});

type PlanFormType = z.infer<typeof planFormSchema>;

export function PlanForm() {
  const {
    register,
    control,
    reset,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PlanFormType>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      isYearly: false,
    },
  });

  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    control,
    name: "features",
  });
  const trpc = useTRPC();
  // const createPlane = useMutation(
  //   // trpc.razorPayRouter.createPlan.mutationOptions({
  //   //   onSuccess: (res) => {
  //   //     toast.success(res.message);
  //   //   },
  //   //   onError: (err) => {
  //   //     toast.success(err.message);
  //   //   },
  //   // })
  // );

  const onSubmit = (data: PlanFormType) => {
    const validationResult = planFormSchema.safeParse(data);

    if (!validationResult.success) {
      console.log(validationResult?.error?.message);
      return;
    }

    // createPlane.mutateAsync({
    //   isYearly,
    //   name: planName,
    //   description,
    //   features: JSON.stringify(features),
    //   amount: amount * 100,
    //   currency,
    // });
  };

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Badge variant={"outline"}>Create Plan</Badge>
        </DialogTrigger>
        <DialogContent className="max-h-[60vh] overflow-y-scroll">
          <DialogTitle>Create New Plan</DialogTitle>
          <DialogDescription>
            You can not delete this plan once created
          </DialogDescription>{" "}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Label className="flex items-center justify-between">
              Yearly Plan
              <Checkbox {...register("isYearly")} />
            </Label>

            <div className="flex flex-col">
              <div className="grid grid-cols-4 gap-y-2">
                <Label className="col-span-1">Plan name</Label>
                <Input
                  className="col-span-3"
                  placeholder="Name"
                  {...register("planName")}
                />
                {errors.planName && (
                  <span className="col-span-4 text-red-500 text-right text-xs italic">
                    {errors.planName.message}
                  </span>
                )}
                <Label className="col-span-1">Amount</Label>

                <Input
                  className="col-span-3"
                  type="number"
                  placeholder="15"
                  {...register("amount", { valueAsNumber: true })}
                />
                {errors.amount && (
                  <span className="col-span-4 text-red-500 text-right text-xs italic">
                    {errors.amount.message}
                  </span>
                )}

                <Label className="col-span-1">Currency</Label>
                <Controller
                  control={control}
                  name="currency"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full col-span-3">
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="INR">INR</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.currency && (
                  <span className="col-span-4 text-red-500 text-right text-xs italic">
                    {errors.currency.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <Label className="col-span-1">Description</Label>

                <TextareaAutosize
                  placeholder="Description"
                  {...register("description")}
                  className={cn(
                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                    "col-span-3"
                  )}
                  minRows={5}
                  maxRows={10}
                  maxLength={500}
                />
                {errors.description && (
                  <span className="col-span-4 text-red-500 text-right text-xs italic">
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <Label>Features</Label>
                {featureFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 mb-2">
                    <Input
                      {...register(`features.${index}.label`)}
                      placeholder={`Feature ${index + 1}`}
                      className="flex-1"
                    />
                    <Button
                      variant={"ghost"}
                      type="button"
                      onClick={() => removeFeature(index)}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                ))}
                {errors.features && (
                  <span className="col-span-4 text-red-500 text-right text-xs italic">
                    {errors.features.message}
                  </span>
                )}
                <Button
                  variant={"outline"}
                  type="button"
                  onClick={() => appendFeature({ label: "" })}
                >
                  {"+ Add Feature"}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              // disabled={createPlane.isPending}
            >
              {/* {createPlane.isPending ? "Loading..." : "Create Plan"} */}
              Loading
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
