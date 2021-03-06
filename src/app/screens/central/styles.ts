/* Copyright (C) 2018 The Manyverse Authors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {StyleSheet} from 'react-native';
import {Palette} from '../../global-styles/palette';
import {Dimensions} from '../../global-styles/dimens';
import {Typography} from '../../global-styles/typography';

const _tabItem = {
  backgroundColor: Palette.brand.background,
  paddingTop: Dimensions.verticalSpaceNormal,
  paddingBottom: Dimensions.verticalSpaceNormal,
};

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.white,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Palette.brand.background,
    minHeight: Dimensions.toolbarAndroidHeight,
  },

  headerIcon: {
    width: Dimensions.iconSizeNormal + Dimensions.horizontalSpaceBig * 2,
    height: Dimensions.iconSizeNormal + Dimensions.verticalSpaceNormal * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    marginLeft: Dimensions.horizontalSpaceNormal,
    fontFamily: Typography.fontFamilyReadableText,
    color: Palette.white,
    fontSize: Typography.fontSizeLarge,
    fontWeight: 'bold',
  },

  indicatorViewPager: {
    flex: 1,
    flexDirection: 'column-reverse',
    backgroundColor: Palette.brand.backgroundDarker,
  },

  tabItem: _tabItem,

  tabItemSelected: {
    ..._tabItem,
    borderBottomWidth: 4,
    borderBottomColor: Palette.brand.backgroundLighterContrast,
  },

  pageContainer: {
    backgroundColor: Palette.brand.voidBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },

  pagePlaceholder: {
    fontSize: Typography.fontSizeLarge,
    fontFamily: Typography.fontFamilyReadableText,
    textAlign: 'center',
  },

  updatesDot: {
    backgroundColor: Palette.white,
    width: 7,
    height: 7,
    position: 'absolute',
    top: -4,
    right: 1,
    borderRadius: 4,
  },

  syncingProgressBar: {
    position: 'absolute',
    left: 2,
    right: 2,
    bottom: 4.9,
  },
});

export const iconProps = {
  headerIcon: {
    size: Dimensions.iconSizeNormal,
    color: Palette.white,
  },

  tab: {
    size: Dimensions.iconSizeNormal,
    color: Palette.brand.backgroundDarkerContrast,
  },

  tabSelected: {
    size: Dimensions.iconSizeNormal,
    color: Palette.white,
  },
};

export const topBarTitle = {
  color: Palette.white,
  fontSize: Typography.fontSizeLarge,
};
