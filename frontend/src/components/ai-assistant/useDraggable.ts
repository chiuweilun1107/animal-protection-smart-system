import { useState, useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { Position } from './types';

export const useDraggable = (
  elementRef: RefObject<HTMLElement | null>,
  handleSelector: string = '.drag-handle'
) => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const positionRef = useRef<Position>({ x: 0, y: 0 });
  const dragStartPos = useRef<Position>({ x: 0, y: 0 });
  const elementStartPos = useRef<Position>({ x: 0, y: 0 });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // 如果元素本身有 drag-handle class，直接使用元素；否則查找子元素
    const handle = element.classList.contains(handleSelector.replace('.', ''))
      ? element
      : (element.querySelector(handleSelector) as HTMLElement);

    if (!handle) return;

    const handlePointerDown = (e: PointerEvent) => {
      // 使用 setPointerCapture 綁定指針到主元素
      (element as any).setPointerCapture(e.pointerId);

      setIsDragging(true);
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      elementStartPos.current = { ...positionRef.current };
    };

    const handlePointerMove = (e: PointerEvent) => {
      // 只有當元素捕獲了指針時才更新
      if (!element.hasPointerCapture(e.pointerId)) return;

      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;

      const newPos = {
        x: elementStartPos.current.x + deltaX,
        y: elementStartPos.current.y + deltaY
      };

      // 直接更新 DOM，不觸發 React 重新渲染
      // 使用 will-change 啟用硬體加速
      element.style.willChange = 'transform';
      element.style.transform = `translate(${newPos.x}px, ${newPos.y}px)`;

      // 只有在移動時才更新狀態
      positionRef.current = newPos;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (element.hasPointerCapture(e.pointerId)) {
        element.releasePointerCapture(e.pointerId);

        // 更新 React 狀態以保存最終位置
        setPosition({ ...positionRef.current });
        setIsDragging(false);
      }
    };

    handle.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointercancel', handlePointerUp);

    return () => {
      handle.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [elementRef, handleSelector]);

  return { position, isDragging };
};
