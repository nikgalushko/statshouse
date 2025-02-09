import React, { memo } from 'react';
import { PlotNavigate } from '../Plot';
import { PlotControlFrom } from '../Plot/PlotControl/PlotControlFrom';
import { PlotControlTo } from '../Plot/PlotControl/PlotControlTo';
import { PlotControlGlobalTimeShifts } from '../Plot/PlotControl/PlotControlGlobalTimeShifts';
import { useStatsHouseShallow, viewPath } from 'store2';
import { NavLink } from 'react-router-dom';
import { Button } from 'components';
import { ReactComponent as SVGArrowCounterclockwise } from 'bootstrap-icons/icons/arrow-counterclockwise.svg';
import { ButtonToggleTvMode } from '../TvMode';

export function _DashboardHeader() {
  const { isSaveDashboard, dashboardId } = useStatsHouseShallow(({ params: { dashboardId } }) => ({
    isSaveDashboard: dashboardId != null,
    dashboardId,
  }));
  // const onToggleEnableTVMode = useCallback(() => {
  //   setTVMode({ enable: !tvModeEnabled });
  // }, [setTVMode, tvModeEnabled]);
  // const dashboardId = useStore(selectorDashboardId);
  //
  //   const tvMode = useTVModeStore((state) => state.enable);
  //
  //   // const [] =
  //
  //   const timeRange = useStore(selectorTimeRange);
  //   const setTimeRange = useStore(selectorSetTimeRange);
  //
  //   const setBaseRange = useStore(selectorSetBaseRange);
  //
  //   const live = useLiveModeStore((s) => s.live);
  //   const disabledLive = useStore(selectorDisabledLive);
  //
  //   const dashboardLayoutEdit = useStore(selectorDashboardLayoutEdit);
  //   const setDashboardLayoutEdit = useStore(selectorSetDashboardLayoutEdit);
  //
  //   const params = useStore(selectorParams);
  //
  //   const copyLink = useMemo(() => {
  //     const search = encodeParams(
  //       produce(params, (p) => {
  //         if (p.dashboard?.dashboard_id) {
  //           p.dashboard.dashboard_id = undefined;
  //         }
  //       })
  //     );
  //     return `${document.location.protocol}//${document.location.host}${document.location.pathname}?${fixMessageTrouble(
  //       new URLSearchParams(search).toString()
  //     )}`;
  //   }, [params]);
  //
  return (
    <div className="d-flex flex-row flex-wrap my-3 container-xl">
      <div className="me-3 mb-2">
        <PlotNavigate className="btn-group-sm" />
        {/*<PlotNavigate*/}
        {/*  className="btn-group-sm"*/}
        {/*  setTimeRange={setTimeRange}*/}
        {/*  live={live}*/}
        {/*  link={copyLink}*/}
        {/*  outerLink={copyLink}*/}
        {/*  setLive={setLiveMode}*/}
        {/*  disabledLive={disabledLive}*/}
        {/*/>*/}
      </div>
      <div className="d-flex flex-row flex-wrap flex-grow-1 align-items-end justify-content-end">
        <div className="flex-grow-1"></div>
        <div className="mb-2">
          <PlotControlFrom className="input-group-sm" />
          {/*<PlotControlFrom*/}
          {/*  className="btn-group-sm"*/}
          {/*  classNameSelect="form-select-sm"*/}
          {/*  timeRange={timeRange}*/}
          {/*  setTimeRange={setTimeRange}*/}
          {/*  setBaseRange={setBaseRange}*/}
          {/*/>*/}
        </div>
        <div className="ms-3 mb-2">
          <PlotControlTo className="input-group-sm" />
          {/*<PlotControlTo*/}
          {/*  className="btn-group-sm"*/}
          {/*  classNameInput="form-control-sm"*/}
          {/*  timeRange={timeRange}*/}
          {/*  setTimeRange={setTimeRange}*/}
          {/*/>*/}
        </div>
        <div className="ms-3 mb-2">
          <PlotControlGlobalTimeShifts />
          {/*<PlotControlTimeShifts />*/}
        </div>
        <div className="ms-3 mb-2">
          {/*<ToggleButton*/}
          {/*  className="btn btn-outline-primary btn-sm"*/}
          {/*  checked={dashboardLayoutEdit}*/}
          {/*  onChange={setDashboardLayoutEdit}*/}
          {/*  title="Edit dashboard"*/}
          {/*>*/}
          {/*  <SVGGearFill />*/}
          {/*</ToggleButton>*/}
        </div>
        {!!isSaveDashboard && (
          <div className="ms-2 mb-2">
            <NavLink to={{ pathname: viewPath[0], search: `?id=${dashboardId}` }} end>
              <Button type="button" className="btn btn-sm btn-outline-primary" title="Reset dashboard to saved state">
                <SVGArrowCounterclockwise />
              </Button>
            </NavLink>
          </div>
        )}
        <div className="ms-2 mb-2">
          <ButtonToggleTvMode className="btn-sm" />
          {/*<ToggleButton*/}
          {/*  className="btn btn-outline-primary btn-sm"*/}
          {/*  checked={tvModeEnabled}*/}
          {/*  onChange={onToggleEnableTVMode}*/}
          {/*  title={tvModeEnabled ? 'TV mode Off' : 'TV mode On'}*/}
          {/*>*/}
          {/*  {tvModeEnabled ? <SVGFullscreenExit /> : <SVGFullscreen />}*/}
          {/*</ToggleButton>*/}
        </div>
      </div>
    </div>
  );
}
export const DashboardHeader = memo(_DashboardHeader);
