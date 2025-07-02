import React from 'react';
import { Plus, MessageSquare, Star } from 'lucide-react';
import { mockTickets } from '../../data/mockData';
import { StatusBadge, PriorityBadge } from '../../components/UI/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

export const MyTickets: React.FC = () => {
  const { user } = useAuth();
  
  // Filter tickets for current user
  const userTickets = mockTickets.filter(ticket => ticket.createdBy === user?.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
          <p className="mt-1 text-gray-600">Track your support requests</p>
        </div>
        <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Create New Ticket
        </button>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {userTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                </div>

                <p className="text-gray-600 mb-4">{ticket.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  <div>Product: <span className="font-medium">{ticket.productName}</span></div>
                  <div>Created: {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</div>
                  {ticket.assignedToName && (
                    <div>Assigned to: <span className="font-medium">{ticket.assignedToName}</span></div>
                  )}
                </div>

                {ticket.comments.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Latest Update
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">{ticket.comments[ticket.comments.length - 1].content}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        By {ticket.comments[ticket.comments.length - 1].userName} • 
                        {formatDistanceToNow(new Date(ticket.comments[ticket.comments.length - 1].createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                )}

                {ticket.status === 'resolved' && !ticket.rating && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-blue-900">Rate Your Experience</h4>
                        <p className="text-sm text-blue-700">Help us improve by rating this support interaction</p>
                      </div>
                      <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50">
                        <Star className="h-4 w-4 mr-1" />
                        Rate
                      </button>
                    </div>
                  </div>
                )}

                {ticket.rating && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-green-900">Your Rating:</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= ticket.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      {ticket.feedback && (
                        <span className="text-sm text-green-700 ml-2">"{ticket.feedback}"</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {userTickets.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets yet</h3>
          <p className="mt-1 text-sm text-gray-500">Create your first support ticket to get started.</p>
          <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Ticket
          </button>
        </div>
      )}
    </div>
  );
};