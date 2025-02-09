// Copyright 2024 V Kontakte LLC
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { memo, useCallback } from 'react';
import { SelectMetric } from 'components';
import { useStatsHouseShallow } from 'store2';
import { type PlotKey } from 'url2';

export type PlotControlMetricNameProps = {
  plotKey: PlotKey;
};
export function _PlotControlMetricName({ plotKey }: PlotControlMetricNameProps) {
  const { metricName, setPlot } = useStatsHouseShallow(({ params: { plots }, setPlot }) => ({
    metricName: plots[plotKey]?.metricName,
    setPlot,
  }));
  const onChange = useCallback(
    (value?: string | string[]) => {
      if (typeof value !== 'string') {
        return;
      }
      setPlot(plotKey, (p) => {
        p.metricName = value;
        p.customName = '';
        p.groupBy = [];
        p.filterIn = {};
        p.filterNotIn = {};
        p.customDescription = '';
      });
    },
    [plotKey, setPlot]
  );
  return <SelectMetric value={metricName} onChange={onChange} />;
}

export const PlotControlMetricName = memo(_PlotControlMetricName);
