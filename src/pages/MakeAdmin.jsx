import React, { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import useSecureAxios from '../hooks/useSecureAxios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const MySwal = withReactContent(Swal);

const MakeAdmin = () => {
  const axiosSecure = useSecureAxios();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState('');
  const [searchEmail, setSearchEmail] = useState('');

  // Fetch users matching the search term
  const { data: foundUsers = [], isLoading, refetch } = useQuery({
    queryKey: ['usersSearch', searchEmail],
    enabled: !!searchEmail, // run only if we have a search term
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/search?email=${searchEmail}`);
      return res.data;
    }
  });

  const searchUsers = () => {
    if (!email.trim()) {
      Swal.fire('Error', 'Please enter an email to search.', 'error');
      return;
    }
    setSearchEmail(email);
  };

  // Mutation for updating the user's role
  const mutation = useMutation({
    mutationFn: async ({ userId, newRole }) => {
      return axiosSecure.patch(`/users/${userId}/role`, {
        role: newRole,
      });
    },
    onSuccess: () => {
      Swal.fire('Success', 'User role updated.', 'success');
      refetch();
    },
    onError: (error) => {
      console.error(error);
      Swal.fire('Error', 'Could not update user role.', 'error');
    },
  });

  const handleUpdateRole = (userId, newRole) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: `Do you want to change this user role to ${newRole}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update!',
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate({ userId, newRole });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Manage Admins</h2>

      <div className="flex space-x-2 mb-4">
        <input
          type="email"
          placeholder="Enter email to search"
          className="border border-gray-300 px-4 py-2 rounded w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={searchUsers}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {foundUsers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Email</th>
                <th className="py-2 px-4 border-b text-left">Role</th>
                <th className="py-2 px-4 border-b text-left">Applied At</th>
                <th className="py-2 px-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {foundUsers.map((user) => (
                <tr key={user._id}>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b capitalize">{user.role || 'user'}</td>
                  <td className="py-2 px-4 border-b">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleString()
                      : 'N/A'}
                  </td>
                  <td className="py-2 px-4 border-b text-center space-x-2">
                    {user.role !== 'admin' ? (
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        onClick={() => handleUpdateRole(user._id, 'admin')}
                        disabled={mutation.isLoading}
                      >
                        Make Admin
                      </button>
                    ) : (
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleUpdateRole(user._id, 'user')}
                        disabled={mutation.isLoading}
                      >
                        Remove Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {searchEmail && !isLoading && foundUsers.length === 0 && (
        <p className="text-gray-500">No users found for this search.</p>
      )}
    </div>
  );
};

export default MakeAdmin;

