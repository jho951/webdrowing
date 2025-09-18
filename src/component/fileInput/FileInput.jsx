import { useDispatch } from 'react-redux';
import { setImageSrc } from '../../redux/slice/imageSlice';

import './fileInput.css';

const FileInput = () => {
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    dispatch(setImageSrc(url));
  };

  return (
    <>
      <label htmlFor="file" className="file-label">
        붙여넣기
      </label>
      <input
        id="file"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
    </>
  );
};

export default FileInput;
