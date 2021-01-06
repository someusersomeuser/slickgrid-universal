/* eslint-disable @typescript-eslint/indent */
import {
  CellMenu,
  ColumnEditor,
  ColumnFilter,
  EditorValidator,
  Formatter,
  Grouping,
  GroupTotalsFormatter,
  HeaderButtonItem,
  MenuCommandItem,
  OnEventArgs,
  SlickEventData,
  SortComparer,
} from './index';
import { FieldType } from '../enums/fieldType.enum';

type PathsToStringProps<T> = T extends string | number | boolean | Date ? [] : {
  [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>]
}[Extract<keyof T, string>];

/* eslint-disable @typescript-eslint/indent */
// disable eslint indent rule until this issue is fixed: https://github.com/typescript-eslint/typescript-eslint/issues/1824
type Join<T extends any[], D extends string> =
  T extends [] ? never :
  T extends [infer F] ? F :
  T extends [infer F, ...infer R] ?
  F extends string ? string extends F ? string : `${F}${D}${Join<R, D>}` : never : string;
/* eslint-enable @typescript-eslint/indent */

export interface Column<T = any> {
  /** async background post-rendering formatter */
  asyncPostRender?: (domCellNode: any, row: number, dataContext: T, columnDef: Column) => void;

  /** Row Move Behavior, used by the Row Move Manager Plugin */
  behavior?: string;

  /** Block event triggering of an insert? */
  cannotTriggerInsert?: boolean;

  /** Options that can be provide to the Cell Context Menu Plugin */
  cellMenu?: CellMenu;

  /** Column group name for grouping of column headers spanning accross multiple columns */
  columnGroup?: string;

  /** Column group name translation key that can be used by the Translate Service (i18n) for grouping of column headers spanning accross multiple columns */
  columnGroupKey?: string;

  /** Column span in pixels or `*`, only input the number value */
  colspan?: number | '*';

  /** CSS class to add to the column cell */
  cssClass?: string;

  /** Data key, for example this could be used as a property key for complex object comparison (e.g. dataKey: 'id') */
  dataKey?: string;

  /** Do we want default sort to be ascending? True by default */
  defaultSortAsc?: boolean;

  /** Any inline editor function that implements Editor for the cell value or ColumnEditor */
  editor?: ColumnEditor;

  /** Default to false, which leads to exclude the column title from the Column Picker. */
  excludeFromColumnPicker?: boolean;

  /** Default to false, which leads to exclude the column from the export. */
  excludeFromExport?: boolean;

  /** Default to false, which leads to exclude the column title from the Grid Menu. */
  excludeFromGridMenu?: boolean;

  /** Defaults to false, which leads to exclude the field from the query (typically a backend service query) */
  excludeFromQuery?: boolean;

  /** Defaults to false, which leads to exclude the column from getting a header menu. For example, the checkbox row selection should not have a header menu. */
  excludeFromHeaderMenu?: boolean;

  /** If defined this will be set as column width in Excel */
  exportColumnWidth?: number;

  /**
   * Export with a Custom Formatter, useful when we want to use a different Formatter for the export.
   * For example, we might have a boolean field with "Formatters.checkmark" but we would like see a translated value for (True/False).
   */
  exportCustomFormatter?: Formatter<T>;

  /**
   * Export with a Custom Group Total Formatter, useful when we want to use a different Formatter for the export.
   * For example, we might have a boolean field with "Formatters.checkmark" but we would like see a translated value for (True/False).
   */
  exportCustomGroupTotalsFormatter?: GroupTotalsFormatter;

  /**
   * Defaults to false, which leads to Formatters being evaluated on export.
   * Most often used with dates that are stored as UTC but displayed as Date ISO (or any other format) with a Formatter.
   */
  exportWithFormatter?: boolean;

  /**
   * Do we want to force the cell value to be a string?
   * When set to True, it will wrap the cell value in double quotes and add an equal sign (=) at the beginning of the cell to force Excel to evaluate it as a string and not change it's format.
   * For example, without this flag a cell value with "1E06" would be interpreted as a number becoming (1.0E06) by Excel.
   * When set this flag to True, the cell value will be wrapped with an equal sign and double quotes, which forces Excel to evaluate it as a string. The output will be:: ="1E06" */
  exportCsvForceToKeepAsString?: boolean;

  /**
   * Field property name to use from the dataset that is used to display the column data.
   * For example: { id: 'firstName', field: 'firstName' }
   *
   * NOTE: a field with dot notation (.) will be considered a complex object.
   * For example: { id: 'Users', field: 'user.firstName' }
   */
  field: Join<PathsToStringProps<T>, '.'>;

  /**
   * Only used by Backend Services since the query is built using the column definitions, this is a way to pass extra properties to the backend query.
   * It can help in getting more fields for a Formatter without adding a new column definition every time that we don't want to display.
   * For example: { id: 'Users', field: 'user.firstName', fields: ['user.lastName', 'user.middleName'], formatter: fullNameFormatter }
   */
  fields?: string[];

  /** Filter class to use when filtering this column */
  filter?: ColumnFilter;

  /** is the column filterable? Goes with grid option "enableFiltering: true". */
  filterable?: boolean;

  /** Extra option to filter more easily. For example, a "UTC Date" field can use a search format of US Format like ">02/28/2017" */
  filterSearchType?: typeof FieldType[keyof typeof FieldType];

