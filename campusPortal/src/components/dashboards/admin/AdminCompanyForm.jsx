import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi';

const companyTypes = [
  'PRODUCT',
  'SERVICE',
  'STARTUP',
  'MNC',
  'CONSULTANCY',
  'PRIVATE_COMPANY',
  'GOVERNMENT',
  'PUBLIC'
];

const AdminCompanyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    name: '',
    industry: '',
    location: '',
    contactInfo: '',
    companyType: '',
    hrName: '',
    description: '',
    logoUrl: '',
    websiteUrl: '',
    companyHRIds: []
  });

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hrOptions, setHrOptions] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);

  // Load all HR users and companies
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all companies first
        const companiesResponse = await api.get('/company', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllCompanies(companiesResponse.data);

        // Then fetch all HR users
        const usersResponse = await api.get('/auth/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const hrUsers = usersResponse.data.filter(user => {
          return user.roles && user.roles.includes('COMPANY_HR');
        });

        // Create HR options with company assignment info
        const options = hrUsers.map(hr => {
          // Find which company this HR is assigned to (if any)
          const assignedCompany = companiesResponse.data.find(company => 
            company.companyHRIds?.includes(hr.id)
          );

          return {
            id: hr.id,
            name: hr.name || hr.email.split('@')[0],
            email: hr.email,
            assignedTo: assignedCompany ? assignedCompany.name : null,
            assignedToId: assignedCompany ? assignedCompany.id : null
          };
        });

        setHrOptions(options);

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load HR options');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Load company details if edit mode
  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get(`/company/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          const companyData = res.data;
          setForm({
            name: companyData.name || '',
            industry: companyData.industry || '',
            location: companyData.location || '',
            contactInfo: companyData.contactInfo || '',
            companyType: companyData.companyType || '',
            hrName: companyData.hrName || '',
            description: companyData.description || '',
            logoUrl: companyData.logoUrl || '',
            websiteUrl: companyData.websiteUrl || '',
            companyHRIds: companyData.companyHRIds || []
          });
        })
        .catch((error) => {
          toast.error('Failed to load company details');
          console.error('Error loading company:', error);
          navigate('/admin/companies');
        })
        .finally(() => setLoading(false));
    }
  }, [id, token, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleHrSelection = (e) => {
    const options = e.target.options;
    const selectedIds = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedIds.push(parseInt(options[i].value));
      }
    }
    setForm(prev => ({
      ...prev,
      companyHRIds: selectedIds
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error('Company name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        ...form
      };

      if (id) {
        await api.put(`/company/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Company updated successfully');
      } else {
        await api.post('/company', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Company created successfully');
      }
      navigate('/admin/companies');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to save company';
      toast.error(errorMessage);
      console.error('Error saving company:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCompanyType = (type) => {
    if (!type) return 'Select company type';
    return type.toLowerCase().replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get currently assigned HRs for this company
  const assignedHRs = hrOptions.filter(hr => 
    form.companyHRIds.includes(hr.id)
  );

  // Get available HRs (not assigned or assigned to this company)
  const availableHRs = hrOptions.filter(hr => 
    !hr.assignedTo || (id && hr.assignedToId === parseInt(id))
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Form Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/admin/companies')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <FiArrowLeft />
              Back to Companies
            </button>
            <h2 className="text-xl font-bold text-gray-800">
              {id ? 'Edit Company' : 'Create New Company'}
            </h2>
            <div className="w-6"></div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information Column */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="industry">
                  Industry
                </label>
                <input
                  id="industry"
                  name="industry"
                  type="text"
                  value={form.industry}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location">
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="companyType">
                  Company Type
                </label>
                <select
                  id="companyType"
                  name="companyType"
                  value={form.companyType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select company type</option>
                  {companyTypes.map(type => (
                    <option key={type} value={type}>
                      {formatCompanyType(type)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Additional Information Column */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Additional Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="hrName">
                  HR Contact Name
                </label>
                <input
                  id="hrName"
                  name="hrName"
                  type="text"
                  value={form.hrName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contactInfo">
                  Contact Information
                </label>
                <input
                  id="contactInfo"
                  name="contactInfo"
                  type="text"
                  value={form.contactInfo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="websiteUrl">
                  Website URL
                </label>
                <input
                  id="websiteUrl"
                  name="websiteUrl"
                  type="url"
                  value={form.websiteUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="logoUrl">
                  Logo URL
                </label>
                <input
                  id="logoUrl"
                  name="logoUrl"
                  type="url"
                  value={form.logoUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  HR Assignment
                </label>
                
                {assignedHRs.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Currently Assigned HRs:</h4>
                    <ul className="bg-gray-50 p-2 rounded-md">
                      {assignedHRs.map(hr => (
                        <li key={hr.id} className="py-1 px-2 text-sm">
                          {hr.name} ({hr.email})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {availableHRs.length > 0 ? (
                  <div>
                    <select
                      multiple
                      id="companyHRIds"
                      name="companyHRIds"
                      value={form.companyHRIds}
                      onChange={handleHrSelection}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-auto"
                      size={Math.min(5, availableHRs.length + 1)}
                    >
                      {availableHRs.map(hr => (
                        <option 
                          key={hr.id} 
                          value={hr.id}
                          className={hr.assignedTo ? 'bg-blue-50' : ''}
                        >
                          {hr.name} ({hr.email})
                          {hr.assignedTo && ` [Currently assigned to ${hr.assignedTo}]`}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      HRs already assigned to other companies are not shown. 
                      {id && " You can only assign HRs that are unassigned or already assigned to this company."}
                    </p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                    {hrOptions.length === 0 
                      ? 'No HR users available. Please create some HR users first.'
                      : 'No available HR users to assign.'}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-8">
            <button
              type="button"
              onClick={() => navigate('/admin/companies')}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiX className="inline mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiSave className="inline mr-2" />
              {isSubmitting ? 'Saving...' : id ? 'Update Company' : 'Create Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCompanyForm;