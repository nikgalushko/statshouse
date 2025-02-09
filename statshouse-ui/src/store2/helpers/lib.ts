// Copyright 2024 V Kontakte LLC
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { type PlotParams, promQLMetric } from 'url2';
import { type PlotData } from '../plotDataStore';
import { whatToWhatDesc } from '../../view/api';

export function getMetricName(plot: PlotParams, plotData?: PlotData) {
  return (plot.metricName !== promQLMetric ? plot.metricName : plotData?.metricName) || `plot#${plot.id}`;
}

export function getMetricWhat(plot: PlotParams, plotData?: PlotData) {
  return (
    (plot.metricName === promQLMetric
      ? plotData?.whats.map((qw) => whatToWhatDesc(qw)).join(', ')
      : plot.what.map((qw) => whatToWhatDesc(qw)).join(', ')) || ''
  );
}

export function getMetricFullName(plot: PlotParams, plotData?: PlotData) {
  if (plot.customName) {
    return plot.customName;
  }
  const metricName = getMetricName(plot, plotData);
  const metricWhat = getMetricWhat(plot, plotData);
  return metricName ? `${metricName}${!!metricWhat ? ': ' + metricWhat : ''}` : '';
}
