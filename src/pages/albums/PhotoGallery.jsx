import React, { useState, useEffect } from 'react';
import useFetch from '../../hooks/useFetch';
import useMutation from '../../hooks/useMutation';
import UniversalModal from './UniversalModal';

const PhotoGallery = ({ album, onBack }) => {
    const [limit, setLimit] = useState(6);
    const [allPhotos, setAllPhotos] = useState([]); 
    const [modalConfig, setModalConfig] = useState({ isOpen: false, mode: 'add', initialData: null });
    const [refreshTrigger, setRefreshTrigger] = useState(0); 
    const { mutate } = useMutation();
    
    const fetchUrl = album?.id 
        ? `http://localhost:3000/photos?albumId=${album.id}&_limit=${limit}&_t=${refreshTrigger}` 
        : null;

    const { data: fetchedPhotos, loading } = useFetch(fetchUrl);

    useEffect(() => {
        if (fetchedPhotos && Array.isArray(fetchedPhotos)) {
            setAllPhotos(fetchedPhotos);
        }
    }, [fetchedPhotos]);

    useEffect(() => {
        setAllPhotos([]);
        setLimit(6);
    }, [album?.id]);

    const handleSave = async (data) => {
        try {
            const payload = { ...data, albumId: String(album.id), thumbnailUrl: data.url };
            if (modalConfig.mode === 'add') {
                await mutate(`http://localhost:3000/photos`, 'POST', payload);
            } else {
                await mutate(`http://localhost:3000/photos/${modalConfig.initialData.id}`, 'PATCH', data);
            }
            setRefreshTrigger(prev => prev + 1);
            setModalConfig({ isOpen: false, mode: 'add', initialData: null });
        } catch (err) {
             alert("Action failed."); 
        }
    };

    return (
        <div className="galleryContainer">
            <div className="galleryHeader">
                <button className="backBtn" onClick={onBack}>← Back</button>
                <h2 className="albumHeader">{album.title}</h2>
                <button className="addBtn" onClick={() => setModalConfig({ isOpen: true, mode: 'add', initialData: null })}>+ Add Photo</button>
            </div>

            <div className="photoGrid">
                {allPhotos.map(photo => (
                    <div key={photo.id} className="photoCard">
                        <div className="photoActions">
                            <button onClick={() => setModalConfig({ isOpen: true, mode: 'edit', initialData: photo })}>🖊️</button>
                            <button onClick={async () => {
                                if (window.confirm("Delete?")) {
                                    await mutate(`http://localhost:3000/photos/${photo.id}`, 'DELETE');
                                    setRefreshTrigger(prev => prev + 1);
                                }
                            }}>🗑️</button>
                        </div>
                        <img src={photo.url} alt={photo.title} className="albumPhoto" />
                        <p className="photoTitle">{photo.title}</p>
                    </div>
                ))}
            </div>
            
            <div className="paginationArea">
                {loading ? (
                    <div>Loading more photos...</div>
                ) : (
                    allPhotos.length >= limit && (
                        <button className="loadMoreBtn" onClick={() => setLimit(prev => prev + 6)}>
                            Load More
                        </button>
                    )
                )}
            </div>

            <UniversalModal 
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onSave={handleSave}
                title="Photo Modal"
                fields={[{name: 'title', label: 'Title'}, {name: 'url', label: 'URL'}]}
                initialData={modalConfig.initialData}
            />
        </div>
    );
};

export default PhotoGallery;






