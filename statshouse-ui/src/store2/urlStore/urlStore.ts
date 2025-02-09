// Copyright 2024 V Kontakte LLC
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { produce } from 'immer';
import { getDefaultParams, type GroupKey, type PlotKey, type PlotParams, type QueryParams } from 'url2';
import { type StoreSlice } from '../createStore';
import { appHistory } from 'common/appHistory';
import { getUrl, isEmbedPath, isValidPath, type ProduceUpdate } from '../helpers';
import { mergeLeft } from 'common/helpers';
import { getUrlState } from './getUrlState';
import { type StatsHouseStore } from '../statsHouseStore';
import { type PlotType, type TimeRangeKeysTo } from 'api/enum';
import { updatePlot } from './updatePlot';
import { updateTimeRange } from './updateTimeRange';
import { updateParams } from './updateParams';
import { updatePlotType } from './updatePlotType';
import {
  timeRangePanLeft,
  timeRangePanRight,
  timeRangeZoomIn,
  timeRangeZoomOut,
  updateResetZoom,
} from './timeRangeNavigate';
import { updatePlotYLock } from './updatePlotYLock';
import { toggleGroupShow } from './toggleGroupShow';
import { updateRemovePlot } from './updateRemovePlot';

export type UrlStore = {
  params: QueryParams;
  saveParams: QueryParams;
  isEmbed: boolean;
  dashboardLayoutEdit: boolean;
  updateUrlState(): void;
  setUrlStore(next: ProduceUpdate<UrlStore>, replace?: boolean): void;
  setParams(next: ProduceUpdate<QueryParams>, replace?: boolean): void;
  setTimeRange(tr: { from: number; to: number | TimeRangeKeysTo }, replace?: boolean): void;
  setPlot(plotKey: PlotKey, next: ProduceUpdate<PlotParams>, replace?: boolean): void;
  setPlotType(plotKey: PlotKey, nextType: PlotType, replace?: boolean): void;
  setPlotYLock(plotKey: PlotKey, status: boolean, yLock?: { min: number; max: number }): void;
  resetZoom(plotKey: PlotKey): void;
  removePlot(plotKey: PlotKey): void;
  timeRangePanLeft(): void;
  timeRangePanRight(): void;
  timeRangeZoomIn(): void;
  timeRangeZoomOut(): void;
  toggleGroupShow(groupKey: GroupKey): void;
  setDashboardLayoutEdit(status: boolean): void;
  saveDashboard(): Promise<void>;
};

export const urlStore: StoreSlice<StatsHouseStore, UrlStore> = (setState, getState) => {
  let prevLocation = appHistory.location;
  let prevSearch = prevLocation.search;

  function updateUrlState() {
    getUrlState(getState().saveParams, prevLocation, getState().setUrlStore)
      .then((res) => {
        setState((s) => {
          s.isEmbed = isEmbedPath(prevLocation);
          s.params = mergeLeft(s.params, res.params);
          s.saveParams = mergeLeft(s.saveParams, res.saveParams);
        });
      })
      .finally(() => {
        getState().updatePlotsInfo();
      });
  }

  function setUrlStore(next: ProduceUpdate<StatsHouseStore>, replace: boolean = false) {
    const nextState = produce(getState(), next);
    const search = getUrl(nextState);
    if (prevSearch !== search) {
      if (replace) {
        appHistory.replace({ search });
      } else {
        appHistory.push({ search });
      }
    }
  }

  appHistory.listen(({ location }) => {
    if (prevLocation.search !== location.search || prevLocation.pathname !== location.pathname) {
      prevLocation = location;
      if (isValidPath(prevLocation)) {
        prevSearch = prevLocation.search;
        updateUrlState();
      }
    }
  });

  const saveParams = getDefaultParams();
  if (isValidPath(prevLocation)) {
    setTimeout(updateUrlState, 0);
  }
  return {
    params: saveParams,
    saveParams: saveParams,
    isEmbed: isEmbedPath(prevLocation),
    updateUrlState,
    setUrlStore,
    dashboardLayoutEdit: false,
    setParams(next: ProduceUpdate<QueryParams>, replace) {
      setUrlStore(updateParams(next), replace);
    },
    setTimeRange({ from, to }, replace) {
      setUrlStore(updateTimeRange(from, to), replace);
    },
    setPlot(plotKey, next, replace) {
      setUrlStore(updatePlot(plotKey, next), replace);
    },
    setPlotType(plotKey, nextType, replace) {
      setUrlStore(updatePlotType(plotKey, nextType), replace);
    },
    setPlotYLock(plotKey, status, yLock?: { min: number; max: number }) {
      setUrlStore(updatePlotYLock(plotKey, status, yLock));
    },
    resetZoom(plotKey: PlotKey) {
      setUrlStore(updateResetZoom(plotKey));
    },
    removePlot(plotKey: PlotKey) {
      setUrlStore(updateRemovePlot(plotKey));
    },
    timeRangePanLeft() {
      setUrlStore(timeRangePanLeft());
    },
    timeRangePanRight() {
      setUrlStore(timeRangePanRight());
    },
    timeRangeZoomIn() {
      setUrlStore(timeRangeZoomIn());
    },
    timeRangeZoomOut() {
      setUrlStore(timeRangeZoomOut());
    },
    toggleGroupShow(groupKey) {
      setUrlStore(toggleGroupShow(groupKey));
    },
    setDashboardLayoutEdit(status) {
      setState((s) => {
        s.dashboardLayoutEdit = status;
      });
    },
    async saveDashboard() {
      //todo: save dash
    },
  };
};
