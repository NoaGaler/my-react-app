import React, { useState, useEffect } from 'react';
import useFetch from '../../hooks/useFetch';
import useMutation from '../../hooks/useMutation';
import UniversalModal from './UniversalModal';

const PhotoGallery = ({ album, onBack }) => {
    const [page, setPage] = useState(1);
    const [allPhotos, setAllPhotos] = useState([]);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, mode: 'add', initialData: null });
    const { mutate } = useMutation();
    
    const { data: newPhotos, loading } = useFetch(
        `http://localhost:3000/photos?albumId=${album.id}&_page=${page}&_limit=10`
    );

    useEffect(() => {
        if (newPhotos) {
            setAllPhotos(prev => {
                const ids = new Set(prev.map(p => p.id));
                return [...prev, ...newPhotos.filter(p => !ids.has(p.id))];
            });
        }
    }, [newPhotos]);

    const photoFields = [
        { name: 'title', label: 'Photo Title', placeholder: 'Enter title...' },
        { name: 'url', label: 'Image URL', placeholder: 'https://...' }
    ];

    const handleSave = async (data) => {
        if (modalConfig.mode === 'add') {
            const saved = await mutate(`http://localhost:3000/photos`, 'POST', { ...data, albumId: album.id, thumbnailUrl: data.url });
            setAllPhotos(prev => [saved, ...prev]);
        } else {
            await mutate(`http://localhost:3000/photos/${modalConfig.initialData.id}`, 'PATCH', data);
            setAllPhotos(prev => prev.map(p => p.id === modalConfig.initialData.id ? { ...p, ...data } : p));
        }
    };

    return (
        <div className="galleryContainer">
            <div className="galleryHeader">
                <button className="backBtn" onClick={onBack}>← Back</button>
                <h2 className="albumHeader">{album.title}</h2>
                <button className="addBtn" onClick={() => setModalConfig({ isOpen: true, mode: 'add', initialData: null })}>+ Add Photo</button>
            </div>

            <UniversalModal 
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onSave={handleSave}
                title={modalConfig.mode === 'add' ? 'Add Photo' : 'Edit Photo'}
                fields={photoFields}
                initialData={modalConfig.initialData}
            />

            <div className="photoGrid">
                {allPhotos.map(photo => (
                    <div key={photo.id} className="photoCard">
                        <div className="photoActions">
                            <button onClick={() => setModalConfig({ isOpen: true, mode: 'edit', initialData: photo })}>🖊️</button>
                            <button onClick={async () => {
                                if(window.confirm("Delete?")) {
                                    await mutate(`http://localhost:3000/photos/${photo.id}`, 'DELETE');
                                    setAllPhotos(prev => prev.filter(p => p.id !== photo.id));
                                }
                            }}>🗑️</button>
                        </div>
                        <img src={photo.url} alt={photo.title} className="albumPhoto" />
                        <p className="photoTitle">{photo.title}</p>
                    </div>
                ))}
            </div>
            
            {!loading && <button className="loadMoreBtn" onClick={() => setPage(page + 1)}>Load More</button>}
        </div>
    );
};

export default PhotoGallery;