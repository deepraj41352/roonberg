import React, { useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';

function Avatar({ name }) {
  console.log('categoryName prop:', name);
  const avatarRef = useRef(null);

  useEffect(() => {
    if (avatarRef.current) {
      html2canvas(avatarRef.current).then((canvas) => {
        const dataURL = canvas.toDataURL('image/png');
        // You can now use the dataURL as needed (e.g., display, save, or send).
        console.log(dataURL);
      });
    }
  }, [name]);

  return (
    <div
      ref={avatarRef}
      style={{
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundColor: '#007bff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        fontSize: '24px',
      }}
    >
      {name[0]}
    </div>
  );
}

export default Avatar;
