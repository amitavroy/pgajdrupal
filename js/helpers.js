/**
 * Created with JetBrains WebStorm.
 * User: Amitav
 * Date: 10/24/13
 * Time: 6:04 PM
 * To change this template use File | Settings | File Templates.
 */

/**
 * This function is being used to trim text where ever requried.
 * This is similar to the view_trim function of drupal.
 * TODO: clean up of the last character check.
 * @param text - the full text which is to be trimmed
 * @param length - count of characters allowed.
 * @return {String}
 */
function trim_view(text, length) {
  var actualArraySize = text.split(" ").length;
  var trimmedText = text.substr(0, length).split(" ");
  var sizeOfTrimmedTextLength = trimmedText.length;
  var bodyText = "";

  /* if no trim is required */
  if (actualArraySize > sizeOfTrimmedTextLength) {
    for (var i = 0; i < sizeOfTrimmedTextLength; i++) {
      if (i == sizeOfTrimmedTextLength - 1) {
        var lastCharacter = trimmedText[i].substr(trimmedText[i].length - 1);

        /* refine this condition later usign something like in_array() of php*/
        if (lastCharacter == "," || lastCharacter == "." || lastCharacter == ";") {
          bodyText = bodyText + trimmedText[i].slice(0, -1);
        }
        else {
          bodyText = bodyText + trimmedText[i];
        }
      }
      else {
        bodyText = bodyText + trimmedText[i] + " ";
      }
    }
    bodyText = bodyText + "...";
  }
  else {
    bodyText = text;
  }

  return bodyText;
}