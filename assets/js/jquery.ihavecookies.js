(function($) {
    $.fn.ihavecookies = function(options) {

        var $element = $(this);

        // Set defaults
        var settings = $.extend({
            cookieTypes: [{
                    type: 'Действия на сайте',
                    value: 'preferences',
                    description: 'These are cookies that are related to your site preferences, e.g. remembering your username, site colours, etc.'
                },
                {
                    type: 'Аналитика',
                    value: 'analytics',
                    description: 'Cookies related to site visits, browser types, etc.'
                },
                {
                    type: 'Маркетинг',
                    value: 'marketing',
                    description: 'Cookies related to marketing, e.g. newsletters, social media, etc'
                }
            ],
            title: 'Cookies & Privacy',
            message: 'A weboldalak cookie-kat használnak.',
            link: 'cookie.html',
            delay: 0,
            expires: 30,
            moreInfoLabel: 'További információ',
            acceptBtnLabel: 'Egyetért',

            cookieTypesTitle: 'Select cookies to accept',
            fixedCookieTypeLabel: 'Necessary',
            fixedCookieTypeDesc: 'These are cookies that are essential for the website to work correctly.',
            onAccept: function() {},
            uncheckBoxes: false
        }, options);

        var myCookie = getCookie('cookieControl');
        var myCookiePrefs = getCookie('cookieControlPrefs');
        if (!myCookie || !myCookiePrefs) {

            // Set the 'necessary' cookie type checkbox which can not be unchecked
            var cookieTypes = '<li><input type="checkbox" name="gdpr[]" value="necessary" checked="checked" disabled="disabled"> <label title="' + settings.fixedCookieTypeDesc + '">' + settings.fixedCookieTypeLabel + '</label></li>';

            // Generate list of cookie type checkboxes
            $.each(settings.cookieTypes, function(index, field) {
                if (field.type !== '' && field.value !== '') {
                    var cookieTypeDescription = '';
                    if (field.description !== false) {
                        cookieTypeDescription = ' title="' + field.description + '"';
                    }
                    cookieTypes += '<li><input type="checkbox" id="gdpr-cookietype-' + field.value + '" name="gdpr[]" value="' + field.value + '" data-auto="on"> <label for="gdpr-cookietype-' + field.value + '"' + cookieTypeDescription + '>' + field.type + '</label></li>';
                }
            });

            // Display cookie message on page
            var cookieMessage = '<div id="gdpr-cookie-message"><p>' + settings.message + ' <a href="' + settings.link + '">' + settings.moreInfoLabel + '</a><p><button id="gdpr-cookie-accept" type="button">' + settings.acceptBtnLabel + '</button></p></div>';
            setTimeout(function() {
                $($element).append(cookieMessage);
                $('#gdpr-cookie-message').hide().fadeIn('slow');
            }, settings.delay);

            // When accept button is clicked drop cookie
            $('body').on('click', '#gdpr-cookie-accept', function() {
                // Set cookie
                dropCookie(true, settings.expires);

                // If 'data-auto' is set to ON, tick all checkboxes because
                // the user hasn't clicked the customise cookies button
                $('input[name="gdpr[]"][data-auto="on"]').prop('checked', true);

                // Save users cookie preferences (in a cookie!)
                var prefs = [];
                $.each($('input[name="gdpr[]"]').serializeArray(), function(i, field) {
                    prefs.push(field.value);
                });
                setCookie('cookieControlPrefs', JSON.stringify(prefs), 365);

                // Run callback function
                settings.onAccept.call(this);
            });

            // Toggle advanced cookie options
            $('body').on('click', '#gdpr-cookie-advanced', function() {
                // Uncheck all checkboxes except for the disabled 'necessary'
                // one and set 'data-auto' to OFF for all. The user can now
                // select the cookies they want to accept.
                $('input[name="gdpr[]"]:not(:disabled)').attr('data-auto', 'off').prop('checked', false);
                $('#gdpr-cookie-types').slideDown('fast', function() {
                    $('#gdpr-cookie-advanced').prop('disabled', true);
                });
            });

        } else {
            var cookieVal = true;
            if (myCookie == 'false') {
                cookieVal = false;
            }
            dropCookie(cookieVal, settings.expires);
        }

        // Uncheck any checkboxes on page load
        if (settings.uncheckBoxes === true) {
            $('input[type="checkbox"].ihavecookies').prop('checked', false);
        }

    };

    // Method to get cookie value
    $.fn.ihavecookies.cookie = function() {
        var preferences = getCookie('cookieControlPrefs');
        return JSON.parse(preferences);
    };

    // Method to check if user cookie preference exists
    $.fn.ihavecookies.preference = function(cookieTypeValue) {
        var control = getCookie('cookieControl');
        var preferences = getCookie('cookieControlPrefs');
        preferences = JSON.parse(preferences);
        if (control === false) {
            return false;
        }
        if (preferences === false || preferences.indexOf(cookieTypeValue) === -1) {
            return false;
        }
        return true;
    };

    /*
    |--------------------------------------------------------------------------
    | Drop Cookie
    |--------------------------------------------------------------------------
    |
    | Function to drop the cookie with a boolean value of true.
    |
    */
    var dropCookie = function(value, expiryDays) {
        setCookie('cookieControl', value, expiryDays);
        $('#gdpr-cookie-message').fadeOut('fast', function() {
            $(this).remove();
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Set Cookie
    |--------------------------------------------------------------------------
    |
    | Sets cookie with 'name' and value of 'value' for 'expiry_days'.
    |
    */
    var setCookie = function(name, value, expiry_days) {
        var d = new Date();
        d.setTime(d.getTime() + (expiry_days * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
        return getCookie(name);
    };

    /*
    |--------------------------------------------------------------------------
    | Get Cookie
    |--------------------------------------------------------------------------
    |
    | Gets cookie called 'name'.
    |
    */
    var getCookie = function(name) {
        var cookie_name = name + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(cookie_name) === 0) {
                return c.substring(cookie_name.length, c.length);
            }
        }
        return false;
    };

}(jQuery));
$(document).ready(function() {
    $('body').ihavecookies({});

});