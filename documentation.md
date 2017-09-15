# AAGPS Backup Sheet

This program is designed to be an event manager, for Athletics in this case, but equally for any sport in which teams can be ranked for each event.

## Rationale for creation and design
There are a few key features of this program:
 * Hosted by Google Sheets
This was chosen since it's widely available and free to use.
 * Online
This was a consequence of using Google Sheets, but also an advantage catastrophic data loss to local computers would not affect a copy of the data held in the cloud.
 * Independent of Individual Players
The software has been designed as a backup, in particular to Hy-Tek's Meet Manager (though any manager program would work just effectively).
It is possible to use this as a stand-alone management tool, as long as player records are unimportant/stored seperately
 * Independent of Athletics/Sport in General
As far as possible, the software has not used any athletics specific conventions/ideas. This should mean it can be used effectively for any racing events, and with some modification, perhaps for general sports too.

# Glossary
 - *Boolean*: A value that is either `TRUE` or `FALSE`
 - `n` (or `m`): Whenever the size of a sheet is variable in a direction, the size will be listed as one of these pronumerals.
 - *Protected*: A protected sheet cannot be edited without a warning pop-up
 - *Invisible*: An invisible sheet cannot be seen on the bottom row of sheets.

# Sheet by Sheet overview

## SHEET: `SCHOOLS`
 * **Dimensions**: 2 across by `n` down, with a header row.
 * **Visibility**: *Protected*; *Invisible*
 * **Summary**: List of each team (called a `School`) who should get individual points. The current release should allow any number of schools, with only minor changes for a change in school numbers.
 
### Structure
 Col A: Full Name of `School`
 
 Col B: `School` ID  - should be short, and used as a convention throughout the competition.
 
## SHEET: `AGE GROUPS`
 * **Dimensions**: 1 across by `n` down, with a header row.
 * **Visibility**: *Protected*; *Invisible*
 * **Summary**: List of each seperate division (called an `AGE GROUP`) 
 
 ### Structure
 Col A: Name of the division
 
 ## SHEET: `EVENT TYPES`
 * **Dimensions**: `n`+2 across by 2 down, with a header row.
 * **Visibility**: *Protected*; *Invisible*
 * **Summary**: List of points awarded for a particular place in a race, according to which type of race it is.
 
 
 ### Structure
 Col A: Boolean which corresponds to whether the row is for a championship or not.
 
 Col B-{second last}: This contains scores for each place in an event that meets the criteria in Col. A(with left being the highest place, and right the lowest).
 
 Last Col: This contains the score awarded for a last place finish (in athletics it is possible for more than one person to come last).
 
 ## SHEET: `SETTINGS`
 * **Dimensions**: `n` across by 1 down, with a header row.
 * **Visibility**: *Protected*; *Invisible*
 * **Summary**: User defined informational settings, and the `UPDATETIME` field
 
 ### Structure
 Each column should have it's second line be a setting, or informational text. Settings should be Named Ranges.
 
 ### A note on UPDATE TIME
One of Google Drive's requirements/features is caching of calls. The caching does not check if the results of custom functions change though, so having an argument which changes is the only way to force an update.
The update is created by a custom function in the `Athletics` Menu - Update Scores.
