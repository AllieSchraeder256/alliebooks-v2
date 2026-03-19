import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonGroup, Modal, ModalHeader, ModalBody, Spinner, UncontrolledTooltip } from 'reactstrap';
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

const ImageModal = ({from, buttonText, buttonColor, onImageSelected, isProcessing = false, showNoImageOption = false}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [sourceImage, setSourceImage] = useState(null);
    const [objectUrl, setObjectUrl] = useState(null);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);
    const [showMetadata, setShowMetadata] = useState(false);

    // track a constrained available height so very tall images don't push the modal off-screen
    const [availableHeight, setAvailableHeight] = useState(() => {
        if (typeof window !== 'undefined') {
            return Math.max(200, window.innerHeight - 160);
        }
        return 600;
    });

    const fileInputRef = useRef(null); // For file input
    const imageRef = useRef(null); // For image element
    const navigate = useNavigate();

    useEffect(() => {
        // update available height on resize so modal contents stay visible
        function updateAvailableHeight() {
            const offset = 160; // conservative offset for modal header/footer and margins
            const h = Math.max(200, window.innerHeight - offset);
            setAvailableHeight(h);
        }
        updateAvailableHeight();
        window.addEventListener('resize', updateAvailableHeight);
        return () => window.removeEventListener('resize', updateAvailableHeight);
    }, []);

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

    // cleanup object URL on unmount
    useEffect(() => {
        return () => {
            if (objectUrl) {
                try { URL.revokeObjectURL(objectUrl); } catch (e) { /* ignore */ }
            }
        };
    }, [objectUrl]);

    const handleShowImage = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        // create and store an object URL for the blob so we can revoke it later
        const url = URL.createObjectURL(file);
        // revoke previous if present
        if (objectUrl) {
            try { URL.revokeObjectURL(objectUrl); } catch (e) { /* ignore */ }
        }
        setObjectUrl(url);
        setSourceImage(file);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSourceImage(null);
        setCompletedCrop(null);
        setCrop(null);
        setCroppedImageUrl(null);
        if (objectUrl) {
            try { URL.revokeObjectURL(objectUrl); } catch (e) { /* ignore */ }
            setObjectUrl(null);
        }
    };

    function doStuff() {
        if (completedCrop && croppedImageUrl) {
            //eslint-disable-next-line no-restricted-syntax
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

    function navigateNoImage() {
        if (from === 'expenseNew') {
            navigate('/expenses/new');
        } else if (from === 'rentPaymentNew') {
            navigate('/rent-payments/new');
        }
    }

    return (
        <>
            <ButtonGroup>
                <Button
                    id="imageCreate"
                    color={buttonColor || "warning"}
                    onClick={() => !isProcessing && fileInputRef.current.click()}
                    disabled={isProcessing}
                >
                    {isProcessing ? (<><Spinner size="sm" className="me-2" /> Processing</>) : (buttonText || 'Upload Image')}
                </Button>
                <UncontrolledTooltip target="imageCreate">
                    Create {buttonText} from uploaded image
                </UncontrolledTooltip>

                { showNoImageOption &&
                    <>
                    <Button id = "skipImageCreate" color={buttonColor || "warning"} onClick={() => navigateNoImage()}>🙈</Button>
                    <UncontrolledTooltip target="skipImageCreate">
                        {buttonText} with no image
                    </UncontrolledTooltip>
                    </>
                }
            </ButtonGroup>
            <input onChange={handleShowImage} multiple={false} ref={fileInputRef} type="file" hidden accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,application/pdf"/>

            <Modal isOpen={modalOpen} toggle={handleCloseModal} fullscreen>
                <ModalHeader toggle={handleCloseModal}>Crop Image
                    <Button style={{paddingTop: '0px', marginLeft: '10px'}} size="sm" color="primary" onClick={doStuff}>Done Cropping</Button>
                    <Button size="sm" color="link" onClick={() => setShowMetadata(!showMetadata)}>{showMetadata ? 'Hide' : 'Show'} Metadata</Button>
                        {showMetadata && <div style={{fontSize: '10px'}}>
                            Resource Id: {sourceImage.resourceId}<br />
                            Resource Type: {sourceImage.resourceType}<br />
                            File Name: {sourceImage.fileName}<br />
                            File type: {sourceImage.fileType}<br />
                            Dimensions: {sourceImage.width} x {sourceImage.height}<br />
                            Compression Quality: {sourceImage.compressionQuality}<br />
                            Created At: {new Date(sourceImage.createdAt).toLocaleString()}<br />
                        </div> }
                </ModalHeader>
                <ModalBody>
                    { sourceImage ? (
                    <>
                        <div style={{maxHeight: availableHeight, overflow: 'auto'}}>
                            <ReactCrop
                                crop={crop}
                                onChange={c => setCrop(c)}
                                onComplete={c => setCompletedCrop(c)}>
                                <img
                                    style={{objectFit: 'contain', maxHeight: availableHeight + 'px', maxWidth:'100%'}}
                                    ref={imageRef}
                                    src={objectUrl}
                                    alt="Source"
                                />
                            </ReactCrop>
                        </div>
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