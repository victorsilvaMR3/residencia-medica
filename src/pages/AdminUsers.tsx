import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const AdminUsers: React.FC = () => {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  console.log('Componente AdminUsers está sendo renderizado!');
  console.log('User no AdminUsers:', user);
  console.log('Loading no AdminUsers (useAuth):', loading);
  console.log('Fetching no AdminUsers (useState):', fetching);

  useEffect(() => {
    const fetchUsers = async () => {
      setFetching(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        console.log('API URL:', import.meta.env.VITE_API_URL);
        console.log('Token:', token);
        const url = `${import.meta.env.VITE_API_URL}/api/admin/users`;
        console.log('Fetch URL:', url);
        const res = await fetch(url, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Response status:', res.status);
        if (!res.ok) {
          const text = await res.text();
          console.error('Response error text:', text);
          throw new Error(`Erro: ${res.status} - ${text}`);
        }
        const data = await res.json();
        console.log('Dados recebidos:', data);
        setUsers(data.map((u: any) => ({
          ...u,
          createdAt: u.createdAt || u.created_at // compatibilidade
        })));
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar usuários');
        console.error('Erro ao buscar usuários:', err);
      } finally {
        setFetching(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading || fetching) return <div className="p-8 text-center">Carregando...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4 font-semibold">{error}</div>
        <p className="text-gray-600">Não foi possível carregar a lista de usuários. Tente novamente ou contate o suporte.</p>
      </div>
    );
  }

  if (!fetching && users.length === 0) {
    return <div className="p-8 text-center">Nenhum usuário encontrado.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Usuários do Sistema</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-left">Nome</th>
              <th className="px-4 py-2 border-b text-left">Email</th>
              <th className="px-4 py-2 border-b text-left">Permissão</th>
              <th className="px-4 py-2 border-b text-left">Data de Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{u.name}</td>
                <td className="px-4 py-2 border-b">{u.email}</td>
                <td className="px-4 py-2 border-b capitalize">{u.role}</td>
                <td className="px-4 py-2 border-b">{new Date(u.createdAt).toLocaleDateString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers; 