import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from "../util/URL";
import './ArticleCard.css'
import ReactMarkdown from 'react-markdown';

const ArticleCard = ({ article, fetchArticles }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedArticle, setEditedArticle] = useState({ ...article, email: article.user.email });

    const handleInputChange = (e) => {
        setEditedArticle({ ...editedArticle, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`${API_URL}/article/update-article/${article.articleId}`, editedArticle);
            setEditMode(false);
            fetchArticles();
        } catch (error) {
            console.error('Error updating article:', error);
        }
    };

    // Disable edit mode if article status is 'PUBLISHED'
    const toggleEditMode = () => {
        if (article.articleStatus !== 'PUBLISHED') {
            setEditMode(!editMode);
        } else {
            alert("Published articles cannot be edited."); // Optionally show a message
        }
    };

    return (
        <div className="article-card">
            {editMode ? (
                <form className="submissions-form">
                    <input type="text" value={editedArticle.title} name="title" onChange={handleInputChange} />
                    <textarea name="content" value={editedArticle.content} onChange={handleInputChange} />
                    <div className="markdown-preview">
                        <ReactMarkdown>{editedArticle.content}</ReactMarkdown>
                    </div>
                </form>
            ) : (
                <>
                    <h2>{article.title}</h2>
                    <ReactMarkdown>{article.content}</ReactMarkdown>
                </>
            )}
            <p>Status: {article.articleStatus}</p>

            {editMode ? (
                <>
                    <button onClick={handleUpdate}>Update</button>
                    <button onClick={() => setEditMode(false)}>Cancel</button>
                </>
            ) : (
                <button onClick={toggleEditMode} disabled={article.articleStatus === 'PUBLISHED'}>
                    Edit
                </button>
            )}
        </div>
    );
};

export default ArticleCard;
