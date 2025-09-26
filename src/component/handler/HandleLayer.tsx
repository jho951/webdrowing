import { useImperativeHandle, useRef, forwardRef } from 'react';

interface HandleLayerProps {
  className?: string;
}

/**
 * @description 가장 위에 위치하는 상호작용용 레이어
 */
const HandleLayer = forwardRef<HTMLDivElement, HandleLayerProps>(
  ({ className = '' }, ref) => {
    const localRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => localRef.current as HTMLDivElement);

    return (
      <div
        ref={localRef}
        className={`handler ${className}`}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: '9999',
        }}
      >
        <div
          className="handler-content"
          style={{ width: '100%', height: '100%' }}
        ></div>
      </div>
    );
  }
);

export default HandleLayer;
