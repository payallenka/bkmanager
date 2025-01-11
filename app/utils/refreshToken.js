import Cookies from 'js-cookie';

export const refreshAccessToken = async () => {
  const refreshToken = Cookies.get('refresh_token');

  if (!refreshToken) {
    window.location.href = '/login';
    return;
  }

  try {
    const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      Cookies.set('access_token', data.access, { expires: 1 });
    } else {
      console.error('Failed to refresh token');
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
};
