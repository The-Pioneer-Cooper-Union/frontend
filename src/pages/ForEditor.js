import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ForEditor.css';
import { API_URL } from '../util/URL';
import Header from "../components/Header";
import ReactMarkdown from 'react-markdown';

function ForEditor() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPendingArticles();
    }, []);

    const fetchPendingArticles = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`${API_URL}/article/all`);
            const pendingArticles = response.data
                .filter(article => article.articleStatus === "PENDING")
                .map(article => ({
                    ...article,
                    tempIssue: article.issue,
                    tempVolume: article.volume,
                    user: article.user || {},
                }));

            setArticles(pendingArticles);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch articles:', error);
            setError('Failed to fetch articles, please check the console for more information.');
            setLoading(false);
        }
    };

    const handleInputChange = (index, field, value) => {
        const newArticles = [...articles];
        newArticles[index][field] = value;
        setArticles(newArticles);
    };

    const publishArticle = async (article, index) => {
        try {
            if (!article.articleId) {
                throw new Error('Invalid article ID');
            }
            const data = {
                articleStatus: 'PUBLISHED',
                title: article.title,
                content: article.content,
                email: article.user.email,
                submissionDate: article.submissionDate,
                category:article.category,
                issue: article.tempIssue,
                volume: article.tempVolume,

            };

            console.log('Publishing with data:', data);

            await axios.put(`${API_URL}/article/update-article/${article.articleId}`, data);
            await fetchPendingArticles();
        } catch (error) {
            console.error('Failed to publish article:', error);
            if (error.response) {
                console.error('Error data:', error.response.data);
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
            }
            setError('Failed to publish article, please check the console for more information.');
        }
    };
    const deleteArticle = async (articleId) => {
        try {
            await axios.delete(`${API_URL}/article/delete-article/${articleId}`);
            await fetchPendingArticles();
        } catch (error) {
            console.error('Failed to delete article:', error);
            if (error.response) {
                console.error('Error data:', error.response.data);
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
            }
            setError('Failed to delete article, please check the console for more information.');
        }
    };

    return (
        <div>
            <Header/>
            <div className="submissions">
                {loading ? (
                    <p>Loading articles...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Content</th>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Issue</th>
                            <th>Volume</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {articles.map((article, index) => (
                            <tr key={article.articleId}>
                                <td>{article.title}</td>
                                <td>{article.user.email}</td>
                                <td><ReactMarkdown>{article.content}</ReactMarkdown></td>
                                <td>{new Date(article.submissionDate).toLocaleDateString()}</td>
                                <td>{article.category}</td>
                                <td>{article.articleStatus}</td>
                                <td>
                                    <input type="number" value={article.tempIssue}
                                           onChange={e => handleInputChange(index, 'tempIssue', e.target.value)}/>
                                </td>
                                <td>
                                    <input type="number" value={article.tempVolume}
                                           onChange={e => handleInputChange(index, 'tempVolume', e.target.value)}/>
                                </td>
                                <td>
                                    <button onClick={() => publishArticle(article, index)}>Publish</button>
                                    <button onClick={() => deleteArticle(article.articleId)}
                                            style={{backgroundColor: "red", color: "white"}}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default ForEditor;
