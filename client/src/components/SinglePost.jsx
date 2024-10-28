import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

const SinglePost = ({ token }) => {
  const { postId } = useParams(); // Get postId from the URL
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null); // New state to handle potential fetch errors

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`http://localhost:8000/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch the post');
      }

      const data = await res.json();
      setPost(data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <p className="text-red-500">Error: {error}</p>; // Display error message
  }

  if (!post) {
    return <p>Loading...</p>; // Loading state
  }

  const formattedDate = new Date(post.createdAt).toLocaleString(); // Format post creation date

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold">{post.title}</h2>
      <p className="mt-2">{post.content}</p>

      {post.codeSnippetUrl && (
        <a
          href={post.codeSnippetUrl}
          className="text-blue-500"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Code Snippet
        </a>
      )}

      {post.email && (
        <p className="text-green-600 mt-2">Posted by: {post.email}</p>
      )}

      <p className="text-gray-600 mt-2">Posted at: {formattedDate}</p>
    </div>
  );
};

SinglePost.propTypes = {
  token: PropTypes.string.isRequired,
};

export default SinglePost;
