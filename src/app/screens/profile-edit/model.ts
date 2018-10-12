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
import {Reducer} from 'cycle-onionify';
import {About, FeedId} from 'ssb-typescript';
import {Image} from 'react-native-image-crop-picker';

export type Props = {
  about: About & {id: FeedId};
};

export type State = {
  about: About & {id: FeedId};
  newName?: string;
  newAvatar?: string;
  newDescription?: string;
};

export type Actions = {
  changeName$: Stream<string>;
  changeAvatar$: Stream<Image>;
  changeDescription$: Stream<string>;
};

export default function model(
  props$: Stream<Props>,
  actions: Actions,
): Stream<Reducer<State>> {
  const propsReducer$ = props$.map(
    props =>
      function propsReducer(): State {
        return {
          about: props.about,
        };
      },
  );

  const changeNameReducer$ = actions.changeName$.map(
    newName =>
      function changeNameReducer(prev: State): State {
        return {...prev, newName};
      },
  );

  const changeAvatarReducer$ = actions.changeAvatar$.map(
    image =>
      function changeDescriptionReducer(prev: State): State {
        return {...prev, newAvatar: image.path.replace('file://', '')};
      },
  );

  const changeDescriptionReducer$ = actions.changeDescription$.map(
    newDescription =>
      function changeDescriptionReducer(prev: State): State {
        return {...prev, newDescription};
      },
  );

  return xs.merge(
    propsReducer$,
    changeNameReducer$,
    changeAvatarReducer$,
    changeDescriptionReducer$,
  );
}
