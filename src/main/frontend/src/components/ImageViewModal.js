import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { apiFetch } from '../utils/api';

const ImageViewModal = ({ resourceId, buttonLabel = "Image" }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [sourceImage, setSourceImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showMetadata, setShowMetadata] = useState(false);

    // compute available height so very tall images don't push the modal off-screen
    const [availableHeight, setAvailableHeight] = useState(() => {
        if (typeof window !== 'undefined') {
            return Math.max(200, window.innerHeight - 160);
        }
        return 600;
    });

    useEffect(() => {
        function updateAvailableHeight() {
            const offset = 160; // leave room for header/footer and margins
            const h = Math.max(200, window.innerHeight - offset);
            setAvailableHeight(h);
        }
        updateAvailableHeight();
        window.addEventListener('resize', updateAvailableHeight);
        return () => window.removeEventListener('resize', updateAvailableHeight);
    }, []);

    const handleShowImage = async () => {
        setModalOpen(true);
        setLoading(true);
        setSourceImage(null);
        const res = await apiFetch(`/images?resourceId=${resourceId}`);
        if (res.ok) {
            const image = await res.json();
            setSourceImage(image);
        }
        setLoading(false);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSourceImage(null);
    };

    return (
        <>
            <Button style={{paddingTop: '0px'}} size="sm" color="link" onClick={handleShowImage}>{buttonLabel}</Button>
            <Modal isOpen={modalOpen} toggle={handleCloseModal} fullscreen>
                <ModalHeader toggle={handleCloseModal}>Image</ModalHeader>
                <ModalBody>
                    {loading ? (
                        <div>Loading...</div>
                    ) : sourceImage ? (
                    <>
                        <div style={{maxHeight: availableHeight, overflow: 'auto'}}>
                            <img
                                src={`data:image/jpeg;base64,${sourceImage.data}`}
                                alt="Source"
                                style={{objectFit: 'contain', maxHeight: availableHeight + 'px', maxWidth: '100%'}}
                            />
                        </div>

                        <Button size="sm" color="link" onClick={() => setShowMetadata(!showMetadata)}>{showMetadata ? 'Hide' : 'Show'} Metadata</Button>
                        {showMetadata && <div>
                            Resource Id: {sourceImage.resourceId}<br />
                            Resource Type: {sourceImage.resourceType}<br />
                            File Name: {sourceImage.fileName}<br />
                            File type: {sourceImage.fileType}<br />
                            Dimensions: {sourceImage.width} x {sourceImage.height}<br />
                            Compression Quality: {sourceImage.compressionQuality}<br />
                            Created At: {new Date(sourceImage.createdAt).toLocaleString()}<br />
                        </div> }
                        </>
                    ) : (
                        <div>No image found.</div>
                    )}
                </ModalBody>
            </Modal>
        </>
    );
};

export default ImageViewModal;