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
import { Plus, Edit, Trash2, Upload, Image as ImageIcon } from 'lucide-react';

export const AdminProducts = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Cloud');
  const [earnMoney, setEarnMoney] = useState('500');
  const [prodImage, setProdImage] = useState('');
  const [prodLink, setProdLink] = useState('https://www.asksila.com/solutions/candidate-twin?referral=KhyOL_UQ');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => affiliateApi.getProducts(),
  });

  const createMutation = useMutation({
    mutationFn: affiliateApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      addToast({ title: 'Product Added', message: `${prodName} added to marketplace.`, type: 'success' });
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err) => {
      addToast({ title: 'Creation Failed', message: err.message, type: 'error' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: affiliateApi.updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      addToast({ title: 'Product Updated', message: `${prodName} updated successfully.`, type: 'success' });
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err) => {
      addToast({ title: 'Update Failed', message: err.message, type: 'error' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: affiliateApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      addToast({ title: 'Product Removed', message: 'Product removed from marketplace.', type: 'info' });
    }
  });

  const resetForm = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory('Cloud');
    setEarnMoney('500');
    setProdImage('');
    setProdLink('https://www.asksila.com/solutions/candidate-twin?referral=KhyOL_UQ');
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setProdName(p.name || '');
    setProdCategory(p.category || 'Cloud');
    setEarnMoney(p.commission ? p.commission.replace('₹', '') : String(p.price || 500));
    setProdImage(p.image || '');
    setProdLink(p.product_link || p.productLink || 'https://www.asksila.com/solutions/candidate-twin?referral=KhyOL_UQ');
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const cleanEarn = earnMoney.startsWith('₹') ? earnMoney : `₹${earnMoney}`;
    const numVal = parseFloat(earnMoney.replace(/[^0-9.]/g, '')) || 0;

    const payload = {
      name: prodName,
      category: prodCategory,
      price: numVal,
      commission: cleanEarn,
      commission_type: 'Flat Rate',
      product_link: prodLink,
      image: prodImage || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80',
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product & Service Catalog"
        subtitle="Configure marketplace products, images, and Refer & Earn reward payouts."
        actions={
          <Button variant="primary" size="sm" onClick={handleOpenCreate} icon={Plus}>
            Create New Product
          </Button>
        }
      />

      <Card>
        <Table headers={['Product & Thumbnail', 'Category', 'Refer & Earn Money', 'Conversions', 'Status', 'Actions']}>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    src={p.image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80'}
                    alt={p.name}
                    className="w-10 h-10 object-cover rounded-lg border border-zinc-200 bg-zinc-100"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80';
                    }}
                  />
                  <div>
                    <div className="font-bold text-zinc-950">{p.name}</div>
                    <div className="text-[11px] text-zinc-500 font-mono truncate max-w-[200px]">{p.product_link || p.productLink}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-xs text-zinc-600">{p.category}</TableCell>
              <TableCell className="font-mono text-xs font-bold text-emerald-600">
                {p.commission ? (p.commission.startsWith('₹') ? p.commission : `₹${p.commission}`) : formatCurrency(p.price)}
              </TableCell>
              <TableCell className="font-mono text-xs">{p.conversions || 0}</TableCell>
              <TableCell>
                <Badge variant="success" dot>{p.status || 'Active'}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" icon={Edit} onClick={() => handleOpenEdit(p)}>
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
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingProduct ? "Edit Marketplace Product" : "Add Marketplace Product"}
        subtitle="Register or update product title, thumbnail image, and destination link."
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <Input
            label="Product Title"
            value={prodName}
            onChange={(e) => setProdName(e.target.value)}
            placeholder="e.g. Ask Sila / Candidate Twin"
            required
          />

          {/* Product Image Input */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
              Product Image (URL or Upload Image File)
            </label>
            <div className="space-y-2">
              <Input
                value={prodImage}
                onChange={(e) => setProdImage(e.target.value)}
                placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 rounded-md text-xs font-medium text-zinc-800 transition">
                  <Upload className="w-3.5 h-3.5" />
                  Choose Image File...
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const img = new Image();
                          img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const MAX_SIZE = 600;
                            let width = img.width;
                            let height = img.height;
                            if (width > height) {
                              if (width > MAX_SIZE) {
                                height *= MAX_SIZE / width;
                                width = MAX_SIZE;
                              }
                            } else {
                              if (height > MAX_SIZE) {
                                width *= MAX_SIZE / height;
                                height = MAX_SIZE;
                              }
                            }
                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0, width, height);
                            setProdImage(canvas.toDataURL('image/jpeg', 0.85));
                          };
                          img.src = event.target.result;
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>

                {/* Quick Presets */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-zinc-500 font-medium mr-1">Presets:</span>
                  {[
                    { label: 'Cloud', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80' },
                    { label: 'Fintech', url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&q=80' },
                    { label: 'SaaS', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80' },
                    { label: 'DevTools', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80' },
                  ].map((preset) => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => setProdImage(preset.url)}
                      className="text-[10px] px-2 py-1 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded text-zinc-700 font-medium cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Image Preview */}
            {prodImage && (
              <div className="mt-3 p-2.5 border border-zinc-200 rounded-lg bg-zinc-50 flex items-center gap-3">
                <img
                  src={prodImage}
                  alt="Product Preview"
                  className="w-14 h-14 object-cover rounded-md border border-zinc-300 shadow-xs"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80';
                  }}
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-zinc-900 flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                    Marketplace Thumbnail Preview
                  </p>
                  <p className="text-[11px] text-zinc-500 font-mono truncate max-w-[280px]">
                    {prodImage.startsWith('data:') ? 'Uploaded Image File (Data URL)' : prodImage}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Input
            label="Refer & Earn Money (₹)"
            type="text"
            value={earnMoney}
            onChange={(e) => setEarnMoney(e.target.value)}
            placeholder="e.g. 500 or ₹1000"
            required
          />

          <Input
            label="External Product Target Link (Destination URL)"
            type="url"
            value={prodLink}
            onChange={(e) => setProdLink(e.target.value)}
            placeholder="e.g. https://www.asksila.com/solutions/candidate-twin?referral=KhyOL_UQ"
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

          <Button
            variant="primary"
            type="submit"
            isLoading={createMutation.isPending || updateMutation.isPending}
            className="w-full"
          >
            {editingProduct ? "Update Product Details" : "Save Product to Marketplace"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminProducts;
