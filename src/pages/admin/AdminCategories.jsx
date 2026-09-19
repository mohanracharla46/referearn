import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Plus } from 'lucide-react';

export const AdminCategories = () => {
  const categories = [
    { id: 'cat-1', name: 'Cloud Infrastructure', slug: 'cloud', count: 14, status: 'Active' },
    { id: 'cat-2', name: 'Fintech & Payment APIs', slug: 'fintech', count: 28, status: 'Active' },
    { id: 'cat-3', name: 'SaaS Software Suites', slug: 'software', count: 42, status: 'Active' },
    { id: 'cat-4', name: 'Developer Tools', slug: 'developer-tools', count: 19, status: 'Active' },
    { id: 'cat-5', name: 'Marketing Automation', slug: 'marketing', count: 22, status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Categories"
        subtitle="Manage product taxonomy and affiliate commission grouping."
        actions={
          <Button variant="primary" size="sm" icon={Plus}>
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
              <TableCell className="font-mono text-xs font-semibold">{cat.count} products</TableCell>
              <TableCell>
                <Badge variant="success" dot>{cat.status}</Badge>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Edit Taxonomy
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
};
