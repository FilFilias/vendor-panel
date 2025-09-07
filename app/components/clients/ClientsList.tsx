import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Search, LayoutGrid, LayoutList, UserPlus, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext
} from "~/components/ui/pagination";
import { Button } from "~/components/ui/button";
import { InviteCustomerDialog } from "./InviteCustomerDialog";

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  orders: any[];
};

type ClientsListProps = {
  clients: Client[];
  total: number;
  page: number;
  pageCount: number;
  search: string;
  onSearch: (s: string) => void;
  onPageChange: (p: number) => void;
  onSelectClient: (c: Client) => void;
  viewMode: "grid" | "list";
  setViewMode: (v: "grid" | "list") => void;
};

export function ClientsList({
  clients,
  total,
  page,
  pageCount,
  search,
  onSearch,
  onPageChange,
  onSelectClient,
  viewMode,
  setViewMode
}: ClientsListProps) {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleCreateClient = () => {
    navigate("/clients/create");
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">View and manage your customers</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
          <div className="flex gap-1">
            <Button
              size="icon"
              variant={viewMode === "grid" ? "default" : "ghost"}
              className={viewMode === "grid" ? "bg-primary text-white" : ""}
              aria-label="Grid View"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant={viewMode === "list" ? "default" : "ghost"}
              className={viewMode === "list" ? "bg-primary text-white" : ""}
              aria-label="List View"
              onClick={() => setViewMode("list")}
            >
              <LayoutList className="w-5 h-5" />
            </Button>
          </div>
          <Button
            variant="secondary"
            onClick={() => setInviteDialogOpen(true)}
            className="flex items-center gap-1"
          >
            <Mail className="h-4 w-4" />
            <span>Invite Customer</span>
          </Button>
          <Button 
            onClick={handleCreateClient}
            className="flex items-center gap-1"
          >
            <UserPlus className="h-4 w-4" />
            <span>Create New Client</span>
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clients..."
            className="w-full pl-10"
            value={search}
            onChange={e => onSearch(e.target.value)}
          />
        </div>
      </div>
      {/* Render grid or list mode */}
      {clients.length === 0 ? (
        <div className="col-span-full text-muted-foreground text-center py-16">
          No clients found
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {clients.map((client) => (
            <Card
              key={client.id}
              className="hover:shadow cursor-pointer transition border"
              onClick={() => onSelectClient(client)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{client.name}</CardTitle>
                <CardDescription>{client.company}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-2">{client.email}</div>
                <div className="flex items-center gap-1 text-xs">
                  <span>{client.phone}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {clients.map((client) => (
            <Card
              key={client.id}
              className="flex flex-row flex-wrap items-center gap-6 px-4 py-3 hover:shadow cursor-pointer transition border"
              onClick={() => onSelectClient(client)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex justify-between flex-wrap">
                  <span className="font-semibold text-base truncate">{client.name}</span>
                </div>
                <span className="text-xs rounded-full bg-muted px-2 py-0.5 text-muted-foreground ml-2">{client.company}</span>
                <div className="text-sm text-muted-foreground truncate">{client.email}</div>
                <div className="text-xs">{client.phone}</div>
              </div>
              <div className="flex flex-col items-end self-stretch justify-center ml-4 pr-2">
                <span className="font-semibold text-primary">{client.orders.length}</span>
                <span className="text-xs text-muted-foreground">orders</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={e => {
                  e.preventDefault();
                  onPageChange(Math.max(1, page - 1));
                }}
                aria-disabled={page === 1}
              />
            </PaginationItem>
            {Array.from({ length: pageCount }).map((_, idx) => (
              <PaginationItem key={idx}>
                <PaginationLink
                  href="#"
                  isActive={page === idx + 1}
                  onClick={e => {
                    e.preventDefault();
                    onPageChange(idx + 1);
                  }}
                >
                  {idx + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={e => {
                  e.preventDefault();
                  onPageChange(Math.min(pageCount, page + 1));
                }}
                aria-disabled={page === pageCount}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      
      <InviteCustomerDialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen} />
    </>
  );
}
