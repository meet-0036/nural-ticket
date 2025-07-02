import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Building, 
  MoreVertical,
  Edit,
  Trash2,
  Users,
  Package,
  Calendar,
  Settings,
  Activity,
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react';
import { mockOrganizations, mockUsers, mockProducts } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import type { Organization } from '../../types';
import { formatDistanceToNow } from 'date-fns';

export const OrganizationList: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Only super admins can access this page
  if (currentUser?.role !== 'super_admin') {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
        <p className="mt-1 text-sm text-gray-500">You don't have permission to view organizations.</p>
      </div>
    );
  }

  const getFilteredOrganizations = () => {
    let organizations = mockOrganizations;

    // Search filtering
    if (searchTerm) {
      organizations = organizations.filter(org => 
        org.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filtering
    if (statusFilter !== 'all') {
      organizations = organizations.filter(org => 
        statusFilter === 'active' ? org.isActive : !org.isActive
      );
    }

    return organizations;
  };

  const getOrganizationStats = (orgId: string) => {
    const users = mockUsers.filter(user => user.organizationId === orgId);
    const products = mockProducts.filter(product => product.organizationId === orgId);
    const activeUsers = users.filter(user => user.isActive && !user.isBlocked).length;
    
    return { 
      totalUsers: users.length, 
      activeUsers, 
      totalProducts: products.length 
    };
  };

  const filteredOrganizations = getFilteredOrganizations();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <p className="mt-1 text-gray-600">Manage organizations and their settings</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Organization
        </button>
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
                placeholder="Search organizations..."
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

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOrganizations.map((organization) => {
          const stats = getOrganizationStats(organization.id);
          return (
            <div
              key={organization.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{organization.name}</h3>
                    <div className="flex items-center mt-1 space-x-2">
                      {organization.isActive ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Activity className="h-3 w-3 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                      {organization.settings.maintenanceMode && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Maintenance
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-600">Users</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{stats.totalUsers}</p>
                  <p className="text-xs text-gray-500">{stats.activeUsers} active</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm text-gray-600">Products</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{stats.totalProducts}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-purple-600 mr-2" />
                    <span className="text-sm text-gray-600">Created</span>
                  </div>
                  <p className="text-xs text-gray-900 mt-1">
                    {formatDistanceToNow(new Date(organization.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>

              {/* Settings Status */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Ticket Submission</span>
                  {organization.settings.allowTicketSubmission ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                {organization.settings.slackWebhook && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Slack Integration</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                )}
                {organization.settings.jiraIntegration?.enabled && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Jira Integration</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">ID: {organization.id}</span>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-indigo-600 hover:text-indigo-900 rounded-lg hover:bg-indigo-50">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50">
                    <Settings className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:text-red-900 rounded-lg hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOrganizations.length === 0 && (
        <div className="text-center py-12">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No organizations found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding a new organization.'}
          </p>
        </div>
      )}
    </div>
  );
};