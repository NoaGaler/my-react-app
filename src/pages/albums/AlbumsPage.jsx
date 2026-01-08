import React, { useState } from 'react';
import useResourceManager from '../../hooks/useResourceManager';
import PhotoGallery from './PhotoGallery';
import UniversalModal from './UniversalModal';
import './Albums.css';

const AlbumsPage = ({ currentUser }) => {
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const baseUrl = `http://localhost:3000/albums`;
    const fetchUrl = currentUser ? `${baseUrl}?userId=${currentUser.id}` : null;

    // שליפת כל הכלים מההוק הגנרי שלך
    const {
        items: albums, 
        loading, 
        error, 
        actionLoading,
        addItem, 
        removeItem,
        setSearch, 
        setCriteria, 
        setSort,
        searchTerm, 
        searchCriteria, 
        sortBy
    } = useResourceManager(baseUrl, fetchUrl);

    const albumFields = [
        { name: 'title', label: 'Album Title', placeholder: 'Enter album name...' }
    ];

    const handleSaveAlbum = async (data) => {
        await addItem({ 
            ...data, 
            userId: currentUser.id 
        });
        setIsModalOpen(false);
    };

    // אם נבחר אלבום, עוברים לתצוגת הגלריה
    if (selectedAlbum) {
        return <PhotoGallery album={selectedAlbum} onBack={() => setSelectedAlbum(null)} />;
    }

    if (loading) return (
        <div className="infoWrapper">
            <div className="spinner"></div>
            <p>Loading your albums...</p>
        </div>
    );

    if (error) return (
        <div className="errorContainer">
            <p>Error: {error}</p>
        </div>
    );

    return (
        <div className="albumsContainer">
            <h1 className="pageTitle">My Albums</h1>

            <div className="postsToolbar">
                <div className="searchGroup">
                    <div className="searchChips">
                        <button 
                            className={`chip ${searchCriteria === 'title' ? 'active' : ''}`} 
                            onClick={() => setCriteria('title')}
                        >
                            Title
                        </button>
                        <button 
                            className={`chip ${searchCriteria === 'id' ? 'active' : ''}`} 
                            onClick={() => setCriteria('id')}
                        >
                            ID
                        </button>
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
                    <button className="addBtn" onClick={() => setIsModalOpen(true)}>+ New Album</button>
                </div>
            </div>

            <UniversalModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveAlbum}
                title="Create New Album"
                fields={albumFields}
            />

            <div className="albumsGrid">
                {albums.map(album => (
                    <div key={album.id} className="albumCard" onClick={() => setSelectedAlbum(album)}>
                        <div className="albumActions">
                            <button 
                                className="deleteBtn" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeItem(album.id);
                                }}
                            >
                                🗑️
                            </button>
                        </div>
                        <div className="folderIcon">🖼️</div>
                        <h3 className="albumTitle">{album.title}</h3>
                        <span className="albumId">ID: {album.id}</span>
                    </div>
                ))}
            </div>

            {actionLoading && <div className="mutationOverlay">Updating Server...</div>}
        </div>
    );
};

export default AlbumsPage;








// import React, { useState } from 'react';
// import useResourceManager from '../../hooks/useResourceManager';
// import PhotoGallery from './PhotoGallery';
// import UniversalModal from './UniversalModal';
// import './Albums.css';

// const AlbumsPage = ({ currentUser }) => {
//     const [selectedAlbum, setSelectedAlbum] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const { items: albums, loading, error, addItem } = useResourceManager(
//         `http://localhost:3000/albums`,
//         `http://localhost:3000/albums?userId=${currentUser?.id}`
//     );

//     const albumFields = [
//         { name: 'title', label: 'Album Title', placeholder: 'Enter album name...' }
//     ];

//     const handleSaveAlbum = async (data) => {
//         await addItem({ ...data, userId: currentUser.id });
//     };

//     if (selectedAlbum) {
//         return <PhotoGallery album={selectedAlbum} onBack={() => setSelectedAlbum(null)} />;
//     }

//     return (
//         <div className="albumsContainer">
//             <div className="pageHeader">
//                 <h2 className="pageTitle">My Albums</h2>
//                 <button className="addBtn" onClick={() => setIsModalOpen(true)}>+ New Album</button>
//             </div>

//             <UniversalModal 
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//                 onSave={handleSaveAlbum}
//                 title="Create New Album"
//                 fields={albumFields}
//             />

//             <div className="albumsGrid">
//                 {albums.map(album => (
//                     <div key={album.id} className="albumCard" onClick={() => setSelectedAlbum(album)}>
//                         <div className="folderIcon">📁</div>
//                         <h3 className="albumTitle">{album.title}</h3>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default AlbumsPage;