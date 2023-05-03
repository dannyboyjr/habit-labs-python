import React, { useEffect } from 'react';
import { useModal } from '../context/Modal';

function OpenModal({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
  isImage,
  className,
  autoOpen // new prop: a boolean value to control whether the modal should open automatically
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (onButtonClick) onButtonClick();
  };

  // Use the useEffect hook to open the modal automatically
  useEffect(() => {
    if (autoOpen) {
      onClick();
    }
  }, [autoOpen]);

  return (
    <>
      {isImage ? (
        <img onClick={onClick} className={className} src={buttonText} alt="oops" />
      ) : (
        <button onClick={onClick}>{buttonText}</button>
      )}
    </>
  );
}

export default OpenModal;
