import { useState } from 'react';

const FileInput = () => {
  const [loadedImage, setLoadedImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = (event) => {
    //     const img = new Image();
    //     img.onload = () => {
    //       setLoadedImage(img); // 이미지를 상태에 저장
    //       setSize({ width: img.width, height: img.height }); // 캔버스 크기만 먼저 조절
    //     };
    //     img.src = event.target.result;
    //   };
    //   reader.readAsDataURL(file);
    // }
  };

  return (
    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e)} />
  );
};

export default FileInput;

// renderImageToCanvas();
