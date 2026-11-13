import { lazy, Suspense } from 'react';
import type { Drone3DCanvasProps } from './Drone3DCanvas';

const Drone3DCanvas = lazy(() =>
  import('./Drone3DCanvas').then((module) => ({ default: module.Drone3DCanvas }))
);

export function LazyDrone3DCanvas(props: Drone3DCanvasProps) {
  return (
    <Suspense
      fallback={
        <div
          className={`drone-3d-canvas-wrap ${props.className ?? ''}`}
          role="status"
          aria-label="Loading interactive agricultural drone"
          style={{
            width: '100%',
            height: '100%',
            minHeight: props.variant === 'showcase' ? '380px' : undefined,
          }}
        />
      }
    >
      <Drone3DCanvas {...props} />
    </Suspense>
  );
}
