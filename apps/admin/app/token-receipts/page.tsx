'use client';
import { gql, useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const GET_TOKEN_RECEIPTS = gql`
  query GetTokenReceipts($page: Int, $limit: Int) {
    tokenReceiptsAll(page: $page, limit: $limit) {
      id
      amount
      type
      description
      createdAt
      customer {
        id
        fullName
      }
    }
  }
`;

const GET_RECEIPT_LOGS = gql`
  query GetReceiptLogs($receiptId: ID!) {
    receiptLogs(receiptId: $receiptId) {
      id
      field
      oldValue
      newValue
      action
      createdAt
    }
  }
`;

const DELETE_TOKEN_RECEIPT = gql`
  mutation DeleteTokenReceipt($id: ID!) {
    deleteTokenReceipt(id: $id)
  }
`;

const UPDATE_TOKEN_RECEIPT = gql`
  mutation UpdateTokenReceipt($id: ID!, $input: TokenReceiptInput!) {
    updateTokenReceipt(id: $id, input: $input) {
      id
      amount
      type
      description
    }
  }
`;

const RESTORE_TOKEN_RECEIPT = gql`
  mutation RestoreTokenReceipt($id: ID!, $field: String!, $value: String!) {
    restoreTokenReceipt(id: $id, field: $field, value: $value) {
      id
      amount
      type
      description
    }
  }
`;

export default function TokenReceiptsPage() {
  const { data, loading, error, refetch } = useQuery(GET_TOKEN_RECEIPTS, {
    variables: { page: 1, limit: 10 }
  });
  const [filter, setFilter] = useState('');
  const [selectedReceipts, setSelectedReceipts] = useState<string[]>([]);
  const [editingReceipt, setEditingReceipt] = useState<any>(null);
  const [historyOpen, setHistoryOpen] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [deleteTokenReceipt] = useMutation(DELETE_TOKEN_RECEIPT);
  const [updateTokenReceipt] = useMutation(UPDATE_TOKEN_RECEIPT);
  const [restoreTokenReceipt] = useMutation(RESTORE_TOKEN_RECEIPT);

  const receipts = data?.tokenReceiptsAll || [];

  const filteredReceipts = receipts.filter((receipt: any) => {
    const matchesSearch = receipt.description.toLowerCase().includes(filter.toLowerCase()) ||
                          receipt.type.toLowerCase().includes(filter.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteTokenReceipt({ variables: { id } });
      await refetch();
      setDeleteConfirm(null);
    } catch (err) {
      alert('Failed to delete receipt: ' + err.message);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedReceipts.length === 0) return;
    try {
      for (const id of selectedReceipts) {
        await deleteTokenReceipt({ variables: { id } });
      }
      await refetch();
      setSelectedReceipts([]);
    } catch (err) {
      alert('Bulk delete failed: ' + err.message);
    }
  };

  const handleRestore = async (receipt: any) => {
    try {
      await restoreTokenReceipt({
        variables: {
          id: receipt.id,
          field: receipt.field,
          value: receipt.value
        }
      });
      await refetch();
      setHistoryOpen(null);
    } catch (err) {
      alert('Restore failed: ' + err.message);
    }
  };

  const handleUpdate = async (receipt: any) => {
    try {
      await updateTokenReceipt({
        variables: {
          id: receipt.id,
          input: {
            amount: parseInt(receipt.amount) || undefined,
            type: receipt.type,
            description: receipt.description
          }
        }
      });
      await refetch();
      setEditingReceipt(null);
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedReceipts.includes(id)) {
      setSelectedReceipts(selectedReceipts.filter(r => r !== id));
    } else {
      setSelectedReceipts([...selectedReceipts, id]);
    }
  };

  const exportCSV = () => {
    const rows = filteredReceipts.map((r: any) => [
      r.id.slice(0, 8),
      r.customer?.fullName || 'Unknown',
      r.amount,
      r.type,
      r.description,
      new Date(r.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = ['ID,Customer,Amount,Type,Description,Date', ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `token-receipts-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const receiptLogsData = useQuery(GET_RECEIPT_LOGS, {
    variables: { receiptId: historyOpen },
    skip: !historyOpen
  });

  if (loading) return <p className="p-6">Loading token receipts...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error.message}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Token Receipts</h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search receipts..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-l"
          />
          <button 
            onClick={exportCSV}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-r hover:bg-blue-700">
            Export CSV
          </button>
          <Link href="/admin">
            <a className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm text-gray-700">
              ← Back to Admin
            </a>
          </Link>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mr-2">From Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-2 py-1 border rounded"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mr-2">To Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-2 py-1 border rounded"
          />
        </div>
        {selectedReceipts.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700">
            Delete Selected ({selectedReceipts.length})
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Select</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredReceipts.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                  No receipts found
                </td>
              </tr>
            ) : (
              filteredReceipts.map((receipt: any) => (
                <tr key={receipt.id} className="hover:bg-gray-50">
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedReceipts.includes(receipt.id)}
                      onChange={() => toggleSelect(receipt.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {receipt.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/admin/customers/${receipt.customer?.id}`} className="text-indigo-600 hover:text-indigo-900 underline">
                      {receipt.customer?.fullName || 'Unknown'}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">${receipt.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{receipt.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600 truncate" title={receipt.description}>
                    {receipt.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                    {new Date(receipt.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => setEditingReceipt(receipt)}
                      className="mr-2 text-indigo-600 hover:text-indigo-900">Edit</button>
                    <button 
                      onClick={() => setHistoryOpen(receipt.id)}
                      className="mr-2 text-gray-600 hover:text-gray-900">History</button>
                    <button 
                      onClick={() => setDeleteConfirm(receipt.id)}
                      className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit Receipt</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                value={editingReceipt.amount || ''}
                onChange={(e) => setEditingReceipt({...editingReceipt, amount: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={editingReceipt.type || ''}
                onChange={(e) => setEditingReceipt({...editingReceipt, type: e.target.value})}
                className="w-full px-3 py-2 border rounded">
                <option value="">Select type</option>
                <option value="referral">Referral</option>
                <option value="booking">Booking</option>
                <option value="loyalty">Loyalty</option>
                <option value="promotion">Promotion</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={editingReceipt.description || ''}
                onChange={(e) => setEditingReceipt({...editingReceipt, description: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                rows="3"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setEditingReceipt(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Cancel
              </button>
              <button 
                onClick={() => handleUpdate(editingReceipt)}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this receipt? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {historyOpen && !receiptLogsData.loading && receiptLogsData.data && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Receipt History</h3>
              <button onClick={() => setHistoryOpen(null)} className="text-gray-600 hover:text-gray-900">✕</button>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Field</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Old Value</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">New Value</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {receiptLogsData.data.receiptLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{log.field}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{log.oldValue}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{log.newValue}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                        log.action === 'DELETE' ? 'bg-red-100 text-red-800' :
                        log.action === 'RESTORE' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}