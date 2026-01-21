import { useState, useEffect, useRef, RefObject } from 'react';
import type { Position } from './types';

export const useDraggable = (
  elementRef: RefObject<HTMLElement>,
  handleSelector: string = '.drag-handle'
) => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const positionRef = useRef<Position>({ x: 0, y: 0 });
  const dragStartPos = useRef<Position>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // 如果元素本身有 drag-handle class，直接使用元素；否則查找子元素
    const handle = element.classList.contains(handleSelector.replace('.', ''))
      ? element
      : (element.querySelector(handleSelector) as HTMLElement);

    if (!handle) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      setIsDragging(true);
      dragStartPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;

      const newPosition = {
        x: positionRef.current.x + deltaX,
        y: positionRef.current.y + deltaY
      };

      // 使用 requestAnimationFrame 優化性能
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        positionRef.current = newPosition;
        element.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px)`;
      });
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
        // 更新 React 狀態，以便保存位置
        setPosition({ ...positionRef.current });
        dragStartPos.current = { x: 0, y: 0 };
      }
    };

    handle.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      handle.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [elementRef, handleSelector]);

  return { position, isDragging };
};
