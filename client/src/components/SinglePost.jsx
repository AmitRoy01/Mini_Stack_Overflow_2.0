import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

const SinglePost = ({ token }) => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [codeContent, setCodeContent] = useState(null); // State for code snippet content
  const [visibleCodeSnippet, setVisibleCodeSnippet] = useState(false); // State to manage code snippet visibility

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

  const handleViewCodeSnippet = async () => {
    if (post && post.codeSnippetUrl) {
      const objectName = post.codeSnippetUrl.split('/').pop();
      try {
        const res = await fetch(`http://localhost:8000/post/code/${objectName}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch the code snippet');
        }

        const code = await res.text();
        setCodeContent(code); // Set the code content state
        setVisibleCodeSnippet(!visibleCodeSnippet); // Toggle visibility state
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!post) {
    return <p>Loading...</p>;
  }

  const formattedDate = new Date(post.createdAt).toLocaleString();

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold">{post.title}</h2>
      <p className="mt-2">{post.content}</p>

      {post.codeSnippetUrl && (
       <button
       onClick={handleViewCodeSnippet}
       className="text-blue-500 bg-transparent hover:bg-blue-200 hover:text-blue-700 transition duration-200 ease-in-out py-1 px-2 rounded shadow hover:shadow-lg" >
       {visibleCodeSnippet ? "Hide Code Snippet" : "View Code Snippet"}
     </button>     
      )}

      {visibleCodeSnippet && codeContent && ( // Render code content if visible
        <pre className="mt-4 p-2 bg-gray-200 border rounded">
          {codeContent}
        </pre>
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
