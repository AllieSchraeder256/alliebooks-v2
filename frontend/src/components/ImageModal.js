import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';

const ImageModal = ({ resourceId, buttonLabel = "Image" }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showMetadata, setShowMetadata] = useState(false);

    const handleShowImage = async () => {
        setModalOpen(true);
        setLoading(true);
        setImage(null);
        const res = await fetch(`/images?resourceId=${resourceId}`);
        if (res.ok) {
            const image = await res.json();
            setImage(image);
        }
        setLoading(false);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setImage(null);
    };

    return (
        <>
            <Button style={{paddingTop: '0px'}} size="sm" color="link" onClick={handleShowImage}>{buttonLabel}</Button>
            <Modal isOpen={modalOpen} toggle={handleCloseModal} size="xl">
                <ModalHeader toggle={handleCloseModal}>Image</ModalHeader>
                <ModalBody>
                    {loading ? (
                        <div>Loading...</div>
                    ) : image ? (
                        <>
                        <img src={`data:image/jpeg;base64,${image.data}`} alt="Resource image" style={{ width: '100%' }} />
                        <Button size="sm" color="link" onClick={() => setShowMetadata(!showMetadata)}>{showMetadata ? 'Hide' : 'Show'} Metadata</Button>
                        {showMetadata && <div>
                            Resource Id: {image.resourceId}<br />
                            Resource Type: {image.resourceType}<br />
                            File Name: {image.fileName}<br />
                            File type: {image.fileType}<br />
                            Dimensions: {image.width} x {image.height}<br />
                            Compression Quality: {image.compressionQuality}<br />
                            Created At: {new Date(image.createdAt).toLocaleString()}<br />
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

export default ImageModal;