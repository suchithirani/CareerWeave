export function getUserRole() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);

    // Check for single role string
    if (decoded.role) return decoded.role;

    // Check for roles array and return first role
    if (decoded.roles && Array.isArray(decoded.roles)) return decoded.roles[0];

    return null;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}
