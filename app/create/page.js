'use client';

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function CreateBookmark() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");  // Ensure category is also part of state
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Ensure that title, URL, and category are provided
    if (!title || !url || !category) {
      setError("Title, URL, and category are required.");
      return;
    }

    // Check if user is logged in before submitting
    if (!session?.accessToken) {
      setError("Please log in first.");
      return;
    }

    try {
      // Make the POST request to create a new bookmark
      const response = await fetch("https://bookmarkmanager-dq8p.onrender.com/api/bookmarks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.accessToken}`,  // Include the token
        },
        body: JSON.stringify({ title, url, category }),  // Send all fields
      });

      if (!response.ok) {
        throw new Error("Failed to create bookmark.");
      }

      // Clear the input fields on success
      setSuccess(true);
      setError(null);
      setTitle("");
      setUrl("");
      setCategory("");  // Reset the category field

    } catch (err) {
      setError(err.message);  // Handle errors
      setSuccess(false);
    }
  };

  // Show login message if the user is not logged in
  if (!session) {
    return <h1>Please sign in to add a bookmark</h1>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-semibold mb-6 text-center text-[var(--foreground)]">Add New Bookmark</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}  {/* Show errors */}
      {success && <p className="text-green-500 mb-4">Bookmark added successfully!</p>}  {/* Show success message */}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}  // Handle title input change
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">URL:</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}  // Handle URL input change
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}  // Handle category input change
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition-all w-full"
        >
          Add Bookmark
        </button>
      </form>
    </div>
  );
}
