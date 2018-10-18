/**
 * Manyverse is a mobile app for Secure Scuttlebutt networks
 *
 * Copyright (C) 2017 Andre 'Staltz' Medeiros
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import xs, {Stream} from 'xstream';
import isolate from '@cycle/isolate';
import {ReactElement} from 'react';
import {KeyboardSource} from 'cycle-native-keyboard';
import {ReactSource} from '@cycle/react';
import {StateSource, Reducer} from '@cycle/state';
import {SSBSource, Req} from '../../drivers/ssb';
import {Command, NavSource} from 'cycle-native-navigation';
import {LifecycleEvent} from '../../drivers/lifecycle';
import {topBar, Sinks as TBSinks} from './top-bar';
import intent from './intent';
import model, {State, topBarLens} from './model';
import view from './view';
import ssb from './ssb';
import navigation from './navigation';

export type Sources = {
  screen: ReactSource;
  navigation: NavSource;
  keyboard: KeyboardSource;
  lifecycle: Stream<LifecycleEvent>;
  state: StateSource<State>;
  ssb: SSBSource;
};

export type Sinks = {
  screen: Stream<ReactElement<any>>;
  navigation: Stream<Command>;
  state: Stream<Reducer<State>>;
  keyboard: Stream<'dismiss'>;
  ssb: Stream<Req>;
};

export const navOptions = {
  topBar: {
    visible: false,
    height: 0,
  },
};

export function compose(sources: Sources): Sinks {
  const topBarSinks: TBSinks = isolate(topBar, {
    '*': 'topBar',
    onion: topBarLens,
  })(sources);

  const actions = intent(
    sources.screen,
    sources.navigation,
    topBarSinks.done,
    sources.state.stream,
    sources.keyboard,
    sources.lifecycle,
  );
  const vdom$ = view(sources.state.stream, topBarSinks.screen);
  const command$ = navigation(actions);
  const reducer$ = model(actions, sources.ssb);
  const newContent$ = ssb(actions);
  const dismiss$ = xs
    .merge(actions.publishMsg$, topBarSinks.back)
    .mapTo('dismiss' as 'dismiss');

  return {
    keyboard: dismiss$,
    screen: vdom$,
    navigation: command$,
    state: reducer$,
    ssb: newContent$,
  };
}
