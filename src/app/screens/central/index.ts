/* Copyright (C) 2018 The Manyverse Authors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import xs, {Stream} from 'xstream';
import {StateSource, Reducer} from '@cycle/state';
import {ReactElement} from 'react';
import isolate from '@cycle/isolate';
import {ReactSource} from '@cycle/react';
import {Command as AlertCommand} from 'cycle-native-alert';
import {Toast, Duration as ToastDuration} from '../../drivers/toast';
import {NetworkSource} from '../../drivers/network';
import {Command, NavSource} from 'cycle-native-navigation';
import {SSBSource, Req} from '../../drivers/ssb';
import {DialogSource} from '../../drivers/dialogs';
import {publicTab, Sinks as PublicTabSinks} from './public-tab/index';
import {
  connectionsTab,
  Sinks as ConnectionsTabSinks,
} from './connections-tab/index';
import {topBar, Sinks as TBSinks} from './top-bar';
import intent from './intent';
import model, {
  State,
  publicTabLens,
  connectionsTabLens,
  topBarLens,
} from './model';
import view from './view';
import navigation from './navigation';
import sampleCombine from 'xstream/extra/sampleCombine';

export type Sources = {
  screen: ReactSource;
  navigation: NavSource;
  network: NetworkSource;
  state: StateSource<State>;
  dialog: DialogSource;
  ssb: SSBSource;
};

export type Sinks = {
  screen: Stream<ReactElement<any>>;
  navigation: Stream<Command>;
  alert: Stream<AlertCommand>;
  state: Stream<Reducer<any>>;
  ssb: Stream<Req>;
  clipboard: Stream<string>;
  toast: Stream<Toast>;
};

export const navOptions = {
  topBar: {
    visible: false,
    drawBehind: true,
    hideOnScroll: false,
    animate: false,
    borderHeight: 0,
    elevation: 0,
    height: 0,
  },
};

export function central(sources: Sources): Sinks {
  const topBarSinks: TBSinks = isolate(topBar, {
    '*': 'topBar',
    state: topBarLens,
  })(sources);

  const actions = intent(sources.screen, sources.navigation);

  const scrollToTop$ = actions.changeTab$
    .compose(sampleCombine(sources.state.stream))
    .filter(([i, state]) => state.currentTab === 0 && i === 0)
    .mapTo(null);

  const fabPress$: Stream<string> = sources.screen
    .select('fab')
    .events('pressItem');

  const publicTabSinks: PublicTabSinks = isolate(publicTab, {
    state: publicTabLens,
    '*': 'publicTab',
  })({...sources, scrollToTop: scrollToTop$, fab: fabPress$});

  const connectionsTabSinks: ConnectionsTabSinks = isolate(connectionsTab, {
    state: connectionsTabLens,
    '*': 'connectionsTab',
  })({...sources, fab: fabPress$});

  const fabProps$ = sources.state.stream
    .map(
      state =>
        state.currentTab === 0 ? publicTabSinks.fab : connectionsTabSinks.fab,
    )
    .flatten();

  const command$ = navigation(
    {openDrawer$: topBarSinks.menuPress},
    xs.merge(publicTabSinks.navigation, connectionsTabSinks.navigation),
  );

  const centralReducer$ = model(actions, sources.ssb);

  const reducer$ = xs.merge(
    centralReducer$,
    publicTabSinks.state,
    connectionsTabSinks.state,
  ) as Stream<Reducer<State>>;

  const vdom$ = view(
    sources.state.stream,
    fabProps$,
    topBarSinks.screen,
    publicTabSinks.screen,
    connectionsTabSinks.screen,
  );

  const inviteToast$: Stream<
    Toast
  > = sources.ssb.acceptInviteResponse$.map(res => {
    if (res === true)
      return {
        type: 'show' as 'show',
        message: '\u2713 Invite accepted',
        duration: ToastDuration.SHORT,
      };
    else
      return {
        type: 'show' as 'show',
        message: '\u2717 Invite rejected. Are you sure it was correct?',
        duration: ToastDuration.LONG,
      };
  });
  const toast$ = xs.merge(inviteToast$, publicTabSinks.toast);

  return {
    screen: vdom$,
    state: reducer$,
    navigation: command$,
    alert: connectionsTabSinks.alert,
    ssb: publicTabSinks.ssb,
    clipboard: publicTabSinks.clipboard,
    toast: toast$,
  };
}
