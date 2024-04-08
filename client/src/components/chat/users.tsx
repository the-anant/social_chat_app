"use client";
import { Plus, Search } from "lucide-react";
import { ResizableHandle, ResizablePanel } from "../ui/resizable";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { UserList } from "./userList";
import { mails } from "@/data/email";
import { Button } from "../ui/button";
import axios from "axios";

export default function Users() {
  const AddUser = async () => {
    try {
      const user = axios
        .post("/chat/users")
        .then((response) => {
          console.log("Response:", response);
          if (response.statusText === "OK") {
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      console.log(user);
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="w-[400px]">
        <Tabs defaultValue="all">
          <div className="flex items-center px-4 py-1">
            <h1 className="text-xl font-bold">Inbox</h1>
            <span className=""></span>

            <TabsList className="ml-auto">
              <Button onClick={AddUser} variant={"link"}>
                <Plus />
              </Button>

              <TabsTrigger
                value="all"
                className="text-zinc-600 dark:text-zinc-200"
              >
                All Message
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className="text-zinc-600 dark:text-zinc-200"
              >
                Unread
              </TabsTrigger>
            </TabsList>
          </div>
          <Separator />
          <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <form>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search" className="pl-8" />
              </div>
            </form>
          </div>
          <TabsContent value="all" className="m-0">
            <UserList items={mails} />
          </TabsContent>
          <TabsContent value="unread" className="m-0">
            <UserList items={mails.filter((item) => !item.read)} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
