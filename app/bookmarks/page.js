'use client';

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BookmarksPage() {
  const { data: session } = useSession();
  const [bookmarks, setBookmarks] = useState([]);  // State to store bookmarks
  const [error, setError] = useState(null);  // Error state if fetching fails
  const [editBookmark, setEditBookmark] = useState(null); // State to store the bookmark being edited
  const [title, setTitle] = useState("");  // State for the updated title
  const [url, setUrl] = useState("");  // State for the updated URL
  const [category, setCategory] = useState("");  // State for the updated category

  useEffect(() => {
    // If session doesn't exist, no need to fetch bookmarks
    if (!session) return;

    // Fetch bookmarks for the user
    const fetchBookmarks = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/bookmarks/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session.accessToken}`,  // Include the Bearer token
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch bookmarks');
        }

        const data = await response.json();
        setBookmarks(data);  // Store the fetched bookmarks in the state
      } catch (err) {
        setError(err.message);  // If there's an error, store it in the error state
      }
    };

    fetchBookmarks();
  }, [session]);  // This effect runs every time the session changes

  // If the user is not logged in, show the login prompt
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[var(--background)] text-[var(--foreground)]">
        <h1 className="text-4xl font-bold mb-6">Please sign in to view your bookmarks</h1>
        <Link href="/">
          <button className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition-all">
            Sign In
          </button>
        </Link>
      </div>
    );
  }

  // Function to handle the deletion of a bookmark
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bookmark?')) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/bookmarks/${id}/`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete bookmark');
        }

        // Remove the deleted bookmark from the state
        setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Function to handle updating a bookmark
  const handleEdit = (bookmark) => {
    setEditBookmark(bookmark);  // Set the bookmark to be edited
    setTitle(bookmark.title);    // Pre-fill the form fields with the current data
    setUrl(bookmark.url);
    setCategory(bookmark.category || ""); // Set category if exists
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page

    if (!title || !url) {
      setError("Title and URL are required.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/bookmarks/${editBookmark.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          title,
          url,
          category,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update bookmark');
      }

      // Update the bookmark in the state with the new data
      setBookmarks(bookmarks.map((bookmark) =>
        bookmark.id === editBookmark.id ? { ...bookmark, title, url, category } : bookmark
      ));

      // Clear edit state after update
      setEditBookmark(null);
      setTitle("");
      setUrl("");
      setCategory("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[var(--background)] text-[var(--foreground)] p-4">
      <h1 className="text-3xl font-semibold text-black mb-6">Your Bookmarks</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}  {/* Display any errors */}

      <div className="mb-6">
        <Link href="/create">
          <button className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition-all">
            Add New Bookmark
          </button>
        </Link>
      </div>

      {/* Show existing bookmarks */}
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-4">
        {bookmarks.length === 0 ? (
          <p className="text-center">No bookmarks found.</p>  // Display a message if no bookmarks
        ) : (
          <ul className="space-y-4">
            {bookmarks.map((bookmark) => (
              <li key={bookmark.id} className="border-b pb-4">
                <h3 className="text-xl font-semibold">{bookmark.title}</h3>
                <p className="text-gray-700">{bookmark.url}</p>
                {bookmark.category && <p className="text-gray-500">Category: {bookmark.category}</p>}
                <p className="text-sm text-gray-500">Created at: {new Date(bookmark.created_at).toLocaleString()}</p>

                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() => handleEdit(bookmark)}
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(bookmark.id)}
                    className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit Bookmark Form */}
      {editBookmark && (
        <div className="mt-8 w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Edit Bookmark</h2>
          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">URL:</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">Category:</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition-all"
              >
                Update Bookmark
              </button>
              <button
                type="button"
                onClick={() => setEditBookmark(null)}
                className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
