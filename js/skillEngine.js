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
        //$('[data-toggle="tooltip"]').tooltip();
        $('body').tooltip({
            selector: '[data-toggle="tooltip"]'
        });
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
    $.fn.skillEngine.events = function (self, object) {

        var $obj = $(object);
        // Handling Others (i.e) Forward
        // =============================
        $obj.on({
            click: function () {

                /* Declaration */
                var $clickedElement = $(this).parent('li');
                var $clickedElementSibilings = $clickedElement.siblings('li');
                var $clickedElementChildren = $clickedElementSibilings.find('li');
                var $clickedElementSibilingsMandatory = $clickedElement.siblings('li[data-is_madatory="1"]');
                var $clickedElementSibilingsOthers = $clickedElement.siblings('li.skill-others');
                var $clickedElementData = $clickedElement.data();
                var $clickedElementObject = self;
                var $elementToLock = $('[data-type="' + $clickedElementObject.options.type + '"] input:hidden[name="checked"][value="true"]').parents('li');

                $clickedElementObject.options.id = $clickedElementData.id;
                $clickedElementObject.selector = 'li#' + $clickedElementData.id;

                /* Toggling */
                $clickedElementSibilings.hide();
                $clickedElementChildren.hide();
                $clickedElementSibilingsMandatory.show();
                $clickedElementSibilingsOthers.show();
                $clickedElementSibilingsOthers.attr('prev-visit', 'li#' + $clickedElementData.id);

                /* Fetch children from remote if not appended already */
                if ($($clickedElementObject.selector).attr('data-appended') == "false" && $.inArray($clickedElementData.is_child, ["1", "2", "4"])) {

                    $.fn.skillEngine.request($clickedElementObject);
                } else {

                    /* Direct descendant only shown > */
                    $($clickedElementObject.selector + ' > ul').children('li:not([class="skill-others"])').show();
                    /* Icon minus while showing the descendant */
                    $($clickedElementObject.selector + ' > a > i').alterClass('iys-*', 'iys-minus');
                }

                /* Lock the selected Skill & its parents */
                $.each($elementToLock, function (index, value) {

                    $(value).siblings('li.skill-others').show();
                    $(value).show();
                    $(value).find(' > a > i').alterClass('iys-*', 'iys-toptree');
                });
            }
        }, 'ul li a');
        // Handling Others (i.e) Back
        // ==========================
        $obj.on({
            click: function () {

                /* Declaration */
                var $clickedElement = $(this).parent('li.skill-others');
                var $clickedElementSibilings = $clickedElement.siblings('li');
                var $clickedElementObject = self;
                var $elementToLock = $('[data-type="' + $clickedElementObject.options.type + '"] input:hidden[name="checked"][value="true"]').parents('li');

                /* Toggling */
                if ($elementToLock.length) {
                    $('[data-type="' + $clickedElementObject.options.type + '"] li.iysTreeLi').hide();
                    $clickedElement.parents('li.iysTreeLi').show();
                }
                else {
                    $clickedElement.find('li.iysTreeLi').hide();
                }

                $clickedElementSibilings.show();
                $($clickedElement.attr('prev-visit') + ' ul').children('li').hide();
                /* Icon */
                $($clickedElement.attr('prev-visit') + ' > a > i').alterClass('iys-*', 'iys-plus');
                $($clickedElement.attr('prev-visit')).find('li:not([class="skill-others"]) > a > i').alterClass('iys-*', 'iys-plus');

                /* Lock the selected Skill & its parents */

                if ($elementToLock.length) {

                    $.each($elementToLock, function (index, value) {

                        $(value).siblings('li[data-is_madatory="1"]').show();
                        $(value).siblings('li.skill-others').show();
                        $(value).show();
                        $(value).find(' > a > i').alterClass('iys-*', 'iys-toptree');
                    });
                }

                /* Hide clicked others */
                $clickedElement.hide();
            }
        }, 'ul li.skill-others a');
        // Handling Search Other
        // =====================
        $obj.on({
            click: function () {

                var $clickedElement = $(this).parent('li.skill-others');
                var $clickedElementSibilings = $clickedElement.siblings('li');
                var $clickedElementChildren = $clickedElementSibilings.find('li.iysTreeLi');
                var $clickedElementParent = $clickedElement.closest('li.iysTreeLi');
                var $clickedElementParentData = $clickedElementParent.data();
                var $clickedElementObject = self;

                $clickedElementObject.options.id = $clickedElementParentData.id;
                $clickedElementObject.selector = 'li#' + $clickedElementParentData.id;

                $.fn.skillEngine.request($clickedElementObject);

                if ($clickedElementSibilings.data("is_child") == 2) {
                    $clickedElementSibilings.show();
                    $clickedElementChildren.show();
                }

                $clickedElement.removeAttr('data-search');
            }
        }, 'ul li[data-search="true"] a');
        // Monitoring the skill check status
        // =================================
        $obj.on({
            click: function () {

                $('#skillform-' + $(this).data('id') + ' input[name="checked"]').val($(this).prop("checked"));
                if ($(this).prop("checked")) {
                    $('li#' + $(this).data('id')).addClass('iys-highlight');
                }
                if (!$(this).prop("checked")) {

                    $('li#' + $(this).data('id')).removeClass('iys-highlight');
                    $('select#skillselect-' + $(this).data('id')).barrating('clear');
                    $('#skillform-' + $(this).data('id') + ' input[name="rating"]').val("0");
                }
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

                    $.fn.skillEngine.request(self);
//                    $(self.selector + ' > a').trigger('click');
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

                $('#skill-top-count').text(top.length);
                $('#skill-bottom-count').text(bottom.length);
            }
        });
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
            $blueprint += '<div class="iys-sh-txt" id="iysAddSkillWrapper" >';
            $blueprint += '<div class="pull-left">';
            $blueprint += '<form id="iysSearch" class="form-inline">';
            $blueprint += 'Search by <label><input type="radio" name="iysSearchMethod" value="search" checked="checked" /> Skills </label>';
            $blueprint += '&nbsp;&nbsp;<label><input type="radio" name="iysSearchMethod" value="template" /> Templates</label>';
            $blueprint += '&nbsp;&nbsp;<span data-toggle="tooltip" data-placement="bottom" data-title="Enter skill and select from the populated suggestions or use the skill tree" title="Enter skill and select from the populated suggestions or use the skill tree" class="label label-info">?</span>';
            $blueprint += '</form>';
            $blueprint += '</div>';
            $blueprint += '</div>';
            $blueprint += '<div class="keyword" style="width:100%;"></div>';
            $blueprint += '</div>';
            $blueprint += '<div class="col-lg-4 col-sm-4 col-sm-4 no-padding pull-right">';
            $blueprint += '<div id="iysAddSkillVerifyWrapper"></div>';
            $blueprint += '<div id="iysSkillChart">';
            $blueprint += '<div class="small"><span id="skills-count" data-count="0">0</span> <span> skill(s) added to your profile</span></div>';
            $blueprint += '<div id="skill-chart"></div>';
            $blueprint += '<div id="skill-chart-text"></div>';
            $blueprint += '</div>';
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
                    $blueprint += '<a><div><span id="skill-top-count">0</span> skills selected above current skill</div></a>';
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

            $blueprint += '<div class="iysInitialSpinner text-center text-info"><i class="fa fa-spinner fa-pulse"></i> &nbsp Please wait... The skills menu is getting ready...</div>';
        }
        $blueprint += '</ul>';
        $blueprint += '</div>';
        if (!obj.options.lock) {
            switch (obj.options.type) {
                case 'functionals':
                    $blueprint += '<div class="iys-fun-end"><p>You have selected <span id="skills-count-functionals">0</span> Functional Skills</p><a><div><span id="skill-bottom-count">0</span> skills selected below current skill</div></a></div>';
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
        $avoidRec = false;
        $(obj.selector + ' div.iysInitialSpinner').remove();
        readymade = function ($data, $parent) {
            if (typeof $parent === "undefined" || $parent === null) {
                $parent = 0;
            }
            for (var i = 0; i < $data.length; i++) {
                if (typeof $data != 'undefined' && typeof $data[i] != 'undefined') {
                    if (typeof $data[i].is_child != 'undefined' && parseInt($data[i].is_child) == 2 && typeof $data[i].concept == 'undefined') {
                        $data[i].concept = 'false';
                    }
                    if (parseInt($data[i].parent_id) == parseInt($parent)) {
                        $tree = treeList($data[i]);
                        readymade($data, parseInt($data[i].id));
                    }
                    else {
                        $tree = treeList($data[i]);
                        // break; // for performance make it break
                    }

                    if (typeof $data[i].is_child != 'undefined' && parseInt($data[i].is_child) == 2) {
                        $data[i].concept = 'true';
                    }

//                    if ($opt != 'SEARCH') {
//                        delete $data[i];
//                    }
                }
            }
        }

        treeList = function ($data) {
            $tree = '';
            /********** Start of Li **********/
            $tree += '<li id="' + $data.id + '" data-value="' + $data.value + '" data-parent_id="' + $data.parent_id + '" data-is_child="' + $data.is_child + '" data-is_madatory="' + $data.is_madatory + '" data-id="' + $data.id + '" ';

            if ($data.is_child == 1 || $data.is_child == 2 || $data.is_child == 4) {

                $tree += 'class="iysTreeLi parent_li" data-appended="false"';
            }
            else {
                $tree += 'class="iysTreeLi" data-scale_type="' + $data.scale_type + '"';
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
                    $tree += '<a class="' + ($data.is_madatory == 1 ? 'text-warning' : '') + '">';
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
                    if ($data.concept == 'false') {
                        self = obj;
                        self.selector = 'li#' + $data.id;
                        self.options.id = $data.id;
                        $.fn.skillEngine.request(self);
                        $avoidRec = true;
                    }
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

                $othersLi = '<li class="skill-others" data-search="true" prev-visit="li#' + $data.id + '"><a><i class="iys-others fa fa-ellipsis-h"></i> Others</a></li>';
            }
            else {
                $othersLi = '<li class="skill-others" style="display:none;" ><a><i class="iys-others fa fa-ellipsis-h"></i> Others</a></li>';
            }

            $element = $adam + ' li#' + $data.parent_id;
            if (!$($adam + ' li#' + $data.id).length) {

                if ($data.parent_id == 0) {

                    if (!$($adam + ' ul#0').has('li.skill-others').length) {

                        $($adam + ' ul#0').append($othersLi);
                    }
                    $($adam + ' ul#0').append($tree);
                    if ($opt != 'SEARCH') {

                        $($adam + ' ul[id="0"] > li:not([class=skill-others])').tinysort({data: 'display_order', order: 'asc'});
                    }
                } else {

                    if ($($element).has('ul li.skill-others').length || $($element).has('ul.iysConceptChild').length) {

                        $($element + ' > ul').append($tree);
                    }

                    else {

                        if ($data.is_child == 3) {

                            $($element).append('<ul class="iysConceptChild">' + $tree + '</ul>');
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

            /********** Start of Display rest skill with searched data **********/
            if ($opt == 'SEARCH') {
                $($adam + ' li#' + $data.id).show();
                $($adam + ' li#' + $data.id + ' > ul').show();
            }
            /********** End of Display rest skill with searched data **********/
            /********** Start of Highlight ScrollTo on Search **********/
            if ($opt == 'SEARCH' && $('input[name=iysSearchMethod]:checked', '#iysSearch').val() != 'template') {
                $('.skill-count-scroll').scrollTo('#skillcheck-' + $data.id, 200, {offset: {top: -200, bottom: 200}});
                $('#skillcheck-' + $data.id).closest('li').delay(200).addClass('iys-highlight').delay(2000).queue(function () {
                    $(this).removeClass("iys-highlight").dequeue();
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

                $captchaModal = '<div class="panel panel-info">';
                $captchaModal += '<div class="panel-heading">Add ' + term + '</div>';
                $captchaModal += '<div class="panel-body text-center">';
                $captchaModal += '<div class="g-recaptcha" data-sitekey="6LeFDAMTAAAAAO06bx_YKqu35WIvwlGOqHnIpQQP"></div>';
                $captchaModal += '<a class="btn btn-success btn-sm pull-left" data-term="' + term + '" id="iysVerifyCaptchaBtn"><i class="fa fa-plus"></i> Add</a>';
                $captchaModal += '<a class="btn btn-danger btn-sm pull-right" id="iysVerifyCaptchaBtnCancel">Cancel</a>';
                $captchaModal += '</div>';
                $captchaModal += '</div>';
                $('#iysAddSkillVerifyWrapper').html($captchaModal);
                $('#iysSkillChart').hide();
                $.getScript('https://www.google.com/recaptcha/api.js');
            }

            return "Add " + term;
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
            formatSelection: function () {
                return '';
            },
            formatNoMatches: formatNoMatches

        }).on("change", function ($e) {

            obj.options.data = JSON.parse($e.val);
            $.fn.skillEngine.buildTree(obj, 'SEARCH');
        });
        $(document).off('click', '#iysVerifyCaptchaBtnCancel');
        $(document).on('click', '#iysVerifyCaptchaBtnCancel', function () {

            $('#iysSkillChart').show();
            $('#iysAddSkillVerifyWrapper').empty();
        });
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
                            data: {'action': 'add', 'term': $('#iysVerifyCaptchaBtn').data('term')},
                            success: function ($data) {

                                $data = JSON.parse($data);
                                obj.options.data = JSON.parse($data[0].tree_structure);
                                $.fn.skillEngine.buildTree(obj, 'SEARCH');
                                $('#iysSkillChart').show();
                                $('#iysAddSkillVerifyWrapper').empty();
                                alert('Added new skill successfully');
                            }
                        });
                    }
                    else {

                        alert('Failed to add new skill');
                    }
                }});
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

            $('li#' + skillid).addClass('iys-highlight');
            $('#skillform-' + skillid + ' input[name="rating"]').val(value);
            $('#skillform-' + skillid + ' input[name="checked"]').val(true);
            $('#skillcheck-' + skillid).prop("checked", true);
            $('#skill-chart').children('div').removeClass('active-bar');

            if ($('div#chart-' + skillid).length) {

                $('div#chart-' + skillid).remove();
            }

            $('#skill-chart').append('<div id="chart-' + skillid + '" data-toggle="tooltip" data-placement="bottom" data-title="' + $('li#' + skillid).data('value') + '" title="' + $('li#' + skillid).data('value') + ' &raquo; ' + parseInt(value) + '" style="height: ' + ((parseInt(value) + 1) * 20) + '%;" class="iys-chart iys-bar active-bar iys-bar' + (parseInt(value)) + '"></div>');
            $('#skill-chart-text').text($('li#' + skillid).data('value'));
            $('#skill-chart').scrollTo('#chart-' + skillid);
        }
        else {

            $('li#' + skillid).removeClass('iys-highlight');
            $('#skillcheck-' + skillid).prop("checked", false);
            $('#skillform-' + skillid + ' input[name="rating"]').val("0");
            $('#skillform-' + skillid + ' input[name="checked"]').val(false);
            $('div#chart-' + skillid).remove();
        }

        $('span#skills-count').text($('input:hidden[name="rating"]').filter(function () {

            return $(this).val() > 0 && $(this).val() < 6;
        }).length);

        $('span#skills-count-functionals').text($('[data-type="functionals"] input:hidden[name="rating"]').filter(function () {

            return $(this).val() > 0 && $(this).val() < 6;
        }).length);

        $('div.iys-chart').on('click', function () {

            $('#skill-chart').children('div').removeClass('active-bar');
            $('#skill-chart-text').text($(this).data('title'));
            $(this).addClass('active-bar');
        });
    }

})(jQuery);

