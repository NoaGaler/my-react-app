import React, { useState } from 'react';
import useResourceManager from '../../hooks/useResourceManager';
import PhotoGallery from './PhotoGallery';
import UniversalModal from './UniversalModal';
import './Albums.css';

const AlbumsPage = ({ currentUser }) => {
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { items: albums, loading, error, addItem } = useResourceManager(
        `http://localhost:3000/albums`,
        `http://localhost:3000/albums?userId=${currentUser?.id}`
    );

    const albumFields = [
        { name: 'title', label: 'Album Title', placeholder: 'Enter album name...' }
    ];

    const handleSaveAlbum = async (data) => {
        await addItem({ ...data, userId: currentUser.id });
    };

    if (selectedAlbum) {
        return <PhotoGallery album={selectedAlbum} onBack={() => setSelectedAlbum(null)} />;
    }

    return (
        <div className="albumsContainer">
            <div className="pageHeader">
                <h2 className="pageTitle">My Albums</h2>
                <button className="addBtn" onClick={() => setIsModalOpen(true)}>+ New Album</button>
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
                        <div className="folderIcon">📁</div>
                        <h3 className="albumTitle">{album.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlbumsPage;