import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import useResourceManager from '../../hooks/useResourceManager';
import PostItem from './PostItem'; 
import PostModal from './PostModal'; 
import './Posts.css'; 

const PostsPage = () => {
    const { currentUser } = useContext(UserContext);

    const baseUrl = `http://localhost:3000/posts`;
    const fetchUrl = currentUser ? `${baseUrl}?userId=${currentUser.id}` : null;

    const {
        items: posts, loading, error, actionLoading,
        addItem, updateItem, removeItem,
        setSearch, setCriteria, setSort,
        searchTerm, searchCriteria, sortBy
    } = useResourceManager(baseUrl, fetchUrl);

    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', post: null });

    const closeModal = () => setModalConfig({ isOpen: false, type: '', post: null });




    const handleSave = async (formData) => {
        if (modalConfig.type === 'add') {
            await addItem({
                userId: currentUser.id,
                title: formData.title,
                body: formData.body
            });
        } else if (modalConfig.type === 'edit') {
            await updateItem(modalConfig.post.id, { 
                title: formData.title, 
                body: formData.body 
            });
        }
        closeModal();
    };

    if (loading) 
      return 
        <div className="infoWrapper">
          <div className="spinner"></div>
          <p>Loading posts...</p>
        </div>;
    if (error) 
      return 
        <div className="errorContainer">
          <p>Error: {error}</p>
        </div>;

    return (
        <div className="postsContainer">
            <h1 className="pageTitle">My Posts</h1>

            <div className="postsToolbar">
                <div className="searchGroup">
                    <div className="searchChips">
                        <button className={`chip ${searchCriteria === 'title' ? 'active' : ''}`} onClick={() => setCriteria('title')}>Title</button>
                        <button className={`chip ${searchCriteria === 'id' ? 'active' : ''}`} onClick={() => setCriteria('id')}>ID</button>
                    </div>
                    <div className="searchField">
                        <input 
                            className="searchInput" 
                            value={searchTerm} 
                            onChange={(e) => setSearch(e.target.value)} 
                            placeholder={`Search by ${searchCriteria}...`} 
                        />
                    </div>
                </div>

                <div className="actionGroup">
                    <button className="addBtn" onClick={() => setModalConfig({ isOpen: true, type: 'add' })}>+ New Post</button>
                </div>
            </div>

            <PostModal 
                isOpen={modalConfig.isOpen}
                title={modalConfig.type === 'edit' ? "Edit Post" : "Create New Post"}
                initialData={modalConfig.type === 'edit' ? modalConfig.post : null}
                onSave={handleSave}
                onClose={closeModal}
            />

            <div className="postsList">
                {posts.map(post => (
                    <PostItem 
                        key={post.id} 
                        post={post} 
                        currentUser={currentUser}
                        onDelete={removeItem}
                        onEdit={(p) => setModalConfig({ isOpen: true, type: 'edit', post: p })}
                    />
                ))}
            </div>
            {actionLoading && <div className="mutationOverlay">Updating Server...</div>}
        </div>
    );
};

export default PostsPage;