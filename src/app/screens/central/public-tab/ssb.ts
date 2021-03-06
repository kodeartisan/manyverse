/* Copyright (C) 2018 The Manyverse Authors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {Stream} from 'xstream';
import {toVoteContent} from '../../../../ssb/to-ssb';
import {contentToPublishReq, Req} from '../../../drivers/ssb';

export type LikeEvent = {msgKey: string; like: boolean};

export type Actions = {
  likeMsg$: Stream<LikeEvent>;
};

export default function ssb(actions: Actions): Stream<Req> {
  const toggleLikeMsg$ = actions.likeMsg$
    .map(toVoteContent)
    .map(contentToPublishReq);

  return toggleLikeMsg$;
}
