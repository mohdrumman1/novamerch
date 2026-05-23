"use client";
import React, { useState } from "react";
import { useData } from "@/context/DataProvider";
import { PageHeader } from "@/components/layout/PageHeader";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { FilterBar } from "@/components/ui/FilterBar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { formatAUD } from "@/lib/format";
import { lineItemsTotal, orderExpectedProfit } from "@/lib/calc";
import type { Customer, Order } from "@/lib/types";
import { CustomerDetailModal } from "@/components/modals/CustomerDetailModal";
import { PlusIcon, EditIcon, TrashIcon } from "@/components/icons";

function emptyCustomer(): Omit<Customer, "id"> {
  return {
    name: "",
    company: "",
    email: "",
    phone: "",
    abn: "",
    billingAddress: "",
    shippingAddress: "",
    createdAt: new Date().toISOString(),
    notes: "",
  };
}

export default function CustomersPage() {
  const { customers, orders, addCustomer, updateCustomer, deleteCustomer } = useData();
  const [search, setSearch] = useState("");
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Customer, "id">>(emptyCustomer());

  const filtered = customers.filter((c) => {
    return (
      !search ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  function getCustomerOrders(customerId: string): Order[] {
    return orders.filter((o) => o.customerId === customerId);
  }

  function getCustomerRevenue(customerId: string): number {
    return getCustomerOrders(customerId).reduce((sum, o) => sum + lineItemsTotal(o.lineItems), 0);
  }

  function getCustomerProfit(customerId: string): number {
    return getCustomerOrders(customerId).reduce((sum, o) => sum + orderExpectedProfit(o), 0);
  }

  function openCreate() {
    setForm(emptyCustomer());
    setEditingCustomer(null);
    setCreating(true);
  }

  function openEdit(customer: Customer) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, ...rest } = customer;
    setForm(rest);
    setEditingCustomer(customer);
    setCreating(false);
  }

  function handleSubmit() {
    if (!form.company) return alert("Company name is required");
    if (editingCustomer) {
      updateCustomer({ ...form, id: editingCustomer.id });
    } else {
      addCustomer({ ...form, id: crypto.randomUUID() });
    }
    setCreating(false);
    setEditingCustomer(null);
  }

  const columns = [
    { key: "company", header: "Company", sortable: true },
    { key: "name", header: "Contact", sortable: true },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    {
      key: "orderCount",
      header: "Orders",
      align: "center" as const,
      render: (row: Customer) => (
        <span className="text-sm font-medium text-[var(--text)]">
          {getCustomerOrders(row.id).length}
        </span>
      ),
    },
    {
      key: "revenue",
      header: "Total Revenue",
      align: "right" as const,
      render: (row: Customer) => (
        <span style={{ fontFamily: "var(--font-dm-mono, monospace)" }}>
          {formatAUD(getCustomerRevenue(row.id))}
        </span>
      ),
    },
    {
      key: "profit",
      header: "Total Profit",
      align: "right" as const,
      render: (row: Customer) => {
        const profit = getCustomerProfit(row.id);
        return (
          <span
            style={{
              fontFamily: "var(--font-dm-mono, monospace)",
              color: profit >= 0 ? "var(--green)" : "var(--red)",
            }}
          >
            {formatAUD(profit)}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "",
      align: "right" as const,
      render: (row: Customer) => (
        <div className="flex items-center gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
          <Button variant="subtle" size="compact" onClick={() => openEdit(row)}>
            <EditIcon size={13} /> Edit
          </Button>
          <Button variant="danger" size="compact" onClick={() => setDeletingId(row.id)}>
            <TrashIcon size={13} />
          </Button>
        </div>
      ),
    },
  ];

  const isFormOpen = creating || editingCustomer !== null;

  return (
    <div>
      <PageHeader
        title="Customers"
        actions={
          <Button variant="primary" onClick={openCreate}>
            <PlusIcon size={16} /> New Customer
          </Button>
        }
      />

      <div className="bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--border)] p-5">
        <FilterBar
          search={{ value: search, onChange: setSearch, placeholder: "Search customers..." }}
        />
        <Table
          columns={columns}
          rows={filtered}
          onRowClick={(row) => setViewingCustomer(row)}
          emptyTitle="No customers found"
          emptyDescription="Add your first customer to get started."
        />
      </div>

      {/* View / Detail modal */}
      <CustomerDetailModal
        open={viewingCustomer !== null}
        onClose={() => setViewingCustomer(null)}
        customer={viewingCustomer}
      />

      {/* Create / Edit form modal */}
      <Modal
        open={isFormOpen}
        onClose={() => { setCreating(false); setEditingCustomer(null); }}
        title={editingCustomer ? `Edit ${editingCustomer.company}` : "New Customer"}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setCreating(false); setEditingCustomer(null); }}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingCustomer ? "Save Changes" : "Create Customer"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Company Name"
              name="company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
            <Input
              label="Contact Name"
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <Input
            label="ABN"
            name="abn"
            value={form.abn ?? ""}
            onChange={(e) => setForm({ ...form, abn: e.target.value })}
          />
          <Textarea
            label="Billing Address"
            name="billingAddress"
            value={form.billingAddress}
            onChange={(e) => setForm({ ...form, billingAddress: e.target.value })}
            rows={2}
          />
          <Textarea
            label="Shipping Address"
            name="shippingAddress"
            value={form.shippingAddress ?? ""}
            onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
            rows={2}
          />
          <Textarea
            label="Notes"
            name="notes"
            value={form.notes ?? ""}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={2}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => { if (deletingId) { deleteCustomer(deletingId); setDeletingId(null); } }}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This will not delete their orders."
      />
    </div>
  );
}
