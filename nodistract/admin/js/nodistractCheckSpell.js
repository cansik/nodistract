/**
 * Function to autocorrect the content of a Post with Bing Spell Checker
 * @param content
 * @returns updatecContent Content with corrections
 */
function checkSpell(content){

    var updatedContent = content;

    // Make Ajaxcall on Bing Spell Checker
    $.ajax({
        type: 'POST',
        url: spellChecker,
        data: "Text="+escape(content), // Escape input
        beforeSend: function(xhr){xhr.setRequestHeader('Ocp-Apim-Subscription-Key', '0b9dff915b1346fca45ec66bd3446535');}, // Set API-Key in Request Header
        success: function (data) {
            // iterate over all sugestions in reverse to correct the text from the end to start to avoid conflicts with positions
            jQuery.each(data.flaggedTokens.reverse() , function() {

                // get suggestionobject
                var obj = this;

                // get only first suggestion of a word
                var firstSuggestion = obj.suggestions[0];

                // cut out wrong words and replace them with the suggested word
                updatedContent = updatedContent.replace(updatedContent.substring(obj.offset,obj.offset + obj.token.length),firstSuggestion.suggestion);
            });
        },
        async: false
    });

    return updatedContent;

}