/**
 * Default trigger, adding the app specific commands.
 * Update Scores: see menu_update
 * Update Entry Form: see form_update
**/
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Athletics')
      .addItem('Update Scores', 'menu_update')
      .addItem('Update Entry Form', 'form_update')
      .addToUi();
}

/**
 * Due to caching in google docs, functions are only reevaluated if they appear to have new arguments
 * This function changes "UPDATE TIME" to the current unix epoch, which should be included in any custom function that calls other custom functions.
**/
function menu_update(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var date = new Date();
  sheet.getRangeByName("UPDATETIME").setValue(date.getTime());
}

/**
 * The linked form to this page should have AT LEAST one List and one Grid item.
 * The first List [in code as `form_event'] will be updated with a list of id's and events from the EVENTS form.addCheckboxGridItem()
 *  * N.B: The format of this list is used in the RegEx used in calculations for SCORES. Ensure that changing this does not affect that.
 * The first Grid [in code as `form_ranks`] is expected to be a list of school codes on the y-axis, and places on the x-axis.
**/
function form_update(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  form = FormApp.openByUrl(sheet.getFormUrl());
  form_event = form.getItems(FormApp.ItemType.LIST)[0].asListItem();
  form_ranks = form.getItems(FormApp.ItemType.GRID)[0].asGridItem();
   
  event_names = [];
  // Col A lists IDs; Col B lists Event Names.
  event_list = sheet.getSheetByName("EVENTS").getRange("A2:B");
  event_list.getValues().forEach(function (row){
    if (row[0] != '' && row[1] != ''){
      event_names.push(row[0]+': '+row[1]);
    } 
  })
  form_event.setChoiceValues(event_names);
  
  school_names = [];
  // Col B lists school codes.
  school_list = sheet.getSheetByName("SCHOOLS").getRange("B2:B").getValues();
  school_list.forEach(function (row){
    school_names.push(row[0]);
  })
  form_ranks.setRows(school_names);
}

/**
 * Returns a score array for a given event `id`, based on rankings in the row `rank_row` and scores in the row `score_row`.
 *
 * @param {team} input The team code.
 * @param {score_row} input An array containing the scores listed from first to last (from `GetScoreRow()` function).
 * @param {rank_row} input An array containing the ranks of teams, in the default order (from `GetRankRow()` function).
 * @return The corresponding amount of points for the team.
 * @customfunction
 */
function Score(score_row, rank_row){
  score_row = score_row[0];
  rank_row = rank_row[0];
  var scores = [];
  for (var counter = 0; counter < rank_row.length; counter++){
    if (rank_row[counter] == "" || rank_row[counter] == 0){
      scores.push(0);
    } else {
      scores.push(score_row[rank_row[counter] - 1]);
    }
  }
  return [scores];
}

/**
 * Find the point score for each rank in either a championship/non championship.
 *
 * @param {is_champ} input Is this race a championship race?.
 * @return An array of scores in rank order.
 * @customfunction
 */
function GetScoreRow(is_champ){
  sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("EVENT TYPES");
  if (is_champ) return sheet.getRange("B2:2").getValues();
  else return sheet.getRange("B3:3").getValues();
}

/**
 * Find the rankings provided by the form, for a given `id`.
 *
 * @param {id} input The team code.
 * @return An array of ranks in team order.
 * @customfunction
 */
function GetRankRow(id, time){
  sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("RANKINPUT");
  ids_v = sheet.getRange("C2:C").getValues();
  match_row = -1;
  for (var i = 0; i < ids_v.length; i++){
    if (ids_v[i][0] == id){
      match_row = i;
    } 
  }
  if (match_row == -1){
    return [[0,0,0,0,0,0,0,0,0]];
  }
  //row is the header + 1
  return sheet.getRange(match_row+2, 4, 1, 9).getValues();
  
}

// Used in format function
function FromTo(index, sheet){
  index = index.toString();
  return sheet+'!'+index+":"+index;
}
