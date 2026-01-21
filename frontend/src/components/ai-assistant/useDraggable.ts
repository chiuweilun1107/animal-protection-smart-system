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
  const hasMovedRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // 如果元素本身有 drag-handle class，直接使用元素；否則查找子元素
    const handle = element.classList.contains(handleSelector.replace('.', ''))
      ? element
      : (element.querySelector(handleSelector) as HTMLElement);

    if (!handle) return;

    const handlePointerDown = (e: PointerEvent) => {
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      elementStartPos.current = { ...positionRef.current };
      hasMovedRef.current = false;
      pointerIdRef.current = e.pointerId;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (pointerIdRef.current !== e.pointerId) return;

      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;

      // 只有移動超過 5px 才算真正拖曳
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (distance < 5) return;

      // 第一次檢測到拖曳時才 capture
      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        setIsDragging(true);
        (element as any).setPointerCapture(e.pointerId);
      }

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
      if (pointerIdRef.current !== e.pointerId) return;

      if (hasMovedRef.current && element.hasPointerCapture(e.pointerId)) {
        element.releasePointerCapture(e.pointerId);

        // 更新 React 狀態以保存最終位置
        setPosition({ ...positionRef.current });
        setIsDragging(false);
      }

      hasMovedRef.current = false;
      pointerIdRef.current = null;
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
