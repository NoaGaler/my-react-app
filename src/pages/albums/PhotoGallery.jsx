import React, { useState, useEffect } from 'react';
import useFetch from '../../hooks/useFetch';
import useMutation from '../../hooks/useMutation';
import UniversalModal from './UniversalModal';

const PhotoGallery = ({ album, onBack }) => {
    const [page, setPage] = useState(1);
    const [allPhotos, setAllPhotos] = useState([]);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, mode: 'add', initialData: null });
    const { mutate } = useMutation();

    // הגנה על ה-URL: טוען רק אם יש ID תקין לאלבום
    // הגנה על ה-URL: הוספנו גרשיים פנימיים מסביב ל-ID
    const fetchUrl = album?.id
        ? `http://localhost:3000/photos?albumId=${album.id}&_page=${page}&_limit=10`
        : null;

    const { data: newPhotos, loading } = useFetch(fetchUrl);



    // useEffect(() => {
    //     console.log("DEBUG: newPhotos current value:", newPhotos);
    //     // הוספת תמונות רק אם באמת חזר מערך עם נתונים חדשים
    //     if (newPhotos && Array.isArray(newPhotos) && newPhotos.length > 0) {
    //         setAllPhotos(prev => {
    //             const ids = new Set(prev.map(p => String(p.id)));
    //             const uniqueNewPhotos = newPhotos.filter(p => !ids.has(String(p.id)));
    //             return [...prev, ...uniqueNewPhotos];
    //         });
    //     }
    // }, [newPhotos]);

    useEffect(() => {
        // הוספת לוג כדי לראות מה נכנס בפועל
        console.log("DEBUG: Processing new photos...", newPhotos);

        // תנאי קריטי: רצים רק אם זה מערך ויש בו לפחות פריט אחד
        if (newPhotos && Array.isArray(newPhotos) && newPhotos.length > 0) {
            setAllPhotos(prev => {
                const existingIds = new Set(prev.map(p => String(p.id)));
                const uniqueNewPhotos = newPhotos.filter(p => !existingIds.has(String(p.id)));

                // אם אחרי הסינון לא נשאר כלום חדש, לא מעדכנים (מונע רינדור מיותר)
                if (uniqueNewPhotos.length === 0) return prev;

                console.log("DEBUG: Adding unique photos to state:", uniqueNewPhotos.length);
                return [...prev, ...uniqueNewPhotos];
            });
        }
    }, [newPhotos]);

    const photoFields = [
        { name: 'title', label: 'Photo Title', placeholder: 'Enter title...' },
        { name: 'url', label: 'Image URL', placeholder: 'https://...' }
    ];

    // const handleSave = async (data) => {
    //     try {
    //         if (modalConfig.mode === 'add') {
    //             const payload = {
    //                 ...data,
    //                 albumId: String(album.id),
    //                 thumbnailUrl: data.url
    //             };
    //             const saved = await mutate(`http://localhost:3000/photos`, 'POST', payload);
    //             if (saved) setAllPhotos(prev => [saved, ...prev]);
    //         } else {
    //             await mutate(`http://localhost:3000/photos/${modalConfig.initialData.id}`, 'PATCH', data);
    //             setAllPhotos(prev => prev.map(p => p.id === modalConfig.initialData.id ? { ...p, ...data } : p));
    //         }
    //         setModalConfig({ isOpen: false, mode: 'add', initialData: null });
    //     } catch (err) {
    //         alert("Action failed. Check server connection.");
    //     }
    // };

    const handleSave = async (data) => {
        try {
            if (modalConfig.mode === 'add') {
                // יצירת אובייקט "מושלם" התואם למבנה ה-DB המקורי
                const payload = {
                    albumId: String(album.id), // תמיד סטרינג לסנכרון מול השרת
                    title: data.title,
                    url: data.url,
                    thumbnailUrl: data.url // שכפול אוטומטי של ה-URL ל-thumbnail
                };

                const saved = await mutate(`http://localhost:3000/photos`, 'POST', payload);

                if (saved) {
                    // הוספת התמונה החדשה לראש הרשימה המוצגת
                    setAllPhotos(prev => [saved, ...prev]);
                }
            } else {
                // בעריכה: אם ה-URL השתנה, אנחנו מעדכנים גם את ה-thumbnailUrl
                const updatePayload = {
                    ...data,
                    thumbnailUrl: data.url // מבטיח שהתצוגה המקדימה תתעדכן גם היא
                };

                const updated = await mutate(
                    `http://localhost:3000/photos/${modalConfig.initialData.id}`,
                    'PATCH',
                    updatePayload
                );

                if (updated) {
                    setAllPhotos(prev =>
                        prev.map(p => p.id === modalConfig.initialData.id ? { ...p, ...updatePayload } : p)
                    );
                }
            }
            // סגירת המודאל ואיפוס רק לאחר הצלחה
            setModalConfig({ isOpen: false, mode: 'add', initialData: null });
        } catch (err) {
            console.error("Save failed:", err);
            alert("Action failed. Check server connection.");
        }
    };

    return (
        <div className="galleryContainer">
            <div className="galleryHeader">
                <button className="backBtn" onClick={onBack}>← Back to Albums</button>
                <div className="headerInfo">
                    <h2 className="albumHeader">{album.title}</h2>
                    <button className="addBtn" onClick={() => setModalConfig({ isOpen: true, mode: 'add', initialData: null })}>+ Add Photo</button>
                </div>
            </div>

            <UniversalModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onSave={handleSave}
                title={modalConfig.mode === 'add' ? 'Add Photo to Album' : 'Edit Photo Details'}
                fields={photoFields}
                initialData={modalConfig.initialData}
            />

            <div className="photoGrid">
                {allPhotos.map(photo => (
                    <div key={photo.id} className="photoCard">
                        <div className="photoActions">
                            <button onClick={() => setModalConfig({ isOpen: true, mode: 'edit', initialData: photo })} title="Edit">🖊️</button>
                            <button onClick={async () => {
                                if (window.confirm("Are you sure you want to delete this photo?")) {
                                    await mutate(`http://localhost:3000/photos/${photo.id}`, 'DELETE');
                                    setAllPhotos(prev => prev.filter(p => p.id !== photo.id));
                                }
                            }} title="Delete">🗑️</button>
                        </div>
                        {/* <img
                            src={photo.url}
                            alt={photo.title}
                            className="albumPhoto"
                            onError={(e) => { e.target.src = 'https://picsum.photos/200'; }}
                        /> */}
                        <p>Photo ID: {photo.id}</p> {/* במקום ה-img כרגע */}
                        <p className="photoTitle">{photo.title}</p>
                    </div>
                ))}
            </div>

            {loading ? (
                <p className="loadingText">Loading photos...</p>
            ) : (
                /* הכפתור יוצג רק אם הדף האחרון היה מלא (סימן שיש אולי עוד) */
                newPhotos?.length === 10 && (
                    <button className="loadMoreBtn" onClick={() => setPage(prev => prev + 1)}>
                        Load More Photos
                    </button>
                )
            )}
        </div>
    );
};

