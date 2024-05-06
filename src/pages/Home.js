import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import './Home.css';
import axios from 'axios';
import { API_URL } from '../util/URL.js';
import { useAuth } from '../AuthContext';
import ReactMarkdown from 'react-markdown';

function Home() {
    const [issues, setIssues] = useState([]);
    const [volumes, setVolumes] = useState([]);
    const [selectedIssue, setSelectedIssue] = useState('');
    const [selectedVolume, setSelectedVolume] = useState('');
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [showNewCommentTextbox, setShowNewCommentTextbox] = useState(false);
    const [selectedArticleId, setSelectedArticleId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const issuesVolumesResponse = await axios.get(`${API_URL}/article/issues-volumes`);
                const uniqueIssues = Array.from(new Set(issuesVolumesResponse.data.issues));
                const uniqueVolumes = Array.from(new Set(issuesVolumesResponse.data.volumes));
                setIssues(uniqueIssues);
                setVolumes(uniqueVolumes);

                if (uniqueIssues.length > 0 && uniqueVolumes.length > 0) {
                    setSelectedIssue(uniqueIssues[0]);
                    setSelectedVolume(uniqueVolumes[0]);
                    await fetchArticles(uniqueIssues[0], uniqueVolumes[0]);
                }
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        if (selectedArticleId) {
            fetchComments(selectedArticleId);
        }
    }, [selectedArticleId]);

    const fetchArticles = async (issue, volume) => {
        try {
            const articlesResponse = await axios.get(`${API_URL}/article/by-issue-volume`, {
                params: { issue: issue, volume: volume }
            });
            setArticles(articlesResponse.data);
        } catch (error) {
            console.error('Failed to fetch articles:', error);
        }
    };

    const handleIssueChange = (event) => {
        setSelectedIssue(event.target.value);
        fetchArticles(event.target.value, selectedVolume);
    };

    const handleVolumeChange = (event) => {
        setSelectedVolume(event.target.value);
        fetchArticles(selectedIssue, event.target.value);
    };

    const handleArticleSearch = (event) => {
        setSearchQuery(event.target.value);
    };


    const fetchComments = async (articleId) => {
        try {
            const response = await axios.get(`${API_URL}/comment/article-comments/${articleId}`);
            setComments(response.data);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        }
    };

    const handlePostComment = async () => {
        if (!newCommentText.trim() || !selectedArticleId || !currentUser) {
            console.error('Missing data or not logged in');
            return;
        }

        try {
            const payload = {
                articleId: selectedArticleId,
                commentText: newCommentText,
                email: currentUser.email,
                commentDate: new Date().toISOString(),
            };
            await axios.post(`${API_URL}/comment/create-comment`, payload);
            setNewCommentText('');
            setShowNewCommentTextbox(false);
            await fetchComments(selectedArticleId);
        } catch (error) {
            console.error('Failed to post comment:', error);
        }
    };


    return (
        <div>
            <Header />
            <div className="home-content">
                <div className="home-dropdowns">
                    <select value={selectedVolume} onChange={handleVolumeChange}>
                        <option value="">Select Volume</option>
                        {volumes.map((volume, index) => (
                            <option key={index} value={volume}>Volume {volume}</option>
                        ))}
                    </select>

                    <select value={selectedIssue} onChange={handleIssueChange}>
                        <option value="">Select Issue</option>
                        {issues.map((issue, index) => (
                            <option key={index} value={issue}>Issue {issue}</option>
                        ))}
                    </select>

                </div>

                <div className="home-search">
                    <input type="text" placeholder="Search" onInput={handleArticleSearch}/>
                </div>

                <div className="home-button-containers">
                    <Link className="home-button" to="/home/submissions">Submit Article</Link>
                    <Link className="home-button" to={`/home/for-editor`}>For Editor</Link>
                </div>

            </div>

            <div className="home-articles-container">
                {loading ? <p>Loading articles...</p> : articles
                .filter(article => article.articleStatus === "PUBLISHED")
                .filter(article => searchQuery === '' || article.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((article, index) => (
                    <div key={index} className="home-article" onClick={() => setSelectedArticleId(article.articleId)}>
                        <div className="home-article-title">{article.title}</div>
                        <div className="home-article-descriptors">
                            <span className="home-article-descriptor">{article.user.username}</span>
                            <span className="home-article-descriptor">{article.submissionDate}</span>
                            <span className="home-article-descriptor">{article.category}</span>
                        </div>
                        <ReactMarkdown>{article.content}</ReactMarkdown>
                        <div className="home-comments-section">
                            {comments.filter(comment => comment.article.articleId === article.articleId).map((comment) => (
                                <div key={comment.commentId} className="home-comment">
                                    <p>
                                        {comment.commentText} - <i>{comment.user.username}    </i>{new Date(comment.commentDate).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                            {currentUser && (
                                <div className="home-new-comment-container">

                                        <div>
                                            <textarea
                                                className="home-new-comment-textbox"
                                                value={newCommentText}
                                                onChange={(e) => setNewCommentText(e.target.value)}
                                                placeholder="Write a comment..."
                                            />
                                            <button className="button" onClick={handlePostComment}>Post Comment</button>
                                        </div>

                                </div>
                            )}
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
