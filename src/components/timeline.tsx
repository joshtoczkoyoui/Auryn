import React, { forwardRef, useRef, useEffect, useImperativeHandle } from 'react';
import { TimelineRef, TimelineRefProps } from '@youi/react-native-youi';

interface TimelineProps extends TimelineRefProps {
  autoplay?: boolean;
}

export interface TimelineType {
  play: (seek?: number) => Promise<undefined>;
  start(): void;
  stop(): void;
  pause(): void;
  abort(): void;
  seek(percentage: number | string): void;
}

export const Timeline = forwardRef<TimelineType, TimelineProps>(
  ({ name, loop, direction = 'forward', onCompleted, autoplay = false, ...rest }, ref) => {
    const timelineRef = useRef<TimelineRef>(null);

    type ResolveType = () => void;
    const resolve = useRef<ResolveType | null>(null);

    useImperativeHandle(ref, () => ({
      play: (seek = 0) =>
        new Promise((resolveArg) => {
          resolve.current = resolveArg;
          if (seek) timelineRef.current?.seek(direction === 'forward' ? seek : 1 - seek);
          else timelineRef.current?.play();
        }),
      stop: () =>
        new Promise((resolveArg) => {
          resolve.current = resolveArg;
          timelineRef.current?.stop();
        }),

      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      start: timelineRef.current!.start,
      pause: timelineRef.current!.pause,
      abort: timelineRef.current!.abort,
      seek: timelineRef.current!.seek,
      /* eslint-enable @typescript-eslint/no-non-null-assertion */
    }));

    useEffect(() => {
      if (autoplay) timelineRef.current?.play();
    }, [autoplay]);

    const onCompletedInner = () => {
      if (!loop) resolve.current?.();

      onCompleted?.();
    };

    return (
      <TimelineRef
        {...rest}
        name={name}
        ref={timelineRef}
        direction={direction}
        loop={loop || name.toLowerCase() === "loop"}
        onCompleted={onCompletedInner}
      />
    );
  },
);
Timeline.displayName = 'Timeline';
