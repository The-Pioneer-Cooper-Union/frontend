import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import './Home.css';

function Home() {
    const [issuesAndVolumes, setIssuesAndVolumes] = useState([]);
    const [selectedIssue, setSelectedIssue] = useState('');
    const [selectedVolume, setSelectedVolume] = useState('');
    const [isAdmin, setIsAdmin] = useState(false); // Track admin status
    // latest volume need also.
    const [latestIssue, setLatestIssue] = useState('');
    const [articles, setArticles] = useState([]);
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [showNewCommentTextbox, setShowNewCommentTextbox] = useState(false);
    
    useEffect(() => {
        const fetchIssuesAndVolumes = async () => {
            try {
                const response = await axios.get('/api/issues-volumes');
                setIssuesAndVolumes(response.data);

                // Set the latest issue
                const latestIssue = response.data[0].issue;
                setLatestIssue(latestIssue);
            } catch (error) {
                console.error('Error fetching issues and volumes:', error);
            }
        };

        fetchIssuesAndVolumes();
    }, []);

    // Get the user type to show the "For Editor" button on-screen.
    useEffect(() => {
        const fetchUserType = async () => {
            try {
                // This needs to be added into the UserController on the backend for the correct route
                const response = await axios.get('/api/users');
                const userType = response.data.user_type;
                setIsAdmin(userType === 'admin');
            } catch (error) {
                console.error('Error fetching user type:', error);
            }
        };

        fetchUserType();
    }, []);

    const handleIssueChange = (event) => {
        setSelectedIssue(event.target.value);
    };

    const handleVolumeChange = (event) => {
        setSelectedVolume(event.target.value);
    };

    useEffect(() => {
        const fetchArticlesAndComments = async () => {
            try {
                const articlesResponse = await axios.get('/api/articles');
                const commentsResponse = await axios.get('/api/comments');
                setArticles(articlesResponse.data);
                setComments(commentsResponse.data);
            } catch (error) {
                console.error('Error fetching articles and comments:', error);
            }
        };

        fetchArticlesAndComments();
    }, []);

    const handleNewCommentTextChange = (event) => {
        setNewCommentText(event.target.value);
    };

    const handlePostComment = async () => {
        try {
            const response = await axios.post('/api/comments', {
                text: newCommentText
            });
            const newComment = response.data;
            setComments([...comments, newComment]);
            setNewCommentText('');
            setShowNewCommentTextbox(false);
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    const toggleNewCommentTextbox = () => {
        setShowNewCommentTextbox(!showNewCommentTextbox);
    };

    // I don't think the article stuff is contained within home-content though!
    return (
        <div>
            <Header />
            <div className="home-content">
                <div className="search">
                    <input type="text" placeholder="Search"/>
                    <button>🔍</button>
                </div>

                <div className="button-containers">
                <a href="https://forms.gle/nk1BcCK8kt6W1Qgc9" target="_blank" rel="noopener noreferrer" className="home-button">Submit Article</a>
                {isAdmin && <Link to="/foreditors" className="home-button">For Editors</Link>}
                <Link to={`/issue/${latestIssue}`} className="home-button">Current Issue</Link>
                </div>

                <div className="dropdowns">
                    <select value={selectedIssue} onChange={handleIssueChange}>
                        <option value="">Select Issue</option>
                        {issuesAndVolumes.map(({issue}) => (
                            <option key={issue} value={issue}>
                                Issue {issue}
                            </option>
                        ))}
                    </select>

                    <select value={selectedVolume} onChange={handleVolumeChange}>
                        <option value="">Select Volume</option>
                        {issuesAndVolumes.map(({volume}) => (
                            <option key={volume} value={volume}>
                                Volume {volume}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Iterate over articles */}
                {articles.map((article, index) => (
                    <div key={index}>
                        <div className="article-title">{article.title}</div>
                        <div className="article-descriptors">
                            Type: {article.type} | Author: {article.author} | Publish Date: {article.publish_date}
                        </div>
                        <div className="article-text">{article.text}</div>

                        {/* Comments section */}
                        <div className="comments">
                            {comments.filter(comment => comment.article_id === article.id).map((comment, commentIndex) => (
                                <div key={commentIndex} className="comment">
                                    <span className="comment-user">{comment.user}</span>
                                    <span className="comment-text">{comment.text}</span>
                                    {/* Add reaction buttons here */}
                                </div>
                            ))}

                            {/* New Comment section */}
                            <div className="new-comment-container">
                                <button onClick={toggleNewCommentTextbox}>New Comment</button>
                                {showNewCommentTextbox && (
                                    <div className="new-comment-textbox">
                                        <input type="text" value={newCommentText} onChange={handleNewCommentTextChange} />
                                        <button onClick={handlePostComment} className={`post-comment-button ${newCommentText ? 'visible' : ''}`}>Post Comment</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <h1>The Pioneer</h1>
        </div>
    );
}

export default Home;

