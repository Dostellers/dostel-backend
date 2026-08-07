export async function isValidSession(token: string): Promise<boolean> {
  // Implementation to validate admin session token with backend
  // Example: Call backend's session validation endpoint
  const response = await fetch('http://65.109.113.80:4000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query: '{ user { id email authLevel } }'
    })
  });

  const data = await response.json();
  return !!data?.data?.user; // Returns true if user exists
}