"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2Icon,
  CreditCardIcon,
  SparklesIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const BillingPage = () => {
  const [interestMessage, setInterestMessage] = useState<string>("");
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: interest, isPending: loadingInterest } = useQuery(
    trpc.feedbackRouter.getInterest.queryOptions()
  );
  const showInterest = useMutation(
    trpc.feedbackRouter.showBillingInterests.mutationOptions({
      onSuccess: (data) => {
        toast.success(data?.message || "Interest recorded", {
          duration: 2000,
          id: "billing-interest",
        });
        queryClient.invalidateQueries(
          trpc.feedbackRouter.getInterest.queryOptions()
        );
      },
      onError: (error) => {
        toast.error(error.message || "Something went wrong", {
          duration: 2000,
          id: "billing-interest",
        });
      },
    })
  );

  return (
    <div className="relative flex h-full max-h-svh flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="relative z-20 flex h-[68px] shrink-0 items-center gap-3 border-b bg-card px-6 shadow-sm">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
          <CreditCardIcon className="size-5" />
        </span>
        <div className="min-w-0 space-y-0.5">
          <h1 className="truncate text-base font-bold leading-tight tracking-tight md:text-lg">
            Billing
          </h1>
          <p className="truncate text-xs text-muted-foreground">
            Manage your plan and upcoming upgrades
          </p>
        </div>
      </header>

      <div className="relative flex-1 overflow-y-auto">
        {/* ambient glow backdrop, scoped to the scroll area */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-40 -top-40 size-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-32 bottom-0 size-96 rounded-full bg-tertiary/10 blur-3xl" />
        </div>

        <div className="flex min-h-full items-center justify-center p-5">
          {loadingInterest ? (
            <Skeleton className="h-[440px] w-full max-w-xl rounded-2xl" />
          ) : interest?.data ? (
            <div className="flex w-full max-w-xl flex-col items-center gap-4 rounded-2xl border bg-card/60 p-8 text-center backdrop-blur-sm">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
                <CheckCircle2Icon className="size-7" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xl font-bold tracking-tight">
                  You&apos;re on the list!
                </h2>
                <p className="mx-auto max-w-md text-sm text-muted-foreground">
                  You&apos;ve already expressed interest in our upgradable plans.
                  We&apos;ll reach out to you as soon as they go live.
                </p>
              </div>
            </div>
          ) : (
            <form
              className="w-full max-w-xl overflow-hidden rounded-2xl border bg-card/60 backdrop-blur-sm"
              onSubmit={(e) => {
                e.preventDefault();
                toast.loading("Recording your interest", {
                  id: "billing-interest",
                });
                showInterest.mutate({
                  message: interestMessage || "Interested in upgradable plans",
                });
              }}
            >
              <div className="space-y-3 border-b bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <SparklesIcon className="size-3.5" />
                  Coming soon
                </span>
                <div className="space-y-1.5">
                  <h2 className="text-xl font-bold tracking-tight">
                    Premium plans are on the way
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Let us know you&apos;re interested and we&apos;ll notify you
                    first when paid plans with higher limits and advanced reviews
                    launch.
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-6">
                <div className="grid gap-2">
                  <Label htmlFor="interest-message">Message (Optional)</Label>
                  <Textarea
                    rows={6}
                    id="interest-message"
                    name="message"
                    placeholder="Tell us what you'd love to see in a paid plan..."
                    onChange={(e) => setInterestMessage(e.target.value)}
                    value={interestMessage}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={showInterest.isPending}
                >
                  <SparklesIcon className="size-4" />
                  {showInterest.isPending ? "Submitting..." : "Show interest"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
