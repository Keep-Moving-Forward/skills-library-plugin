(function ($) {

    $('body').on('click', function () {

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
        this.attr('data-type', options.type);
        switch ($mode) {

            case "output":
                if (options.type)
                    return $.fn.skillEngine.output(this, options.type);
                else
                    return $.fn.skillEngine.output(this);
                break;

            case "input":
                $.fn.skillEngine.input(this);
                break;

            case "preview":

                if (options.data) {

                    $.fn.skillEngine.setupCSS();
                    $(this).append($.fn.skillEngine.preview(options.data));
                }
                else {

                    $output = $.fn.skillEngine.output(this, options.type);

                    if (!$output[options.type].err) {


                        $(this).html($.fn.skillEngine.preview($output[options.type]));
                    }
                    else {

                        $(this).html('<p class="text-center text-danger">No ' + options.type + ' skills selected</p>');
                    }

                }

                $('.previewskillselect').barrating({'readonly': true});
                break;

            case "search":
                $.fn.skillEngine.search(this, options.wrapper);
                break;

            default:
                $.fn.skillEngine.setupCSS();
                $.fn.skillEngine.setupHTML(this);
                $.fn.skillEngine.request(this);
                $.fn.skillEngine.scroll();
                var self = this;
                return this.each(function () {

                    var tree = $(this);
                    $(tree).on('click', 'ul li a', function () {

                        var $li = $(this).parent('li');
                        if ($li.hasClass('skill-others')) {

                            $.each($li.siblings(), function (key, value) {

                                $(value).children('ul').hide();
                                $(value).show();
                            });
                            $li.hide();
                            $.fn.skillEngine.checkbox(self);
                        }
                        else {

                            self.selector = 'li#' + $li.attr('id');
                            self.options.id = $li.attr('id');
                            $.fn.skillEngine.Events.click(self);
                        }
                    });
                    $(tree).on('click', 'input[name="skills[]"]:checkbox', function () {

                        console.log($(this).parents('li').siblings('i'));
                        $(this).parents('li').siblings('i').alterClass('fa-*', ' fa-check-circle-o ');
                    });
                    $(tree).on('focusin', 'input.in-build-search', function () {

                        $(this).css('width', '150px');
                        $li = $(this).offsetParent()[0];
                        var id = $(this).parent('li')[0].id;
                        self.selector = 'li#' + id;
                        self.options.id = id;
                        if ($(self.selector).attr('data-appended') == "false") {

                            $.fn.skillEngine.Events.click(self);
                        }
                    });
                    $(tree).on('focusout', 'input.in-build-search', function () {

                        $(this).css('width', '20px');
                    });
                    $(tree).on('keyup', 'input.in-build-search', function () {

                        $li = $(this).offsetParent()[0];
                        var id = $(this).parent('li')[0].id;
                        self.selector = 'li#' + id;
                        self.options.id = id;
                        var txt = $(this).val();
                        $(self.selector + ' ul').show();
                        $(self.selector).find('li').each(function () {

                            if ($(this).text().toUpperCase().indexOf(txt.toUpperCase()) != -1) {

                                $(this).show();
                            }
                            else {

                                $(this).hide();
                            }
                        });
                    });
                });
        }
    };
    $.fn.skillEngine.Events = {
        click: function (obj) {
            $.fn.skillEngine.beautify(obj);
            if ($(obj.selector).attr('data-appended') == "false" && ($(obj.selector).attr('data-is_child') == 1 || $(obj.selector).attr('data-is_child') == 2)) {

                $.fn.skillEngine.request(obj);
            }

        }
    };
    $.fn.skillEngine.defaults = {};
    $.fn.skillEngine.type = ['functionals', 'behavioural', 'managerial'];
    $.fn.skillEngine.input = function (obj, $type) {

//        if ($type == $(obj).data('type')) {
//
//
//        }
//        else {
//
//            alert('Illegal Element and Type instantiated');
//        }
//        console.log(obj);
        $.fn.skillEngine.buildTree(obj);
    }

    $.fn.skillEngine.output = function (obj, $type) {

        if ($type) {

            $data = [];
            $.each($('[data-type="' + $type + '"] input[name="skills[]"]:checkbox:checked').parents('li'), function (index, value) {

                $data.push($(value).data());
            });
            if ($data.length > 0) {

                $output = {};
                $output[$type] = $data.reverse();
            }
            else {

                $output = {};
                $output[$type] = {msg: 'Please select aleast one ' + obj.options.type + ' skill!', err: true, type: obj.options.type};
            }
            return($output);
        }
    }

    $.fn.skillEngine.preview = function ($output) {

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

                    $tree += '<li id="' + $data[i].id + '" data-value="' + $data[i].value + '" data-scale_type="' + $data[i].scale_type + '" data-parent_id="' + $data[i].parent_id + '" data-is_child="' + $data[i].is_child + '" data-id="' + $data[i].id + '" ';

                    if ($data.is_child == 1) {

                        $tree += 'data-appended="false"';
                    }
                    else {

                        if ($data.rating) {
                            $tree += 'data-rating="' + $data.rating + '"';
                        }
                        else {
                            $tree += 'data-rating=""';
                        }
                        $tree += 'data-scale_type="' + $data.scale_type + '"';
                    }

                    $tree += ' >';

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
                        $tree += '<select class="previewskillselect" name="skills-rating[]" id="skillselect-' + $data[i].id + '" data-id="' + $data[i].id + '">';
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

        return('<ul class="easy-tree">' + readymade($output) + '</ul>');

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
        $(obj).append($blueprint);
    }

    /* Loading the CSS */
    $.fn.skillEngine.setupCSS = function () {

        $("<link>", {rel: "stylesheet", type: "text/css", href: "//netdna.bootstrapcdn.com/bootstrap/3.1.0/css/bootstrap.min.css"}).appendTo('head');
        $("<link>", {rel: "stylesheet", type: "text/css", href: "//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css"}).appendTo('head');
        $("<link>", {rel: "stylesheet", type: "text/css", href: "https://www.itsyourskills.com/css/iys.css"}).appendTo('head');
        $("<link>", {rel: "stylesheet", type: "text/css", href: "https://www.itsyourskills.com/css/select2.css"}).appendTo('head');
    }

    $.fn.skillEngine.scroll = function () {


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
    }

    /* Beautify the icons */
    $.fn.skillEngine.beautify = function (obj) {

        $(obj.selector).siblings().children('i').alterClass('fa-*', 'fa-plus-circle');
        if ($(obj.selector).find("input:checked").length > 0) {

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

        $.each($(obj.selector).siblings(), function (key, value) {

            if ($(value).hasClass('skill-others')) {
//            if ($(value).hasClass('skill-others') && $(value).siblings().find('input[name="skills[]"]:checkbox').length < 1) {

                $(value).show();
            }
            else {

                if ($(value).data('appended') != 'false') {

                    if (!$(value).find('input[name="skills[]"]:checkbox:checked').length) {

                        $(value).hide();
                    }
                    else {

                        $(value).show();
                    }
                }
            }
        });
        if ($(obj.selector).children('ul').is(':hidden')) {

            $(obj.selector).children('ul').show();
            $(obj.selector).children('ul').children('li:not(.skill-others)').show();
            return false;
        }
        else if ($(obj.selector).children('ul').is(':visible') && $(obj.selector).find('input[name="skills[]"]:checkbox:checked').length > 0 && $(obj.selector).find('input[name="skills[]"]:checkbox:checked').length != $(obj.selector).find('input[name="skills[]"]:checkbox').length) {

            if (($(obj.selector).children('ul').children('li').length - 1) == $(obj.selector).children('ul').children('li:visible').length) {

                var $localcheckbox = $(obj.selector).find('input[name="skills[]"]:checkbox');
                if ($localcheckbox.length > 0) {

                    $localcheckbox.each(function () {

                        $(this).not(":checked").closest('li').hide(); //Important

                        var $parentId = $('li#' + $(this).data('id')).data('parent_id');
                        var $parentSelector = $('li#' + $parentId + ' > ul');
                        $.each($parentSelector.children(), function (key, value) {

                            if ($(value).data('is_child') == 1 && 'li#' + $(value).data('id') != obj.selector && !$(value).find('input[name="skills[]"]:checkbox').is(":checked")) {

                                $(value).hide();
                            }
                        });
                    });
                }

            }
            else {

                $(obj.selector).children('ul').show();
                $(obj.selector).children('ul').children('li:not(.skill-others)').show();
            }

            return false;
        }
        else {

            if ($(obj.selector).attr('data-appended') == "true") {

                $(obj.selector).children('ul').hide();
                $(obj.selector).children('ul').children('li:not(.skill-others)').hide();
            }
        }

        $.fn.skillEngine.checkbox(obj);
    }

    $.fn.skillEngine.checkbox = function (obj) {

        /* Global Checkbox  System*/
        var $globalcheckbox = $(document).find('input[name="skills[]"]:checkbox');
        if ($globalcheckbox.length > 0) {

            $globalcheckbox.each(function () {

                if ($(this).is(":checked")) {

                    $(this).parentsUntil('li[data-parent_id="0"]').show();
                }

                $(this).not(":checked").closest('li').hide(); //Important

                var $parentId = $('li#' + $(this).data('id')).data('parent_id');
                var $parentSelector = $('li#' + $parentId + ' > ul');
                $.each($parentSelector.children(), function (key, value) {

                    if ($(value).data('is_child') == 1 && 'li#' + $(value).data('id') != obj.selector && !$(value).find('input[name="skills[]"]:checkbox').is(":checked")) {

                        $(value).hide();
                    }
                });
            });
        }
        /* End of Global Checkbox System*/
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
                obj.options.data = data;
                $.fn.skillEngine.buildTree(obj);
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

            var treeArr = item.text.replace(/[(:\d_)]+/g, '@@@').split('@@@');
            treeArr = treeArr.slice(1, treeArr.length - 1),
                    skillname = treeArr[0], categories = [], catstr = '';
            if (treeArr.length >= 3) {
                categories = treeArr.slice(treeArr.length - 2);
            } else if (treeArr.length == 2) {
                categories.push(treeArr[1]);
            } else {

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
            $datum = [];
            $.each($skillsDetails, function (key, value) {

                $data = {};
                $temp = value.split('_');
                $data.id = parseInt($temp[0]);
                $data.value = $temp[1];
                if ($skillsDetails.length - 1 > key) {

                    $data.parent_id = parseInt($skillsDetails[key + 1].split('_')[0]);
                }
                else {
                    $data.parent_id = 0;
                }

                if (key == 0) {
                    $data.is_child = parseInt($childscale[0]);
                    $data.scale_type = parseInt($childscale[1]);
                }
                else {

                    $data.is_child = 1;
                }

                $datum.push($data);
            });

            obj.options.data = $datum;

            $.fn.skillEngine.buildTree(obj, 'SEARCH');
        }

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
    }

    $.fn.skillEngine.buildTree = function (obj, $opt) {

        $data = obj.options.data;
        $adam = obj.adam.selector;
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
            $tree += '<li id="' + $data.id + '" data-value="' + $data.value + '" data-parent_id="' + $data.parent_id + '" data-is_child="' + $data.is_child + '" data-id="' + $data.id + '" ';

            if ($data.is_child == 1) {

                $tree += 'data-appended="false"';
            }
            else {

                if ($data.rating) {
                    $tree += 'data-rating="' + $data.rating + '"';
                }
                else {
                    $tree += 'data-rating=""';
                }
                $tree += 'data-scale_type="' + $data.scale_type + '"';
            }

            $tree += ' >';

            if ($data.is_child == 1) {

                $tree += '<i class="fa  fa-plus-circle text-success"></i>';
                $tree += '<a class="btn">' + $data.value + '</a>';
                $tree += '<input style="color:#000;" type="text" class="in-build-search textbox" />';
            }

            if ($data.is_child == 0) {

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

            if ($data.is_child == 2) {

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
            }

            $tree += '</li>';
            $element = $adam + ' li#' + $data.parent_id;
            $othersLi = '<li class="skill-others" style="display:none;" ><a class="btn btn-sm btn-warning"> <i class="fa fa-sort text-success"></i> Others</a></li>';
            if (!$($adam + ' li#' + $data.id).length) {

                if ($data.parent_id == 0) {

                    if (!$($adam + ' ul#0').has('li.skill-others').length) {

                        $($adam + ' ul#0').append($othersLi);
                    }

                    $($adam + ' ul#0').append($tree);
                }

                if ($($element).has('ul').length) {

                    $($element + ' > ul').append($tree);
                } else {

                    $($element).append('<ul>' + $othersLi + $tree + '</ul>');
                }
            }

            $($adam + ' li#' + $data.id).show();
            $($adam + ' li#' + $data.id + ' > ul').show();

            if ($opt == 'SEARCH') {

                $('div.iys-min-ht').scrollTo('#skillcheck-' + $data.id, 200);
            }
        }

        readymade($data);
        $('body').trigger('click');
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
})($);