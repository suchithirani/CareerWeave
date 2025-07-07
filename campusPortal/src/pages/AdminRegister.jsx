// import React, { useState } from 'react';
// import api from '../../services/api';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useNavigate } from 'react-router-dom';

// const AdminRegister = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     role: '', // HR or OFFICER
//   });

//   const availableRoles = [
//     { label: 'HR', value: 'COMPANY_HR' },
//     { label: 'Placement Officer', value: 'PLACEMENT_OFFICER' },
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (form.password !== form.confirmPassword) {
//       toast.error('Passwords do not match');
//       return;
//     }

//     if (!form.role) {
//       toast.error('Please select a role');
//       return;
//     }

//     const payload = {
//       name: form.name,
//       email: form.email,
//       password: form.password,
//       roles: [form.role],
//     };

//     const token = localStorage.getItem('token');

//     try {
//       const res = await api.post('/auth/admin-register', payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success(res.data);
//       navigate('/admin/dashboard');
//     } catch (err) {
//       toast.error(err.response?.data || 'Registration failed');
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-8">
//       <h2 className="text-xl font-semibold mb-4">Register HR / Officer</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {['name', 'email', 'password', 'confirmPassword'].map((field, idx) => (
//           <div key={idx}>
//             <label className="block text-gray-700 capitalize">{field}</label>
//             <input
//               type={field.includes('password') ? 'password' : 'text'}
//               name={field}
//               value={form[field]}
//               onChange={handleChange}
//               required
//               className="w-full mt-1 px-3 py-2 border rounded"
//             />
//           </div>
//         ))}

//         <div>
//           <label className="block text-gray-700">Role</label>
//           <select
//             name="role"
//             value={form.role}
//             onChange={handleChange}
//             className="w-full mt-1 px-3 py-2 border rounded"
//             required
//           >
//             <option value="">Select Role</option>
//             {availableRoles.map((r, idx) => (
//               <option key={idx} value={r.value}>{r.label}</option>
//             ))}
//           </select>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//         >
//           Register
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AdminRegister;
