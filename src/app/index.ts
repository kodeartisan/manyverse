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

export enum Screens {
  Central = 'Manyverse.Central',
  Drawer = 'Manyverse.Drawer',
  Compose = 'Manyverse.Compose',
  Thread = 'Manyverse.Thread',
  InvitePaste = 'Manyverse.Invite.Paste',
  InviteCreate = 'Manyverse.Invite.Create',
  Profile = 'Manyverse.Profile',
  ProfileEdit = 'Manyverse.Profile.Edit',
  RawDatabase = 'Manyverse.RawDatabase',
  RawMessage = 'Manyverse.RawMessage',
}

import onionify from 'cycle-onionify';
import {makeKeyboardDriver} from 'cycle-native-keyboard';
import {alertDriver} from 'cycle-native-alert';
import {linkingDriver} from 'cycle-native-linking';
import {makeToastDriver} from './drivers/toast';
import {notificationDriver} from 'cycle-native-android-local-notification';
import {ssbDriver} from './drivers/ssb';
import {shareDriver} from 'cycle-native-share';
import {makeNetworkDriver} from './drivers/network';
import {dialogDriver} from './drivers/dialogs';
import {makeActivityLifecycleDriver} from './drivers/lifecycle';
import {central, navOptions as centralNavOpts} from './screens/central/index';
import {drawer} from './screens/drawer/index';
import {compose} from './screens/compose/index';
import {thread} from './screens/thread/index';
import {pasteInvite} from './screens/invite-paste/index';
import {profile} from './screens/profile/index';
import {editProfile} from './screens/profile-edit/index';
import {createInvite} from './screens/invite-create';
import {rawDatabase} from './screens/raw-db/index';
import {rawMessage} from './screens/raw-msg/index';
import {Palette} from './global-styles/palette';
import {Typography} from './global-styles/typography';

export const screens: {[k in Screens]?: (so: any) => any} = {
  [Screens.Central]: onionify(central),
  [Screens.Drawer]: onionify(drawer),
  [Screens.Compose]: onionify(compose),
  [Screens.Thread]: onionify(thread),
  [Screens.InvitePaste]: onionify(pasteInvite),
  [Screens.InviteCreate]: onionify(createInvite),
  [Screens.Profile]: onionify(profile),
  [Screens.ProfileEdit]: onionify(editProfile),
  [Screens.RawDatabase]: rawDatabase,
  [Screens.RawMessage]: rawMessage,
};

export const drivers = {
  alert: alertDriver,
  keyboard: makeKeyboardDriver(),
  linking: linkingDriver,
  ssb: ssbDriver,
  share: shareDriver,
  lifecycle: makeActivityLifecycleDriver(),
  network: makeNetworkDriver(),
  notification: notificationDriver,
  dialog: dialogDriver,
  toast: makeToastDriver(),
};

export const layout = {
  root: {
    sideMenu: {
      left: {
        visible: false,
        component: {name: Screens.Drawer},
      },
      center: {
        stack: {
          id: 'mainstack',
          children: [
            {
              component: {
                name: Screens.Central,
                options: centralNavOpts,
              },
            },
          ],
        },
      },
    },
  },
};

export const defaultNavOptions = {
  statusBar: {
    visible: true,
    backgroundColor: Palette.brand.backgroundDarker,
    style: 'light',
  },
  layout: {
    backgroundColor: Palette.brand.voidBackground,
    orientation: ['portrait', 'landscape'],
  },
  topBar: {
    visible: false,
    drawBehind: true,
    hideOnScroll: false,
    animate: false,
    height: 0,
    borderHeight: 0,
    elevation: 0,
    buttonColor: Palette.white,
    background: {
      color: Palette.brand.background,
    },
    title: {
      text: '',
      color: Palette.white,
      fontSize: Typography.fontSizeLarge,
    },
  },
};
