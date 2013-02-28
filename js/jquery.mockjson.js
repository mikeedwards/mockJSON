/*jslint browser: true, regexp: true, sloppy: true, indent: 4, maxerr: 50 */
/*global jQuery: false */
;(function($) {

var _mocked = [],
    _original_ajax = $.ajax,
    _random_numbers = [0.021768910889510606,0.23762323165420307,0.9079616118204306,0.6534305309997466,0.22049697572443694,0.07687466163364898,0.8017428775547905,0.16165353264404825,0.5124345671670483,0.19337327636624613,0.39963994200698416,0.8012592654139514,0.22474962687229938,0.9791396234452399,0.7965428353317756,0.9777664340629622,0.5135216702983731,0.7407128236192145,0.12880984991420075,0.8186600800491484,0.5187691445438851,0.034723021925916586,0.5625092833040853,0.02502838571997701,0.663696305503698,0.3481608684353138,0.8991623585175106,0.3640542564277087,0.8320766874121723,0.012778915627689846,0.1427680370061336,0.9774408289203956,0.010229381207667587,0.2596610885223093,0.6150540104297127,0.7130773919030915,0.8638338302974085,0.6178483032907357,0.980312844391733,0.5007277415012348,0.6348672031113127,0.4400097775503303,0.8468458451408212,0.38724997893647317,0.690237920987028,0.19850102297146477,0.44895115941315766,0.22283381913760725,0.031228117310125314,0.3367510872581615,0.28155752394210787,0.14696694832580504,0.08164635161760991,0.8837733477785624,0.4590179148539142,0.9613195413217465,0.11263127577456922,0.743695635896287,0.0002424891439143373,0.1964622832546613,0.7333363138878922,0.5575568682003356,0.20426374168098604,0.18030934250338893,0.9792636408392759,0.30121911048336913,0.7734906886720265,0.6984051127767527,0.6638058511379343,0.3310956256388182,0.36632372827973203,0.8996494702333895,0.8235917663049763,0.418496734118911,0.8164648495097332,0.9457831606354686,0.2845227542117049,0.42374718399151545,0.3431728911657228,0.5289314006219973,0.6029243600407113,0.6528301140700757,0.6948768236197832,0.7887302784092911,0.8950274196119906,0.6121642239166305,0.31797481561514696,0.34903732589844216,0.3580320092281766,0.8312225728434115,0.32331010157206974,0.16395388672837796,0.6072960306003872,0.6580526967999424,0.23472961545632742,0.6138637855489343,0.3067303339060682,0.44935935129958315,0.24729465243280668,0.8244189715967711];

// Returns an object of query string parameters for a given URL
function parseQueryString(url) {
    var pairs,
        i,
        p,
        qpos = url.indexOf("?"),
        query_string = {};

    if ( qpos !== -1 ) {
        pairs = url.substring(qpos + 1).split("&");

        for ( i in pairs ) {
            if (pairs.hasOwnProperty(i)) {
                p = pairs[i].split("=");
                query_string[p[0]] = p[1];
            }
        }
    }

    return query_string;
}

function rand() {
    if ($.mockJSON.random) {
        return Math.random();
    } else {
        _random_numbers = _random_numbers.concat(_random_numbers.splice(0,1));
        return _random_numbers[0];
    }
}

function type(obj) {
    return $.isArray(obj)
        ? 'array'
        : (obj === null)
            ? 'null'
            : typeof obj;
}


function pad(num) {
    if (num < 10) {
        return '0' + num;
    }
    return num + String();
}

function randomDate() {
    return new Date(Math.floor(rand() * new Date().valueOf()));
}


function getMockData(key, mock) {
    var params, pos, a, index, ret;

    key = key.substr(1); // remove "@"

    // Check to see if the key has parameters
    params = key.match(/\(([^\)]+)\)/) || null;
    if ( params !== null ) {
        // If so, split the parameters by comma into an array
        params = params[1].split(",");
        // And remove the parameter and parentheses from the key
        key = key.substring(0, key.indexOf("("));
    }

    if ($.mockJSON.data.hasOwnProperty(key)) {

        a = $.mockJSON.data[key];

        switch (type(a)) {
            case 'array':
                index = Math.floor(a.length * rand());
                ret = a[index];
                break;

            case 'function':
                ret = a(params, mock);
                break;
        }
    } else {
        ret = key;
    }
    return ret;
}

$.mockJSON = function(request, template, wait) {
    var i, mock;

    if (typeof wait === "undefined") {
        wait = 0;
    }

    for (i = 0; i < _mocked.length; i = i + 1) {
        mock = _mocked[i];
        if (mock.request.toString() === request.toString()) {
            _mocked.splice(i, 1);
            break;
        }
    }

    _mocked.push({
        request:request,
        template:template,
        wait: wait,
        // This array stores pattern matches in the given URL
        url_matches: [],
        // This object stores query string properties
        query_string: {}
    });

    return $;
};

$.mockJSON.data = {
    NUMBER : String.prototype.split.call('0123456789', ''),
    LETTER_UPPER : String.prototype.split.call('ABCDEFGHIJKLMNOPQRSTUVWXYZ', ''),
    LETTER_LOWER : String.prototype.split.call('abcdefghijklmnopqrstuvwxyz', ''),
    MALE_FIRST_NAME : ["James", "John", "Robert", "Michael", "William", "David",
        "Richard", "Charles", "Joseph", "Thomas", "Christopher", "Daniel",
        "Paul", "Mark", "Donald", "George", "Kenneth", "Steven", "Edward",
        "Brian", "Ronald", "Anthony", "Kevin", "Jason", "Matthew", "Gary",
        "Timothy", "Jose", "Larry", "Jeffrey", "Frank", "Scott", "Eric"],
    FEMALE_FIRST_NAME : ["Mary", "Patricia", "Linda", "Barbara", "Elizabeth",
        "Jennifer", "Maria", "Susan", "Margaret", "Dorothy", "Lisa", "Nancy",
        "Karen", "Betty", "Helen", "Sandra", "Donna", "Carol", "Ruth", "Sharon",
        "Michelle", "Laura", "Sarah", "Kimberly", "Deborah", "Jessica",
        "Shirley", "Cynthia", "Angela", "Melissa", "Brenda", "Amy", "Anna"],
    LAST_NAME : ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller",
        "Davis", "Garcia", "Rodriguez", "Wilson", "Martinez", "Anderson",
        "Taylor", "Thomas", "Hernandez", "Moore", "Martin", "Jackson",
        "Thompson", "White", "Lopez", "Lee", "Gonzalez", "Harris", "Clark",
        "Lewis", "Robinson", "Walker", "Perez", "Hall", "Young", "Allen"],
    EMAIL : function() {
        return getMockData('@LETTER_LOWER')
            + '.'
            + getMockData('@LAST_NAME').toLowerCase()
            + '@'
            + getMockData('@LAST_NAME').toLowerCase()
            + '.com';
    },
    DATE_YYYY : function() {
        var yyyy = randomDate().getFullYear();
        return yyyy + String();
    },
    DATE_DD : function() {
        return pad(randomDate().getDate());
    },
    DATE_MM : function() {
        return pad(randomDate().getMonth() + 1);
    },
    TIME_HH : function() {
        return pad(randomDate().getHours());
    },
    TIME_MM : function() {
        return pad(randomDate().getMinutes());
    },
    TIME_SS : function() {
        return pad(randomDate().getSeconds());
    },
    LOREM : function() {
        var words = String.prototype.split.call('lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum', ' '),
            index = Math.floor(rand() * words.length);
        return words[index];
    },
    LOREM_IPSUM : function() {
        var words = String.prototype.split.call('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum', ' '),
            result = [],
            length = Math.floor(rand() * words.length / 2),
            i, index;
        for (i = 0; i < length; i = i + 1) {
            index = Math.floor(rand() * words.length);
            result.push(words[index]);
        }
        return result.join(' ');
    },
    QUERY_STRING: function() {
          // Only accepts one parameter: the name of the query string var.
          // Check for it, and return it from the data store if it's present.
          var param = Array.prototype.slice.call(arguments[0], 0).shift().toString();
          var query_string = arguments[1].special.QUERY_STRING;
          if ( typeof query_string[param] !== 'undefined' ) {
              return query_string[param];
          }
          return null;
    },
    URL_MATCH: function() {
          // For URL matches, the parameter should be the index of the match.
          var index = parseInt(Array.prototype.slice.call(arguments[0], 0).shift(), 10);
          var url_match = arguments[1].special.URL_MATCH;
          if ( typeof url_match[index] !== 'undefined' ) {
              return url_match[index];
          }
          return null;
    }
};

