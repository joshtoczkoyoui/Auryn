import { Ref, useEffect, useRef } from 'react';

// This is a workaround to both expose a forwardRef and make use of it in a functional component with Hooks.
// Currently there is no API to do that natively, as described by this post:
// https://itnext.io/reusing-the-ref-from-forwardref-with-react-hooks-4ce9df693dd
//
// The solution in the article isn't as elegant as the one proposed by Adam Pietrasiak in the article's comments:
// https://gist.github.com/pie6k/b4717f392d773a71f67e110b42927fea#file-useshareforwardedref-tsx-L11

export default function useSharedForwardedRef<T>(forwardedRef: Ref<T>) {
  // The final ref that will share its value with the forwarded ref
  // This is the one we will attach to components
  const innerRef = useRef<T>(null);

  useEffect(() => {
    // After every render, try to share the current ref value with the forwarded ref
    if (!forwardedRef) return;

    if (typeof forwardedRef === 'function') {
      forwardedRef(innerRef.current);
    } else {
      // By default forwardedRef.current is readonly. Let's ignore it.
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      forwardedRef.current = innerRef.current;
    }
  });

  return innerRef;
}
