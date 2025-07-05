import { useQuery } from '@tanstack/react-query';
import useAuth from '../hooks/useAuth';
import useSecureAxios from './useSecureAxios';

const useUserRole = () => {
  const axiosSecure = useSecureAxios();
  const { user,loading } = useAuth();

  const userEmail = user?.email;

  const { data:role='user', isLoading:roleLoading, refetch} = useQuery({
    queryKey: ['userRole', user?.email],
    enabled:!loading && !!user?.email, // only run if email exists
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${userEmail}/role`);
      return res.data.role;
    },
  });

  return {
    role,
    roleLoading:loading || roleLoading,
    refetch
  };
};

export default useUserRole;
