import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, Spinner } from 'reactstrap';
import ReactCrop, { type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

const ImageModal = ({from, buttonText, buttonColor, onImageSelected, isProcessing = false}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [sourceImage, setSourceImage] = useState(null);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);
    const [showMetadata, setShowMetadata] = useState(false);

    const fileInputRef = useRef(null); // For file input
    const imageRef = useRef(null); // For image element
    const navigate = useNavigate();

    useEffect(() => {
        if (!completedCrop || !imageRef.current) {
            setCroppedImageUrl(null);
            return;
        }
        const image = imageRef.current;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const canvas = document.createElement('canvas');
        canvas.width = completedCrop.width * scaleX;
        canvas.height = completedCrop.height * scaleY;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
        );
        setCroppedImageUrl(canvas.toDataURL('image/jpeg'));
    }, [completedCrop]);

    const handleShowImage = async (event) => {
        setModalOpen(true);
        setSourceImage(event.target.files[0]);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSourceImage(null);
        setCompletedCrop(null);
        setCrop(null);
        setCroppedImageUrl(null);
    };

    function doStuff() {
        if (completedCrop && croppedImageUrl) {
            fetch(croppedImageUrl)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], sourceImage.name || 'cropped.jpg', { type: 'image/jpeg' });
                    if ((from ==='expenseEdit' || from ==='rentPaymentEdit') && onImageSelected) {
                        onImageSelected(file);
                    } else {
                        if (from === 'expenseNew') {
                            navigate('/expenses/new', { state: { imageFile: file } });
                        } else if (from === 'rentPaymentNew') {
                            navigate('/rent-payments/new', { state: { imageFile: file } });
                        }
                    }
                });
        }
        handleCloseModal();
    }

    return (
        <>
            <Button
                color={buttonColor || "warning"}
                onClick={() => !isProcessing && fileInputRef.current.click()}
                disabled={isProcessing}
            >
                {isProcessing ? (<><Spinner size="sm" className="me-2" /> Processing</>) : (buttonText || 'Upload Image')}
            </Button>
            <input onChange={handleShowImage} multiple={false} ref={fileInputRef} type="file" hidden/>

            <Modal isOpen={modalOpen} toggle={handleCloseModal} size="md">
                <ModalHeader toggle={handleCloseModal}>Crop Image
                    <Button style={{paddingTop: '0px', marginLeft: '10px'}} size="sm" color="primary" onClick={doStuff}>Done Cropping</Button>
                </ModalHeader>
                <ModalBody>
                    { sourceImage ? (
                    <>
                        <ReactCrop
                            crop={crop}
                            onChange={c => setCrop(c)}
                            onComplete={c => setCompletedCrop(c)}>
                            <img
                                style={{objectFit: 'cover', maxHeight:'100vh', maxWidth:'100%'}}
                                ref={imageRef}
                                src={URL.createObjectURL(sourceImage)}
                                alt="Source"
                            />
                        </ReactCrop>

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

export default ImageModal;