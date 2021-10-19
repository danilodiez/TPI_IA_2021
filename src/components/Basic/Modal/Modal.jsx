import React from 'react';
import Modal from 'react-modal';
import Button from '../Button/Button';

const styles = {
  modal: {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '18rem',
      fontFamily: 'Roboto-Black',
    },
  },
  messageWrapper: {
    padding: '2rem 1rem',
    textAlign: 'center',
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: 'red',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
};

const BaseModal = ({
  isOpen,
  closeModal,
  message = 'message',
  showButtons = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Example Modal"
      style={styles.modal}
      ariaHideApp={false}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          fill="currentColor"
          className="bi bi-x"
          viewBox="0 0 16 16"
          onClick={closeModal}
          style={{ cursor: 'pointer' }}
        >
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
        </svg>
      </div>
      <div>
        <div style={styles.messageWrapper}>{message}</div>
      </div>
    </Modal>
  );
};

export default BaseModal;
