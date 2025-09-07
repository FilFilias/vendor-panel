
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Search, Plus, Trash2 } from "lucide-react";
import { ScrollArea } from "~/components/ui/scroll-area";

type Client = {
  id: string;
  name: string;
  email: string;
};

interface ClientSectionProps {
  selectedClients: Client[];
  setSelectedClients: (clients: Client[]) => void;
  clientSearch?: string;
  setClientSearch?: (search: string) => void;
  mockClients?: Client[];
}

export function ClientSection({
  selectedClients,
  setSelectedClients,
  clientSearch = "",
  setClientSearch = () => {},
  mockClients = [],
}: ClientSectionProps) {
  const filteredClients = mockClients.filter(
    (c) => !selectedClients.find((sc) => sc.id === c.id) &&
    c.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  return (
    <div className="space-y-4 overflow-hidden flex flex-col">
      <h3 className="font-semibold">Clients</h3>
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search clients..."
          value={clientSearch}
          onChange={(e) => setClientSearch(e.target.value)}
          className="text-black"
        />
      </div>

      <ScrollArea className="flex-1 border rounded-md">
        <div className="space-y-2 p-4">
          {selectedClients.map((client) => (
            <div key={client.id} className="flex items-center gap-4 rounded-md border p-2">
              <div className="flex-1">
                <p className="font-medium">{client.name}</p>
                <p className="text-sm text-gray-500">{client.email}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedClients(selectedClients.filter((c) => c.id !== client.id));
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {filteredClients.map((client) => (
            <Button
              key={client.id}
              type="button"
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setSelectedClients([...selectedClients, client])}
            >
              <Plus className="mr-2 h-4 w-4" />
              {client.name}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
