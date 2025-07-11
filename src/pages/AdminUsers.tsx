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
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
  const [creating, setCreating] = useState(false);

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

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (!res.ok) throw new Error('Erro ao atualizar permissão');
      // Atualize a lista localmente ou refaça o fetch dos usuários
      setUsers(users => users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err: any) {
      alert('Erro ao atualizar permissão: ' + err.message);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao criar usuário');
      }
      setNewUser({ name: '', email: '', password: '', role: 'user' });
      window.location.reload();
    } catch (err: any) {
      alert('Erro ao criar usuário: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Erro ao excluir usuário');
      setUsers(users => users.filter(u => u.id !== userId));
    } catch (err: any) {
      alert('Erro ao excluir usuário: ' + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Usuários do Sistema</h1>
      {/* Formulário de criação de usuário */}
      <form onSubmit={handleCreateUser} className="mb-6 flex gap-2 items-end flex-wrap">
        <input
          type="text"
          placeholder="Nome"
          value={newUser.name}
          onChange={e => setNewUser({ ...newUser, name: e.target.value })}
          required
          className="border rounded px-2 py-1"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={e => setNewUser({ ...newUser, email: e.target.value })}
          required
          className="border rounded px-2 py-1"
        />
        <input
          type="password"
          placeholder="Senha"
          value={newUser.password}
          onChange={e => setNewUser({ ...newUser, password: e.target.value })}
          required
          className="border rounded px-2 py-1"
        />
        <select
          value={newUser.role}
          onChange={e => setNewUser({ ...newUser, role: e.target.value })}
          className="border rounded px-2 py-1"
        >
          <option value="user">user</option>
          <option value="admin">admin</option>
          <option value="moderator">moderator</option>
        </select>
        <button
          type="submit"
          className="bg-success-600 text-white px-4 py-1 rounded"
          disabled={creating}
        >
          {creating ? 'Criando...' : 'Criar Usuário'}
        </button>
      </form>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-left">Nome</th>
              <th className="px-4 py-2 border-b text-left">Email</th>
              <th className="px-4 py-2 border-b text-left">Permissão</th>
              <th className="px-4 py-2 border-b text-left">Data de Cadastro</th>
              <th className="px-4 py-2 border-b text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{u.name}</td>
                <td className="px-4 py-2 border-b">{u.email}</td>
                <td className="px-4 py-2 border-b capitalize">
                  <select
                    value={u.role}
                    onChange={e => handleChangeRole(u.id, e.target.value)}
                    className="border rounded px-2 py-1"
                    disabled={u.id === user?.id} // não permitir alterar a si mesmo
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                    <option value="moderator">moderator</option>
                  </select>
                </td>
                <td className="px-4 py-2 border-b">{new Date(u.createdAt).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    disabled={u.id === user?.id}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers; 