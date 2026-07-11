import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MessageSquare,
  Clock,
  User,
  Mail,
  RefreshCw,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
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
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "../AdminAuthContext";
import { MessageItem } from "../types";
import { ExpandableText } from "../shared/ExpandableText";

export default function MessagesSection() {
  const { token, fetchWithAuth } = useAdminAuth();
  const [messageFilter, setMessageFilter] = useState<
    "All" | "Unread" | "Important"
  >("All");
  const queryClient = useQueryClient();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch messages query
  const messagesQuery = useQuery<MessageItem[]>({
    queryKey: ["messages", token],
    queryFn: async () => {
      const res = await fetchWithAuth(`${apiUrl}/api/contact`);
      if (!res.ok) throw new Error("Failed to load messages.");
      return res.json();
    },
    enabled: !!token,
  });

  // Message status mutation
  const messageStatusMutation = useMutation({
    mutationFn: async ({
      id,
      newStatus,
    }: {
      id: string;
      newStatus: string;
    }) => {
      const res = await fetchWithAuth(`${apiUrl}/api/contact/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update message status.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetchWithAuth(`${apiUrl}/api/contact/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete message.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  const getStatusBadge = (status: MessageItem["status"]) => {
    switch (status) {
      case "Unread":
        return (
          <Badge
            variant="outline"
            className="border-blue-500/30 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 text-[10px]"
          >
            Unread
          </Badge>
        );
      case "Read":
        return (
          <Badge
            variant="secondary"
            className="bg-muted text-muted-foreground hover:bg-muted/80 text-[10px]"
          >
            Read
          </Badge>
        );
      case "Important":
        return (
          <Badge
            variant="outline"
            className="border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-[10px]"
          >
            Important
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const { data: messages = [], isLoading } = messagesQuery;

  const filteredMessages = messages.filter((m) =>
    messageFilter === "All" ? true : m.status === messageFilter,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5 gap-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-soft shrink-0">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Messages Box</h2>
            <p className="text-sm text-muted-foreground">
              Review and manage client contact form inquiries
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Tabs
            value={messageFilter}
            onValueChange={(val) =>
              setMessageFilter(val as "All" | "Unread" | "Important")
            }
            className="w-auto"
          >
            <TabsList className="grid grid-cols-3 w-[260px] h-9">
              <TabsTrigger value="All" className="cursor-pointer text-xs">
                All
              </TabsTrigger>
              <TabsTrigger value="Unread" className="cursor-pointer text-xs">
                Unread
              </TabsTrigger>
              <TabsTrigger value="Important" className="cursor-pointer text-xs">
                Important
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card/20">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredMessages.length === 0 ? (
        <Card className="flex flex-col items-center justify-center text-center p-12 border-muted bg-card/40 backdrop-blur-md shadow-soft rounded-2xl">
          <div className="h-12 w-12 rounded-full bg-muted grid place-items-center mb-4 text-muted-foreground">
            <MessageSquare className="h-6 w-6" />
          </div>
          <CardTitle className="text-lg font-bold">No messages found</CardTitle>
          <CardDescription className="max-w-xs mt-1">
            There are no contact form messages matching your current filter
            selection.
          </CardDescription>
        </Card>
      ) : (
        <Card className="border-border bg-card/40 backdrop-blur-lg shadow-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-[180px]">Received Date</TableHead>
                  <TableHead className="w-[200px]">Sender Details</TableHead>
                  <TableHead>Message Content</TableHead>
                  <TableHead className="w-[150px]">Status Tag</TableHead>
                  <TableHead className="w-[100px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.map((msg) => (
                  <TableRow
                    key={msg._id}
                    className="border-border/60 hover:bg-muted/10 transition-colors group"
                  >
                    <TableCell className="align-top py-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        <span>{formatDate(msg.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="align-top py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          {msg.name}
                        </span>
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-xs text-primary hover:underline flex items-center gap-1.5 mt-1.5"
                        >
                          <Mail className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                          {msg.email}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell className="align-top py-4 max-w-sm">
                      <div className="text-sm text-foreground break-words whitespace-pre-wrap leading-relaxed">
                        <ExpandableText text={msg.message} />
                      </div>
                    </TableCell>
                    <TableCell className="align-top py-4">
                      <div className="flex flex-col gap-2">
                        <div>{getStatusBadge(msg.status)}</div>
                        <Select
                          value={msg.status}
                          onValueChange={(newStatus) =>
                            messageStatusMutation.mutate({
                              id: msg._id,
                              newStatus,
                            })
                          }
                        >
                          <SelectTrigger className="w-[125px] h-8 cursor-pointer text-xs rounded-lg border-border hover:bg-muted/40 transition-colors">
                            <SelectValue placeholder="Update Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Unread">Unread</SelectItem>
                            <SelectItem value="Read">Read</SelectItem>
                            <SelectItem value="Important">Important</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell className="align-middle text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete message?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this message from{" "}
                              {msg.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                deleteMessageMutation.mutate(msg._id)
                              }
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
