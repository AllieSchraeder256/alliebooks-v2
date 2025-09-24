export async function apiFetch(input, options = {}) {
  try {
    /*const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const res = await fetch(input, { ...options, headers });

    if (res.status === 401) {
      // Clear token and send user to login, preserving intended destination
      try {
        const current = window.location.pathname + window.location.search;
        localStorage.setItem('postLoginRedirect', current);
      } catch {}
      try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      } catch {}
      if (typeof window !== 'undefined') {
        window.location.assign('/login');
      }
      throw new Error('Unauthorized');
    }*/
    console.log("Calling /api" + input);
    const res = await fetch("/api" + input, { ...options });
    return res;
  } catch (err) {
    throw err;
  }
}

