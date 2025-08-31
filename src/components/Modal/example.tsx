import { useState } from 'react';
import { Modal } from './index';

// Example usage component
export const ModalExample: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    src: string;
  } | null>(null);

  const openModal = (title: string, src: string) => {
    setModalContent({ title, src });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <div>
      {/* Example buttons - These URLs work with iframe embedding */}
      <button 
        onClick={() => openModal('YouTube Video', 'https://www.youtube.com/embed/dQw4w9WgXcQ')}
        style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}
      >
        Open YouTube Video
      </button>
      
      <button 
        onClick={() => openModal('Wikipedia', 'https://en.wikipedia.org/wiki/RSS')}
        style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}
      >
        Open Wikipedia (RSS)
      </button>

      <button 
        onClick={() => openModal('MDN Web Docs', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe')}
        style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}
      >
        Open MDN Docs
      </button>

      <button 
        onClick={() => openModal('OpenStreetMap', 'https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik')}
        style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}
      >
        Open Map
      </button>

      {/* Example of sites that won't work (for demonstration) */}
      <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef2f2', borderRadius: '8px' }}>
        <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: '#dc2626' }}>
          These won't work (X-Frame-Options restriction):
        </p>
        <button 
          onClick={() => openModal('GitHub (Will Fail)', 'https://github.com')}
          style={{ margin: '0.25rem', padding: '0.5rem 1rem', opacity: '0.7' }}
        >
          GitHub (Blocked)
        </button>
        <button 
          onClick={() => openModal('CodePen (Will Fail)', 'https://codepen.io')}
          style={{ margin: '0.25rem', padding: '0.5rem 1rem', opacity: '0.7' }}
        >
          CodePen (Blocked)
        </button>
      </div>

      {/* Modal - Mobile first, fullscreen by default */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalContent?.title}
        src={modalContent?.src}
        showHeader={false} // Try both true and false to see the difference
      />
    </div>
  );
};

export default ModalExample;
