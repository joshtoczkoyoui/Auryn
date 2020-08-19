import React, { useRef, useState, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { Composition, ButtonRef, TextRef, FocusManager } from '@youi/react-native-youi';
import { Timeline, BackButton } from '../components';
import { withNavigationFocus, NavigationEventSubscription, NavigationFocusInjectedProps } from 'react-navigation';
import { AurynHelper } from '../aurynHelper';
import { TimelineType } from '../components/timeline';

type ProfileProps = NavigationFocusInjectedProps;

const ProfileScreen = (props: ProfileProps) => {
  const [activeProfileIndex, setActiveProfileIndex] = useState(1);

  const activeProfileButtonRef = useRef<ButtonRef | null>(null);
  const outTimeline = useRef<TimelineType | null>(null);

  useEffect(() => {
    if (activeProfileButtonRef.current) FocusManager.focus(activeProfileButtonRef.current);
  }, []);

  useEffect(() => {
    const focusListener = props.navigation.addListener('didFocus', () => {
      BackHandler.addEventListener('hardwareBackPress', navigateBack);
    });
    const blurListener = props.navigation.addListener('didBlur', () =>
      BackHandler.removeEventListener('hardwareBackPress', navigateBack),
    );

    return () => {
      focusListener.remove();
      blurListener.remove();
    };
  });

  const navigateBack = async () => {
    await outTimeline.current?.play();

    if (AurynHelper.isRoku) props.navigation.navigate({ routeName: 'Lander' });
    else props.navigation.goBack(null);

    return true;
  };

  const buttons = Array.from(Array(3), (_, i) => (
    <ButtonRef
      key={i}
      name={`Btn-Profile${i + 1}`}
      onPress={() => setActiveProfileIndex(i + 1)}
      ref={i + 1 === activeProfileIndex ? activeProfileButtonRef : null}
    >
      <TextRef name="Active User" text={activeProfileIndex === i + 1 ? 'Active User' : ''} />
      <Timeline name="Toggle-On" autoplay={activeProfileIndex === i + 1} />
      <Timeline name="Toggle-Off" autoplay={activeProfileIndex !== i + 1} />
    </ButtonRef>
  ));

  return (
    <Composition source="Auryn_Profile">
      <BackButton focusable={props.isFocused} onPress={navigateBack} />
      <Timeline name="ProfileIn" autoplay />
      <Timeline name="ProfileOut" ref={outTimeline} />
      {buttons}
    </Composition>
  );
};

interface ProfileState {
  activeButtonIndex: number;
}

class ProfileScreenOld extends React.Component<ProfileProps, ProfileState> {
  state = { activeButtonIndex: 1 };

  focusListener!: NavigationEventSubscription;

  blurListener!: NavigationEventSubscription;

  outTimeline = React.createRef<TimelineType>();

  activeButton = React.createRef<ButtonRef>();

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      BackHandler.addEventListener('hardwareBackPress', this.navigateBack);
    });
    this.blurListener = this.props.navigation.addListener('didBlur', () =>
      BackHandler.removeEventListener('hardwareBackPress', this.navigateBack),
    );

    if (this.activeButton.current) FocusManager.focus(this.activeButton.current);
  }

  componentWillUnmount() {
    this.focusListener.remove();
    this.blurListener.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.navigateBack);
  }

  navigateBack = async () => {
    await this.outTimeline.current?.play();

    if (AurynHelper.isRoku) this.props.navigation.navigate({ routeName: 'Lander' });
    else this.props.navigation.goBack(null);

    return true;
  };

  onPress = (i: number) => this.setState({ activeButtonIndex: i });

  render = () => {
    const buttons = Array(3)
      .fill(null)
      .map((_, i) => (
        <ButtonRef
          key={i}
          name={`Btn-Profile${i + 1}`}
          onPress={() => this.onPress(i + 1)}
          ref={i + 1 === this.state.activeButtonIndex ? this.activeButton : null}
        >
          <TextRef name="Active User" text={this.state.activeButtonIndex === i + 1 ? 'Active User' : ''} />
          <Timeline
            name="Toggle-On"
            autoplay={this.state.activeButtonIndex === i + 1}
          />
          <Timeline name="Toggle-Off" autoplay={this.state.activeButtonIndex !== i + 1} />
        </ButtonRef>
      ));

    return (
      <Composition source="Auryn_Profile">
        <BackButton focusable={this.props.isFocused} onPress={this.navigateBack} />
        <Timeline name="ProfileIn" autoplay />
        <Timeline name="ProfileOut" ref={this.outTimeline} />
        {buttons}
      </Composition>
    );
  };
}

export const Profile = withNavigationFocus(ProfileScreen);
