(function ($) {

    $.getScript("//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js");
    $.getScript("//cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/1.4.14/jquery.scrollTo.min.js");

    $('body').click(function () {
        $('.skillselect').barrating('show', {
            onSelect: $.fn.skillEngine.chart
        });
    });

    $.fn.skillEngine = function ($mode, options) {

        this.options = $.extend({
            'apikey': this.data('apikey'),
            'id': (typeof this.data('skill-id') === 'undefined' || this.data('skill-id') == "") ? 0 : this.data('skill-id'),
        }, $.fn.skillEngine.defaults, options);

        this.adam = $(this);

        switch ($mode) {

            case "output":
                return $.fn.skillEngine.output(this);
                break;

            case "input":
                $.fn.skillEngine.input(this, options.data);
                break;

            case "preview":
                $.fn.skillEngine.preview(this);
                break;

            case "search":
                $.fn.skillEngine.search(this, options.wrapper);
                break;

            default:
                $.fn.skillEngine.setupCSS();
                $.fn.skillEngine.setupHTML(this);
                $.fn.skillEngine.request(this);

                var self = this;
                return this.each(function () {

                    var tree = $(this);

                    $('#skill-count-scroll').on('scroll', function () {

                        var top = $("input[name='skills[]']:above-the-top:checked").each(function (key, value) {

                            return value;
                        });
                        var bottom = $("input[name='skills[]']:below-the-fold:checked").each(function (key, value) {

                            return value;
                        });
                        $('#skill-top-count').text('Skills seleceted @ top #' + top.length);
                        $('#skill-bottom-count').text('Skills seleceted @ bottom #' + bottom.length);
                    });

                    $(tree).on('click', 'ul li a', function () {

                        var id = $(this).parent('li')[0].id;
                        self.selector = 'li#' + id;
                        self.options.id = id;
                        $.fn.skillEngine.beautify(self);
                        if ($(self.selector).attr('data-appended') == "false" && ($(self.selector).attr('data-is_child') == 1 || $(self.selector).attr('data-is_child') == 2)) {

                            $.fn.skillEngine.request(self);
                        }
                    });
                });
        }
    };

    $.fn.skillEngine.defaults = {};

    $.fn.skillEngine.type = ['functionals', 'behavioural', 'managerial'];

    $.fn.skillEngine.input = function (obj, $data) {

        $.fn.skillEngine.buildTree(obj.selector, $data, 'MM');
    }

    $.fn.skillEngine.output = function (obj) {

        $output = [];
        $.each($('input[name="skills[]"]:checkbox:checked').parents('li'), function (index, value) {

            $output.push($(value).data());
        });

        if ($output.length > 0) {
            return(JSON.stringify($output.reverse()));
        }
        else {

            return 'Please select aleast one functional skill!';

        }
    }

    $.fn.skillEngine.preview = function (obj) {
        $modal = $('div#myModal div.modal-body');
        $modal.html('<div class="easy-tree">' + $.fn.skillEngine.buildTree('', $.fn.skillEngine.output(obj), 'PRE') + '</div>');
    }

    /* Loading HTML */
    $.fn.skillEngine.setupHTML = function (obj) {


        $blueprint = '<div class="content no-padding">';
        $blueprint += '<div class="iys-bg">';
        $blueprint += '<div class="col-lg-12 col-sm-12 col-md-12">';
        $blueprint += '<div class="yellow_bg_head">';

        switch (obj.options.type) {
            case 'functionals':
                $blueprint += '<h2>Functional Skills</h2>';
                break;
            case 'behavioural':
                $blueprint += '<h2>Behavioural Skills</h2>';
                break;
            case 'managerial':
                $blueprint += '<h2>Managerial Skills</h2>';
                break;
        }
        switch (obj.options.type) {
            case 'functionals':
                $blueprint += '<a class="iys-edit"><div id="skill-top-count"></div></a>';
                break;
        }

        $blueprint += '</div>';
        $blueprint += '<div id="iys-arrow"></div>';
        $blueprint += '<div id="skill-count-scroll" class="content_2 iys-min-ht">';
        $blueprint += '<ul class="easy-tree" id="0"></ul>';
        $blueprint += '</div>';

        switch (obj.options.type) {
            case 'functionals':
                $blueprint += '<a class="iys-edit"><div id="skill-bottom-count"></div></a>';
                break;
        }

        $blueprint += '<div class="clearfix"></div>';
        $blueprint += '</div>';
        $blueprint += '</div>';
        $blueprint += '</div>';

        $previewModal = '<div class="modal fade" data-backdrop="false" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
        $previewModal += '<div class="modal-dialog modal-lg">';
        $previewModal += '<div class="modal-content">';
        $previewModal += '<div class="modal-header">';
        $previewModal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
        $previewModal += '<h4 class="modal-title" id="myModalLabel">Skill Preview</h4>';
        $previewModal += '</div>';
        $previewModal += '<div class="modal-body">';
        $previewModal += '</div>';
        $previewModal += '<div class="modal-footer">';
        $previewModal += '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
        $previewModal += '</div>';
        $previewModal += '</div>';
        $previewModal += '</div>';
        $previewModal += '</div>';

        $(obj).append($blueprint);
        $('body').append($previewModal);
    }

    /* Loading the CSS */
    $.fn.skillEngine.setupCSS = function () {

        $("<link>", {rel: "stylesheet", type: "text/css", href: "//netdna.bootstrapcdn.com/bootstrap/3.1.0/css/bootstrap.min.css"}).appendTo('head');
        $("<link>", {rel: "stylesheet", type: "text/css", href: "//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css"}).appendTo('head');
        $("<link>", {rel: "stylesheet", type: "text/css", href: "https://www.itsyourskills.com/css/iys.css"}).appendTo('head');
        $("<link>", {rel: "stylesheet", type: "text/css", href: "https://www.itsyourskills.com/css/select2.css"}).appendTo('head');
    }

    /* Beautify the icons */
    $.fn.skillEngine.beautify = function (obj) {

        var $skillChecked = $(obj.selector).find("input:checked").each(function () {

            return true;
        });
        $(obj.selector).siblings().children('i').alterClass('fa-*', 'fa-plus-circle');
        if ($skillChecked.length > 0) {
            $(obj.selector + ' > i').alterClass('fa-*', ' fa-check-circle-o ');
        }
        else {

            if ($(obj.selector).children('ul:visible').length < 1 || $(obj.selector).children('ul').length == 0) {

                $(obj.selector + ' > i').alterClass('fa-*', 'fa-minus-circle');
            }
            else {

                $(obj.selector + ' > i').alterClass('fa-*', 'fa-plus-circle');
            }
        }

        $.fn.skillEngine.switch(obj);
    }

    $.fn.skillEngine.switch = function (obj) {

        var $skillChecked = $(document).find('input[name="skills[]"]:checkbox').each(function () {

//                    $('li#0').hide();
//                    if ($(this).is(":checked")) {
//
//                        console.log($(this).parents());
//                    }

            $(this).not(":checked").closest('li').hide();
//                    $(this).not(":checked").prev().siblings('ul').hide();
        });
//                console.log($(obj.selector).siblings('li'));

//                $.each($(obj.selector).siblings('li'), function (key, value) {
//
//                    console.log($(value).find('input[name="skills[]"]:checkbox').not(":checked").closest('li').hide());
//                });

        if ($(obj.selector).children('ul').length < 1 || $(obj.selector).children('ul').is(':hidden')) {

            $(obj.selector).children('ul').show();
            $(obj.selector).children('ul').children('li').show();
        }
        else {

            if ($(obj.selector).attr('data-appended') == "true") {

                $(obj.selector).children('ul').hide();
                $(obj.selector).children('ul').children('li').hide();
            }
        }
    }

    /* Request Skills using access token*/
    $.fn.skillEngine.request = function (obj) {

        $(obj.selector).children('i').addClass('fa-spin');
        $.ajax({
            url: 'https://iys.p.mashape.com/' + obj.options.id + '/' + obj.options.type,
            type: 'GET',
            datatype: 'json',
            headers: {'X-Mashape-Authorization': obj.options.apikey},
            success: function (data) {

                $.fn.skillEngine.buildTree(obj.adam.selector, data, 'MM');
                $(obj.selector).attr('data-appended', true);
                $(obj.selector).children('i').removeClass('fa-spin');
            },
            error: function (err) {
                alert('Ajax Error: Check console log');
                console.log(err);
            }
        });
    }

    /* Search Skills*/
    $.fn.skillEngine.search = function (obj) {

        function formatResult(item) {
            // return item template
            var treeArr = item.text.replace(/[(:\d_)]+/g, '@@@').split('@@@');
            treeArr = treeArr.slice(1, treeArr.length - 1),
                    skillname = treeArr[0], categories = [], catstr = '';
            if (treeArr.length >= 3) {
                categories = treeArr.slice(treeArr.length - 2);
            } else if (treeArr.length == 2) {
                categories.push(treeArr[1]);
            } else {
                //
            }
            catstr = (categories.length > 0 ? ('<div><smaller>(' + categories.join(' <i class="fa fa-angle-double-left"></i> ') + ')</smaller></div>') : '');
            return '<div><b>' + skillname + '</b></div>' + catstr;
        }

        function formatSelection(item) {
            return '';
        }
        function covertTreeValueToJson($e) {

            $original = $e.val.split('|^|');
            $childscale = $original[1].split('_');
            $skillsDetails = $original[0].substring(1, $original[0].length - 1).split(':');

            $ka = [];

            $.each($skillsDetails, function (key, value) {

                $k = {};
                $temp = value.split('_');
                $k.id = parseInt($temp[0]);
                $k.value = $temp[1];
                if ($skillsDetails.length - 1 > key) {

                    $k.parent_id = parseInt($skillsDetails[key + 1].split('_')[0]);
                }
                else {
                    $k.parent_id = 0;
                }

                if (key == 0) {
                    $k.is_child = parseInt($childscale[0]);
                    $k.scale_type = parseInt($childscale[1]);
                }
                else {

                    $k.is_child = 1;
                }

                $ka.push($k);
            });

            $.fn.skillEngine.buildTree(obj.adam.selector, $ka, 'MM', 'SEA');
        }

        $.getScript("https://www.itsyourskills.com/js/select2.js").done(function () {

            $('.keyword').select2({
                placeholder: "Please Enter Your skill",
                minimumInputLength: 2,
                allowClear: true,
                multiple: false,
                openOnEnter: true,
                quietMillis: 2000,
                ajax: {
                    url: 'https://www.itsyourskills.com/skill_proxy.php',
                    dataType: 'json',
                    cache: "true",
                    data: function (term) {
                        return {
                            term: term,
                        };
                    },
                    results: function (data, callback) {

                        var datum = [];
                        $.each(data, function (key, value) {
                            var compressedSkill = value.skillKey;
                            datum.push({'id': compressedSkill, 'text': value.tree_id_value});
                        });
                        return {results: datum};
                    }
                },
                formatResult: formatResult,
                formatSelection: formatSelection

            }).on("change", covertTreeValueToJson);
        });
    }

    $.fn.skillEngine.buildTree = function ($adam, $data, $mode, $opt) {

        if ($mode == 'MM') {

            readymade = function ($data, $parent) {

                if (typeof $parent === "undefined" || $parent === null) {

                    $parent = 0;
                }

                for (var i = 0; i < $data.length; i++) {

                    if (parseInt($data[i].parent_id) == parseInt($parent)) {

                        $tree = treeList($data[i]);
                        readymade($data, parseInt($data[i].id));
                    }
                    else {

                        $tree = treeList($data[i]);
//                        break; // for performance make it break
                    }
                }
            }

            treeList = function ($data) {

                $tree = '';
                $tree += '<li id="' + $data.id + '" data-value="' + $data.value + '" data-parent_id="' + $data.parent_id + '" data-is_child="' + $data.is_child + '" data-id="' + $data.id + '" ' + (($data.is_child == 1) ? 'data-appended="false"' : 'data-rating="" data-scale_type="' + $data.scale_type + '"') + ' >';

                if ($data.is_child == 1) {

                    $tree += '<i class="fa  fa-plus-circle  text-success"></i>';
                    $tree += '<a class="btn">' + $data.value + '</a>';
                }

                if ($data.is_child == 0 || $data.is_child == 2) {

                    $tree += '<span class="checkbox text-info text-sm">';
                    $tree += '<label>';
                    $tree += '<input type="checkbox" class="skillcheck" name="skills[]" id="skillcheck-' + $data.id + '" data-id="' + $data.id + '"';
                    if (typeof $data.rating === "undefined" || $data.rating === null || $data.rating == "") {


                    }
                    else {

                        $tree += ' checked="true"';
                    }

                    $tree += '>';
                    $tree += $data.value;
                    $tree += '</label>';
                    $tree += '</span>';
                    $tree += '<div class="rating-f experties_dashboard">';
                    $tree += '<select class="skillselect"  name="skills-rating[]" id="skillselect-' + $data.id + '" data-id="' + $data.id + '">';
                    $tree += $.fn.skillEngine.scaleType($data.scale_type, $data.rating);
                    $tree += '</select>';
                    $tree += '</div>';
                }

                $tree += '</li>';

                $element = $adam + ' li#' + $data.parent_id;

                if (!$($adam + ' li#' + $data.id).length) {

                    if ($data.parent_id == 0) {
                        $($adam + ' ul#0').append($tree);
                    }

                    if ($($element).has('ul').length) {

                        $($element + ' > ul').append($tree);
                    } else {

                        $($element).append('<ul>' + $tree + '</ul>');
                    }
                }

                $($adam + ' li#' + $data.id).show();
                $($adam + ' li#' + $data.id + ' > ul').show();

                if ($opt == 'SEA') {

                    $('div.iys-min-ht').scrollTo('#skillcheck-' + $data.id, 1000);
                }
            }

            readymade($data);
            $('body').trigger('click');
        }

        if ($mode == 'PRE') {

            readymade = function ($data, $parent) {

                if (typeof $parent === "undefined" || $parent === null) {

                    $parent = 0;
                }

                $tree = '';

                if ($parent != 0) {

                    $tree += '<ul>';
                }

                for (var i = 0; i < $data.length; i++) {

                    if ($data[i]['parent_id'] == $parent) {

                        $tree += '<li id="' + $data[i].id + '" data-value="' + $data[i].value + '" data-scale_type="' + $data[i].scale_type + '" data-parent_id="' + $data[i].parent_id + '" data-is_child="' + $data[i].is_child + '" data-id="' + $data[i].id + '" ' + (($data[i].is_child == 1) ? 'data-appended="false"' : 'data-rating=""') + ' >';
                        if ($data[i].is_child == 1) {

                            $tree += '<i class="fa  fa-check-circle-o  text-success"></i>';
                            $tree += '<a class="btn">' + $data[i].value + '</a>';
                        }

                        $tree += readymade($data, $data[i]['id']);
                        if ($data[i].is_child == 0 || $data[i].is_child == 2) {
                            $tree += '<span class="checkbox text-info text-sm">';
                            $tree += '<label>';
                            $tree += $data[i].value;
                            $tree += '</label>';
                            $tree += '</span>';
                            $tree += '<div class="rating-f experties_dashboard">';
                            $tree += '<select class="skillselect" disable="true"  name="skills-rating[]" id="skillselect-' + $data[i].id + '" data-id="' + $data[i].id + '">';
                            $tree += $.fn.skillEngine.scaleType($data[i].scale_type, parseInt($data[i].rating));
                            $tree += '</select>';
                            $tree += '</div>';
                        }

                        $tree += '</li>';
                    }
                }

                if ($parent != 0) {

                    $tree += '</ul>';
                }
                return $tree;
            }

            return readymade(JSON.parse($data));
        }

    }

    $.fn.skillEngine.scaleType = function (type, rate) {

        var scale_type = [{"id": "1", "scale": "Novice:Competent:Proficient:Expert:Master"}, {"id": "2", "scale": "0 - 2 yrs exp:2 - 5 yrs exp:5 - 10 yrs exp:10 - 20 yrs exp: 20 plus yrs exp"}, {"id": "4", "scale": "Fair:Good:Very Good:Excellent:Outstanding"}, {"id": "5", "scale": "1 - 5:6 - 10:11 - 50:51 - 200:&gt;200"}, {"id": "6", "scale": "Low:Medium:High:Very High:Extreme"}, {"id": "7", "scale": "&lt;10:10 - 50:50 - 100:100 - 200:&gt;200"}, {"id": "8", "scale": "&lt; 1 Mn:1 - 2 Mn:2 - 5 Mn:5 - 10 Mn:&gt; 10 Mn"}, {"id": "9", "scale": "Experience in compliance:Experience in making improvements:Experience in driving implementation:Experience in making changes:Experience in conceptualising and strategising"}, {"id": "10", "scale": "Mostly compliance:Made improvements:Led small scale implementation:Led large scale implementation:Conceptualised \/ Strategised"}, {"id": "11", "scale": "Compliance:Improvement:Implementation Team:Implementation Head:Strategy"}, {"id": "12", "scale": "Operational Level:Junior Mgmt:Middle Mgmt:Senior Mgmt:CXO Level"}, {"id": "13", "scale": "Making Improvements:Adding Features:Involved in NPD:Driving NPD:Strategy for NPD"}, {"id": "14", "scale": "&lt; 1 Month:1-3 Months:3-12 Months:1-2 Years:&gt;2 Years"}, {"id": "15", "scale": "Level 1:Level 2:Level 3:Level 4:Level 5"}];
        scale_split = scale_type[type].scale.split(':');
        var scale = '<option value=""></option>';

        $.each(scale_split, function (index, value) {

            if (rate == index) {
                scale += '<option value="' + (index) + '" selected="selected">' + value + '</option>';
            } else {

                scale += '<option value="' + (index) + '">' + value + '</option>';
            }
        });
        return scale;
    }

//    $.fn.skillEngine.rating = function () {
//
//        $(document).on('ajaxComplete load ready', function () {
//
//            $('.skillcheck').on('click', function () {
//
//                //                $(this).prop("checked", false);
//                $('#skillselect-' + $(this).data('id')).barrating('clear');
//                $('#skills-count').text($('input[name="skills[]"]:checkbox:checked').length);
//            });
//
//            $('.skillselect').barrating('show', {
//                onSelect: $.fn.skillEngine.chart
//            });
//        });
//    }

    $.fn.skillEngine.chart = function (value, text) {

        var skillid = $(this).parent().siblings('select.skillselect').data('id');
        $('#skill-chart').addClass('graph');

        if (value != '') {

            $('li#' + skillid).data('rating', value);
            $('#skillcheck-' + skillid).prop("checked", true);
            $('#skill-chart').children('div').removeClass('active-bar');

            if ($('div#chart-' + skillid).length) {

                $('div#chart-' + skillid).remove();
            }

            $('#skill-chart').append('<div id="chart-' + skillid + '" data-toggle="tooltip" data-placement="top" title="' + $('li#' + skillid).data('value') + '" style="height: ' + ((parseInt(value) + 1) * 20) + '%;" class="bar active-bar"></div>');
            $('#skill-chart-text').text($('li#' + skillid).data('value'));
        }
        else {

            $('#skillcheck-' + skillid).prop("checked", false);
            $('div#chart-' + skillid).remove();
        }

        $('#skills-count').text($('input[name="skills[]"]:checkbox:checked').length);
    }

    /* Alter Class */
    $.fn.alterClass = function (removals, additions) {

        var self = this;
        if (removals.indexOf('*') === -1) {
            self.removeClass(removals);
            return !additions ? self : self.addClass(additions);
        }

        var patt = new RegExp('\\s' +
                removals.
                replace(/\*/g, '[A-Za-z0-9-_]+').
                split(' ').
                join('\\s|\\s') +
                '\\s', 'g');
        self.each(function (i, it) {
            var cn = ' ' + it.className + ' ';
            while (patt.test(cn)) {
                cn = cn.replace(patt, ' ');
            }
            it.className = $.trim(cn);
        });
        return !additions ? self : self.addClass(additions);
    }
    /* End of Alter Class */

//    $.uuid = function () {
//
//        var d = new Date().getTime();
//        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//            var r = (d + Math.random() * 16) % 16 | 0;
//            d = Math.floor(d / 16);
//            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
//        });
//        return uuid;

//        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//            return v.toString(16);
//        });
//    };

    /* View Port*/
    $.belowthefold = function (element, settings) {
        var fold = $(window).height() + $(window).scrollTop();
        return fold <= $(element).offset().top - settings.threshold;
    };
    $.abovethetop = function (element, settings) {
        var top = $(window).scrollTop();
        return top >= $(element).offset().top + $(element).height() - settings.threshold;
    };
    $.rightofscreen = function (element, settings) {
        var fold = $(window).width() + $(window).scrollLeft();
        return fold <= $(element).offset().left - settings.threshold;
    };
    $.leftofscreen = function (element, settings) {
        var left = $(window).scrollLeft();
        return left >= $(element).offset().left + $(element).width() - settings.threshold;
    };
    $.inviewport = function (element, settings) {
        return !$.rightofscreen(element, settings) && !$.leftofscreen(element, settings) && !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
    };
    $.extend($.expr[':'], {
        "below-the-fold": function (a, i, m) {
            return $.belowthefold(a, {threshold: 0});
        },
        "above-the-top": function (a, i, m) {
            return $.abovethetop(a, {threshold: 0});
        },
        "left-of-screen": function (a, i, m) {
            return $.leftofscreen(a, {threshold: 0});
        },
        "right-of-screen": function (a, i, m) {
            return $.rightofscreen(a, {threshold: 0});
        },
        "in-viewport": function (a, i, m) {
            return $.inviewport(a, {threshold: 0});
        }
    });
    /* End of  View Port*/

    /* Bar Rating */
    var BarRating, root, hasTouch;
    root = typeof window !== "undefined" && window !== null ? window : global;
    hasTouch = 'ontouchstart'in root;
    root.BarRating = BarRating = (function () {
        function BarRating() {

            this.show = function () {
                var $this = $(this.elem), $widget, $all, userOptions = this.options, nextAllorPreviousAll, initialOption, clickEvent = hasTouch ? 'touchstart' : 'click';

                if (!$this.data('barrating')) {

                    if (userOptions.initialRating) {

                        initialOption = $('option[value="' + userOptions.initialRating + '"]', $this);
                    } else {

                        initialOption = $('option:selected', $this);
                    }

                    $this.data('barrating', {currentRatingValue: initialOption.val(), currentRatingText: initialOption.text(), originalRatingValue: initialOption.val(), originalRatingText: initialOption.text()});
                    $widget = $('<div />', {'class': 'br-widget'}).insertAfter($this);

                    $this.find('option').each(function () {

                        var val, text, $a, $span;
                        val = $(this).val();
                        if (val) {

                            text = $(this).text();
                            $a = $('<a />', {href: '#', 'data-rating-value': val, 'data-rating-text': text});
                            $span = $('<span />', {text: (userOptions.showValues) ? text : ''});
                            $widget.append($a.append($span));
                        }
                    });

                    if (userOptions.showSelectedRating) {
                        $widget.append($('<div />', {text: '', 'class': 'br-current-rating'}));
                    }

                    $this.data('barrating').deselectable = (!$this.find('option:first').val()) ? true : false;

                    if (userOptions.reverse) {

                        nextAllorPreviousAll = 'nextAll';
                    } else {

                        nextAllorPreviousAll = 'prevAll';
                    }

                    if (userOptions.reverse) {

                        $widget.addClass('br-reverse');
                    }

                    if (userOptions.readonly) {

                        $widget.addClass('br-readonly');
                    }

                    $widget.on('ratingchange', function (event, value, text) {

                        var selBx = null;
                        value = value ? value : $this.data('barrating').currentRatingValue;
                        text = text ? text : $this.data('barrating').currentRatingText;
                        selBx = $this.find('option[value="' + value + '"]');
                        selBx.prop('selected', true);

                        if (userOptions.showSelectedRating) {

                            $(this).find('.br-current-rating').text(text);
                        }

                    }).trigger('ratingchange');

                    $widget.on('updaterating', function (event) {

                        $(this).find('a[data-rating-value="' + $this.data('barrating').currentRatingValue + '"]').addClass('br-selected br-current')[nextAllorPreviousAll]().addClass('br-selected');
                    }).trigger('updaterating');

                    $all = $widget.find('a');

                    if (hasTouch || userOptions.readonly) {

                        $all.on('click', function (event) {

                            event.preventDefault();
                        });
                    }

                    if (!userOptions.readonly) {

                        $all.on(clickEvent, function (event) {

                            var $a = $(this), value, text;
                            event.preventDefault();
                            $all.removeClass('br-active br-selected');
                            $a.addClass('br-selected')[nextAllorPreviousAll]().addClass('br-selected');
                            value = $a.attr('data-rating-value');
                            text = $a.attr('data-rating-text');

                            if ($a.hasClass('br-current') && $this.data('barrating').deselectable) {

                                $a.removeClass('br-selected br-current')[nextAllorPreviousAll]().removeClass('br-selected br-current');
                                value = '', text = '';

                                if (!$.isEmptyObject($a.parent().prev('label')))
                                    $a.parent().prev('label').show();
                            } else {

                                $all.removeClass('br-current');
                                $a.addClass('br-current');

                                if (!$.isEmptyObject($a.parent().prev('label')))
                                    $a.parent().prev('label').hide();
                            }

                            $this.data('barrating').currentRatingValue = value;
                            $this.data('barrating').currentRatingText = text;
                            $widget.trigger('ratingchange');

                            userOptions.onSelect.call(this, $this.data('barrating').currentRatingValue, $this.data('barrating').currentRatingText);
                            return false;
                        });

                        if (!hasTouch) {

                            $all.on({mouseenter: function () {

                                    var $a = $(this);
                                    $all.removeClass('br-active').removeClass('br-selected');
                                    $a.addClass('br-active')[nextAllorPreviousAll]().addClass('br-active');
                                    $widget.trigger('ratingchange', [$a.attr('data-rating-value'), $a.attr('data-rating-text')]);
                                }});

                            $widget.on({mouseleave: function () {

                                    $all.removeClass('br-active');
                                    $widget.trigger('ratingchange').trigger('updaterating');
                                }});
                        }
                    }
                    $this.hide();
                }
            }

            this.clear = function () {

                var $this = $(this.elem);
                var $widget = $this.next('.br-widget');

                if ($widget && $this.data('barrating')) {

                    $widget.find('a').removeClass('br-selected br-current');
                    $this.data('barrating').currentRatingValue = $this.data('barrating').originalRatingValue;
                    $this.data('barrating').currentRatingText = $this.data('barrating').originalRatingText;
                    $widget.trigger('ratingchange').trigger('updaterating');

                    this.options.onClear.call(this, $this.data('barrating').currentRatingValue, $this.data('barrating').currentRatingText);
                }
            }

            this.destroy = function () {

                var $this = $(this.elem);
                var $widget = $this.next('.br-widget');

                if ($widget && $this.data('barrating')) {

                    var value = $this.data('barrating').currentRatingValue;
                    var text = $this.data('barrating').currentRatingText;
                    $this.removeData('barrating');
                    $widget.off().remove();
                    $this.show();

                    this.options.onDestroy.call(this, value, text);
                }
            }
        }
        BarRating.prototype.init = function (options, elem) {
            var self;
            self = this;
            self.elem = elem;
            return self.options = $.extend({}, $.fn.barrating.defaults, options);
        };
        return BarRating;
    })();

    $.fn.barrating = function (method, options) {
        return this.each(function () {
            var plugin = new BarRating();
            if (!$(this).is('select')) {
                $.error('Sorry, this plugin only works with select fields.');
            }
            if (plugin.hasOwnProperty(method)) {
                plugin.init(options, this);
                return plugin[method]();
            } else if (typeof method === 'object' || !method) {
                options = method;
                plugin.init(options, this);
                return plugin.show();
            } else {
                $.error('Method ' + method + ' does not exist on jQuery.barrating');
            }
        });
    };
    return $.fn.barrating.defaults = {
        initialRating: null,
        showValues: false,
        showSelectedRating: true,
        reverse: false,
        readonly: false,
        onSelect: function (value, text) {
        },
        onClear: function (value, text) {
        },
        onDestroy: function (value, text) {
        }};
    /* End of Bar Rating */
})($);