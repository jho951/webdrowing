import { useState, useEffect } from 'react';

function useImageUrl(src) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!src) return;
    let objectUrl = null;
    let active = true;
    async function fetchImage() {
      const response = await fetch(src);
      const blob = await response.blob();
      objectUrl = URL.createObjectURL(blob);
      if (active) setUrl(objectUrl);
    }
    fetchImage();
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  return url;
}

export default useImageUrl;
