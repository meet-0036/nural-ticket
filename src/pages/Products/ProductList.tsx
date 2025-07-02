import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Package, 
  MoreVertical,
  Edit,
  Trash2,
  Users,
  Ticket,
  Clock,
  Calendar,
  Building,
  Settings,
  Activity
} from 'lucide-react';
import { mockProducts, mockOrganizations, mockTickets } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import type { Product } from '../../types';
import { formatDistanceToNow } from 'date-fns';

export const ProductList: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter products based on current user's role
  const getFilteredProducts = () => {
    let products = mockProducts;

    // Role-based filtering
    if (currentUser?.role === 'client_admin' || currentUser?.role === 'product_admin') {
      products = products.filter(p => p.organizationId === currentUser.organizationId);
    }
    if (currentUser?.role === 'product_admin') {
      products = products.filter(p => currentUser.productIds.includes(p.id));
    }

    // Search filtering
    if (searchTerm) {
      products = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filtering
    if (statusFilter !== 'all') {
      products = products.filter(product => 
        statusFilter === 'active' ? product.isActive : !product.isActive
      );
    }

    return products;
  };

  const getOrganizationName = (orgId: string) => {
    return mockOrganizations.find(org => org.id === orgId)?.name || 'Unknown';
  };

  const getProductStats = (productId: string) => {
    const productTickets = mockTickets.filter(ticket => ticket.productId === productId);
    const openTickets = productTickets.filter(ticket => ticket.status === 'open').length;
    const totalTickets = productTickets.length;
    
    return { openTickets, totalTickets };
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-gray-600">Manage products and their configurations</p>
        </div>
        {(currentUser?.role === 'super_admin' || currentUser?.role === 'client_admin') && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-full lg:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="block w-full lg:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const stats = getProductStats(product.id);
          return (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <div className="flex items-center mt-1">
                      {product.isActive ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Activity className="h-3 w-3 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <Ticket className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-600">Open Tickets</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{stats.openTickets}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm text-gray-600">SLA Hours</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{product.slaHours}h</p>
                </div>
              </div>

              {/* Organization */}
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Building className="h-4 w-4 mr-2" />
                <span>{getOrganizationName(product.organizationId)}</span>
              </div>

              {/* Created Date */}
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Created {formatDistanceToNow(new Date(product.createdAt), { addSuffix: true })}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">Total: {stats.totalTickets} tickets</span>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-indigo-600 hover:text-indigo-900 rounded-lg hover:bg-indigo-50">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50">
                    <Settings className="h-4 w-4" />
                  </button>
                  {(currentUser?.role === 'super_admin' || currentUser?.role === 'client_admin') && (
                    <button className="p-2 text-red-600 hover:text-red-900 rounded-lg hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding a new product.'}
          </p>
        </div>
      )}
    </div>
  );
};