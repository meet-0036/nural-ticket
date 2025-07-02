import React from 'react';
import { 
  Ticket, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Package,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { StatsCard } from '../components/UI/StatsCard';
import { TicketTrendChart, StatusDistributionChart, ProductTicketsChart } from '../components/Charts/TicketChart';
import { mockAnalytics, mockTickets } from '../data/mockData';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Transform data for charts
  const statusData = Object.entries(mockAnalytics.ticketsByStatus).map(([name, value]) => ({
    name: name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value,
  }));

  const productData = Object.entries(mockAnalytics.ticketsByProduct).map(([name, value]) => ({
    name,
    value,
  }));

  const getRecentTickets = () => {
    return mockTickets
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">Welcome back, {user?.name}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
            System Status: Active
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard
          title="Total Tickets"
          value={mockAnalytics.totalTickets}
          icon={Ticket}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Open Tickets"
          value={mockAnalytics.openTickets}
          icon={AlertTriangle}
          color="yellow"
          trend={{ value: -5, isPositive: false }}
        />
        <StatsCard
          title="Resolved Tickets"
          value={mockAnalytics.resolvedTickets}
          icon={CheckCircle}
          color="green"
          trend={{ value: 18, isPositive: true }}
        />
        <StatsCard
          title="Avg Resolution"
          value={`${mockAnalytics.avgResolutionTime}h`}
          icon={Clock}
          color="purple"
          trend={{ value: -8, isPositive: true }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TicketTrendChart data={mockAnalytics.dailyTickets} />
        </div>
        <StatusDistributionChart data={statusData} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ProductTicketsChart data={productData} />
        
        {/* Recent Tickets */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Tickets</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {getRecentTickets().map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{ticket.title}</p>
                  <p className="text-xs text-gray-500">{ticket.productName}</p>
                </div>
                <div className="ml-4 flex items-center space-x-2">
                  <span className={`
                    inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                    ${ticket.priority === 'critical' ? 'bg-red-100 text-red-800' :
                      ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'}
                  `}>
                    {ticket.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SLA Compliance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">SLA Performance</h3>
          <TrendingUp className="h-5 w-5 text-emerald-500" />
        </div>
        <div className="flex items-center">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Compliance</span>
              <span className="text-sm font-semibold text-emerald-600">{mockAnalytics.slaCompliance}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${mockAnalytics.slaCompliance}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};