"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import useAuthStore from "@/store/use-auth";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Building2Icon,
  CheckIcon,
  LogOutIcon,
  PlusIcon,
  ShieldCheckIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const getInitials = (name?: string) =>
  (name || "?").trim().slice(0, 2).toUpperCase();

export const ManageTeam = () => {
  const { defaultOrg, username } = useAuthStore();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [openModel, setOpenModel] = useState<boolean>(false);
  const { data: members, isPending: loadingMembers } = useQuery(
    trpc.teamRouter.getTeamMembers.queryOptions({
      orgname: defaultOrg,
    })
  );

  const sendInvite = useMutation(
    trpc.teamRouter.inviteTeamMembers.mutationOptions({
      onSuccess: () => {
        setOpenModel(false);
        toast.success("Invitation Sent");
      },
    })
  );

  const toggleMemberAccess = useMutation(
    trpc.teamRouter.toggleMemberAccess.mutationOptions({
      onSuccess: () => {
        toast.success("Member access updated successfully", {
          id: "member-access-update",
        });
        queryClient.invalidateQueries(
          trpc.teamRouter.getTeamMembers.queryOptions({
            orgname: defaultOrg,
          })
        );
      },
      onError: (error) => {
        toast.error("Failed to update member access: " + error.message, {
          id: "member-access-update",
        });
      },
    })
  );
  const removeMemberFromTeam = useMutation(
    trpc.teamRouter.removeTeamMember.mutationOptions({
      onSuccess: () => {
        toast.success("Member status updated successfully", {
          id: "member-access-update",
        });
        queryClient.invalidateQueries(
          trpc.teamRouter.getTeamMembers.queryOptions({
            orgname: defaultOrg,
          })
        );
      },
      onError: (error) => {
        toast.error("Failed to update member status: " + error.message, {
          id: "member-access-update",
        });
      },
    })
  );

  const [formData, setFormData] = useState<{
    username: string;
    email: string;
  }>({
    username: "",
    email: "",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold">Manage Team</h3>
          <p className="text-xs text-muted-foreground">
            People with access to{" "}
            <span className="font-medium text-foreground">{defaultOrg}</span>
          </p>
        </div>
        <AlertDialog open={openModel} onOpenChange={setOpenModel}>
          <AlertDialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <PlusIcon className="size-4" />
              Invite Member
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Send Invitation</AlertDialogTitle>
              <AlertDialogDescription>
                Invite a teammate to collaborate in{" "}
                <span className="font-medium text-foreground">{defaultOrg}</span>
                .
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-3 py-2">
              <div className="grid gap-1.5">
                <Label>Username</Label>
                <Input
                  type="text"
                  placeholder={username}
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      username: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder={"johndoe@example.com"}
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setOpenModel(false);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  if (sendInvite.isPending) return;
                  sendInvite.mutateAsync({
                    orgname: defaultOrg,
                    email: formData.email,
                    username: formData.username,
                  });
                }}
                disabled={sendInvite.isPending}
              >
                {sendInvite.isPending ? "Sending..." : "Send Invite"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="rounded-2xl border bg-card/60 p-3 backdrop-blur-sm">
        {loadingMembers ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton className="h-14 w-full rounded-xl" key={idx} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-1 pb-1">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Present Members
              </h2>
              <Badge variant="secondary" className="rounded-full">
                {members?.presentMembers?.length ?? 0}
              </Badge>
            </div>
            {members?.presentMembers?.map((member) => (
              <div
                className="flex items-center justify-between gap-3 rounded-xl border bg-card/40 p-3 transition-all hover:border-primary/40 hover:bg-card"
                key={member.id}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                    {getInitials(member?.teamMemberUsername)}
                  </span>
                  <span className="truncate text-sm font-medium">
                    {member?.teamMemberUsername}
                  </span>
                </div>

                {username === member?.teamMemberUsername ? (
                  <Badge className="gap-1 rounded-full bg-primary/15 text-primary">
                    <ShieldCheckIcon className="size-3" />
                    Admin
                  </Badge>
                ) : (
                  <span className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast.loading("Updating member access", {
                          id: "member-access-update",
                        });
                        toggleMemberAccess.mutateAsync({
                          orgname: defaultOrg,
                          teamMemberUsername: member?.teamMemberUsername,
                          isAllowed: !member?.isAllowed,
                        });
                      }}
                      className={cn(
                        member?.isAllowed
                          ? "border-secondary/40 bg-secondary/10 text-secondary hover:bg-secondary/20"
                          : "border-tertiary/40 bg-tertiary/10 text-tertiary hover:bg-tertiary/20"
                      )}
                    >
                      {member?.isAllowed ? "Has Access" : "No Access"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      title="Remove member"
                      onClick={() => {
                        toast.loading("Updating member status", {
                          id: "member-access-update",
                        });
                        removeMemberFromTeam.mutateAsync({
                          orgname: defaultOrg,
                          username: member?.teamMemberUsername,
                        });
                      }}
                    >
                      <LogOutIcon className="size-4" />
                    </Button>
                  </span>
                )}
              </div>
            ))}

            {members?.pastMembers?.length! > 0 && (
              <>
                <div className="mt-4 flex items-center gap-2 border-t px-1 pb-1 pt-4">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-destructive">
                    Past Members
                  </h2>
                </div>
                {members?.pastMembers?.map((member) => (
                  <div
                    className="flex items-center justify-between gap-3 rounded-xl border bg-card/40 p-3"
                    key={member.id}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
                        {getInitials(member?.teamMemberUsername)}
                      </span>
                      <span className="truncate text-sm font-medium text-muted-foreground">
                        {member?.teamMemberUsername}
                      </span>
                    </div>
                    <Badge variant={"destructive"} className="rounded-full">
                      Left
                    </Badge>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const ManageInvitations = () => {
  const { username, defaultOrg } = useAuthStore();
  const [toastId, setToastId] = useState<string | number>("");
  const trpc = useTRPC();
  const { data: invitations, isPending: loadingInvitations } = useQuery(
    trpc.teamRouter.getInvitation.queryOptions({
      username: username,
      orgname: defaultOrg,
    })
  );
  const queryClient = useQueryClient();
  const updateInvitationStatus = useMutation(
    trpc?.teamRouter.updateInvitationStatus.mutationOptions({
      onSuccess: () => {
        toast.success("Updated invitation status successfully", {
          id: toastId,
        });
        queryClient.invalidateQueries(
          trpc.teamRouter.getInvitation.queryOptions({
            username: username,
            orgname: defaultOrg,
          })
        );
      },
    })
  );

  const InvitationItem = ({
    username,
    status,
    tab,
    isResponded,
    orgname,
    invitationId,
  }: {
    username: string;
    createdAt?: Date;
    status: string;
    tab: "sent" | "received";
    isResponded: boolean;
    orgname: string;
    invitationId: string;
  }) => {
    const label = tab === "received" ? orgname : username;
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border bg-card/40 p-3 transition-all hover:border-primary/40 hover:bg-card">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
            {getInitials(label)}
          </span>
          <span className="truncate text-sm font-medium">{label}</span>
        </div>
        <span className="flex items-center gap-2">
          <Badge
            className="rounded-full capitalize"
            variant={
              status === "pending"
                ? "outline"
                : status === "accepted"
                ? "default"
                : "destructive"
            }
          >
            {status}
          </Badge>
          {tab === "received" && !isResponded && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="size-8 border-secondary/40 bg-secondary/10 text-secondary hover:bg-secondary/20"
                title="Accept"
                onClick={() => {
                  const toastId = toast.loading("Accepting invitation");
                  setToastId(toastId);
                  updateInvitationStatus.mutateAsync({
                    isAccepted: true,
                    invitationId,
                    orgname,
                  });
                }}
              >
                <CheckIcon className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                title="Reject"
                onClick={() => {
                  const toastId = toast.loading("Rejecting invitation");
                  setToastId(toastId);
                  updateInvitationStatus.mutateAsync({
                    isAccepted: false,
                    invitationId,
                    orgname,
                  });
                }}
              >
                <XIcon className="size-4" />
              </Button>
            </>
          )}
        </span>
      </div>
    );
  };

  if (loadingInvitations) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
        <div className="flex flex-col gap-2 rounded-2xl border bg-card/60 p-3 backdrop-blur-sm">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton className="h-14 w-full rounded-xl" key={idx} />
          ))}
        </div>
      </div>
    );
  }

  const EmptyState = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <UsersIcon className="size-6" />
      </div>
      <p className="max-w-md text-sm text-muted-foreground">{children}</p>
    </div>
  );

  return (
    <Tabs
      defaultValue={
        invitations && invitations?.sent?.length > 0 ? "sent" : "received"
      }
      className="space-y-3"
    >
      <TabsList>
        <TabsTrigger value="sent">Sent</TabsTrigger>
        {defaultOrg === username && (
          <TabsTrigger value="received">Received</TabsTrigger>
        )}
      </TabsList>
      <TabsContent
        value="sent"
        className="flex w-full flex-col gap-2 rounded-2xl border bg-card/60 p-3 backdrop-blur-sm"
      >
        {invitations?.sent.length ? (
          invitations?.sent?.map((invitation) => (
            <InvitationItem
              invitationId={invitation.id}
              orgname={invitation.orgname}
              key={invitation.id}
              username={invitation.username}
              status={invitation.status}
              tab="sent"
              isResponded={invitation.isResponded}
            />
          ))
        ) : (
          <EmptyState>
            You haven&apos;t sent any invitations for{" "}
            <span className="font-medium text-primary">{defaultOrg}</span> yet.
          </EmptyState>
        )}
      </TabsContent>
      {defaultOrg === username && (
        <TabsContent
          value="received"
          className="flex w-full flex-col gap-2 rounded-2xl border bg-card/60 p-3 backdrop-blur-sm"
        >
          {invitations?.received.length ? (
            invitations?.received?.map((invitation) => (
              <InvitationItem
                invitationId={invitation.id}
                orgname={invitation.orgname}
                key={invitation.id}
                username={invitation.username}
                status={invitation.status}
                tab="received"
                isResponded={invitation.isResponded}
              />
            ))
          ) : (
            <EmptyState>
              No one has sent you an invitation to join their organization.
            </EmptyState>
          )}
        </TabsContent>
      )}
    </Tabs>
  );
};

