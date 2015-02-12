(function ($) {

    $.getScript("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js");

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
            return(JSON.stringify($output));
        }
        else {

            return 'Please select aleast one functional skill!';

        }
    }

    $.fn.skillEngine.preview = function (obj) {

        $('div#myModal div.modal-body').addClass('easy-tree');
        $('div#myModal div.modal-body').html($.fn.skillEngine.buildTree('', $.fn.skillEngine.output(obj), 'PRE'));
    }

    /* Loading HTML */
    $.fn.skillEngine.setupHTML = function (obj) {


        $blueprint = '<div class="content no-padding">';
        $blueprint += '<div class="iys-bg">';
        $blueprint += '<div class="col-lg-12 col-sm-12 col-md-12">';
        $blueprint += '<div class="yellow_bg_head">';
        $blueprint += '<h2>Functional Skills</h2>';
        $blueprint += '<a class="iys-edit"><div id="skill-top-count"></div></a>';
        $blueprint += '</div>';
        $blueprint += '<div id="iys-arrow"></div>';
        $blueprint += '<div id="skill-count-scroll" class="content_2 iys-min-ht">';
        $blueprint += '<ul class="easy-tree" id="0"></ul>';
        $blueprint += '</div>';
        $blueprint += '<div class="yellow_bg_head">';
        $blueprint += '<a class="iys-edit"><div id="skill-bottom-count"></div></a>';
        $blueprint += '</div>';
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

            $.fn.skillEngine.buildTree(obj.adam.selector, $ka, 'MM');
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

    $.fn.skillEngine.buildTree = function ($adam, $data, $mode) {

        $data = $data.reverse();
//        console.log(JSON.stringify($data));

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
//                $($adam).scrollTo('li#' + $data.id + ':checked');
//                $('#functionals').animate({scrollTop: $('li#' + $data.id + '').offset().top}, 1);
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
                            $tree += '<div class="br-widget">';
                            //                                    $tree += '<a class="br-selected" data-rating-text="0 - 2 yrs exp" data-rating-value="0" href="#"><span></span></a><a class="br-selected" data-rating-text="2 - 5 yrs exp" data-rating-value="1" href="#"><span></span></a><a class="br-current br-selected" data-rating-text="5 - 10 yrs exp" data-rating-value="2" href="#"><span></span></a><a class="" data-rating-text="10 - 20 yrs exp" data-rating-value="3" href="#"><span></span></a><a class="" data-rating-text=" 20 plus yrs exp" data-rating-value="4" href="#"><span></span></a><div class="br-current-rating">5 - 10 yrs exp</div></div>';
                            $tree += '<select class="skillselect"  name="skills-rating[]" id="skillselect-' + $data[i].id + '" data-id="' + $data[i].id + '">';
                            $tree += $.fn.skillEngine.scaleType($data[i].scale_type, $data[i].rating);
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
                scale += '<option value="' + (index + 1) + '" selected="selected">' + value + '</option>';
            } else {

                scale += '<option value="' + (index + 1) + '">' + value + '</option>';
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
        $('li#' + skillid).data('rating', value);
        $('#skillcheck-' + skillid).prop("checked", true);
        $('#skills-count').text($('input[name="skills[]"]:checkbox:checked').length);

        $('#skill-chart').children('div').removeClass('active-bar');
        $chartWidget = '<div style="height: ' + ((parseInt(value) + 1) * 20) + '%;" class="bar active-bar"></div>';

        $('#skill-chart').addClass('graph')
        $('#skill-chart').append($chartWidget);
    }

    $.fn.scrollTo = function (elem) {

        $(this).scrollTop($(this).scrollTop() - $(this).offset().top + $(elem).offset().top);
        return this;
    };

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

    $.uuid = function () {

        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;

//        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//            return v.toString(16);
//        });
    };

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

/*Trigger the required plugins*/

$json1 = [{"value": "Engineering", "scale_type": 1, "parent_id": 0, "is_child": 1, "id": 2866844, "rating": "", "appended": false}, {"value": "Earthquake Engineering", "scale_type": 1, "parent_id": 2866844, "is_child": 1, "id": 2872022, "rating": "", "appended": false}, {"value": "Earthquake Resistant Constructions", "scale_type": 1, "parent_id": 2872022, "is_child": 1, "id": 2872088, "rating": "", "appended": false}, {"rating": "3", "value": "Limestone & Sandstone Structures", "scale_type": 1, "parent_id": 2872088, "is_child": 0, "id": 2872094, "appended": false}, {"rating": "1", "value": "Prediction of Earthquake Losses", "scale_type": 1, "parent_id": 2872022, "is_child": 0, "id": 2872085, "appended": false}, {"value": "Seismic Design", "scale_type": 1, "parent_id": 2872022, "is_child": 1, "id": 2872076, "rating": "", "appended": false}, {"rating": "2", "value": "Seismic Design Criteria", "scale_type": 1, "parent_id": 2872076, "is_child": 0, "id": 2872079, "appended": false}, {"value": "Seismic Vibration Control Techniques", "scale_type": 1, "parent_id": 2872022, "is_child": 1, "id": 2872049, "rating": "", "appended": false}, {"rating": "3", "value": "Springs-with-Damper Base Isolator", "scale_type": 1, "parent_id": 2872049, "is_child": 0, "id": 2872070, "appended": false}, {"rating": "1", "value": "Friction Pendulum Bearing", "scale_type": 1, "parent_id": 2872049, "is_child": 0, "id": 2872061, "appended": false}, {"rating": "2", "value": "Dry-Stone Walls Control", "scale_type": 1, "parent_id": 2872049, "is_child": 0, "id": 2872052, "appended": false}, {"value": "Earthquake Engineering Research", "scale_type": 1, "parent_id": 2872022, "is_child": 1, "id": 2872040, "rating": "", "appended": false}, {"rating": "3", "value": "Earthquake Simulation", "scale_type": 1, "parent_id": 2872040, "is_child": 0, "id": 2872043, "appended": false}, {"value": "Seismic Structural Analysis", "scale_type": 1, "parent_id": 2872022, "is_child": 1, "id": 2872031, "rating": "", "appended": false}, {"rating": "4", "value": "Experimental Assessment", "scale_type": 1, "parent_id": 2872031, "is_child": 0, "id": 2872034, "appended": false}, {"value": "Mechanical", "scale_type": 1, "parent_id": 2866844, "is_child": 1, "id": 2867276, "rating": "", "appended": false}, {"value": "Design Process / Activities", "scale_type": 1, "parent_id": 2867276, "is_child": 1, "id": 2867355, "rating": "", "appended": false}, {"rating": "1", "value": "Detailing", "scale_type": 1, "parent_id": 2867355, "is_child": 0, "id": 2867358, "appended": false}, {"value": "Piping", "scale_type": 1, "parent_id": 2866844, "is_child": 1, "id": 2867047, "rating": "", "appended": false}, {"value": "Activities", "scale_type": 1, "parent_id": 2867047, "is_child": 1, "id": 2867053, "rating": "", "appended": false}, {"rating": "2", "value": "Conceptual Design Preparation", "scale_type": 1, "parent_id": 2867053, "is_child": 0, "id": 2867054, "appended": false}, {"value": "Arts, Crafts, Sports", "scale_type": 1, "parent_id": 0, "is_child": 1, "id": 2838516, "rating": "", "appended": false}, {"value": "Craftwork", "scale_type": 1, "parent_id": 2838516, "is_child": 1, "id": 2838805, "rating": "", "appended": false}, {"value": "Type of Craftwork", "scale_type": 1, "parent_id": 2838805, "is_child": 1, "id": 2838806, "rating": "", "appended": false}, {"rating": "3", "value": "Toy Making", "scale_type": 1, "parent_id": 2838806, "is_child": 0, "id": 2838820, "appended": false}, {"rating": "4", "value": "Relief Painting", "scale_type": 1, "parent_id": 2838806, "is_child": 0, "id": 2838818, "appended": false}, {"rating": "1", "value": "Canvas Painting", "scale_type": 1, "parent_id": 2838806, "is_child": 0, "id": 2838809, "appended": false}, {"rating": "2", "value": "Art Glass", "scale_type": 1, "parent_id": 2838806, "is_child": 0, "id": 2838807, "appended": false}, {"value": "Performing Arts", "scale_type": 1, "parent_id": 2838516, "is_child": 1, "id": 2838659, "rating": "", "appended": false}, {"value": "Sub Function/ Area / Specialization", "scale_type": 1, "parent_id": 2838659, "is_child": 1, "id": 2838660, "rating": "", "appended": false}, {"value": "Music", "scale_type": 1, "parent_id": 2838660, "is_child": 1, "id": 2838682, "rating": "", "appended": false}, {"value": "Music Software", "scale_type": 1, "parent_id": 2838682, "is_child": 1, "id": 2838764, "rating": "", "appended": false}, {"rating": "3", "value": "Ardour", "scale_type": 1, "parent_id": 2838764, "is_child": 0, "id": 2838769, "appended": false}, {"rating": "4", "value": "Ableton Live", "scale_type": 1, "parent_id": 2838764, "is_child": 0, "id": 2838765, "appended": false}, {"value": "Singing", "scale_type": 1, "parent_id": 2838682, "is_child": 1, "id": 2838683, "rating": "", "appended": false}, {"rating": "1", "value": "Bass", "scale_type": 1, "parent_id": 2838683, "is_child": 0, "id": 2838686, "appended": false}, {"rating": "2", "value": "Alto", "scale_type": 1, "parent_id": 2838683, "is_child": 0, "id": 2838684, "appended": false}, {"value": "Acting", "scale_type": 1, "parent_id": 2838660, "is_child": 1, "id": 2838661, "rating": "", "appended": false}, {"rating": "3", "value": "Theatre", "scale_type": 1, "parent_id": 2838661, "is_child": 0, "id": 2838664, "appended": false}, {"rating": "4", "value": "Movies", "scale_type": 1, "parent_id": 2838661, "is_child": 0, "id": 2838662, "appended": false}, {"value": "Sports & Fitness", "scale_type": 1, "parent_id": 2838516, "is_child": 1, "id": 2838615, "rating": "", "appended": false}, {"value": "Sports Area", "scale_type": 1, "parent_id": 2838615, "is_child": 1, "id": 2838616, "rating": "", "appended": false}, {"rating": "1", "value": "Basketball", "scale_type": 1, "parent_id": 2838616, "is_child": 0, "id": 2838622, "appended": false}, {"rating": "2", "value": "Adventure Sports", "scale_type": 1, "parent_id": 2838616, "is_child": 0, "id": 2838617, "appended": false}, {"value": "Information Technology", "scale_type": 1, "parent_id": 0, "is_child": 1, "id": 2822824, "rating": "", "appended": false}, {"value": "Tools / Technologies /  Environment", "scale_type": 1, "parent_id": 2822824, "is_child": 1, "id": 2833200, "rating": "", "appended": false}, {"value": "Systems Related", "scale_type": 1, "parent_id": 2833200, "is_child": 1, "id": 2835051, "rating": "", "appended": false}, {"value": "Microcontrollers", "scale_type": 1, "parent_id": 2835051, "is_child": 1, "id": 2835078, "rating": "", "appended": false}, {"value": "Category", "scale_type": 1, "parent_id": 2835078, "is_child": 1, "id": 2835079, "rating": "", "appended": false}, {"rating": "3", "value": "64 Bit", "scale_type": 1, "parent_id": 2835079, "is_child": 0, "id": 2835083, "appended": false}, {"rating": "4", "value": "8 Bit", "scale_type": 1, "parent_id": 2835079, "is_child": 0, "id": 2835080, "appended": false}, {"value": "Engineering Design/Drawing Software/Tools", "scale_type": 1, "parent_id": 2833200, "is_child": 1, "id": 2833435, "rating": "", "appended": false}, {"rating": "1", "value": "Staad-Pro", "scale_type": 1, "parent_id": 2833435, "is_child": 0, "id": 2833436, "appended": false}, {"value": "IT Infrastructure Management", "scale_type": 1, "parent_id": 2822824, "is_child": 1, "id": 2830827, "rating": "", "appended": false}, {"value": "IT Service Management (ITSM)", "scale_type": 1, "parent_id": 2830827, "is_child": 1, "id": 2848940, "rating": "", "appended": false}, {"value": " By Service Strategy", "scale_type": 1, "parent_id": 2848940, "is_child": 1, "id": 2892476, "rating": "", "appended": false}, {"rating": "2", "value": "Demand Management", "scale_type": 1, "parent_id": 2892476, "is_child": 0, "id": 2892506, "appended": false}, {"value": "Financial Management for IT Services", "scale_type": 1, "parent_id": 2892476, "is_child": 1, "id": 2892481, "rating": "", "appended": false}, {"value": "Processes", "scale_type": 1, "parent_id": 2892481, "is_child": 1, "id": 2892482, "rating": "", "appended": false}, {"rating": "3", "value": "Budgeting", "scale_type": 1, "parent_id": 2892482, "is_child": 0, "id": 2892483, "appended": false}, {"value": "Software Testing", "scale_type": 1, "parent_id": 2822824, "is_child": 1, "id": 2830714, "rating": "", "appended": false}, {"value": "Testing Methods", "scale_type": 1, "parent_id": 2830714, "is_child": 1, "id": 2894256, "rating": "", "appended": false}, {"value": "Black Box Testing", "scale_type": 1, "parent_id": 2894256, "is_child": 1, "id": 2894635, "rating": "", "appended": false}, {"value": "Testing Design Techniques", "scale_type": 1, "parent_id": 2894635, "is_child": 1, "id": 2894636, "rating": "", "appended": false}, {"rating": "4", "value": "Equivalence Partitioning", "scale_type": 1, "parent_id": 2894636, "is_child": 0, "id": 2894640, "appended": false}, {"value": "White Box Testing", "scale_type": 1, "parent_id": 2894256, "is_child": 1, "id": 2894257, "rating": "", "appended": false}, {"rating": "1", "value": "Path Testing", "scale_type": 1, "parent_id": 2894257, "is_child": 0, "id": 2894262, "appended": false}, {"rating": "2", "value": "Control Flow Testing ", "scale_type": 1, "parent_id": 2894257, "is_child": 0, "id": 2894258, "appended": false}, {"value": "Testing Activities", "scale_type": 1, "parent_id": 2830714, "is_child": 1, "id": 2830715, "rating": "", "appended": false}, {"rating": "3", "value": "Test Environment Creation", "scale_type": 1, "parent_id": 2830715, "is_child": 0, "id": 2830720, "appended": false}, {"rating": "4", "value": "Bug Fix", "scale_type": 1, "parent_id": 2830715, "is_child": 0, "id": 2830716, "appended": false}, {"value": "Custom Software Applications", "scale_type": 1, "parent_id": 2822824, "is_child": 1, "id": 2822825, "rating": "", "appended": false}, {"value": "Application Platform", "scale_type": 1, "parent_id": 2822825, "is_child": 1, "id": 2859961, "rating": "", "appended": false}, {"value": "Java Technologies", "scale_type": 1, "parent_id": 2859961, "is_child": 1, "id": 2862949, "rating": "", "appended": false}, {"value": "JDBC", "scale_type": 1, "parent_id": 2862949, "is_child": 1, "id": 2862951, "rating": "", "appended": false}, {"rating": "1", "value": "Create Tables", "scale_type": 1, "parent_id": 2862951, "is_child": 0, "id": 2862952, "appended": false}, {"rating": "2", "value": "JAXP", "scale_type": 1, "parent_id": 2862949, "is_child": 0, "id": 2862950, "appended": false}, {"value": "Linux Apache MySQL PHP - LAMP", "scale_type": 1, "parent_id": 2859961, "is_child": 1, "id": 2859967, "rating": "", "appended": false}, {"rating": "3", "value": "PHP", "scale_type": 1, "parent_id": 2859967, "is_child": 2, "id": 2866631, "appended": false}, {"value": "Supply Chain Management", "scale_type": 1, "parent_id": 0, "is_child": 1, "id": 65604, "rating": "", "appended": false}, {"value": "Distribution / Network Planning", "scale_type": 1, "parent_id": 65604, "is_child": 1, "id": 2839532, "rating": "", "appended": false}, {"rating": "4", "value": "Stock Planning for DCs / Warehouses", "scale_type": 1, "parent_id": 2839532, "is_child": 0, "id": 2839536, "appended": false}, {"rating": "0", "value": "Network Planning", "scale_type": 1, "parent_id": 2839532, "is_child": 0, "id": 2839534, "appended": false}, {"value": "Tools / Technologies", "scale_type": 1, "parent_id": 65604, "is_child": 1, "id": 65607, "rating": "", "appended": false}, {"rating": "1", "value": "Sql Server", "scale_type": 1, "parent_id": 65607, "is_child": 0, "id": 2814345, "appended": false}, {"rating": "2", "value": "JD Edwards", "scale_type": 1, "parent_id": 65607, "is_child": 0, "id": 2814340, "appended": false}, {"value": "Pharmaceuticals / Biotech / Life Sciences", "scale_type": 1, "parent_id": 0, "is_child": 1, "id": 54477, "rating": "", "appended": false}, {"rating": "3", "value": "Medical Writing", "scale_type": 1, "parent_id": 54477, "is_child": 0, "id": 2837019, "appended": false}, {"value": "Clinical Trial", "scale_type": 1, "parent_id": 54477, "is_child": 1, "id": 2835346, "rating": "", "appended": false}, {"value": "Activities in Clinical Trials", "scale_type": 1, "parent_id": 2835346, "is_child": 1, "id": 2835352, "rating": "", "appended": false}, {"rating": "4", "value": "Informed Consent", "scale_type": 1, "parent_id": 2835352, "is_child": 0, "id": 2835353, "appended": false}, {"value": "Regulations / Best Practices", "scale_type": 1, "parent_id": 54477, "is_child": 1, "id": 54657, "rating": "", "appended": false}, {"value": "Regulatory Bodies", "scale_type": 1, "parent_id": 54657, "is_child": 1, "id": 54658, "rating": "", "appended": false}, {"rating": "1", "value": "US FDA", "scale_type": 1, "parent_id": 54658, "is_child": 0, "id": 54659, "appended": false}, {"value": "Banking, Financial Services, Insurance", "scale_type": 1, "parent_id": 0, "is_child": 1, "id": 53599, "rating": "", "appended": false}, {"value": "Insurance", "scale_type": 1, "parent_id": 53599, "is_child": 1, "id": 2837146, "rating": "", "appended": false}, {"value": "Insurance Instrument", "scale_type": 1, "parent_id": 2837146, "is_child": 1, "id": 2837183, "rating": "", "appended": false}, {"rating": "2", "value": "Workmen Compensation", "scale_type": 1, "parent_id": 2837183, "is_child": 0, "id": 2837196, "appended": false}, {"rating": "3", "value": "Motor", "scale_type": 1, "parent_id": 2837183, "is_child": 0, "id": 2837191, "appended": false}, {"rating": "4", "value": "Commercial", "scale_type": 1, "parent_id": 2837183, "is_child": 0, "id": 2837187, "appended": false}, {"value": "Principles / Concepts / Regulations", "scale_type": 1, "parent_id": 53599, "is_child": 1, "id": 53620, "rating": "", "appended": false}, {"value": "Banking Regulations", "scale_type": 1, "parent_id": 53620, "is_child": 1, "id": 53622, "rating": "", "appended": false}, {"rating": "1", "value": "Frank Dodd", "scale_type": 1, "parent_id": 53622, "is_child": 0, "id": 53815, "appended": false}, {"rating": "2", "value": "Basel II", "scale_type": 1, "parent_id": 53622, "is_child": 0, "id": 53813, "appended": false}, {"value": "General Management", "scale_type": 1, "parent_id": 0, "is_child": 1, "id": 36719, "rating": "", "appended": false}, {"value": "Business Strategy", "scale_type": 1, "parent_id": 36719, "is_child": 1, "id": 2849578, "rating": "", "appended": false}, {"value": "Corporate Portfolio Analysis", "scale_type": 1, "parent_id": 2849578, "is_child": 1, "id": 2849595, "rating": "", "appended": false}, {"rating": "3", "value": "Mckinsey G.E. Business Screen", "scale_type": 1, "parent_id": 2849595, "is_child": 0, "id": 2849599, "appended": false}, {"rating": "4", "value": "Boston Consulting Group (BCG) Matrix", "scale_type": 1, "parent_id": 2849595, "is_child": 0, "id": 2849596, "appended": false}, {"value": "Sales & Marketing", "scale_type": 1, "parent_id": 0, "is_child": 1, "id": 18865, "rating": "", "appended": false}, {"value": "Market Research, Analytics", "scale_type": 1, "parent_id": 18865, "is_child": 1, "id": 2837977, "rating": "", "appended": false}, {"value": "Market Research Domains", "scale_type": 1, "parent_id": 2837977, "is_child": 1, "id": 2837978, "rating": "", "appended": false}, {"rating": "1", "value": "Customer Attitude Study", "scale_type": 1, "parent_id": 2837978, "is_child": 0, "id": 2837984, "appended": false}, {"rating": "2", "value": "Market Intelligence", "scale_type": 1, "parent_id": 2837978, "is_child": 0, "id": 2837982, "appended": false}, {"rating": "3", "value": "Consumer Trends", "scale_type": 1, "parent_id": 2837978, "is_child": 0, "id": 2837980, "appended": false}, {"rating": "4", "value": "Competition Intelligence", "scale_type": 1, "parent_id": 2837978, "is_child": 0, "id": 2837979, "appended": false}, {"value": "Human Resources (HR)", "scale_type": 1, "parent_id": 0, "is_child": 1, "id": 18860, "rating": "", "appended": false}, {"value": "Recruitment", "scale_type": 1, "parent_id": 18860, "is_child": 1, "id": 2847291, "rating": "", "appended": false}, {"value": "Activities Related To", "scale_type": 1, "parent_id": 2847291, "is_child": 1, "id": 2847402, "rating": "", "appended": false}, {"rating": "1", "value": "Requirement Generation", "scale_type": 1, "parent_id": 2847402, "is_child": 0, "id": 2847433, "appended": false}, {"value": "Sourcing Through", "scale_type": 1, "parent_id": 2847402, "is_child": 1, "id": 2847405, "rating": "", "appended": false}, {"rating": "2", "value": "Advertisement campaigns", "scale_type": 1, "parent_id": 2847405, "is_child": 0, "id": 2847406, "appended": false}, {"value": "Accounts, Corporate Finance", "scale_type": 1, "parent_id": 0, "is_child": 1, "id": 18846, "rating": "", "appended": false}, {"value": "Finance & Accounts Administration", "scale_type": 1, "parent_id": 18846, "is_child": 1, "id": 2837720, "rating": "", "appended": false}, {"value": "Book Keeping", "scale_type": 1, "parent_id": 2837720, "is_child": 1, "id": 2857523, "rating": "", "appended": false}, {"rating": "3", "value": "Asset Tracking", "scale_type": 1, "parent_id": 2857523, "is_child": 0, "id": 2857524, "appended": false}, {"value": "Cash Management", "scale_type": 1, "parent_id": 2837720, "is_child": 1, "id": 2857501, "rating": "", "appended": false}, {"rating": "4", "value": "Cash Book Maintenance", "scale_type": 1, "parent_id": 2857501, "is_child": 0, "id": 2857509, "appended": false}, {"value": "Bank Activities", "scale_type": 1, "parent_id": 2837720, "is_child": 1, "id": 2857491, "rating": "", "appended": false}, {"rating": "1", "value": "Bank Guarantees", "scale_type": 1, "parent_id": 2857491, "is_child": 0, "id": 2857492, "appended": false}, {"value": "Cost Accounting", "scale_type": 1, "parent_id": 18846, "is_child": 1, "id": 2837710, "rating": "", "appended": false}, {"rating": "2", "value": "Variance Analysis", "scale_type": 1, "parent_id": 2837710, "is_child": 0, "id": 2857543, "appended": false}, {"rating": "3", "value": "Product Costing", "scale_type": 1, "parent_id": 2837710, "is_child": 0, "id": 2857539, "appended": false}, {"value": "Project Costing", "scale_type": 1, "parent_id": 2837710, "is_child": 1, "id": 2857535, "rating": "", "appended": false}, {"rating": "4", "value": "Expenditures", "scale_type": 1, "parent_id": 2857535, "is_child": 0, "id": 2857536, "appended": false}, {"value": "Principles / Standards / Regulations", "scale_type": 1, "parent_id": 18846, "is_child": 1, "id": 51544, "rating": "", "appended": false}, {"value": "Financial Statements", "scale_type": 1, "parent_id": 51544, "is_child": 1, "id": 51552, "rating": "", "appended": false}, {"rating": "1", "value": "P&L Statement", "scale_type": 1, "parent_id": 51552, "is_child": 0, "id": 51557, "appended": false}, {"rating": "2", "value": "Balance Sheets", "scale_type": 1, "parent_id": 51552, "is_child": 0, "id": 51553, "appended": false}, {"value": "Accounting standards", "scale_type": 1, "parent_id": 51544, "is_child": 1, "id": 51546, "rating": "", "appended": false}, {"rating": "3", "value": "EU GAAP", "scale_type": 1, "parent_id": 51546, "is_child": 0, "id": 51547, "appended": false}, {"value": "Tools / Technologies", "scale_type": 1, "parent_id": 18846, "is_child": 1, "id": 51538, "rating": "", "appended": false}, {"value": "MS Excel", "scale_type": 1, "parent_id": 51538, "is_child": 1, "id": 2843916, "rating": "", "appended": false}, {"rating": "4", "value": "Basic MS Excel", "scale_type": 1, "parent_id": 2843916, "is_child": 0, "id": 2843924, "appended": false}, {"value": "Accounting softwares", "scale_type": 1, "parent_id": 51538, "is_child": 1, "id": 51712, "rating": "", "appended": false}, {"value": "Exactly Gold", "scale_type": 1, "parent_id": 51712, "is_child": 0, "id": 51723, "rating": "", "appended": false}, {"value": "Money Ware", "scale_type": 1, "parent_id": 51712, "is_child": 0, "id": 51722, "rating": "", "appended": false}, {"value": "Pay Plus", "scale_type": 1, "parent_id": 51712, "is_child": 0, "id": 51721, "rating": "", "appended": false}, {"value": "Ace", "scale_type": 1, "parent_id": 51712, "is_child": 0, "id": 51720, "rating": "", "appended": false}, {"value": "Fact", "scale_type": 1, "parent_id": 51712, "is_child": 0, "id": 51719, "rating": "", "appended": false}, {"value": "QuickBooks", "scale_type": 1, "parent_id": 51712, "is_child": 0, "id": 51715, "rating": "", "appended": false}, {"value": "Oracle Financials", "scale_type": 1, "parent_id": 51712, "is_child": 1, "id": 51714, "rating": "", "appended": false}, {"value": "Financials Centralized Solution Set", "scale_type": 1, "parent_id": 51714, "is_child": 0, "id": 2872680, "rating": "", "appended": false}, {"value": "General Ledger", "scale_type": 1, "parent_id": 51714, "is_child": 0, "id": 2872677, "rating": "", "appended": false}, {"value": "Microsoft Dynamics", "scale_type": 1, "parent_id": 51712, "is_child": 0, "id": 51713, "rating": "", "appended": false}];
$json2 = [{"value": "Social Service", "scale_type": 1, "parent_id": 0, "is_child": 1, "id": 2804926, "rating": "", "appended": true}, {"rating": "2", "value": "Wildlife Protection", "scale_type": 1, "parent_id": 2804926, "is_child": 0, "id": 2849470, "appended": false}];
$json3 = [{"id": "2836874", "value": "Pathological stealing [kleptomania]", "rating": 2, "parent_id": "2836871", "is_child": "0", "scale_type": "1"}, {"id": "2836871", "value": "Habit and impulse disorders", "parent_id": "2836866", "is_child": 1}, {"id": "2836866", "value": "Disorders of adult personality and behavior", "parent_id": "2836822", "is_child": 1}, {"id": "2836822", "value": "Mental and behavioral disorders", "parent_id": "2835594", "is_child": 1}, {"id": "2835594", "value": "Disease", "parent_id": "2835427", "is_child": 1}, {"id": "2835427", "value": "Drug Discovery & Development", "parent_id": "54477", "is_child": 1}, {"id": "54477", "value": "Pharmaceuticals / Biotech / Life Sciences", "parent_id": 0, "is_child": 1}];
$json = [{"value": "Social Service", "parent_id": 0, "is_child": 1, "id": 2804926, "appended": false}, {"value": "Wildlife Protection", "parent_id": 2804926, "is_child": 0, "id": 2849470, "rating": "", "scale_type": 1}, {"value": "Skilled Trade", "parent_id": 0, "is_child": 1, "id": 18871, "appended": true}, {"rating": "5", "value": "Mining", "parent_id": 18871, "is_child": 0, "id": 2839323, "scale_type": 1}, {"rating": "5", "value": "Molder", "parent_id": 18871, "is_child": 0, "id": 2839324, "scale_type": 1}, {"value": "Banking, Financial Services, Insurance", "parent_id": 0, "is_child": 1, "id": 53599, "appended": true}, {"value": "Principles / Concepts / Regulations", "parent_id": 53599, "is_child": 1, "id": 53620, "appended": true}, {"value": "Financial Accounting", "parent_id": 53620, "is_child": 1, "id": 53621, "appended": true}, {"value": "Financial Statements", "parent_id": 53621, "is_child": 1, "id": 53816, "appended": true}, {"rating": "5", "value": "Balance Sheets", "parent_id": 53816, "is_child": 0, "id": 53817, "scale_type": 1}, {"value": "Engineering", "parent_id": 0, "is_child": 1, "id": 2866844, "appended": true}, {"value": "Process Engineering", "parent_id": 2866844, "is_child": 1, "id": 2866875, "appended": true}, {"value": "Concepts / Basic Engineering", "parent_id": 2866875, "is_child": 1, "id": 2867023, "appended": true}, {"rating": "3", "value": "Energy Balance", "parent_id": 2867023, "is_child": 0, "id": 2867024, "scale_type": 1}, {"value": "Instrumentation", "parent_id": 2866844, "is_child": 1, "id": 2867071, "appended": true}, {"rating": "4", "value": "Human Machine Interface HMI Application Development", "parent_id": 2867071, "is_child": 0, "id": 2867082, "scale_type": 1}, {"value": "Civil / Structural Engineering", "parent_id": 2866844, "is_child": 1, "id": 2867146, "appended": true}, {"value": "Design Concepts", "parent_id": 2867146, "is_child": 1, "id": 2867158, "appended": true}, {"rating": "4", "value": "Structural Engineering", "parent_id": 2867158, "is_child": 0, "id": 2867159, "scale_type": 1}, {"value": "Related to Performing Tasks", "parent_id": 0, "is_child": 1, "id": 2934472, "appended": true}, {"rating": "4", "value": "Timeliness", "parent_id": 2934472, "is_child": 0, "id": 2934473, "scale_type": 4}, {"value": "Related to Thinking", "parent_id": 0, "is_child": 1, "id": 2934477, "appended": true}, {"rating": "3", "value": "Analytical Thinking", "parent_id": 2934477, "is_child": 0, "id": 2934478, "scale_type": 4}, {"rating": "3", "value": "Creative Thinking", "parent_id": 2934477, "is_child": 0, "id": 2934479, "scale_type": 4}, {"rating": "5", "value": "Systems Thinking", "parent_id": 2934477, "is_child": 0, "id": 2934480, "scale_type": 4}, {"value": "Related to Knowledge / Information", "parent_id": 0, "is_child": 1, "id": 2934486, "appended": true}, {"rating": "4", "value": "Adapting to new knowledge", "parent_id": 2934486, "is_child": 0, "id": 2934487, "scale_type": 1}, {"value": "Related to Managing Activities", "parent_id": 0, "is_child": 1, "id": 2934491, "appended": true}, {"rating": "4", "value": "Coordinating activities", "parent_id": 2934491, "is_child": 0, "id": 2934492, "scale_type": 4}, {"rating": "3", "value": "Following Processes", "parent_id": 2934491, "is_child": 0, "id": 2934494, "scale_type": 4}, {"value": "Related to Money", "parent_id": 0, "is_child": 1, "id": 2934496, "appended": true}, {"rating": "5", "value": "Risk Taking", "parent_id": 2934496, "is_child": 0, "id": 2934497, "scale_type": 4}, {"rating": "4", "value": "Financial Judgement", "parent_id": 2934496, "is_child": 0, "id": 2934499, "scale_type": 4}, {"value": "Making / Producing things", "parent_id": 0, "is_child": 1, "id": 2934712, "appended": true}, {"rating": "3", "value": "Individual Contribution / Contributing as a team member", "parent_id": 2934712, "is_child": 0, "id": 2934749, "scale_type": 1}, {"value": "Servicing People", "parent_id": 0, "is_child": 1, "id": 2934762, "appended": true}, {"rating": "4", "value": "Individual Contribution / Contributing as a team member", "parent_id": 2934762, "is_child": 0, "id": 2934863, "scale_type": 1}, {"rating": "4", "value": "Executing / Managing people", "parent_id": 2934762, "is_child": 0, "id": 2934864, "scale_type": 1}, {"value": "Making Creative Works", "parent_id": 0, "is_child": 1, "id": 2934807, "appended": true}, {"rating": "3", "value": "Individual Contribution / Contributing as a team member", "parent_id": 2934807, "is_child": 0, "id": 2934845, "scale_type": 1}];

$('#functionals').skillEngine('init', {type: 'functionals'});
//$('#functionals').skillEngine('input', {data: $json});
$('#functionals').skillEngine('search', {wrapper: 'as'});

$('#behavioural').skillEngine('init', {type: 'behavioural'});
$('#managerial').skillEngine('init', {type: 'managerial'});

$('#skill-json').on('click', function () {

    alert($().skillEngine('output'));
});

$('#skill-preview').on('click', function () {

    $().skillEngine('preview');
});
