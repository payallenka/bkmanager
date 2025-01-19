'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function UpdateBookmarkPage() {
  const { data: session } = useSession();
  const [bookmark, setBookmark] = useState({ title: '', url: '', category: '' });
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query; 

  useEffect(() => {
    if (session && id) {
      
      fetch(`https://bookmarkmanager-dq8p.onrender.com/api/auth/bookmark/route/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setBookmark(data))
        .catch((err) => setError(err.message));
    }
  }, [session, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://bookmarkmanager-dq8p.onrender.com/api/auth/bookmark/update/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify(bookmark),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update bookmark');
      }

      router.push('/bookmarks');  
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Update Bookmark</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={bookmark.title}
            onChange={(e) => setBookmark({ ...bookmark, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label>URL</label>
          <input
            type="url"
            value={bookmark.url}
            onChange={(e) => setBookmark({ ...bookmark, url: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Category</label>
          <input
            type="text"
            value={bookmark.category}
            onChange={(e) => setBookmark({ ...bookmark, category: e.target.value })}
          />
        </div>
        <button type="submit">Update Bookmark</button>
      </form>
    </div>
  );
}