export const OrgList = () => {
  const trpc = useTRPC();
  const { data: orgs, isPending: loadingOrgs } = useQuery(
    trpc.teamRouter.getTeamMemberOrgs.queryOptions()
  );

  if (loadingOrgs)
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton key={idx} className="h-16 w-full rounded-2xl" />
        ))}
      </div>
    );

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 px-1 pb-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Current Organizations
          </h2>
        </div>
        {orgs && orgs.presentOrgs?.length > 0 ? (
          <div className="flex flex-col gap-2">
            {orgs.presentOrgs?.map((org) => (
              <Link
                href={`/dashboard/team/organization/${org.orgname}`}
                key={org.id}
                className="group flex items-center justify-between gap-3 rounded-2xl border bg-card/60 p-4 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Building2Icon className="size-5" />
                  </span>
                  <h3 className="truncate text-sm font-semibold">
                    {org.orgname}
                  </h3>
                </div>
                {org.isAllowed ? (
                  <Badge className="rounded-full bg-secondary/15 text-secondary">
                    Has Access
                  </Badge>
                ) : (
                  <Badge variant={"destructive"} className="rounded-full">
                    No Access
                  </Badge>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Building2Icon className="size-6" />
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              You are not part of any organization as a team member.
            </p>
          </div>
        )}
      </div>

      {orgs && orgs.pastOrgs?.length > 0 && (
        <div>
          <div className="flex items-center gap-2 border-t px-1 pb-2 pt-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-destructive">
              Past Organizations
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            {orgs.pastOrgs?.map((org) => (
              <div
                key={org.id}
                className="flex items-center justify-between gap-3 rounded-2xl border bg-card/40 p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <Building2Icon className="size-5" />
                  </span>
                  <h3 className="truncate text-sm font-semibold text-muted-foreground">
                    {org.orgname}
                  </h3>
                </div>
                <Badge variant={"destructive"} className="rounded-full">
                  Left
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const TeamPage = () => {
  return (
    <div className="relative flex h-full max-h-svh flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="relative z-20 flex h-[68px] shrink-0 items-center gap-3 border-b bg-card px-6 shadow-sm">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
          <UsersIcon className="size-5" />
        </span>
        <div className="min-w-0 space-y-0.5">
          <h1 className="truncate text-base font-bold leading-tight tracking-tight md:text-lg">
            Teams &amp; Organizations
          </h1>
          <p className="truncate text-xs text-muted-foreground">
            Manage your team or the orgs you belong to as a member
          </p>
        </div>
      </header>

      <div className="relative flex-1 overflow-y-auto">
        {/* ambient glow backdrop, scoped to the scroll area */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-40 -top-40 size-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-32 bottom-0 size-96 rounded-full bg-secondary/10 blur-3xl" />
        </div>

        <div className="p-5">
          <Tabs defaultValue="team" className="space-y-4">
            <TabsList>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="orgs">Orgs</TabsTrigger>
              <TabsTrigger value="invitations">Invitations</TabsTrigger>
            </TabsList>
            <TabsContent value="team">
              <ManageTeam />
            </TabsContent>
            <TabsContent value="orgs">
              <OrgList />
            </TabsContent>
            <TabsContent value="invitations">
              <ManageInvitations />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
