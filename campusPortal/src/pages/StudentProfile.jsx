import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    enrollmentNumber: '',
    branch: '',
    degree: '',
    cgpa: '',
    passingYear: '',
    resumeUrl: '',
    skills: '',
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Fetch existing profile if any
    axios.get('http://localhost:8080/api/student/profile/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      if(res.data) {
        setProfile(res.data);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/student/profile/create', profile, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      setMessage('Profile saved successfully!');
    }).catch(err => {
      console.error(err);
      setMessage('Failed to save profile.');
    });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <label>
        Enrollment Number:
        <input name="enrollmentNumber" value={profile.enrollmentNumber} onChange={handleChange} />
      </label>

      <label>
        Branch:
        <input name="branch" value={profile.branch} onChange={handleChange} />
      </label>

      <label>
        Degree:
        <input name="degree" value={profile.degree} onChange={handleChange} />
      </label>

      <label>
        CGPA:
        <input type="number" step="0.01" name="cgpa" value={profile.cgpa} onChange={handleChange} />
      </label>

      <label>
        Passing Year:
        <input type="number" name="passingYear" value={profile.passingYear} onChange={handleChange} />
      </label>

      <label>
        Resume URL:
        <input name="resumeUrl" value={profile.resumeUrl} onChange={handleChange} />
      </label>

      <label>
        Skills (comma separated):
        <input name="skills" value={profile.skills} onChange={handleChange} />
      </label>

      <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Save Profile
      </button>

      {message && <p className="mt-2">{message}</p>}
    </form>
  );
};

export default StudentProfile;
