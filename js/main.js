$(document).ready(function () {
    'use strict';
    
    $('#joinPanel').hide();
    $('#nav').find('li').click(function () {
        console.log($(this).attr('id'));
        var hiddenVal = $(this).attr('id');
        $('#joinHidden').attr('value', hiddenVal);
        $('#reserveHidden').attr('value', hiddenVal);
        var gameTitle = $(this).attr('value');
        $('#gameId').text(gameTitle);
    });
    
    $('.reserve').click(function () {
        $('#joinPanel').fadeOut(function () {
            $('#reservePanel').fadeIn();
        });
    });
    
    $('.join').click(function () {
        $('#reservePanel').fadeOut(function () {
            $('#joinPanel').fadeIn();
        });
        
    });
    
});