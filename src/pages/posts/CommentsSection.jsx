import React, { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import useMutation from '../../hooks/useMutation';

const CommentsSection = ({ postId, currentUser }) => {
    const {
        data: comments,
        loading,
        error,
        setData: setComments
    } = useFetch(`http://localhost:3000/comments?postId=${postId}`);

    const { mutate } = useMutation();
    const [newComment, setNewComment] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        const commentData = {
            postId: postId,
            name: currentUser.username,
            email: currentUser.email,
            body: newComment
        };

        try {
            const savedComment = await mutate(`http://localhost:3000/comments`, 'POST', commentData);
            setComments(prev => [...prev, savedComment]);
            setNewComment("");
        } catch (err) {
            alert("Failed to add comment");
        }
    };

    const handleUpdate = async (commentId) => {
        try {
            const updated = await mutate(`http://localhost:3000/comments/${commentId}`, 'PATCH', { body: editText });
            setComments(prev => prev.map(c => c.id === commentId ? updated : c));
            setEditingId(null);
        } catch (err) {
            alert("Update failed");
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await mutate(`http://localhost:3000/comments/${commentId}`, 'DELETE');
            setComments(prev => prev.filter(c => c.id !== commentId));
        } catch (err) {
            alert("Delete failed");
        }
    };

    if (loading)
        return
    <p className="loadingText">Loading comments...</p>;
    if (error)
        return
    <p className="errorText">Error loading comments.</p>;

    return (
        <div className="commentsSection">
            <h5>Comments</h5>
            <div className="commentsList">
                {comments?.map(comment => {

                    const isOwner = comment.email === currentUser.email;

                    return (
                        <div key={comment.id} className="commentCard">
                            <div className="commentHeader">
                                <strong>{comment.name}</strong>
                                <span className="commentEmail">({comment.email})</span>
                            </div>

                            {editingId === comment.id ? (
                                <div className="editCommentArea">
                                    <textarea value={editText} onChange={(e) => setEditText(e.target.value)} />
                                    <div className="editCommentActions">
                                        <button onClick={() => handleUpdate(comment.id)}>Save</button>
                                        <button onClick={() => setEditingId(null)}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <p className="commentBody">{comment.body}</p>
                            )}

                            {isOwner && editingId !== comment.id && (
                                <div className="commentActions">
                                    <button onClick={() => { setEditingId(comment.id); setEditText(comment.body); }}>🖊️</button>
                                    <button onClick={() => handleDelete(comment.id)}>🗑️</button>
                                </div>
                            )}

                        </div>
                    );
                })}
            </div>

            <div className="addCommentForm">
                <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button onClick={handleAddComment}>Post</button>
            </div>
        </div>
    );
};

export default CommentsSection;