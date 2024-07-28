import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import axios from 'axios';
import { formatDate } from '../utils/helpers';
import './styles.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userName, setUserName] = useState('');
  const [sortOption, setSortOption] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users`);
        setUsers(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    };

    fetchUsers();
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, [API_BASE_URL]);

  const sortedUsers = [...users].sort((a, b) => {
    if (sortOption === 'name-asc') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'name-desc') {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
  };

  const handleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const handleAction = async (action) => {
    if (selectedUsers.length === 0) {
      alert('No users selected');
      return;
    }

    try {
      const selectedUserRecords = users.filter((user) =>
        selectedUsers.includes(user.id)
      );
      const userIds = selectedUserRecords.map((user) => user.id);
      const uids = selectedUserRecords.map((user) => user.uid);

      await axios.post(`${API_BASE_URL}/users/${action}`, {
        userIds,
        uids,
      });

      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(Array.isArray(response.data) ? response.data : []);
      setSelectedUsers([]);
    } catch (error) {
      console.error(`Error performing action (${action}):`, error);
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  const toggleSort = () => {
    setSortOption((prevOption) =>
      prevOption === 'name-asc' ? 'name-desc' : 'name-asc'
    );
  };

  return (
    <div className='container-fluid cartoon-ui'>
      <div className='row justify-content-between align-items-center py-3 mb-4 border-bottom'>
        <div className='col-12 col-md-6'>
          <h2 className='cartoon-ui'
              style={{ fontFamily: 'Gill Sans, sans-serif' }}>User Management</h2>
        </div>
        <div className='col-12 col-md-6 text-md-end'>
          <span className='me-3'>
            <b>Hello</b>, {userName}!
          </span>
          <a href='#' onClick={handleLogout}>
            Logout
          </a>
        </div>
      </div>
      <div className='row mb-3'>
        <div className='col-12'>
          <button
            className='btn btn-danger me-2 mb-2'
            onClick={() => handleAction('block')}
            style={{ background: '#FA5067', color: 'white'}}
          >
            <i className='bi bi-lock' style={{ background: '#FA5067', color: 'white'}}></i> Block
          </button>
          <button
            className='btn btn-secondary me-2 mb-2'
            onClick={() => handleAction('unblock')}
          >
            <i className='bi bi-unlock'></i>
          </button>
          <button
            className='btn btn-danger mb-2'
            onClick={() => handleAction('delete')}
          >
            <i className='bi bi-trash' style={{ color: 'red'}}></i>
          </button>
        </div>
      </div>
      <div className='row'>
        <div className='col-12'>
          <table className='table border table-hover table-responsive border-black border-3'>
            <thead className='table-secondary'>
              <tr className='border border-black'>
                <th scope='col'>
                  <input
                    type='checkbox'
                    onChange={handleSelectAll}
                    checked={selectedUsers.length === users.length}
                    className='checkbox bg-2'
                  />
                </th>
                <th scope='col'>ID</th>
                <th
                  scope='col'
                  onClick={toggleSort}
                  style={{ cursor: 'pointer' }}
                >
                  Name {sortOption === 'name-asc' ? '▲' : '▼'}
                </th>
                <th scope='col'>Email</th>
                <th scope='col'>Last Login</th>
                <th scope='col'>Registration Time</th>
                <th scope='col'>Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <input
                      type='checkbox'
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className='checkbox'
                    />
                  </td>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.last_login ? formatDate(user.last_login) : 'Never'}
                  </td>
                  <td>{formatDate(user.registration_time)}</td>
                  <td>{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