export default PhotoGallery;








// import React, { useState, useEffect } from 'react';
// import useFetch from '../../hooks/useFetch';
// import useMutation from '../../hooks/useMutation';
// import UniversalModal from './UniversalModal';

// const PhotoGallery = ({ album, onBack }) => {
//     const [page, setPage] = useState(1);
//     const [allPhotos, setAllPhotos] = useState([]);
//     const [modalConfig, setModalConfig] = useState({ isOpen: false, mode: 'add', initialData: null });
//     const { mutate } = useMutation();

//     // השורה המתוקנת (שורה 11):
//     const { data: newPhotos, loading } = useFetch(
//         `http://localhost:3000/photos?albumId=${String(album.id)}&_page=${page}&_limit=10`
//     );

//     useEffect(() => {
//         if (newPhotos && Array.isArray(newPhotos) && newPhotos.length > 0) {
//             setAllPhotos(prev => {
//                 const ids = new Set(prev.map(p => String(p.id)));
//                 const uniqueNewPhotos = newPhotos.filter(p => !ids.has(String(p.id)));
//                 return [...prev, ...uniqueNewPhotos];
//             });
//         }
//     }, [newPhotos]);

//     const photoFields = [
//         { name: 'title', label: 'Photo Title', placeholder: 'Enter title...' },
//         { name: 'url', label: 'Image URL', placeholder: 'https://...' }
//     ];

//     const handleSave = async (data) => {
//         try {
//             if (modalConfig.mode === 'add') {
//                 const payload = {
//                     ...data,
//                     albumId: String(album.id), // שמירה תמיד כסטרינג
//                     thumbnailUrl: data.url
//                 };
//                 const saved = await mutate(`http://localhost:3000/photos`, 'POST', payload);
//                 setAllPhotos(prev => [saved, ...prev]);
//             } else {
//                 await mutate(`http://localhost:3000/photos/${modalConfig.initialData.id}`, 'PATCH', data);
//                 setAllPhotos(prev => prev.map(p => p.id === modalConfig.initialData.id ? { ...p, ...data } : p));
//             }
//             setModalConfig({ isOpen: false, mode: 'add', initialData: null });
//         } catch (err) {
//             alert("Action failed. Check server connection.");
//         }
//     };

//     return (
//         <div className="galleryContainer">
//             <div className="galleryHeader">
//                 <button className="backBtn" onClick={onBack}>← Back to Albums</button>
//                 <div className="headerInfo">
//                     <h2 className="albumHeader">{album.title}</h2>
//                     <button className="addBtn" onClick={() => setModalConfig({ isOpen: true, mode: 'add', initialData: null })}>+ Add Photo</button>
//                 </div>
//             </div>

//             <UniversalModal
//                 isOpen={modalConfig.isOpen}
//                 onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
//                 onSave={handleSave}
//                 title={modalConfig.mode === 'add' ? 'Add Photo to Album' : 'Edit Photo Details'}
//                 fields={photoFields}
//                 initialData={modalConfig.initialData}
//             />

//             <div className="photoGrid">
//                 {allPhotos.map(photo => (
//                     <div key={photo.id} className="photoCard">
//                         <div className="photoActions">
//                             <button onClick={() => setModalConfig({ isOpen: true, mode: 'edit', initialData: photo })} title="Edit">🖊️</button>
//                             <button onClick={async () => {
//                                 if (window.confirm("Are you sure you want to delete this photo?")) {
//                                     await mutate(`http://localhost:3000/photos/${photo.id}`, 'DELETE');
//                                     setAllPhotos(prev => prev.filter(p => p.id !== photo.id));
//                                 }
//                             }} title="Delete">🗑️</button>
//                         </div>
//                         <img
//                             src={photo.url}
//                             alt={photo.title}
//                             className="albumPhoto"
//                             onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Image+Error'; }}
//                         />
//                         <p className="photoTitle">{photo.title}</p>
//                     </div>
//                 ))}
//             </div>

//             {loading ? (
//                 <p className="loadingText">Loading more photos...</p>
//             ) : (
//                 /* הכפתור יוצג רק אם הגיעו תמונות בדף האחרון (סימן שיש אולי עוד) */
//                 newPhotos?.length === 10 && (
//                     <button className="loadMoreBtn" onClick={() => setPage(prev => prev + 1)}>
//                         Load More Photos
//                     </button>
//                 )
//             )}
//         </div>
//     );
// };

// export default PhotoGallery;