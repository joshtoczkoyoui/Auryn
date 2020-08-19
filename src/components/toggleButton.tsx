import React, { forwardRef, useEffect, useRef } from 'react';
import { ButtonRef, FocusManager, RefProps } from '@youi/react-native-youi';
import { Timeline } from '.';
import useSharedForwardedRef from './useSharedForwardedRef';
import { AurynHelper } from '../aurynHelper';
import { TimelineType } from './timeline';

export type ToggleButtonPress = (index: number) => void;

export interface ToggleButtonProps extends RefProps {
  index?: number;
  toggled?: boolean;
  onPress?: ToggleButtonPress;
  focusOnMount?: boolean;
}

// forwardRef allows parent components to take a ref to this component for the purposes of e.g. taking focus.
// Since it's a functional component, it doesn't have an instance and therefore can't provide a ref to itself.
// forwardRef allows us to point the ref (i.e. "forward") to the internal ButtonRef's ref.
// Docs: https://reactjs.org/docs/forwarding-refs.html
// Because we also want to make use of this ref internally (focusOnMount), we use useSharedForwardedRef (see definition for more info).
export const ToggleButton = forwardRef<ButtonRef, ToggleButtonProps>(
  (
    { name, index = -1, toggled = false, onPress = () => {}, focusOnMount = false, focusable, visible, children },
    ref,
  ) => {
    const buttonRef = useSharedForwardedRef(ref);

    useEffect(() => {
      // setTimeout is a hack to delay until the SceneNode is ready to receive focus
      if (focusOnMount) setTimeout(() => FocusManager.focus(buttonRef.current), 0);
    }, []);

    const toggleOnTimeline = useRef<TimelineType>(null);
    const toggleOffTimeline = useRef<TimelineType>(null);

    useEffect(() => {
      if (toggled || !AurynHelper.isRoku) toggleOnTimeline.current?.play();
      else toggleOffTimeline.current?.play();
    }, [toggled]);

    return (
      <ButtonRef name={name} ref={buttonRef} visible={visible} focusable={focusable} onPress={() => onPress(index)}>
        <Timeline
          name="Toggle-On"
          direction={toggled || AurynHelper.isRoku ? 'forward' : 'reverse'}
          ref={toggleOnTimeline}
        />
        {AurynHelper.isRoku ? <Timeline name="Toggle-Off" ref={toggleOffTimeline} /> : null}
        {children}
      </ButtonRef>
    );
  },
);
// When using forwardRef, we need to give the component an explicit displayName
ToggleButton.displayName = 'ToggleButton';
