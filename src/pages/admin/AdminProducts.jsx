import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { affiliateApi } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit, Trash2 } from 'lucide-react';

export const AdminProducts = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Cloud');
  const [prodPrice, setProdPrice] = useState('4999');
  const [commissionRate, setCommissionRate] = useState('20%');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => affiliateApi.getProducts(),
  });

  const createMutation = useMutation({
    mutationFn: affiliateApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      addToast({ title: 'Product Added', message: `${prodName} added to marketplace catalog.`, type: 'success' });
      setIsModalOpen(false);
      setProdName('');
      setProdPrice('4999');
    },
    onError: (err) => {
      addToast({ title: 'Creation Failed', message: err.message, type: 'error' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: affiliateApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      addToast({ title: 'Product Removed', message: 'Product removed from marketplace.', type: 'info' });
    }
  });

  const handleAddProduct = (e) => {
    e.preventDefault();
    createMutation.mutate({
      name: prodName,
      category: prodCategory,
      price: parseFloat(prodPrice),
      commission: commissionRate,
      commission_type: commissionRate.includes('%') ? 'Percentage' : 'Flat Rate',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product & Service Catalog"
        subtitle="Configure affiliate commission percentages, pricing, and campaign promotion rules."
        actions={
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} icon={Plus}>
            Create New Product
          </Button>
        }
      />

      <Card>
        <Table headers={['Product Name', 'Category', 'Price', 'Commission Rate', 'Commission Type', 'Conversions', 'Status', 'Actions']}>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-bold text-zinc-950">{p.name}</TableCell>
              <TableCell className="text-xs text-zinc-600">{p.category}</TableCell>
              <TableCell className="font-mono text-xs font-semibold">{formatCurrency(p.price)}</TableCell>
              <TableCell className="font-mono text-xs font-bold text-zinc-950">{p.commission}</TableCell>
              <TableCell className="text-xs text-zinc-600">{p.commissionType}</TableCell>
              <TableCell className="font-mono text-xs">{p.conversions}</TableCell>
              <TableCell>
                <Badge variant="success" dot>{p.status}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" icon={Edit}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-600 hover:text-rose-700"
                    onClick={() => deleteMutation.mutate(p.id)}
                    icon={Trash2}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Marketplace Product"
        subtitle="Register a new product or subscription tier for affiliate promotion."
      >
        <form onSubmit={handleAddProduct} className="space-y-4">
          <Input
            label="Product Title"
            value={prodName}
            onChange={(e) => setProdName(e.target.value)}
            placeholder="e.g. Cloud Database Pro"
            required
          />
          <Input
            label="Product Base Price (₹)"
            type="number"
            value={prodPrice}
            onChange={(e) => setProdPrice(e.target.value)}
            required
          />
          <Input
            label="Commission Rate (% or Flat ₹)"
            value={commissionRate}
            onChange={(e) => setCommissionRate(e.target.value)}
            placeholder="25% or ₹2000"
            required
          />
          <Select
            label="Product Category"
            value={prodCategory}
            onChange={(e) => setProdCategory(e.target.value)}
            options={[
              { value: 'Cloud', label: 'Cloud Infrastructure' },
              { value: 'Fintech', label: 'Fintech & Payment APIs' },
              { value: 'Software', label: 'SaaS Software' },
              { value: 'Developer Tools', label: 'Developer Tools' },
              { value: 'Marketing', label: 'Marketing & Growth' },
            ]}
          />
          <Button variant="primary" type="submit" isLoading={createMutation.isPending} className="w-full">
            Save Product to Marketplace
          </Button>
        </form>
      </Modal>
    </div>
  );
};