  /** are we allowed to focus on the column? */
  focusable?: boolean;

  /** Formatter function is to format, or visually change, the data shown in the grid (UI) in a different way without affecting the source. */
  formatter?: Formatter<T>;

  /** Grouping option used by a Draggable Grouping Column */
  grouping?: Grouping;

  /** Group Totals Formatter function that can be used to add grouping totals in the grid */
  groupTotalsFormatter?: GroupTotalsFormatter;

  /** Options that can be provided to the Header Menu Plugin */
  header?: {
    /** list of Buttons to show in the header */
    buttons?: Array<HeaderButtonItem | 'divider'>;
    menu?: { items: Array<MenuCommandItem | 'divider'> };
  };

  /** CSS class that can be added to the column header */
  headerCssClass?: string;

  /** ID of the column, each row have to be unique or SlickGrid will throw an error. */
  id: number | string;

  /**
   * @reserved This is a RESERVED property and is used internally by the library to copy over the Column Editor Options.
   * You can read this property if you wish, but DO NOT override this property (unless you know what you're doing) as it will cause other issues with your editors.
   */
  internalColumnEditor?: ColumnEditor;

  /** Label key, for example this could be used as a property key for complex object label display (e.g. labelKey: 'name') */
  labelKey?: string;

  /** Maximum Width of the column in pixels (number only). */
  maxWidth?: number;

  /** Minimum Width of the column in pixels (number only). */
  minWidth?: number;

  /** Field Name to be displayed in the Grid (UI) */
  name?: string;

  /** Field Name translation key that can be used by the translate Service (i18n) to display the text for each column header title */
  nameKey?: string;

  /** an event that can be used for executing an action before the cell becomes editable (that event happens before the "onCellChange" event) */
  onBeforeEditCell?: (e: SlickEventData, args: OnEventArgs) => void;

  /** an event that can be used for executing an action after a cell change */
  onCellChange?: (e: SlickEventData, args: OnEventArgs) => void;

  /** an event that can be used for executing an action after a cell click */
  onCellClick?: (e: SlickEventData, args: OnEventArgs) => void;

  /**
   * Column output type (e.g. Date Picker, the output format that we will see in the picker)
   * NOTE: this is only currently used by the Editors/Filters with a Date Picker
   */
  outputType?: typeof FieldType[keyof typeof FieldType];

  /**
   * Column Editor save format type (e.g. which date format to use when saving after choosing a date from the Date Editor picker)
   * NOTE: this is only currently used by the Date Editor (date picker)
   */
  saveOutputType?: typeof FieldType[keyof typeof FieldType];

  /** if you want to pass custom paramaters to your Formatter/Editor or anything else */
  params?: any | any[];

  /** The previous column width in pixels (number only) */
  previousWidth?: number;

  /**
   * Useful when you want to display a certain field to the UI, but you want to use another field to query when Filtering/Sorting.
   * Please note that it has higher precendence over the "field" property.
   */
  queryField?: string;

  /**
   * When you do not know at hand the name of the Field to use for querying,
   * the lib will run your callback to find out which Field name you want to use by the logic you defined.
   * Useful when you only know the Field name by executing a certain logic in order to get the Field name to query from.
   * @param {Object} dataContext - item data object
   * @return {string} name of the Field that will end up being used to query
   */
  queryFieldNameGetterFn?: (dataContext: T) => string;

  /**
   * Similar to "queryField" but only used when Filtering (please note that it has higher precendence over "queryField").
   * Useful when you want to display a certain field to the UI, but you want to use another field to query for Filtering.
   */
  queryFieldFilter?: string;

  /**
   * Similar to "queryField" but only used when Sorting (please note that it has higher precendence over "queryField").
   * Useful when you want to display a certain field to the UI, but you want to use another field to query for Sorting.
   */
  queryFieldSorter?: string;

  /** Is the column resizable, can we make it wider/thinner? A resize cursor will show on the right side of the column when enabled. */
  resizable?: boolean;

  /** Do we want to re-render the grid on a grid resize */
  rerenderOnResize?: boolean;

  /** Defaults to false, which leads to Sanitizing all data (striping out any HTML tags) when being evaluated on export. */
  sanitizeDataExport?: boolean;

  /** Is the column selectable? Goes with grid option "enableCellNavigation: true". */
  selectable?: boolean;

  /** Is the column sortable? Goes with grid option "enableSorting: true". */
  sortable?: boolean;

  /** Custom Sort Comparer function that can be provided to the column */
  sortComparer?: SortComparer;

  /** Custom Tooltip that can ben shown to the column */
  toolTip?: string;

  /** What is the Field Type, this can be used in the Formatters/Editors/Filters/... */
  type?: typeof FieldType[keyof typeof FieldType];

  /** Defaults to false, when set to True will lead to the column being unselected in the UI */
  unselectable?: boolean;

  /** Editor Validator */
  validator?: EditorValidator;

  /**
   * Defaults to false, can the value be undefined?
   * Typically undefined values are disregarded when sorting, when setting this flag it will adds extra logic to Sorting and also sort undefined value.
   * This is an extra flag that user has to enable by themselve because Sorting undefined values has unwanted behavior in some use case
   * (for example Row Detail has UI inconsistencies since undefined is used in the plugin's logic)
   */
  valueCouldBeUndefined?: boolean;

  /** Width of the column in pixels (number only). */
  width?: number;
}
