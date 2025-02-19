import { SlickCellRangeSelector } from '../extensions/slickCellRangeSelector';

export type RowSelectionModelOption = {
  /** Defaults to True, should we auto-scroll when dragging a row */
  autoScrollWhenDrag?: boolean;

  /** Defaults to False, should we select when dragging? */
  dragToSelect?: boolean;

  /** cell range selector */
  cellRangeSelector?: SlickCellRangeSelector;

  /** defaults to True, do we want to select the active row? */
  selectActiveRow?: boolean;
};
