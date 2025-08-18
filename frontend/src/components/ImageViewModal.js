import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';

const ImageViewModal = ({ resourceId, buttonLabel = "Image" }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [sourceImage, setSourceImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showMetadata, setShowMetadata] = useState(false);

    const handleShowImage = async () => {
        setModalOpen(true);
        setLoading(true);
        setSourceImage(null);
        const res = await fetch(`/images?resourceId=${resourceId}`);
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
            <Modal isOpen={modalOpen} toggle={handleCloseModal} size="md">
                <ModalHeader toggle={handleCloseModal}>Image</ModalHeader>
                <ModalBody>
                    {loading ? (
                        <div>Loading...</div>
                    ) : sourceImage ? (
                    <>
                        <img src={`data:image/jpeg;base64,${sourceImage.data}`} alt="Resource image" style={{objectFit: 'cover', maxHeight:'100vh', maxWidth:'100%'}} />

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