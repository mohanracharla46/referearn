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
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2 } from 'lucide-react';

export const AdminCategories = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: affiliateApi.getCategories,
  });

  const createMutation = useMutation({
    mutationFn: affiliateApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addToast({ title: 'Category Created', message: `${catName} added to taxonomy.`, type: 'success' });
      setIsModalOpen(false);
      setCatName('');
      setCatDesc('');
    },
    onError: (err) => {
      addToast({ title: 'Creation Failed', message: err.message, type: 'error' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: affiliateApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addToast({ title: 'Category Removed', message: 'Category removed.', type: 'info' });
    }
  });

  const handleCreate = (e) => {
    e.preventDefault();
    createMutation.mutate({ name: catName, description: catDesc });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Categories"
        subtitle="Manage product taxonomy and affiliate commission grouping."
        actions={
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} icon={Plus}>
            Add Category
          </Button>
        }
      />

      <Card>
        <Table headers={['Category Name', 'Slug', 'Active Products', 'Status', 'Actions']}>
          {categories.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell className="font-bold text-zinc-950">{cat.name}</TableCell>
              <TableCell className="font-mono text-xs text-zinc-600">{cat.slug}</TableCell>
              <TableCell className="font-mono text-xs font-semibold">{cat.products_count ?? 0} products</TableCell>
              <TableCell>
                <Badge variant="success" dot>{cat.status || 'Active'}</Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-rose-600 hover:text-rose-700"
                  onClick={() => deleteMutation.mutate(cat.id)}
                  icon={Trash2}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Product Category"
        subtitle="Create a new classification category for products in the marketplace."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Category Name"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            placeholder="e.g. AI & Machine Learning"
            required
          />
          <Input
            label="Description"
            value={catDesc}
            onChange={(e) => setCatDesc(e.target.value)}
            placeholder="e.g. Generative AI tools and LLM APIs"
          />
          <Button variant="primary" type="submit" isLoading={createMutation.isPending} className="w-full">
            Save Category
          </Button>
        </form>
      </Modal>
    </div>
  );
};
