
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AddClientForm from "@/components/AddClientForm";
import ClientSearchModal from "@/components/ClientSearchModal";
import ClientTableHeader from "@/components/client-table/ClientTableHeader";
import ClientRowActions from "@/components/client-table/ClientRowActions";
import EmptyClientTableState from "@/components/client-table/EmptyClientTableState";
import { useClientTableData } from "@/hooks/useClientTableData";
import { useClientModals } from "@/hooks/useClientModals";

interface ClientTableProps {
  clientListId: string;
  onClientUpdate?: (activeClients: any[]) => void;
}

const ClientTable = ({ clientListId, onClientUpdate }: ClientTableProps) => {
  const {
    clients,
    loading,
    fetchClients,
    handleToggleClient,
    handleRemoveClient
  } = useClientTableData(clientListId, onClientUpdate);

  const {
    showAddForm,
    setShowAddForm,
    showSearchModal,
    setShowSearchModal
  } = useClientModals();

  const handleAddClientSuccess = (newClientWithEntry: any) => {
    setShowAddForm(false);
    fetchClients();
  };

  const handleClientAdded = (clientWithEntry: any) => {
    setShowSearchModal(false);
    fetchClients();
  };

  return (
    <div className="space-y-6">
      <ClientTableHeader 
        onShowAddForm={() => setShowAddForm(!showAddForm)}
        onShowSearchModal={() => setShowSearchModal(true)}
      />

      {showAddForm && (
        <div className="bg-card p-6 rounded-lg border shadow-sm mb-6">
          <AddClientForm
            clientListId={clientListId}
            onSuccess={handleAddClientSuccess}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      <ClientSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        clientListId={clientListId}
        onClientAdded={handleClientAdded}
      />

      {loading ? (
        <div className="text-center py-4">Loading clients...</div>
      ) : clients.length === 0 ? (
        <EmptyClientTableState 
          onShowAddForm={() => setShowAddForm(true)}
          onShowSearchModal={() => setShowSearchModal(true)}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="w-[100px] text-center">Include</TableHead>
              <TableHead className="w-[100px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.company_name}</TableCell>
                <ClientRowActions 
                  client={client}
                  onToggleClient={handleToggleClient}
                  onRemoveClient={handleRemoveClient}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ClientTable;
