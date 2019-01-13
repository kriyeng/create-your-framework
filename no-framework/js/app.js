/*
* @date: December 30th, 2018
* @author: David Ibañez
 */

document.addEventListener("DOMContentLoaded", function() {
    initButtons();
});

function initButtons(){
    // Get menu-buttons from DOM
    var menu = document.querySelector('#menu-buttons');

    // Add EventListener to the buttons
    menu.addEventListener('click', function(event){

        // Check if the clicked element has the 'button' class
        // Because classList is not an array we do the trick to call an array method using the list as the 'this' element
        if([].indexOf.call(event.target.classList,'button') > -1) {

            // Remove selected class to the current selection
            menu.querySelector('.selected').classList.remove('selected');

            // Add selected class to the button clicked
            event.target.classList.add('selected');

            // Remove the selected class on the current tab
            document.querySelector('.tab.selected').classList.remove('selected');

            // Add the selected class to the new tab selected
            document.querySelector('.tab.' + event.target.innerHTML.toLowerCase()).classList.add('selected');
        }
    });
}

var pixabay_page;

function searchKeyUp(e, type){
    if(e.keyCode == 13){
        if(e.target.value.trim()){

            var api_function = type === 'photos' ? px_api.searchPhotos : px_api.searchVideos;

            pixabay_page = 1;
            api_function(e.target.value.trim(), pixabay_page, function(results){
                if(results){
                    renderResults(results, type);
                }
            });
        }
    }
}

function renderResults(pictures, type) {
    var list = document.querySelector('#' + type + '-list');
    list.innerHTML = '';
    if(pictures && pictures.items) {
        pictures.items.map(function(item) {
            var newDiv = document.createElement("div");
            newDiv.classList.add('item');
            newDiv.classList.add('panel');

            newDiv.innerHTML = '    <div class="image" style="background-image: url(\'' + item.preview+ '\')"></div>' +
                '    <div class="details">' +
                '        <div class="user">' +
                '            <div class="thumb" style="background-image: url(\'' + item.user_img + '\')"></div>' +
                '            <div>' + item.user + '</div>' +
                '        </div>' +
                '        <div class="views"><span class="fa fa-eye"></span> ' + formatTotals(item.views) + '</div>' +
                '        <div class="likes"><span class="fa fa-heart"></span> ' + formatTotals(item.likes) + '</div>' +
                '    </div>';

            list.append(newDiv);
        })
    }
}

function formatTotals(views){
    if(views > 1000000){
        return Math.floor(views / 10000) + 'M'
    }
    if(views > 1000){
        return Math.floor(views / 1000) + 'K'
    }
    return views
}