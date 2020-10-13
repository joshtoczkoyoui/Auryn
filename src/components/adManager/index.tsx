import React, { Component, createRef, RefObject } from 'react';
import { View, StyleSheet } from 'react-native';

import PauseAd from './pause-ad';
import { AdContextType, AdContext, AdState } from './context';
import LowerThirdAd from './lower-third-ad';

interface AdManagerProps {
  pauseAdCompositionName?: string;
  pauseAdClosed: () => void;
}

class AdManager extends Component<AdManagerProps> {
  static contextType = AdContext;
  context!: AdContextType;
  
  static defaultProps = {
    pauseAdClosed: () => {},
  };

  private pauseAdRef: RefObject<PauseAd> = createRef();

  handleOnClose = () => this.context.setPauseAdState(AdState.closed);

  renderPauseAd = () => {
    const { pauseAdCompositionName } = this.props;

    if (pauseAdCompositionName === undefined) return null;

    this.context.setPauseAdEnabled(true);

    return <PauseAd ref={this.pauseAdRef} name={pauseAdCompositionName} onClose={this.handleOnClose} />;
  };

  renderLowerThirdAd = () => {
    return <LowerThirdAd />;
  };

  render() {
    return (
      <View style={styles.container}>
        {this.renderPauseAd()}
        {this.props.children}
        {this.renderLowerThirdAd()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    ...StyleSheet.absoluteFillObject,
  },
});

export default AdManager;
