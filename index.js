var pf = require('quick-primefactors'),
    levels = require('hrm-level-data');

var tilesForLevel = {};

levels.forEach(function (level) {
    tilesForLevel[level.number] = level.floor && level.floor.tiles;
});

function splitStrings(arr) {
    var strings = [],
        zeroPos;

    while (arr.length) {
        zeroPos = arr.indexOf(0);
        strings.push(arr.slice(0, zeroPos));
        arr = arr.slice(zeroPos + 1);
    }

    return strings;
}

function splitGroups(arr, groupSize) {
    var strings = [],
        zeroPos;

    for (var i = 0; i < arr.length; i += groupSize) {
        strings.push(arr.slice(i, i + groupSize));
    }

    return strings;
}

var generators = {
    /*** Mail Room ***/
    '1': function (inbox) {
        // Direct copy
        return inbox.slice(0);
    },
    /*** Busy Mail Room ***/
    '2': function (inbox) {
        // Direct copy
        return inbox.slice(0);
    },
    /*** Copy Floor ***/
    '3': function () {
        // Hard-coded
        return [ "B", "U", "G" ];
    },
    /*** Scrambler Handler ***/
    '4': function (inbox) {
        // Output each pair with the items sorted in reverse order
        return splitGroups(inbox, 2).reduce(function (outbox, pair) {
            return outbox.concat(pair.sort(function (a, b) {
                return a === b
                    ? 0
                    : a < b
                        ? 1
                        : -1;
            }));
        }, []);
    },
    /*** Rainy Summer ***/
    '6': function (inbox) {
        // Output the sum of each pair
        return splitGroups(inbox, 2).map(function (pair) {
            return pair[0] + pair[1];
        });
    },
    /*** Zero Exterminator ***/
    '7': function (inbox) {
        // Filter out zeros
        return inbox.filter(function (item) {
            return item !== 0;
        });
    },
    /*** Tripler Room ***/
    '8': function (inbox) {
        // Multiply the numbers by 3
        return inbox.map(function (item) {
            return item * 3;
        });
    },
    /*** Zero Preservation Initiative ***/
    '9': function (inbox) {
        // Preserve zeros
        return inbox.filter(function (item) {
            return item === 0;
        });
    },
    /*** Octoplier Suite ***/
    '10': function (inbox) {
        // Multiply the numbers by 8
        return inbox.map(function (item) {
            return item * 8;
        });
    },
    /*** Sub Hallway ***/
    '11': function (inbox) {
        // Output difference of each pair, both ways
        return splitGroups(inbox, 2)
            .map(function (pair) {
                var diff = pair[1] - pair[0];

                return [ diff, -diff ];
            })
            .reduce(function (outbox, diffs) {
                return outbox.concat(diffs);
            });
    },
    /*** Tetracontiplier ***/
    '12': function (inbox) {
        // Multiply the numbers by 40
        return inbox.map(function (item) {
            return item * 40;
        });
    },
    /*** Equalization Room ***/
    '13': function (inbox) {
        // Output one of equal pairs
        return splitGroups(inbox, 2)
            .filter(function (pair) {
                return pair[0] === pair[1];
            })
            .map(function (pair) {
                return pair[0];
            });
    },
    /*** Maximization Room ***/
    '14': function (inbox) {
        // Output the maximum of each pair
        return splitGroups(inbox, 2).map(function (pair) {
            return Math.max.apply(null, pair);
        });
    },
    /*** Absolute Positivity ***/
    '16': function (inbox) {
        // Output absolute values
        return inbox.map(Math.abs);
    },
    /*** Exclusive Lounge ***/
    '17': function (inbox) {
        // For each pair, output 1 if the signs are the same, 0 if different
        return splitGroups(inbox, 2).map(function (pair) {
            return pair[0] * pair[1] < 0 ? 1 : 0;
        });
    },
    /*** Countdown ***/
    '19': function (inbox) {
        return inbox.reduce(function (outbox, item) {
            if (item >= 0) {
                for (var i = item; i >= 0; i--) {
                    outbox.push(i);
                }
            } else {
                for (var i = item; i <= 0; i++) {
                    outbox.push(i);
                }
            }

            return outbox;
        }, []);
    },
    /*** Multiplication Workshop ***/
    '20': function (inbox) {
        // For each pair, output their product
        return splitGroups(inbox, 2).map(function (pair) {
            return pair[0] * pair[1];
        });
    },
    /*** Zero Terminated Sum ***/
    '21': function (inbox) {
        return splitStrings(inbox)
            .map(function (string) {
                return string.reduce(function (sum, item) {
                    return sum + item;
                }, 0);
            });
    },
    /*** Fibonacci Visitor ***/
    '22': function (inbox) {
        return inbox.reduce(function (outbox, item) {
            var i = 1,
                j = 1,
                tmp;

            do {
                outbox.push(i);
                tmp = j;
                j += i;
                i = tmp;
            } while (i <= item);

            return outbox;
        }, []);
    },
    /*** The Littlest Number ***/
    '23': function (inbox) {
        return splitStrings(inbox).map(function (string) {
            return Math.min.apply(null, string);
        });
    },
    /*** Mod Module ***/
    '24': function (inbox) {
        // For each pair, output the modulus
        return splitGroups(inbox, 2).map(function (pair) {
            return pair[0] % pair[1];
        });
    },
    /*** Cumulative Countdown ***/
    '25': function (inbox) {
        // Sum of all numbers up to and including item
        return inbox.map(function (item) {
            return item * (item + 1) / 2;
        });
    },
    /*** Small Divide ***/
    '26': function (inbox) {
        // For each pair, output the quotient
        return splitGroups(inbox, 2).map(function (pair) {
            return Math.floor(pair[0] / pair[1]);
        });
    },
    /*** Three Sort ***/
    '28': function (inbox) {
        // For each triple, sort then output
        return splitGroups(inbox, 3).reduce(function (outbox, triplet) {
            return outbox.concat(triplet.sort());
        }, []);
    },
    /*** Storage Floor ***/
    '29': function (inbox) {
        var tiles = tilesForLevel[29];

        // Lookup floor tiles
        return inbox.map(function (item) {
            return tiles[item];
        });
    },
    /*** String Storage Floor ***/
    '30': undefined,
    /*** String Reverse ***/
    '31': function (inbox) {
        // Reverse strings and output
        return splitStrings(inbox).reduce(function (outbox, string) {
            return outbox.concat(string.reverse());
        }, []);
    },
    /*** Inventory Report ***/
    '32': undefined,
    /*** Vowel Incinerator ***/
    '34': undefined,
    /*** Duplicate Removal ***/
    '35': undefined,
    /*** Alphabetizer ***/
    '36': undefined,
    /*** Scavenger Chain ***/
    '37': undefined,
    /*** Digit Exploder ***/
    '38': undefined,
    /*** Re-Coordinator ***/
    '39': undefined,
    /*** Prime Factory ***/
    '40': function (inbox) {
        // Output prime factors smallest to largest of each number
        return inbox.reduce(function (outbox, item) {
            return outbox.concat(pf(item));
        }, []);
    },
    /*** Sorting Floor ***/
    '41': function (inbox) {
        // Split strings, sort items in each string, then output all strings
        return splitStrings(inbox)
            .map(function (string) {
                return string.sort();
            })
            .reduce(function (output, string) {
                return output.concat(string);
            });
    }
};

exports.generate = function (levelNumber, inbox) {
    var generator = generators[levelNumber];

    if (!generator) {
        return null;
    }

    return generator(inbox);
};
