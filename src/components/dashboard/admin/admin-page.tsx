import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React from "react";

const AdminPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b">
        <div className="flex items-center justify-between p-2">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-3">
              Hello ADMIN
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground italic">
              here you can manage platform
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="plans" className="px-2 py-4">
        <TabsList>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="plans"></TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
