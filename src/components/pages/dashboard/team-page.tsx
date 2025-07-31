"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import useAuthStore from "@/store/use-auth";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { CheckIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const ManageTeam = () => {
  const { defaultOrg, username } = useAuthStore();
  const trpc = useTRPC();
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

  const [formData, setFormData] = useState<{
    username: string;
    email: string;
  }>({
    username: "",
    email: "",
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Manage Team</h3>
        <AlertDialog open={openModel}>
          <AlertDialogTrigger
            onClick={() => {
              setOpenModel(true);
            }}
          >
            Invite Member
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle
                onClick={() => {
                  setOpenModel(true);
                }}
              >
                Send Invitation
              </AlertDialogTitle>
              <AlertDialogDescription>
                <span className="grid grid-cols-4 gap-2">
                  <Label className="col-span-1">Username</Label>
                  <Input
                    type="text"
                    placeholder={username}
                    className="col-span-3"
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        username: e.target.value,
                      });
                    }}
                  />
                  <Label className="col-span-1">Email</Label>
                  <Input
                    type="email"
                    placeholder={"johndoe@exampl.com"}
                    className="col-span-3"
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      });
                    }}
                  />
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setOpenModel(false);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (sendInvite.isPending) return;
                  sendInvite.mutateAsync({
                    orgname: defaultOrg,
                    email: formData.email,
                    username: formData.username,
                  });
                }}
                disabled={sendInvite.isPending}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="bg-card p-2 mt-2 rounded-lg flex flex-col gap-2">
        {loadingMembers
          ? Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton className="w-full h-10" key={idx} />
            ))
          : members?.map((member, idx) => (
              <div
                className="flex items-center justify-between"
                key={member.id}
              >
                <span className="font-bold">
                  {idx + 1 + ". " + member?.teamMemberUsername}{" "}
                </span>

                {username === member?.teamMemberUsername ? (
                  <Button disabled={true}>Admin</Button>
                ) : (
                  <Button
                    className={cn(
                      "",
                      member?.isAllowed
                        ? "!bg-green-500 !text-white"
                        : "!bg-red-500 !text-white"
                    )}
                  >
                    {member?.isAllowed ? "Has Access" : "No Access"}
                  </Button>
                )}
              </div>
            ))}
      </div>
    </>
  );
};

export const ManageInvitations = () => {
  const { username, defaultOrg } = useAuthStore();
  const trpc = useTRPC();
  const { data: invitations, isPending: loadingInvitations } = useQuery(
    trpc.teamRouter.getInvitation.queryOptions({
      username: username,
      orgname:defaultOrg,
    })
  );

  const InvitationItem = ({
    username,
    status,
    tab,
    isResponded,
    orgname,
  }: {
    username: string;
    createdAt?: Date;
    status: string;
    tab: "sent" | "received";
    isResponded: boolean;
    orgname:string
  }) => {
    return (
      <span className="flex items-center justify-between">
        <span>{tab === "received" ? orgname:username }</span>
        <span className="flex items-center gap-2">
          <Badge>{status}</Badge>
          {tab === "received" && !isResponded && (
            <>
              <span>
                <CheckIcon />
              </span>
              <span>
                <XIcon />
              </span>
            </>
          )}
        </span>
      </span>
    );
  };
  if (loadingInvitations) {
    return <p>Loading</p>;
  }

  return (
    <Tabs
      defaultValue={
        invitations && invitations?.sent?.length > 0 ? "sent" : "received"
      }
    >
      <TabsList>
        <TabsTrigger value="sent">Sent</TabsTrigger>
        <TabsTrigger value="received">Received</TabsTrigger>
      </TabsList>
      <TabsContent value="sent">
        {invitations?.sent.length &&
          invitations?.sent?.map((invitation) => (
            <InvitationItem
            orgname={invitation.orgname}
              key={invitation.id}
              username={invitation.username}
              status={invitation.status}
              tab="sent"
              isResponded={invitation.isResponded}
            />
          ))}
      </TabsContent>
      <TabsContent value="received">
        {invitations?.received.length &&
          invitations?.received?.map((invitation) => (
            <InvitationItem
            orgname={invitation.orgname}
              key={invitation.id}
              username={invitation.username}
              status={invitation.status}
              tab="received"
              isResponded={invitation.isResponded}
            />
          ))}
      </TabsContent>
    </Tabs>
  );
};
export const TeamPage = () => {
  const { username } = useAuthStore();
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-card border-b">
        <div className="flex items-center justify-between p-2">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-3">
              Teams and Orgs you are part in
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground italic">
              Manage teams in your org or orgs in which you are a team member
            </p>
          </div>
        </div>
      </div>

      <div className="mt-2 p-4">
        <Tabs defaultValue="team">
          <TabsList>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="orgs">Orgs</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
          </TabsList>
          <TabsContent value="team">
            <ManageTeam />
          </TabsContent>
          <TabsContent value="orgs">Orgs</TabsContent>
          <TabsContent value="invitations">
            <ManageInvitations />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
