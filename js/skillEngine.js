/*!
 * Skill Profile & Library Engine
 * Copyright 2011-2015 IYS, Pvt. Ltd
 * Licensed under MIT
 */
if (typeof jQuery === 'undefined' || typeof $ === 'undefined') {
    throw new Error('Skill Profile & Library Engine JavaScript requires jQuery');
}

/* ========================================================================
 * SPLE: Skill Engine
 * ========================================================================
 * Copyright 2011-2015 IYS, Pvt. Ltd
 * Licensed under MIT
 * ======================================================================== */
(function ($) {

    $.fn.skillEngine = function ($mode, options) {

// BOOTSTRAP
// =========
        this.options = $.extend({}, $.fn.skillEngine.defaults, options);
        this.adam = $(this);
        $.fn.skillEngine.obj[this.options.type] = this;
        this.attr('data-type', options.type);
        this.attr('data-id', 0);
        Mustache.tags = ["<%", "%>"];
        // Switch case for Mode
        // ====================
        switch ($mode) {

            case "output":
                if (options.type)
                    return $.fn.skillEngine.output(this, options.type);
                else
                    return $.fn.skillEngine.output(this);
                break;
            case "view":
                $(this).append($.fn.skillEngine.view(options));
                $('.previewskillselect').barrating({'readonly': true});
                break;
            case "preview":

                $output = $.fn.skillEngine.output(this, options.type);
                if (!$output[options.type].err) {

                    options.data = $output[options.type];
                    $(this).html($.fn.skillEngine.view(options));
                }
                else {

                    $(this).html('<p>No ' + options.type + ' skills selected</p>');
                }

                $('.previewskillselect').barrating({'readonly': true});
                break;
            case "search":

                break;
            default:
                $.fn.skillEngine.setupHTML(this);
                if (!options.lock) {

                    $.fn.skillEngine.search(this);
                    $.fn.skillEngine.request(this);
                }

                if (options.data && options.data != "" && options.data != null) {

                    $.fn.skillEngine.buildTree(this, 'INPUT');
                }

                var self = this;
                return this.each(function () {

                    if (!options.lock) {

                        $.fn.skillEngine.events(self, this);
                    }
                });
        }
    };
    $.fn.skillEngine.defaults = {
        id: 0,
        type: 'functionals',
        lock: false,
        unlockRating: false
    };
    $.fn.skillEngine.type = ['functionals', 'behavioural', 'managerial'];
    $.fn.skillEngine.obj = {};

    // Event Repo
    // ==========
    $.fn.skillEngine.eventsnew = function (self, object) {

        console.log('SELF' + self);
        console.log('CURRENT OBJ' + object);

        var $obj = $(object);

        $obj.on({
            click: function () {

                alert(this.selector);
            }
        });
    }

    // Event Repo
    // ==========
    $.fn.skillEngine.events = function (self, object) {

        var $obj = $(object);
        // Parent categorized
        // ==================
        $obj.on({
            click: function () {

                var $li = $(this).parent('li');
                if ($li.hasClass('skill-others')) {

                    $parent = $li.parents('li').eq(0);
                    if ($parent.data('appended') || $li.parent('ul#0').length) {

                        $.each($li.siblings(), function (key, value) {

                            $(value).find('ul').hide();
//                                $(value).find('li').hide(); // Others will be hidden
                            $(value).show();
                            if (!$(value).hasClass('skill-others')) {

                                $(value).find('> a:first > i:first').alterClass('iys-*', 'iys-plus');
                            }
                        });
                        stabilizer(self);
                        $li.siblings().show();
                        $li.hide();
                    }
                    else {

                        self.selector = 'li#' + $parent.attr('id');
                        self.options.id = $parent.attr('id');
                        switcher(self);
                    }

                    $li.children(' > a > i').eq(0).alterClass('iys-*', 'iys-plus');
//                                $(obj.selector).siblings('li').children(' a > i').alterClass('iys-*', 'iys-plus');

                }
                else {

                    self.selector = 'li#' + $li.attr('id');
                    self.options.id = $li.attr('id');
                    switcher(self);
                }

                $('.skill-count-scroll').scrollTo($(this), 100);
            }
        }, 'ul li a');
        // Monitoring the skill check status
        // =================================
        $obj.on({
            click: function () {

                $('#skillform-' + $(this).data('id') + ' input[name="checked"]').val($(this).prop("checked"));

                if ($(this).prop("checked")) {
                    $('li#' + $(this).data('id')).css({'background': '#CCC'});
                }
                if (!$(this).prop("checked")) {

                    $('li#' + $(this).data('id')).css({'background': ''});
                    $('select#skillselect-' + $(this).data('id')).barrating('clear');
                    $('#skillform-' + $(this).data('id') + ' input[name="rating"]').val("0");
                }

//                        $li = $(this).closest('li');
//                        $parent = 'li#' + $li.data('parent_id');
//
//                        if ($($parent).find('input[name="skills[]"]:checkbox').length == $($parent + ' ul').children('li').length - 1) {
//
//                            if ($(this).prop('checked')) {
//
//                                alert('ce');
//                                $(this).closest('li').siblings('li.skill-others:first').show()
//                                console.log();
//                            }
//                            else {
//
//                                $(this).closest('li').siblings('li.skill-others:first').show()
//                            }
//
//                        }

//                        $.each($(this).parents('li'), function (key, value) {
//
//                            console.log($(value));
//                            $(value).children(' > a > i').alterClass('iys-*', 'iys-intermediate');
//                        });
            }
        }, 'input[name="skills[]"]');
        // Siblings level linear search
        // ============================
        $obj.on({
            focusin: function () {

                $(this).css({'width': '150px', 'border': '1px solid #CCC'});
                $li = $(this).offsetParent()[0];
                var id = $(this).parent('li')[0].id;
                self.selector = 'li#' + id;
                self.options.id = id;
                $(this).removeClass('iys-placeholder');
                if ($(self.selector).attr('data-appended') == "false") {

                    switcher(self);
                }
            },
            focusout: function () {

                if ($(this).val().length == 0) {
                    $(this).css({'width': '20px', 'border': 'none'});
                    $(this).addClass('iys-placeholder');
                }
            },
            keyup: function () {

                $li = $(this).offsetParent()[0];
                var id = $(this).parent('li')[0].id;
                self.selector = 'li#' + id;
                self.options.id = id;
                var txt = $(this).val();
                $(self.selector + ' ul').show();
                $(self.selector).find('li').each(function () {

                    if ($(this).text().toUpperCase().indexOf(txt.toUpperCase()) != -1) {

                        $(this).filter(':not(.skill-others)').show();
                    }
                    else {

                        $(this).hide();
                    }
                });
            }

        }, "input.in-build-search");
        // Count Scroll
        // ============
        $('ul.skill-count-scroll').on({
            scroll: function () {

                var top = $("input[name='skills[]']:above-the-top:checked").each(function (key, value) {

                    return value;
                });
                var bottom = $("input[name='skills[]']:below-the-fold:checked").each(function (key, value) {

                    return value;
                });
                $('#skill-top-count').text(top.length + ' skills selected above current skill');
                $('#skill-bottom-count').text(bottom.length + ' skills selected below current skill');
            }
        });
        // Switcher
        // ========
        function switcher(obj) {

            /* Icon */
            $(obj.selector + ' > a > i').alterClass('iys-*', 'iys-plus');
            $(obj.selector).siblings('li').children(' a > i').alterClass('iys-*', 'iys-plus');
            if ($(obj.selector).find("input:checked").length < 1) {

                if ($(obj.selector).children('ul:visible').length < 1 || $(obj.selector).children('ul').length == 0) {

                    $(obj.selector + ' > a > i').alterClass('iys-*', 'iys-minus');
                }
                else {

                    $(obj.selector + ' > a > i').alterClass('iys-*', 'iys-plus');
                }
            }

            /* Toggle */
            $.each($(obj.selector).siblings(), function (key, value) {

                if ($(value).hasClass('skill-others')) {

                    $(value).show();
                }
                else {

                    if ($(value).data('appended') != 'false') {

                        if ($(value).find('input[name="skills[]"]:checkbox:checked').length === 0) {

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

            /* Checkbox */
            stabilizer(obj);
            /* Request */
            if ($(obj.selector).attr('data-appended') == "false" && (($(obj.selector).attr('data-is_child') == 1 || $(obj.selector).attr('data-is_child') == 2 || $(obj.selector).attr('data-is_child') == 4))) {

                $.fn.skillEngine.request(obj);
            }

        }

        // Stabilizer
        // ==========
        function stabilizer(obj) {

            /* Global Checkbox  System*/
            var $globalcheckbox = $(document).find('input[name="skills[]"]:checkbox');
            if ($globalcheckbox.length > 0) {

                $globalcheckbox.each(function () {

                    if ($(this).is(":checked")) {

                        $(this).parentsUntil('li[data-parent_id="0"]').show();
                        $(this).parentsUntil('li[data-parent_id="0"]').find('li.skill-others').show();
                    }

                    if (!$(obj.selector).hasClass('skill-others')) {

                        $(this).not(":checked").closest('li').hide(); //Important
                        $(this).siblings('li.skill-others').show();
//                        commented to fix the Mixed error
                        var $parentId = $('li#' + $(this).data('id')).data('parent_id');
                        var $parentSelector = $('li#' + $parentId + ' > ul');
                        $.each($parentSelector.children(), function (key, value) {

                            if ($(value).data('is_child') == 1 && 'li#' + $(value).data('id') != obj.selector && !$(value).find('input[name="skills[]"]:checkbox').is(":checked")) {

                                $(value).hide();
                            }
                        });
                    }
                });
            }
            /* End of Global Checkbox System*/
        }
    }

})(jQuery);
/* ========================================================================
 * SPLE: Request Skills using Data source
 * ========================================================================
 * Copyright 2011-2015 IYS, Pvt. Ltd
 * Licensed under MIT
 * ======================================================================== */

(function ($) {

    /* Request Skills using access token*/
    $.fn.skillEngine.request = function (obj) {

        if (typeof obj.options.source == 'undefined' || obj.options.source == '') {

            alert('SPL-Error: No source provided for the selector: ' + obj.selector);
            return false;
        }
        else {

            $(obj.selector + ' > a > i').alterClass('iys-*', 'iys-loading');
            $.ajax({
//                url: obj.options.source.replace(/.*?:\/\//g, "//"),
                url: obj.options.source,
                type: 'POST',
                data: {id: obj.options.id, type: obj.options.type},
                datatype: 'json',
                success: function (data) {
                    $(obj.selector + ' div.iysInitialSpinner').remove();
                    obj.options.data = data;
                    $.fn.skillEngine.buildTree(obj);
                    $(obj.selector).attr('data-appended', true);
                    $(obj.selector + ' > a > i').alterClass('iys-*', 'iys-minus');
                },
                error: function (err) {

                    alert('SPL-Error: Ajax error check console log');
                    console.log(err);
                }
            });
        }
    }

})(jQuery);
/* ========================================================================
 * SPLE: HTML Layout
 * ========================================================================
 * Copyright 2011-2015 IYS, Pvt. Ltd
 * Licensed under MIT
 * ======================================================================== */

(function ($) {

    $.fn.skillEngine.setupHTML = function (obj) {

        $blueprint = '<div class="iys-spe">';
        if (obj.options.type == 'functionals' && !obj.options.lock) {
            $blueprint += '<div class="iys-spe iys-search-br iys-search-inhouse">';
            $blueprint += '<div class="container">';
            $blueprint += '<div class="col-lg-6 col-sm-6 col-sm-6 no-padding">';
            $blueprint += '<div class="iys-sh-txt" id="iysAddSkillWrapper">Enter skill and select from the populated suggestions or use the skill tree</div>';
            $blueprint += '<div class="keyword" style="width:100%;"></div>';
            $blueprint += '<div class="pull-right">';
            $blueprint += '<form id="iysSearch" class="form-inline">';
            $blueprint += 'Search by <div class="radio"><label><input type="radio" name="iysSearchMethod" value="search" checked="checked" /> Skills </label></div>';
            $blueprint += '<div class="radio"><label><input type="radio" name="iysSearchMethod" value="template" /> Templates</label></div>';
            $blueprint += '</form>';
            $blueprint += '</div>';
            $blueprint += '</div>';
            $blueprint += '<div class="col-lg-3 col-sm-3 col-sm-3">';
//                $blueprint += '<div class="small margin-top-10"><span id="skills-count" data-count="0">0</span> <span> skill(s) added to your profile</span></div>';
            $blueprint += '</div>';
            $blueprint += '<div class="col-lg-3 col-sm-3 col-sm-3 no-padding">';
            $blueprint += '<div class="small"><span id="skills-count" data-count="0">0</span> <span> skill(s) added to your profile</span></div>';
            $blueprint += '<div id="skill-chart"></div>';
            $blueprint += '<div id="skill-chart-text"></div>';
            $blueprint += '</div>';
            $blueprint += '</div>';
            $blueprint += '</div>';
        }

        $blueprint += '<div class="container">';
        $blueprint += '<div class="iys-fun-title ';
        switch (obj.options.type) {
            case 'functionals':
                $blueprint += 'iys-fun-bg">';
                $blueprint += '<h2>Functional / Technical Skills</h2>';
                if (!obj.options.lock) {
                    $blueprint += '<a><div id="skill-top-count"> 0 skills selected above current skill</div></a>';
                }
                break;
            case 'behavioural':
                $blueprint += 'iys-beh-bg">';
                $blueprint += '<h2>Behavioral / Cognitive Skills</h2>';
                break;
            case 'managerial':
                $blueprint += 'iys-man-bg">';
                $blueprint += '<h2>Managerial Skills</h2>';
                break;
        }

        $blueprint += '</div>';
        $blueprint += '<div>';
        $blueprint += '<ul class="iys-tree skill-count-scroll" id="0">';
        if (!obj.options.lock) {

            $blueprint += '<div class="iysInitialSpinner text-center text-info"><i class="fa fa-spinner fa-pulse fa-3x"></i></div>';
        }
        $blueprint += '</ul>';
        $blueprint += '</div>';
        if (!obj.options.lock) {
            switch (obj.options.type) {
                case 'functionals':
                    $blueprint += '<div class="iys-fun-end"><p>You have selected <span id="skills-count">0</span> Functional Skills</p><a><div id="skill-bottom-count">0 skills selected below current skill</div></a></div>';
                    break;
            }
        }
        $blueprint += '</div>';
        $blueprint += '</div>';
        $(obj).append($blueprint);
    }


})(jQuery);
/* ========================================================================
 * SPLE: Output in JSON Format
 * ========================================================================
 * Copyright 2011-2015 IYS, Pvt. Ltd
 * Licensed under MIT
 * ======================================================================== */

(function ($) {

    $.fn.skillEngine.output = function (obj, $type) {

        if ($type) {

            $data = [];

            $.each($('[data-type="' + $type + '"] input:hidden[name="checked"]').filter(function () {

                return $(this).val() == "true";

            }).parents('li'), function (index, value) {

                if ($(value).data('is_child') == 1) {

                    $data.push($(value).data());
                }
                else {

                    $datum = {};
                    $.each($('form#skillform-' + $(value).attr('id')).serializeArray(), function () {
                        $datum[this.name] = this.value;
                    })

                    $data.push($datum);
                }
            });


//            $.each($('[data-type="' + $type + '"] input[name="skills[]"]:checkbox:checked').parents('li'), function (index, value) {
//
//                if ($(value).data('is_child') == 1) {
//
//                    $data.push($(value).data());
//                }
//                else {
//
//                    $datum = {};
//                    $.each($('form#skillform-' + $(value).attr('id')).serializeArray(), function () {
//                        $datum[this.name] = this.value;
//                    })
//
//                    $data.push($datum);
//                }
//            });

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
})(jQuery);
/* ========================================================================
 * SPLE: Standalone View
 * ========================================================================
 * Copyright 2011-2015 IYS, Pvt. Ltd
 * Licensed under MIT
 * ======================================================================== */

(function ($) {

    $.fn.skillEngine.view = function (options) {

        readymade = function ($data, $parent, $is_child) {

            if (typeof $parent === "undefined" || $parent === null) {

                $parent = 0;
            }

            $tree = '';
            if ($parent != 0) {

                if ($is_child == 2) {

                    $tree += '<ul class="iysConceptChild">';
                }
                else {
                    $tree += '<ul>';
                }
            }

            for (var i = 0; i < $data.length; i++) {

                if ($data[i]['parent_id'] == $parent) {

                    $tree += '<li ';
                    if ($data[i].is_child == 1 || $data[i].is_child == 4) {

                        $tree += 'class="parent_li"';
                    }
                    $tree += ' >';
                    switch (parseInt($data[i].is_child)) {

                        case 0:
                            $tree += '<a><i class="iys-tick"></i>';
                            $tree += $data[i].value;
                            $tree += '</a>';
                            $tree += '<div class="rating-f">';
                            $tree += '<select class="previewskillselect" name="skills-rating[]" id="skillselect-' + $data[i].id + '" data-id="' + $data[i].id + '">';
                            $tree += $.fn.skillEngine.scaleType($data[i].scale_type, parseInt($data[i].rating));
                            $tree += '</select>';
                            $tree += '</div>';
                            $tree += '<p>';
                            if (options.template) {

                                $tree += Mustache.render(options.template, $data[i]);
                            }

                            $tree += '</p>';
                            break;
                        case 1:
                            $tree += '<a><i class="iys-toptree"></i>' + $data[i].value + '</a>';
                            break;
                        case 2:
                            $tree += '<a><i class="iys-tick"></i>';
                            $tree += $data[i].value;
                            $tree += '</a>';
                            $tree += '<div class="rating-f">';
                            $tree += '<select class="previewskillselect" name="skills-rating[]" id="skillselect-' + $data[i].id + '" data-id="' + $data[i].id + '">';
                            $tree += $.fn.skillEngine.scaleType($data[i].scale_type, parseInt($data[i].rating));
                            $tree += '</select>';
                            $tree += '</div>';
                            $tree += '<p>';
                            if (options.template) {

                                $tree += Mustache.render(options.template, $data[i]);
                            }

                            $tree += '</p>';
                            break;
                        case 3:
                            $tree += '<a><i class="iys-tick"></i>' + $data[i].value + '</a>';
                            break;
                        case 4:
                            $tree += '<a> <i class="iys-tick"></i> ' + $data[i].value + '</a>';
                            $tree += '<div class="rating-f">';
                            $tree += '<select class="previewskillselect"  name="skills-rating[]" id="skillselect-' + $data[i].id + '" data-id="' + $data[i].id + '">';
                            $tree += $.fn.skillEngine.scaleType($data[i].scale_type, $data[i].rating);
                            $tree += '</select>';
                            $tree += '</div>';
                            $tree += '<p>';
                            if (options.template) {

                                $tree += Mustache.render(options.template, $data[i]);
                            }
                            $tree += '</p>';
                            break;
                        default:
                            $tree = 'Out of Child';
                    }

                    $tree += readymade($data, $data[i]['id'], $data[i].is_child);
                    $tree += '</li>';
                }
            }

            if ($parent != 0) {

                $tree += '</ul>';
            }
            return $tree;
        }

        return('<ul class="iys-tree">' + readymade(options.data) + '</ul>');
    }

})(jQuery);
/* ========================================================================
 * SPLE: Core Tree Builder
 * ========================================================================
 * Copyright 2011-2015 IYS, Pvt. Ltd
 * Licensed under MIT
 * ======================================================================== */

(function ($) {

    $.fn.skillEngine.buildTree = function (obj, $opt) {

        $data = obj.options.data;
        $adam = obj.adam.selector;

        $(obj.selector + ' div.iysInitialSpinner').remove();

        readymade = function ($data, $parent) {
            if (typeof $parent === "undefined" || $parent === null) {
                $parent = 0;
            }
            for (var i = 0; i < $data.length; i++) {
                if (typeof $data != 'undefined' && typeof $data[i] != 'undefined') {
                    if (parseInt($data[i].parent_id) == parseInt($parent)) {
                        $tree = treeList($data[i]);
                        readymade($data, parseInt($data[i].id));
                    }
                    else {
                        $tree = treeList($data[i]);
// break; // for performance make it break
                    }
                    if ($opt != 'SEARCH') {
                        delete $data[i];
                    }
                }
            }
        }
        treeList = function ($data) {
            $tree = '';
            /********** Start of Li **********/
            $tree += '<li id="' + $data.id + '" data-value="' + $data.value + '" data-parent_id="' + $data.parent_id + '" data-is_child="' + $data.is_child + '" data-id="' + $data.id + '" ';

            if ($data.is_child == 1 || $data.is_child == 2 || $data.is_child == 4) {

                $tree += 'class="parent_li" data-appended="false"';
            }
            else {
                $tree += 'data-scale_type="' + $data.scale_type + '"';
            }
            $tree += ' >';
            switch (parseInt($data.is_child)) {

                case 0:
                    $tree += '<label>';
                    $tree += '<input type="checkbox" class="skillcheck" name="skills[]" id="skillcheck-' + $data.id + '" data-id="' + $data.id + '" ' + (typeof $data.checked != 'undefined' && $data.checked == "true" ? 'checked="checked"' : '');
                    if (obj.options.lock) {
                        $tree += ' disabled="true"';
                    }

                    $tree += '>';
                    $tree += $data.value;
                    $tree += '</label>';
                    $tree += '<div class="rating-f">';
                    $tree += '<select class="skillselect"  name="skills-rating[]" id="skillselect-' + $data.id + '" data-id="' + $data.id + '">';
                    $tree += $.fn.skillEngine.scaleType($data.scale_type, $data.rating);
                    $tree += '</select>';
                    $tree += '</div>';
                    $tree += '<p>';
                    $tree += '<form id="skillform-' + $data.id + '">';
                    $tree += '<input type="hidden" name="id" value="' + $data.id + '" />';
                    $tree += '<input type="hidden" name="parent_id" value="' + $data.parent_id + '" />';
                    $tree += '<input type="hidden" name="is_child" value="' + $data.is_child + '" />';
                    $tree += '<input type="hidden" name="scale_type" value="' + $data.scale_type + '" />';
                    $tree += '<input type="hidden" name="rating" value="' + (typeof $data.rating == 'undefined' ? 0 : $data.rating) + '" />';
                    $tree += '<input type="hidden" name="checked" value="' + (typeof $data.checked == 'undefined' ? false : $data.checked) + '" />';
                    $tree += '<input type="hidden" name="value" value="' + $data.value + '" />';
                    if (obj.options.template) {

                        $tree += Mustache.render(obj.options.template, $data);
                    }

                    $tree += '</form>';
                    $tree += '</p>';
                    break;
                case 1:

                    $tree += '<a>';

                    if (obj.options.lock) {

                        $tree += '<i class="iys-toptree"></i> ';
                    } else {

                        $tree += '<i class="iys-plus"></i> ';
                    }

                    $tree += $data.value + '</a>';

                    if (!obj.options.lock) {

                        $tree += '<input type="text" class="in-build-search textbox iys-placeholder" />';
                    }
                    break;
                case 2:
                    $tree += '<label>';
                    $tree += '<input type="checkbox" class="skillcheck" name="skills[]" id="skillcheck-' + $data.id + '" data-id="' + $data.id + '" ' + (typeof $data.checked != 'undefined' && $data.checked == 'true' ? 'checked="checked"' : '');
                    if (obj.options.lock) {
                        $tree += ' disabled="true"';
                    }

                    $tree += '>';
                    $tree += $data.value;
                    $tree += '</label>';
                    $tree += '<div class="rating-f">';
                    $tree += '<select class="skillselect"  name="skills-rating[]" id="skillselect-' + $data.id + '" data-id="' + $data.id + '">';
                    $tree += $.fn.skillEngine.scaleType($data.scale_type, $data.rating);
                    $tree += '</select>';
                    $tree += '</div>';
                    $tree += '<p>';
                    $tree += '<form id="skillform-' + $data.id + '">';
                    $tree += '<input type="hidden" name="id" value="' + $data.id + '" />';
                    $tree += '<input type="hidden" name="parent_id" value="' + $data.parent_id + '" />';
                    $tree += '<input type="hidden" name="is_child" value="' + $data.is_child + '" />';
                    $tree += '<input type="hidden" name="scale_type" value="' + $data.scale_type + '" />';
                    $tree += '<input type="hidden" name="rating" value="' + (typeof $data.rating == 'undefined' ? 0 : $data.rating) + '" />';
                    $tree += '<input type="hidden" name="checked" value="' + (typeof $data.checked == 'undefined' ? false : $data.checked) + '" />';
                    $tree += '<input type="hidden" name="value" value="' + $data.value + '" />';
                    if (obj.options.template) {

                        $tree += Mustache.render(obj.options.template, $data);
                    }

                    $tree += '</form>';
                    $tree += '</p>';

                    self = obj;
                    self.selector = 'li#' + $data.id;
                    self.options.id = $data.id;
                    $.fn.skillEngine.request(self);
                    break;
                case 3:
                    $tree += '<label>';
                    $tree += '<input type="checkbox" class="skillcheck" name="skills[]" id="skillcheck-' + $data.id + '" data-id="' + $data.id + '" ' + (typeof $data.checked != 'undefined' && $data.checked == 'true' ? 'checked="checked"' : '');
                    if (obj.options.lock) {
                        $tree += ' disabled="true"';
                    }

                    $tree += '>';
                    $tree += $data.value;
                    $tree += '</label>';
                    $tree += '<p>';
                    $tree += '<form id="skillform-' + $data.id + '">';
                    $tree += '<input type="hidden" name="id" value="' + $data.id + '" />';
                    $tree += '<input type="hidden" name="parent_id" value="' + $data.parent_id + '" />';
                    $tree += '<input type="hidden" name="is_child" value="' + $data.is_child + '" />';
                    $tree += '<input type="hidden" name="value" value="' + $data.value + '" />';
                    $tree += '<input type="hidden" name="rating" value="' + (typeof $data.rating == 'undefined' ? 0 : $data.rating) + '" />';
                    $tree += '<input type="hidden" name="checked" value="' + (typeof $data.checked == 'undefined' ? false : $data.checked) + '" />';
                    $tree += '</form>';
                    $tree += '</p>';
                    break;
                case 4:
                    $tree += '<a>';

                    if (obj.options.lock) {

                        $tree += '<i class="iys-toptree"></i> ';
                    } else {

                        $tree += '<i class="iys-plus"></i> ';
                    }

                    $tree += $data.value + '</a>';

                    if (!obj.options.lock) {
                        $tree += '<input type="text" class="in-build-search textbox iys-placeholder" />';
                    }

//                        $tree += '<input type="checkbox" class="skillcheck" name="skills[]" id="skillcheck-' + $data.id + '" data-id="' + $data.id + '" ' + (typeof $data.checked != 'undefined' && $data.checked == 'true' ? 'checked="checked"' : '');
//                        if (obj.options.lock) {
//                            $tree += ' disabled="true"';
//                        }
//
//                        $tree += '>';

                    $tree += '<div class="rating-f">';
                    $tree += '<select class="skillselect"  name="skills-rating[]" id="skillselect-' + $data.id + '" data-id="' + $data.id + '">';
                    $tree += $.fn.skillEngine.scaleType($data.scale_type, $data.rating);
                    $tree += '</select>';
                    $tree += '</div>';
                    $tree += '<p>';
                    $tree += '<form id="skillform-' + $data.id + '">';
                    $tree += '<input type="hidden" name="id" value="' + $data.id + '" />';
                    $tree += '<input type="hidden" name="parent_id" value="' + $data.parent_id + '" />';
                    $tree += '<input type="hidden" name="is_child" value="' + $data.is_child + '" />';
                    $tree += '<input type="hidden" name="scale_type" value="' + $data.scale_type + '" />';
                    $tree += '<input type="hidden" name="rating" value="' + (typeof $data.rating == 'undefined' ? 0 : $data.rating) + '" />';
                    $tree += '<input type="hidden" name="checked" value="' + (typeof $data.checked == 'undefined' ? false : $data.checked) + '" />';
                    $tree += '<input type="hidden" name="value" value="' + $data.value + '" />';
                    if (obj.options.template) {

                        $tree += Mustache.render(obj.options.template, $data);
                    }

                    $tree += '</form>';
                    $tree += '</p>';
                    break;
                default:
                    $tree = 'Out of Child';
            }
            $tree += '</li>';
            /********** End of Li **********/
            /********** Start of Appending **********/
            if ($opt == 'SEARCH') {
                $othersLi = '<li class="skill-others"><a><i class="iys-others"></i> Others</a></li>';
            }
            else {
                $othersLi = '<li class="skill-others" style="display:none;" ><a><i class="iys-others"></i> Others</a></li>';
            }
            $element = $adam + ' li#' + $data.parent_id;
            if (!$($adam + ' li#' + $data.id).length) {
                if ($data.parent_id == 0) {
                    if (!$($adam + ' ul#0').has('li.skill-others').length) {
                        $($adam + ' ul#0').append($othersLi);
                    }
                    $($adam + ' ul#0').append($tree);
                    if ($opt != 'SEARCH') {
                        $($adam + ' ul[id="0"] > li:not([class=skill-others]').tinysort({data: 'display_order', order: 'asc'});
                    }
                } else {
                    if ($($element).has('ul li.skill-others').length) {
                        $($element + ' > ul').append($tree);
                    } else {
                        if ($data.is_child == 3) {
                            $($element).append('<ul class="iysConceptChild">' + $othersLi + $tree + '</ul>');
                        }
                        else {
                            $($element).append('<ul>' + $othersLi + $tree + '</ul>');
                        }
                    }
                    if ($opt != 'SEARCH') {
                        var $mixedContent = $('li[id="' + $data.parent_id + '"] > ul > li').find('input[type="checkbox"]').length;
                        if (!$mixedContent) {
                            $('li[id="' + $data.parent_id + '"] > ul > li:not([class=skill-others]').tinysort({data: 'display_order', order: 'asc'});
                        } else {
                            $('li[id="' + $data.parent_id + '"] > ul > li:not([class=skill-others]').tinysort({order: 'asc', data: 'display_order', data: 'is_child'});
                        }
                    }
                }
            }
            /********** End of Appending **********/
            /********** Start of Display rest with searched data **********/
            if ($opt == 'SEARCH') {
                $($adam + ' li#' + $data.id).show();
                $($adam + ' li#' + $data.id + ' > ul').show();
            }
            /********** End of Display rest with searched data **********/
            /********** Start of Highlight ScrollTo on Search **********/
            if ($opt == 'SEARCH' && $('input[name=iysSearchMethod]:checked', '#iysSearch').val() != 'template') {
                $('.skill-count-scroll').scrollTo('#skillcheck-' + $data.id, 200, {offset: {top: -200, bottom: 200}});
                $('#skillcheck-' + $data.id).closest('li').delay(200).addClass('iys-bar4').delay(2000).queue(function () {
                    $(this).removeClass("iys-bar4").dequeue();
                });
            }
            /********** End of Highlight ScrollTo on Search **********/
        }
        readymade($data);
        if (obj.options.lock && !obj.options.unlockRating) {
            $('.skillselect').barrating({'readonly': true});
        } else {
            $('.skillselect').barrating('show', {onSelect: $.fn.skillEngine.chart
            });
        }

        return;
        alert('beyond me -----');
        /** nothing invest **/

        if ($opt != 'SEARCH' && $opt != 'INPUT') {

            $parent = $(obj.selector).data();
            var $tree = [], o = -1;

//            if (!$($adam + ' li:not([class=skill-others]').length) {
//
//                $tree[++o] = '<li class="skill-others" style="display:none;" ><a><i class="iys-others"></i> Others</a></li>';
//            }
            for (var i = 0; i < $data.length; i++) {

                if (typeof $data != 'undefined' && typeof $data[i] != 'undefined') {

                    if (!$($adam + ' li#' + $data[i].id).length) {

                        /********** Start of Li **********/
                        $tree[++o] = '<li id="' + $data[i].id + '" data-value="' + $data[i].value + '" data-parent_id="' + $data[i].parent_id + '" data-is_child="' + $data[i].is_child + '" data-id="' + $data[i].id + '" ';
                        if ($data[i].is_child == 1 || $data[i].is_child == 4) {

                            $tree[++o] = 'class="parent_li" data-appended="false"';
                        }
                        else {

                            $tree[++o] = 'data-scale_type="' + $data[i].scale_type + '"';
                        }

                        $tree[++o] = ' >';
                        switch (parseInt($data[i].is_child)) {

                            case 0:
                                $tree[++o] = '<label>';
                                $tree[++o] = '<input type="checkbox" class="skillcheck" name="skills[]" id="skillcheck-' + $data[i].id + '" data-id="' + $data[i].id + '" ' + (typeof $data[i].checked != 'undefined' && $data[i].checked == "true" ? 'checked="checked"' : '');
                                if (obj.options.lock) {
                                    $tree[++o] = ' disabled="true"';
                                }

                                $tree[++o] = '>';
                                $tree[++o] = $data[i].value;
                                $tree[++o] = '</label>';
                                $tree[++o] = '<div class="rating-f">';
                                $tree[++o] = '<select class="skillselect"  name="skills-rating[]" id="skillselect-' + $data[i].id + '" data-id="' + $data[i].id + '">';
                                $tree[++o] = $.fn.skillEngine.scaleType($data[i].scale_type, $data[i].rating);
                                $tree[++o] = '</select>';
                                $tree[++o] = '</div>';
                                $tree[++o] = '<p>';
                                $tree[++o] = '<form id="skillform-' + $data[i].id + '">';
                                $tree[++o] = '<input type="hidden" name="id" value="' + $data[i].id + '" />';
                                $tree[++o] = '<input type="hidden" name="parent_id" value="' + $data[i].parent_id + '" />';
                                $tree[++o] = '<input type="hidden" name="is_child" value="' + $data[i].is_child + '" />';
                                $tree[++o] = '<input type="hidden" name="scale_type" value="' + $data[i].scale_type + '" />';
                                $tree[++o] = '<input type="hidden" name="rating" value="' + (typeof $data[i].rating == 'undefined' ? 0 : $data[i].rating) + '" />';
                                $tree[++o] = '<input type="hidden" name="checked" value="' + (typeof $data[i].checked == 'undefined' ? false : $data[i].checked) + '" />';
                                $tree[++o] = '<input type="hidden" name="value" value="' + $data[i].value + '" />';
                                if (obj.options.template) {

                                    $tree[++o] = Mustache.render(obj.options.template, $data[i]);
                                }

                                $tree[++o] = '</form>';
                                $tree[++o] = '</p>';
                                break;
                            case 1:

                                $tree[++o] = '<a> <i class="iys-plus"></i> ' + $data[i].value + '</a>';
                                if (!obj.options.lock) {
                                    $tree[++o] = '<input type="text" class="in-build-search textbox iys-placeholder" />';
                                }
                                break;
                            case 2:
                                $tree[++o] = '<label>';
                                $tree[++o] = '<input type="checkbox" class="skillcheck" name="skills[]" id="skillcheck-' + $data[i].id + '" data-id="' + $data[i].id + '" ' + (typeof $data[i].checked != 'undefined' && $data[i].checked == 'true' ? 'checked="checked"' : '');
                                if (obj.options.lock) {
                                    $tree[++o] = ' disabled="true"';
                                }

                                $tree[++o] = '>';
                                $tree[++o] = $data[i].value;
                                $tree[++o] = '</label>';
                                $tree[++o] = '<div class="rating-f">';
                                $tree[++o] = '<select class="skillselect"  name="skills-rating[]" id="skillselect-' + $data[i].id + '" data-id="' + $data[i].id + '">';
                                $tree[++o] = $.fn.skillEngine.scaleType($data[i].scale_type, $data[i].rating);
                                $tree[++o] = '</select>';
                                $tree[++o] = '</div>';
                                $tree[++o] = '<p>';
                                $tree[++o] = '<form id="skillform-' + $data[i].id + '">';
                                $tree[++o] = '<input type="hidden" name="id" value="' + $data[i].id + '" />';
                                $tree[++o] = '<input type="hidden" name="parent_id" value="' + $data[i].parent_id + '" />';
                                $tree[++o] = '<input type="hidden" name="is_child" value="' + $data[i].is_child + '" />';
                                $tree[++o] = '<input type="hidden" name="scale_type" value="' + $data[i].scale_type + '" />';
                                $tree[++o] = '<input type="hidden" name="rating" value="' + (typeof $data[i].rating == 'undefined' ? 0 : $data[i].rating) + '" />';
                                $tree[++o] = '<input type="hidden" name="checked" value="' + (typeof $data[i].checked == 'undefined' ? false : $data[i].checked) + '" />';
                                $tree[++o] = '<input type="hidden" name="value" value="' + $data[i].value + '" />';
                                if (obj.options.template) {

                                    $tree[++o] = Mustache.render(obj.options.template, $data[i]);
                                }

                                $tree[++o] = '</form>';
                                $tree[++o] = '</p>';
                                self = obj;
                                self.selector = 'li#' + $data[i].id;
                                self.options.id = $data[i].id;
                                $.fn.skillEngine.request(self);
                                break;
                            case 3:
                                $tree[++o] = '<label>';
                                $tree[++o] = '<input type="checkbox" class="skillcheck" name="skills[]" id="skillcheck-' + $data[i].id + '" data-id="' + $data[i].id + '" ' + (typeof $data[i].checked != 'undefined' && $data[i].checked == 'true' ? 'checked="checked"' : '');
                                if (obj.options.lock) {
                                    $tree[++o] = ' disabled="true"';
                                }

                                $tree[++o] = '>';
                                $tree[++o] = $data[i].value;
                                $tree[++o] = '</label>';
                                $tree[++o] = '<p>';
                                $tree[++o] = '<form id="skillform-' + $data[i].id + '">';
                                $tree[++o] = '<input type="hidden" name="id" value="' + $data[i].id + '" />';
                                $tree[++o] = '<input type="hidden" name="parent_id" value="' + $data[i].parent_id + '" />';
                                $tree[++o] = '<input type="hidden" name="is_child" value="' + $data[i].is_child + '" />';
                                $tree[++o] = '<input type="hidden" name="value" value="' + $data[i].value + '" />';
                                $tree[++o] = '<input type="hidden" name="checked" value="' + (typeof $data[i].checked == 'undefined' ? false : $data[i].checked) + '" />';
                                $tree[++o] = '</form>';
                                $tree[++o] = '</p>';
                                break;
                            case 4:
                                $tree[++o] = '<a> <i class="iys-plus"></i> ' + $data[i].value + '</a>';
                                if (!obj.options.lock) {
                                    $tree[++o] = '<input type="text" class="in-build-search textbox iys-placeholder" />';
                                }

//                              $tree += '<input type="checkbox" class="skillcheck" name="skills[]" id="skillcheck-' + $data.id + '" data-id="' + $data.id + '" ' + (typeof $data.checked != 'undefined' && $data.checked == 'true' ? 'checked="checked"' : '');
//                        if (obj.options.lock) {
//                            $tree += ' disabled="true"';
//                        }
//                                $tree[++o] = '>';

                                $tree[++o] = '<div class="rating-f">';
                                $tree[++o] = '<select class="skillselect"  name="skills-rating[]" id="skillselect-' + $data[i].id + '" data-id="' + $data[i].id + '">';
                                $tree[++o] = $.fn.skillEngine.scaleType($data[i].scale_type, $data[i].rating);
                                $tree[++o] = '</select>';
                                $tree[++o] = '</div>';
                                $tree[++o] = '<p>';
                                $tree[++o] = '<form id="skillform-' + $data[i].id + '">';
                                $tree[++o] = '<input type="hidden" name="id" value="' + $data[i].id + '" />';
                                $tree[++o] = '<input type="hidden" name="parent_id" value="' + $data[i].parent_id + '" />';
                                $tree[++o] = '<input type="hidden" name="is_child" value="' + $data[i].is_child + '" />';
                                $tree[++o] = '<input type="hidden" name="scale_type" value="' + $data[i].scale_type + '" />';
                                $tree[++o] = '<input type="hidden" name="rating" value="' + (typeof $data[i].rating == 'undefined' ? 0 : $data[i].rating) + '" />';
                                $tree[++o] = '<input type="hidden" name="value" value="' + $data[i].value + '" />';
                                if (obj.options.template) {

                                    $tree[++o] = Mustache.render(obj.options.template, $data[i]);
                                }

                                $tree[++o] = '</form>';
                                $tree[++o] = '</p>';
                                break;
                            default:
                                $stem = 'Out of Child';
                        }

                        $tree[++o] = '</li>';
                        /********** End of Li **********/

                    }

//                    delete $data[i];
                }//if data check

//                setTimeout(function () {
//                    console.log('Loading please wait...');
//                }, 1000 * i);
            }//for loop


            /********** Start of Appending **********/
            $othersLi = '<li class="skill-others" style="display:none;" ><a><i class="iys-others"></i> Others</a></li>';

            $element = $adam + ' li#' + $parent.id;
            if ($parent.id == 0) {

                if (!$($adam + ' ul#0').has('li.skill-others').length) {

                    $($adam + ' ul#0').append($othersLi);
                }

                $($adam + ' ul#0').append($tree.join(''));
            } else {

                if ($($element).has('ul li.skill-others').length) {

                    $($element + ' > ul').append($tree.join(''));
                } else {

                    if ($data.is_child == 2) {

                        $($element).append('<ul class="iysConceptChild">' + $othersLi + $tree.join('') + '</ul>');
                    }
                    else {

                        $($element).append('<ul>' + $othersLi + $tree.join('') + '</ul>');
                    }
                }

            }
            /********** End of Appending **********/

            /* Sorting */
            if ($parent.id == 0) {

                $($adam + ' ul[id="0"] > li:not([class=skill-others]').tinysort({order: 'asc'});
            }
            else {

                var $mixedContent = $('li[id="' + $parent.id + '"] > ul > li').find('input[type="checkbox"]').length;
                if (!$mixedContent) {

                    $('li[id="' + $parent.id + '"] > ul > li:not([class=skill-others]').tinysort({order: 'asc'});
                } else {

                    $('li[id="' + $parent.id + '"] > ul > li:not([class=skill-others]').tinysort({order: 'asc', data: 'is_child'});
                }
            }

        }// Non Search


        /* Search */
        if ($opt == 'SEARCH' || $opt == 'INPUT') {

            readymade = function ($data, $parent) {

                if (typeof $parent === "undefined" || $parent === null) {

                    $parent = 0;
                }

                for (var i = 0; i < $data.length; i++) {

                    if (typeof $data != 'undefined' && typeof $data[i] != 'undefined') {

                        if (parseInt($data[i].parent_id) == parseInt($parent)) {

                            $tree = treeList($data[i]);
                            readymade($data, parseInt($data[i].id));
                        }
                        else {

                            $tree = treeList($data[i]);
//                        break; // for performance make it break
                        }

                        if ($opt != 'SEARCH') {

                            delete $data[i];
                        }
                    }
                }
            }

            treeList = function ($data) {

                $tree = '';
                /********** Start of Li **********/
                $tree += '<li id="' + $data.id + '" data-value="' + $data.value + '" data-parent_id="' + $data.parent_id + '" data-is_child="' + $data.is_child + '" data-id="' + $data.id + '" ';
                if ($data.is_child == 1 || $data.is_child == 4) {

                    $tree += 'class="parent_li" data-appended="false"';
                }
                else {

                    $tree += 'data-scale_type="' + $data.scale_type + '"';
                }

                $tree += ' >';
                switch (parseInt($data.is_child)) {

                    case 0:
                        $tree += '<label>';
                        $tree += '<input type="checkbox" class="skillcheck" name="skills[]" id="skillcheck-' + $data.id + '" data-id="' + $data.id + '" ' + (typeof $data.checked != 'undefined' && $data.checked == "true" ? 'checked="checked"' : '');
                        if (obj.options.lock) {
                            $tree += ' disabled="true"';
                        }

                        $tree += '>';
                        $tree += $data.value;
                        $tree += '</label>';
                        $tree += '<div class="rating-f">';
                        $tree += '<select class="skillselect"  name="skills-rating[]" id="skillselect-' + $data.id + '" data-id="' + $data.id + '">';
                        $tree += $.fn.skillEngine.scaleType($data.scale_type, $data.rating);
                        $tree += '</select>';
                        $tree += '</div>';
                        $tree += '<p>';
                        $tree += '<form id="skillform-' + $data.id + '">';
                        $tree += '<input type="hidden" name="id" value="' + $data.id + '" />';
                        $tree += '<input type="hidden" name="parent_id" value="' + $data.parent_id + '" />';
                        $tree += '<input type="hidden" name="is_child" value="' + $data.is_child + '" />';
                        $tree += '<input type="hidden" name="scale_type" value="' + $data.scale_type + '" />';
                        $tree += '<input type="hidden" name="rating" value="' + (typeof $data.rating == 'undefined' ? 0 : $data.rating) + '" />';
                        $tree += '<input type="hidden" name="checked" value="' + (typeof $data.checked == 'undefined' ? false : $data.checked) + '" />';
                        $tree += '<input type="hidden" name="value" value="' + $data.value + '" />';
                        if (obj.options.template) {

                            $tree += Mustache.render(obj.options.template, $data);
                        }

                        $tree += '</form>';
                        $tree += '</p>';
                        break;
                    case 1:

                        $tree += '<a>';

                        if (obj.options.lock) {

                            $tree += '<i class="iys-toptree"></i> ';
                        } else {

                            $tree += '<i class="iys-plus"></i> ';
                        }

                        $tree += $data.value + '</a>';

                        if (!obj.options.lock) {

                            $tree += '<input type="text" class="in-build-search textbox iys-placeholder" />';
                        }
                        break;
                    case 2:
                        $tree += '<label>';
                        $tree += '<input type="checkbox" class="skillcheck" name="skills[]" id="skillcheck-' + $data.id + '" data-id="' + $data.id + '" ' + (typeof $data.checked != 'undefined' && $data.checked == 'true' ? 'checked="checked"' : '');
                        if (obj.options.lock) {
                            $tree += ' disabled="true"';
                        }

                        $tree += '>';
                        $tree += $data.value;
                        $tree += '</label>';
                        $tree += '<div class="rating-f">';
                        $tree += '<select class="skillselect"  name="skills-rating[]" id="skillselect-' + $data.id + '" data-id="' + $data.id + '">';
                        $tree += $.fn.skillEngine.scaleType($data.scale_type, $data.rating);
                        $tree += '</select>';
                        $tree += '</div>';
                        $tree += '<p>';
                        $tree += '<form id="skillform-' + $data.id + '">';
                        $tree += '<input type="hidden" name="id" value="' + $data.id + '" />';
                        $tree += '<input type="hidden" name="parent_id" value="' + $data.parent_id + '" />';
                        $tree += '<input type="hidden" name="is_child" value="' + $data.is_child + '" />';
                        $tree += '<input type="hidden" name="scale_type" value="' + $data.scale_type + '" />';
                        $tree += '<input type="hidden" name="rating" value="' + (typeof $data.rating == 'undefined' ? 0 : $data.rating) + '" />';
                        $tree += '<input type="hidden" name="checked" value="' + (typeof $data.checked == 'undefined' ? false : $data.checked) + '" />';
                        $tree += '<input type="hidden" name="value" value="' + $data.value + '" />';
                        if (obj.options.template) {

                            $tree += Mustache.render(obj.options.template, $data);
                        }

                        $tree += '</form>';
                        $tree += '</p>';
                        self = obj;
                        self.selector = 'li#' + $data.id;
                        self.options.id = $data.id;
                        $.fn.skillEngine.request(self);
                        break;
                    case 3:
                        $tree += '<label>';
                        $tree += '<input type="checkbox" class="skillcheck" name="skills[]" id="skillcheck-' + $data.id + '" data-id="' + $data.id + '" ' + (typeof $data.checked != 'undefined' && $data.checked == 'true' ? 'checked="checked"' : '');
                        if (obj.options.lock) {
                            $tree += ' disabled="true"';
                        }

                        $tree += '>';
                        $tree += $data.value;
                        $tree += '</label>';
                        $tree += '<p>';
                        $tree += '<form id="skillform-' + $data.id + '">';
                        $tree += '<input type="hidden" name="id" value="' + $data.id + '" />';
                        $tree += '<input type="hidden" name="parent_id" value="' + $data.parent_id + '" />';
                        $tree += '<input type="hidden" name="is_child" value="' + $data.is_child + '" />';
                        $tree += '<input type="hidden" name="value" value="' + $data.value + '" />';
                        $tree += '<input type="hidden" name="checked" value="' + (typeof $data.checked == 'undefined' ? false : $data.checked) + '" />';
                        $tree += '</form>';
                        $tree += '</p>';
                        break;
                    case 4:
                        $tree += '<a>';

                        if (obj.options.lock) {

                            $tree += '<i class="iys-toptree"></i> ';
                        } else {

                            $tree += '<i class="iys-plus"></i> ';
                        }

                        $tree += $data.value + '</a>';

                        if (!obj.options.lock) {
                            $tree += '<input type="text" class="in-build-search textbox iys-placeholder" />';
                        }
//                        $tree += '<input type="checkbox" class="skillcheck" name="skills[]" id="skillcheck-' + $data.id + '" data-id="' + $data.id + '" ' + (typeof $data.checked != 'undefined' && $data.checked == 'true' ? 'checked="checked"' : '');
//                        if (obj.options.lock) {
//                            $tree += ' disabled="true"';
//                        }
//
//                        $tree += '>';
//
                        $tree += '<div class="rating-f">';
                        $tree += '<select class="skillselect"  name="skills-rating[]" id="skillselect-' + $data.id + '" data-id="' + $data.id + '">';
                        $tree += $.fn.skillEngine.scaleType($data.scale_type, $data.rating);
                        $tree += '</select>';
                        $tree += '</div>';
                        $tree += '<p>';
                        $tree += '<form id="skillform-' + $data.id + '">';
                        $tree += '<input type="hidden" name="id" value="' + $data.id + '" />';
                        $tree += '<input type="hidden" name="parent_id" value="' + $data.parent_id + '" />';
                        $tree += '<input type="hidden" name="is_child" value="' + $data.is_child + '" />';
                        $tree += '<input type="hidden" name="scale_type" value="' + $data.scale_type + '" />';
                        $tree += '<input type="hidden" name="rating" value="' + (typeof $data.rating == 'undefined' ? 0 : $data.rating) + '" />';
                        $tree += '<input type="hidden" name="value" value="' + $data.value + '" />';
                        if (obj.options.template) {

                            $tree += Mustache.render(obj.options.template, $data);
                        }

                        $tree += '</form>';
                        $tree += '</p>';
                        break;
                    default:
                        $tree = 'Out of Child';
                }

                $tree += '</li>';
                /********** End of Li **********/

                /********** Start of Appending **********/

                if (!obj.options.lock && $opt == 'INPUT') {

                    $othersLi = '<li class="skill-others"><a><i class="iys-others"></i> Others</a></li>';
                }
                if ($opt == 'SEARCH') {

                    $othersLi = '<li class="skill-others"><a><i class="iys-others"></i> Others</a></li>';
                }
                else {
                    $othersLi = '<li class="skill-others" style="display:none;" ><a><i class="iys-others"></i> Others</a></li>';
                }

                $element = $adam + ' li#' + $data.parent_id;
                if (!$($adam + ' li#' + $data.id).length) {

                    if ($data.parent_id == 0) {

                        if (!$($adam + ' ul#0').has('li.skill-others').length) {

                            $($adam + ' ul#0').append($othersLi);
                        }

                        $($adam + ' ul#0').append($tree);

                        if ($opt != 'SEARCH') {

                            $($adam + ' ul[id="0"] > li:not([class=skill-others]').tinysort({order: 'asc'});
                        }

                    } else {

                        if ($($element).has('ul li.skill-others').length) {

                            $($element + ' > ul').append($tree);
                        } else {

                            if ($data.is_child == 3) {


                                $($element).append('<ul class="iysConceptChild">' + $othersLi + $tree + '</ul>');
                            }
                            else {

                                $($element).append('<ul>' + $othersLi + $tree + '</ul>');
                            }
                        }


                        /* Sorting */
                        if ($opt != 'SEARCH') {

                            var $mixedContent = $('li[id="' + $data.parent_id + '"] > ul > li').find('input[type="checkbox"]').length;
                            if (!$mixedContent) {

                                $('li[id="' + $data.parent_id + '"] > ul > li:not([class=skill-others]').tinysort({order: 'asc'});
                            } else {

                                $('li[id="' + $data.parent_id + '"] > ul > li:not([class=skill-others]').tinysort({order: 'asc', data: 'is_child'});
                            }
                        }
                    }
                }
                /********** End of Appending **********/

                /********** Start of Display rest with searched data **********/
                if ($opt == 'SEARCH') {

                    $($adam + ' li#' + $data.id).show();
                    $($adam + ' li#' + $data.id + ' > ul').show();
                }
                /********** End of Display rest with searched data **********/

                /********** Start of Highlight ScrollTo on Search **********/
                if ($opt == 'SEARCH' && $('input[name=iysSearchMethod]:checked', '#iysSearch').val() != 'template') {

                    $('.skill-count-scroll').scrollTo('#skillcheck-' + $data.id, 200, {offset: {top: -200, bottom: 200}});
                    $('#skillcheck-' + $data.id).closest('li').delay(200).addClass('iys-bar4').delay(2000).queue(function () {
                        $(this).removeClass("iys-bar4").dequeue();
                    });
                }
                /********** End of Highlight ScrollTo on Search **********/
            }

            readymade($data);
        }

        if (obj.options.lock && !obj.options.unlockRating) {

            $('.skillselect').barrating({'readonly': true});
        } else {

            $('.skillselect').barrating('show', {onSelect: $.fn.skillEngine.chart});
        }
    }
})(jQuery);
/* ========================================================================
 * SPLE: Scale Type
 * ========================================================================
 * Copyright 2011-2015 IYS, Pvt. Ltd
 * Licensed under MIT
 * ======================================================================== */

(function ($) {
    $.fn.skillEngine.scaleType = function (type, rate) {

        var scale_type = [{"id": "1", "scale": "Novice:Competent:Proficient:Expert:Master"}, {"id": "2", "scale": "0 - 2 yrs exp:2 - 5 yrs exp:5 - 10 yrs exp:10 - 20 yrs exp: 20 plus yrs exp"}, {"id": "4", "scale": "Fair:Good:Very Good:Excellent:Outstanding"}, {"id": "5", "scale": "1 - 5:6 - 10:11 - 50:51 - 200:&gt;200"}, {"id": "6", "scale": "Low:Medium:High:Very High:Extreme"}, {"id": "7", "scale": "&lt;10:10 - 50:50 - 100:100 - 200:&gt;200"}, {"id": "8", "scale": "&lt; 1 Mn:1 - 2 Mn:2 - 5 Mn:5 - 10 Mn:&gt; 10 Mn"}, {"id": "9", "scale": "Experience in compliance:Experience in making improvements:Experience in driving implementation:Experience in making changes:Experience in conceptualising and strategising"}, {"id": "10", "scale": "Mostly compliance:Made improvements:Led small scale implementation:Led large scale implementation:Conceptualised \/ Strategised"}, {"id": "11", "scale": "Compliance:Improvement:Implementation Team:Implementation Head:Strategy"}, {"id": "12", "scale": "Operational Level:Junior Mgmt:Middle Mgmt:Senior Mgmt:CXO Level"}, {"id": "13", "scale": "Making Improvements:Adding Features:Involved in NPD:Driving NPD:Strategy for NPD"}, {"id": "14", "scale": "&lt; 1 Month:1-3 Months:3-12 Months:1-2 Years:&gt;2 Years"}, {"id": "15", "scale": "Level 1:Level 2:Level 3:Level 4:Level 5"}];
        scale_split = scale_type[type].scale.split(':');
        var scale = '<option value=""></option>';
        $.each(scale_split, function (index, value) {
            if (rate == index + 1) {
                scale += '<option value="' + (index + 1) + '" selected="selected">' + value + '</option>';
            } else {
                scale += '<option value="' + (index + 1) + '">' + value + '</option>';
            }
        });
        return scale;
    }

})(jQuery);
/* ========================================================================
 * SPLE: Fuzzy Approach - Search
 * ========================================================================
 * Copyright 2011-2015 IYS, Pvt. Ltd
 * Licensed under MIT
 * ======================================================================== */

(function ($) {
    $.fn.skillEngine.search = function () {

        obj = $.fn.skillEngine.obj['functionals'];
        function formatItem(item) {

            var treeArr = item.text.replace(/[(:\d_)]+/g, '@@@').split('@@@');
            treeArr = treeArr.slice(1, treeArr.length - 1);
            var skillname = treeArr[0], categories = [], catstr = '';
            if (treeArr.length >= 3) {
                categories = treeArr.slice(treeArr.length - 2);
            } else if (treeArr.length == 2) {
                categories.push(treeArr[1]);
            } else {
            }
            catstr = (categories.length > 0 ? ('<div><smaller>(' + categories.join(' &laquo; ') + ')</smaller></div>') : '');
            return '<div><b>' + skillname + '</b></div>' + catstr;
        }

        function formatNoMatches(term) {

            if ($('input[name=iysSearchMethod]:checked', '#iysSearch').val() != 'template') {

                $captchaModal = "<a class='btn btn-info' data-term='" + term + "' id='iysAddSkillBtn'> Add " + term + ". </a>";
                $captchaModal += '<div class="iys-spe"><div class="modal fade" id="iysVerifyCaptchaModal">';
                $captchaModal += '<div class="modal-dialog modal-md">';
                $captchaModal += '<div class="modal-content">';
                $captchaModal += '<div class="modal-header">';
                $captchaModal += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
                $captchaModal += '<h4 class="modal-title">Add "' + term + '" to my profile</h4>';
                $captchaModal += '</div>';
                $captchaModal += '<div class="modal-body">';
                $captchaModal += '<div class="g-recaptcha" data-sitekey="6LeFDAMTAAAAAO06bx_YKqu35WIvwlGOqHnIpQQP"></div>';
                $captchaModal += '</div>';
                $captchaModal += '<div class="modal-footer">';
//            $captchaModal += '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
                $captchaModal += '<a type="button" class="btn btn-primary" id="iysVerifyCaptchaBtn">add skill</a>';
                $captchaModal += '</div>';
                $captchaModal += '</div><!-- /.modal-content -->';
                $captchaModal += '</div><!-- /.modal-dialog -->';
                $captchaModal += '</div></div>';
                $('#iysAddSkillWrapper').html($captchaModal);
                $.getScript('https://www.google.com/recaptcha/api.js');
                //            $("#select2-drop-mask").click();
            }

            return "No Matches found, wanna add";
        }

        $('.keyword').select2({
            placeholder: "Please Enter Your skill",
            minimumInputLength: 2,
            allowClear: true,
            multiple: false,
            openOnEnter: true,
            quietMillis: 2000,
            ajax: {url: 'https://www.itsyourskills.com/proxy/action',
                dataType: 'json',
                cache: "true",
                data: function (term) {

                    return {
                        term: term,
                        action: $('input[name=iysSearchMethod]:checked', '#iysSearch').val()};
                },
                results: function (data, callback) {
                    var datum = [];
                    $.each(data, function (key, value) {
                        var compressedSkill = value.tree_structure;
                        datum.push({'id': compressedSkill, 'text': value.tree_id_value});
                    });
                    return {results: datum};
                }
            },
            formatResult: formatItem,
            formatSelection: formatItem,
            formatNoMatches: formatNoMatches

        }).on("change", function ($e) {

            obj.options.data = JSON.parse($e.val);
            $.fn.skillEngine.buildTree(obj, 'SEARCH');
        });
        $(document).off('click', '#iysAddSkillBtn');
        $(document).on('click', '#iysAddSkillBtn', function () {
            $('#iysVerifyCaptchaModal').modal('show');
            $(document).off('click', '#iysVerifyCaptchaBtn');
            $(document).on('click', '#iysVerifyCaptchaBtn', function () {
                if ($('#g-recaptcha-response').val() == '') {
                    alert('Please verify the Recaptcha');
                    return false;
                }

                $.ajax({
                    url: 'https://www.itsyourskills.com/proxy/verify-captcha/' + $('#g-recaptcha-response').val(),
                    type: 'POST',
                    async: true,
                    success: function ($da) {
                        if ($da.success) {
                            obj = $.fn.skillEngine.obj['functionals'];
                            $.ajax({
                                url: 'https://www.itsyourskills.com/proxy/action',
                                type: 'POST',
                                data: {'action': 'add', 'term': $('#iysAddSkillBtn').data('term')},
                                success: function ($data) {

                                    $data = JSON.parse($data);
                                    obj.options.data = JSON.parse($data[0].tree_structure);
                                    $.fn.skillEngine.buildTree(obj, 'SEARCH');
                                    $('#iysVerifyCaptchaModal').modal('hide');
                                    $('#iysAddSkillWrapper').html('Enter the required Skill in the Search Box above or Select from the Suggestion Tree below');
                                    $(document).remove('.modal-backdrop');
                                }
                            });
                        }
                        else {
                            $('#iysVerifyCaptchaModal').modal('hide');
                            $('#iysAddSkillWrapper').html('Enter the required Skill in the Search Box above or Select from the Suggestion Tree below');
                            $(document).remove('.modal-backdrop');
                        }
                    }});
            });
        });
    }

})(jQuery);
/* ========================================================================
 * SPLE: Chart Widgets
 * ========================================================================
 * Copyright 2011-2015 IYS, Pvt. Ltd
 * Licensed under MIT
 * ======================================================================== */

(function ($) {

    $.fn.skillEngine.chart = function (value, text) {

        var skillid = $(this).parent().siblings('select.skillselect').data('id');
        $('#skill-chart').addClass('iys-bar-graph');
        $('#skill-chart-text').show();
        if (value != '') {
            $('li#' + skillid).css({'background': '#CCC'});
            $('#skillform-' + skillid + ' input[name="rating"]').val(value);
            $('#skillform-' + skillid + ' input[name="checked"]').val(true);
            $('#skillcheck-' + skillid).prop("checked", true);
            $('#skill-chart').children('div').removeClass('active-bar');
            if ($('div#chart-' + skillid).length) {
                $('div#chart-' + skillid).remove();
            }

            $('#skill-chart').append('<div id="chart-' + skillid + '" data-toggle="tooltip" data-placement="top" data-title="' + $('li#' + skillid).data('value') + '" title="' + $('li#' + skillid).data('value') + ' &raquo; ' + parseInt(value) + '" style="height: ' + ((parseInt(value) + 1) * 20) + '%;" class="iys-chart iys-bar active-bar iys-bar' + (parseInt(value)) + '"></div>');
            $('#skill-chart-text').text($('li#' + skillid).data('value'));
            $('#skill-chart').scrollTo('#chart-' + skillid);
        }
        else {
            $('li#' + skillid).css({'background': ''});
            $('#skillcheck-' + skillid).prop("checked", false);
            $('#skillform-' + skillid + ' input[name="rating"]').val("0");
            $('#skillform-' + skillid + ' input[name="checked"]').val(false);
            $('div#chart-' + skillid).remove();
        }

        $('span#skills-count').text($('input[name="skills[]"]:checkbox:checked').length);

        $('[data-toggle="tooltip"]').tooltip();

        $('div.iys-chart').on('click', function () {

            $('#skill-chart-text').text($(this).data('title'));
        });
    }

})(jQuery);

