import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import "../styles/postlist.css"; // Adjust according to your actual folder structure

function PostList({ token }) {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [codeSnippet, setCodeSnippet] = useState(''); // For pasted code snippets
  const [language, setLanguage] = useState(''); // For selecting code language
  const [showingUserPosts, setShowingUserPosts] = useState(false); // State to toggle view
  const [showCreateForm, setShowCreateForm] = useState(false); // State to toggle post creation form
  const [uploadOption, setUploadOption] = useState(''); // State to determine which input to show
 
  const [codeContent, setCodeContent] = useState(''); // State to hold the fetched code content
  const [error, setError] = useState(''); // State to hold error messages
  const [visibleCodeSnippetId, setVisibleCodeSnippetId] = useState(null); // State to track visible code snippet


  useEffect(() => {
    fetchPosts(); // Initially fetch posts by others
  }, [token]);

  const fetchPosts = async () => {
    const res = await fetch(`http://localhost:8000/post`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPosts(data);
    setShowingUserPosts(false); // Set to false when fetching posts by others
  };

  const fetchUserPosts = async () => {
    const res = await fetch(`http://localhost:8000/mypost`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPosts(data);
    setShowingUserPosts(true); // Set to true when fetching user posts
  };

  // 
  const handleCreatePost = async () => {
    if (!title) {
      alert("Title is required");
      return;
    }
  
    const formData = new FormData();
    formData.append('title', title);
  
    // Optional fields
    if (content) {
      formData.append('content', content);
    }
  
    // Check if a code snippet is pasted or a file is uploaded
    if (uploadOption === 'codeSnippet' && codeSnippet) {
      // Save code snippet with the corresponding file extension
      const extensionMap = {
        javascript: 'js',
        python: 'py',
        java: 'java',
        c: 'c',
        cpp: 'cpp',
        csharp: 'cs',
        ruby: 'rb',
        go: 'go',
        php: 'php',
        html: 'html',
        css: 'css',
        swift: 'swift',
        kotlin: 'kt',
        rust: 'rs',
        typescript: 'ts',
      };
      const fileExtension = extensionMap[language] || 'txt'; // Default to .txt if language not found
      const fileName = `${title}.${fileExtension}`;
      formData.append('codeSnippet', new Blob([codeSnippet], { type: 'text/plain' }), fileName);
      formData.append('language', language); // Include the selected language
    } else if (uploadOption === 'uploadFile' && file) {
      formData.append('codeSnippet', file); // Append the uploaded file if present
    }
  
    const res = await fetch(`http://localhost:8000/post`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  
    if (res.ok) {
      setTitle('');
      setContent('');
      setFile(null);
      setCodeSnippet(''); // Reset code snippet
      setLanguage(''); // Reset language selection
      setUploadOption(''); // Reset upload option
      alert("Post created successfully");
      setShowCreateForm(false); // Hide the form after creating a post
      fetchPosts(); // Refresh posts after creating a new post
    } else {
      alert('Error creating post');
    }
  };
  
  // Sorting posts by 'createdAt' to show recent posts at the top
  const sortedPosts = posts
    .slice() // Create a shallow copy of posts to avoid mutating the original array
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by creation date (most recent first)


    
/// onk kahini ekhane

// Handle view/hide code snippet
const handleToggleCodeSnippet = async (postId, post) => {
  if (visibleCodeSnippetId === postId) {
    // If the code snippet is already visible, hide it
    setVisibleCodeSnippetId(null);
    setCodeContent(''); // Clear the code content
  } else {
    // If the code snippet is not visible, fetch and show it
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
      setError(''); // Clear any previous errors
      setVisibleCodeSnippetId(postId); // Show this post's code snippet
    } catch (err) {
      setError(err.message);
    }
  }
};

  return (
    <div>
      <div className="flex justify-between m-4">
        {/* <h2 className="text-xl font-bold mb-4">
         {showingUserPosts ? "My Posts" : "Posts of Others"}
        </h2> */}
        <div>
       <button
              onClick={fetchUserPosts}
              className="btn"
            >
              View My Posts
            </button>

            <button
              onClick={fetchPosts}
              className="btn"
            >
              View Posts of Others
            </button>     
        </div>
      </div>

        
      {/* "Create Post" Button to Toggle Form */}
      <div className="mb-4">
      <button
          onClick={() => setShowCreateForm(!showCreateForm)} // Toggle the form visibility
          className="bg-green-500 border-2 border-transparent hover:bg-gray-400 hover:border-gray-600 text-white py-2 px-4 rounded transition duration-200"
          >
          {showCreateForm ? "Cancel" : "Create Post"}
        </button>
      </div>

      {/* Show the form only if "Create Post" button is clicked */}
      {showCreateForm && (
        <div>
          <p><b>Title      </b>
              --( Be specific and imagine you’re asking a question to another person ) </p>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Ask your questions (required)"
            className="block w-full p-2 mb-2 border rounded"
          />
          <p><b>Description  </b></p>

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Description about your question ( optional)"
            className="block w-full p-2 mb-2 border rounded"
          />

          {/* Upload Option Selection */}
          <div className="mb-2">
            <button
              onClick={() => {
                setUploadOption('codeSnippet');
                setFile(null); // Reset file if switching to code snippet
              }}
              className={`button mr-2 ${uploadOption === 'codeSnippet' ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              Paste Code Snippet
            </button>
            <button
              onClick={() => {
                setUploadOption('uploadFile');
                setCodeSnippet(''); // Reset code snippet if switching to upload
              }}
              className={`button-upload ${uploadOption === 'uploadFile' ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              Upload File
            </button>


          </div>

          {/* Conditional Inputs Based on Selection */}
          {uploadOption === 'codeSnippet' && (
            <div>
              <textarea
                value={codeSnippet}
                onChange={e => setCodeSnippet(e.target.value)}
                placeholder="Paste your code snippet here"
                className="block w-full p-2 mb-2 border rounded"
              />

              {/* Language Dropdown */}
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="block w-full p-2 mb-2 border rounded"
              >
                <option value="">Select language</option>
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="csharp">C#</option>
                <option value="ruby">Ruby</option>
                <option value="go">Go</option>
                <option value="php">PHP</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="swift">Swift</option>
                <option value="kotlin">Kotlin</option>
                <option value="rust">Rust</option>
                <option value="typescript">TypeScript</option>
              </select>
            </div>
          )}

          {uploadOption === 'uploadFile' && (
            <div>
              <input
                type="file"
                onChange={e => setFile(e.target.files[0])}
                className="block w-full p-2 mb-2"
              />
            </div>
          )}

          <button
            onClick={handleCreatePost}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4"
          >
            Submit Post
          </button>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">{showingUserPosts ? "My Posts" : "Posts by Others"}</h2>
      {sortedPosts.length ? (
        sortedPosts.map(post => {
          const formattedDate = new Date(post.createdAt).toLocaleString(); // Create the formatted date once

          return (
            <div key={post._id} className="post-card"> {/* Use the new class for styling */}
              <h3 className="text-lg font-bold">{post.title}</h3>
              <p>{post.content}</p>

              {/* {post.codeSnippetUrl && (
                <a
                  href={post.codeSnippetUrl}
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Code Snippet
                </a>
              )} */}

          {/* Button to view/hide code snippet */}
          {post.codeSnippetUrl && (
          <button
          onClick={() => handleToggleCodeSnippet(post._id, post)} // Pass post ID and post to the handler
          className="text-blue-500 bg-transparent hover:bg-blue-200 hover:text-blue-700 transition duration-200 ease-in-out py-1 px-2 rounded shadow hover:shadow-lg">
          {visibleCodeSnippetId === post._id ? "Hide Code Snippet" : "View Code Snippet"}
        </button>
          )}

          {/* Display the fetched code content if visible */}
          {visibleCodeSnippetId === post._id && codeContent && (
            <pre className="mt-4 p-2 bg-gray-200 border rounded">
              {codeContent}
            </pre>
          )}

          {/* Display error message if any */}
          {error && (
            <div className="text-red-500 mt-2">
              {error}
            </div>
          )}

              {post.email && (
                <p className="text-green-600">Posted by {post.email || 'Unknown'}</p>
              )}
              <p className="text-gray-600">Posted at {formattedDate}</p>
            </div>
          );
        })
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
}

PostList.propTypes = {
  token: PropTypes.string.isRequired,
};

export default PostList;
