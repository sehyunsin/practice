// components/Modal.js
import React from 'react';
import styles from './Modal.module.css';

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          닫기
        </button>
        {children}
      </div>
    </div>
  );
}




// components/Modal.module.css
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 400px;
    width: 100%;
    text-align: center;
  }
  
  .closeButton {
    background: #f44336;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 4px;
  }
  



/*   pages/index.js */

import React, { useState } from 'react';
import Modal from '../components/Modal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <h1>React 모달 창</h1>
      <button onClick={openModal}>모달 열기</button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2>모달 내용</h2>
        <p>React로 만든 간단한 모달 창입니다.</p>
      </Modal>
    </div>
  );
}