$.mockJSON.random = true;

$.ajax = function(url, options) {
    var delay = function (options, defer, resp) {
            options.success(resp);
            defer.resolve(resp);
        },
        i, mock, defer, resp;

    // Mimic jQuery >= 1.5 argument handling
    if ( typeof url === "object" ) {
        options = url;
        url = undefined;
    }

    options = options || {};

    if (options.dataType === 'json') {
        for (i = 0; i < _mocked.length; i = i + 1) {
            mock = _mocked[i];
            defer = $.Deferred();

            if (mock.request.test(options.url)) {
                // Store special values for this request:
                // * URL_MATCH: pattern matches from the URL given
                // * QUERY_STRING: query string parameters in the URL
                mock.special = {
                    URL_MATCH: options.url.match(mock.request),
                    QUERY_STRING: parseQueryString(options.url)
                };
                resp = $.mockJSON.generateFromTemplate(mock.template, null, mock);

                setTimeout(delay, mock.wait, options, defer, resp);

                defer.success = defer.done;
                defer.error = defer.fail;

                return defer;
            }
        }
    }
    return _original_ajax.call(this, url, options);
};


$.mockJSON.generateFromTemplate = function(template, name, mock) {
    var length = 0, length_min, length_max,
        matches = (name || '').match(/\w+\|(\d+)(-(\d+))?/),
        generated = null,
        i, p, inc_matches, increment, keys, key;
    if (matches) {
        length_min = parseInt(matches[1], 10);
        length_max = matches[3] !== undefined ? parseInt(matches[3], 10) : null;
        // If there's a max length present, the length is a random number between the two.
        // If not, we use the first parameter, which is length_min 
        length = length_max !== null ? Math.round(rand() * (length_max - length_min)) + length_min : length_min;
    }

    switch (type(template)) {
        case 'array':
            generated = [];
            for (i = 0; i < length; i = i + 1) {
                generated[i] = $.mockJSON.generateFromTemplate(template[0], null, mock);
            }
            break;

        case 'object':
            generated = {};
            for (p in template) {
                if (template.hasOwnProperty(p)) {
                    generated[p.replace(/\|(\d+-\d+|\+\d+)/, '')] = $.mockJSON.generateFromTemplate(template[p], p, mock);
                    inc_matches = p.match(/\w+\|\+(\d+)/);
                    if (inc_matches && type(template[p]) === 'number') {
                        increment = parseInt(inc_matches[1], 10);
                        template[p] += increment;
                    }
                }
            }
            break;

        case 'number':
            generated = (matches)
                ? length
                : template;
            break;

        case 'boolean':
            generated = (matches)
                ? rand() >= 0.5
                : template;
            break;

        case 'string':
            if (template.length) {
                generated = '';
                length = length || 1;
                for (i = 0; i < length; i = i + 1) {
                    generated += template;
                }
                keys = generated.match(/@([A-Za-z_0-9\(\),]+)/g) || [];
                for (i = 0; i < keys.length; i = i + 1) {
                    key = keys[i];
                    generated = generated.replace(key, getMockData(key, mock));
                }
            } else {
                generated = "";
                for (i = 0; i < length; i = i + 1) {
                    generated += String.fromCharCode(Math.floor(rand() * 255));
                }
            }
            break;

        default:
            generated = template;
            break;
    }
    return generated;

};

}(jQuery));
