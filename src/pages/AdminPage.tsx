import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, UserCheck, UserX, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminPage: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, loadUsers, user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    isAdmin: false,
    isActive: true,
  });

  useEffect(() => {
    if (user?.isAdmin) loadUsers();
  }, [user]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    await addUser(newUser);
    setNewUser({ username: '', password: '', isAdmin: false, isActive: true });
    setShowAddForm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-teal-600" />
          <h1 className="text-2xl font-bold text-gray-800">Benutzerübersicht</h1>
        </div>
        
        <motion.button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md shadow-sm hover:bg-teal-700 transition-colors w-full sm:w-auto justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          {showAddForm ? 'Abbrechen' : 'Benutzer hinzufügen'}
        </motion.button>
      </div>
      
      {showAddForm && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Benutzer hinzufügen</h2>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Benutzername
              </label>
              <input
                type="text"
                id="username"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Passwort
              </label>
              <input
                type="password"
                id="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
              <div className="flex items-center">
                <input
                  id="isAdmin"
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  checked={newUser.isAdmin}
                  onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.checked })}
                />
                <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-700">
                  Administrator
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="isActive"
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  checked={newUser.isActive}
                  onChange={(e) => setNewUser({ ...newUser, isActive: e.target.checked })}
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Aktiv
                </label>
              </div>
            </div>
            
            <div className="flex justify-end">
              <motion.button
                type="submit"
                className="px-4 py-2 bg-teal-600 text-white rounded-md shadow-sm hover:bg-teal-700 transition-colors w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Benutzer hinzufügen
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Benutzer</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Benutzername
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rolle
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.isAdmin ? 'Administrator' : 'Benutzer'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {user.isActive ? (
                        <button
                          onClick={() => updateUser(user.id, false)}
                          className="text-amber-600 hover:text-amber-900"
                          title="Benutzer deaktivieren"
                        >
                          <UserX className="h-5 w-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => updateUser(user.id, true)}
                          className="text-green-600 hover:text-green-900"
                          title="Benutzer aktivieren"
                        >
                          <UserCheck className="h-5 w-5" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 ml-2"
                        title="Benutzer löschen"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminPage;