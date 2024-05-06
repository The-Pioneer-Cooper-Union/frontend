import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { API_URL } from '../util/URL.js';
import { useNavigate } from 'react-router-dom';
import './Submissions.css'
import Header from "../components/Header";
import ReactMarkdown from 'react-markdown';

function ArticleSubmission() {
  const [article, setArticle] = useState({
    title: '',
    content: '',
    category: ''
  });
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleInputChange = (e) => {
    setArticle({ ...article, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('No authenticated user found!');
      return;
    }
    const articleData = {
      ...article,
      email: currentUser.email,
      submissionDate: new Date().toISOString(),
      articleStatus: 'PENDING',
      issue: 1,
      volume: 1,
    };

    try {
      await axios.post(`${API_URL}/article/create-article`, articleData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      alert('Article created successfully!');
      navigate('/home');
    } catch (error) {
      console.error('Error creating article:', error);
      alert('Error creating article: ' + (error.response?.data || error.message));
    }
  };

  return (
    <div>
      <Header />
      <div className="submissions-page">

        <div className="submissions-right-side">
          <h1>Create Article</h1>
          <form onSubmit={handleSubmit} className="submissions-form">
            <input
                type="text"
                name="title"
                value={article.title}
                onChange={handleInputChange}
                placeholder="Article Title"
            />
            <textarea
                name="content"
                value={article.content}
                onChange={handleInputChange}
                placeholder="Content (Markdown supported)"
            />
            <div className="markdown-preview">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>
            <select
                name="category"
                value={article.category}
                onChange={handleInputChange}
            >
              <option value="">Select Category</option>
              <option value="Technology">Technology</option>
              <option value="Science">Science</option>
              <option value="Politics">Politics</option>
              <option value="Creative Writing">Creative Writing</option>
              <option value="News">News</option>
              <option value="Op-Ed">Op-Ed</option>


            </select>
            <button type="submit">Submit Article</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ArticleSubmission;
