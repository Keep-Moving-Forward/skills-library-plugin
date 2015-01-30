
(function () {

    var jQuery;
    /******** Load jQuery if not present *********/
    if (window.jQuery === undefined || window.jQuery.fn.jquery !== '2.1.3') {

        var script_tag = document.createElement('script');
        script_tag.setAttribute("type", "text/javascript");
        script_tag.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js");
        if (script_tag.readyState) {

            script_tag.onreadystatechange = function () {

                if (this.readyState == 'complete' || this.readyState == 'loaded') {

                    scriptLoadHandler();
                }
            };
        } else {

            script_tag.onload = scriptLoadHandler;
        }

        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
    } else {

        jQuery = window.jQuery;
        main(jQuery);
    }

    /******** Called once jQuery has loaded ******/
    function scriptLoadHandler() {

        jQuery = window.jQuery.noConflict(true);
        main(jQuery);
    }

    /******** Our main function ********/
    function main($) {

        (function ($) {
            $.fn.skillEngine = function (options) {

                this.options = $.extend({
                    'apikey': this.data('apikey'),
                    'id': (typeof this.data('skill-id') === 'undefined' || this.data('skill-id') == "") ? 0 : this.data('skill-id'),
                    'getSkillJson': function () {
                    }
                }, options);

                $.fn.loadCss();
                $(this.selector).addClass('easy-tree');

                if (typeof options.data === 'undefined' || options.data == "") {

                } else {
                    $(this).append($.fn.buildTreeRecur(options.data));
                }

                $.fn.requestSkill(this);
                $.fn.skillRating();

                $(this).append('<div id="skill-top-count" class="" style="position:fixed; background-color:#444;top: 0px;height: 25px;">No Skills Selected above</div><div id="skill-bottom-count" style="position:fixed; background-color:#444;bottom: 0px;height: 25px; float:right;">No Skills Selected below</div>');
                options.getSkillJson.call(this, $.fn.skillJson());
                var self = this;

                return this.each(function () {

                    var tree = $(this);

                    $(document).on('scroll', function () {

                        var top = $("input[name='skills[]']:above-the-top:checked").each(function (key, value) {

                            return value;
                        });

                        var bottom = $("input[name='skills[]']:below-the-fold:checked").each(function (key, value) {

                            return value;
                        });

                        $('#skill-top-count').text('Skills selected @ top ' + top.length);
                        $('#skill-bottom-count').text('Skills selected @ bottom ' + bottom.length);
                    });

                    $(tree).on('click', 'ul li a', function () {

                        var id = $(this).parent('li')[0].id;
                        self.selector = 'li#' + id;
                        self.options.id = id;

                        $.fn.beautify(self);

                        if ($(self.selector).attr('data-appended') == "false" && ($(self.selector).attr('data-is_child') == 1 || $(self.selector).attr('data-is_child') == 2)) {

                            $.fn.requestSkill(self);
                        }
                    });

                });
            };

            /* Loading the CSS */
            $.fn.loadCss = function () {

                $("<link>", {rel: "stylesheet", type: "text/css", href: "//netdna.bootstrapcdn.com/bootstrap/3.1.0/css/bootstrap.min.css"}).appendTo('head');
                $("<link>", {rel: "stylesheet", type: "text/css", href: "//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css"}).appendTo('head');
                $("<link>", {rel: "stylesheet", type: "text/css", href: "http://api.itsyourskills.com/css/widgets.css"}).appendTo('head');
                $("<link>", {rel: "stylesheet", type: "text/css", href: "http://antenna.io/demo/jquery-bar-rating/examples/css/examples.css"}).appendTo('head');
            }

            /* Beautify the icons */
            $.fn.beautify = function (obj) {

                var $skillList = $(obj.selector);



                var checked = $skillList.find("input:checked").each(function () {

                    return true;
                });

                if (checked.length > 0) {

                    $(obj.selector + ' > i').alterClass('fa-*', 'fa-check');
                }
                else {

                    if ($(obj.selector + ' ul').children(':visible').length > 1 || $(obj.selector + ' ul').length == 0) {

                        $(obj.selector + ' > i').alterClass('fa-*', 'fa-minus');
                    }
                    else {

                        $(obj.selector + ' > i').alterClass('fa-*', 'fa-plus');
                    }

                }

                if ($skillList.children('ul').length < 1) {

                    $skillList.children('ul').show()
                }
                else {

                    if ($skillList.children('ul').is(':hidden')) {

                        $skillList.children('ul').show()
                    }
                    else {

                        if ($skillList.attr('data-appended') == "true") {

                            $skillList.children('ul').hide()
                        }
                        else {

                            $(obj.selector + ' i').addClass(' fa-spin');
                        }
                    }
                }
            }

            /* Request Skills using access token*/
            $.fn.requestSkill = function (obj) {


                $(obj.selector).children('i').addClass('fa-spin');
                $.ajax({
                    url: 'https://iys.p.mashape.com/' + obj.options.id, // The URL to the API. You can get this in the API page of the API you intend to consume
                    type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
                    data: {}, // Additional parameters here
                    datatype: 'json',
                    success: function (data) {

                        $.fn.buildTree(obj, data);
                    },
                    error: function (err) {
                        alert(err);
                    },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("X-Mashape-Authorization", obj.options.apikey); // Enter here your Mashape key
                    }
                });

                $(obj.selector + ' i').removeClass('fa-spin');
            }

            $.fn.buildTreeRecur = function ($data, $parent) {

                if (typeof $parent === "undefined" || $parent === null) {
                    $parent = 0;
                }

                $tree = '<ul>';
                for (var i = 0; i < $data.length; i++) {

                    if ($data[i]['parent_id'] == $parent) {

                        $tree += '<li id="' + $data[i].id + '" data-value="' + $data[i].value + '" data-scale_type="' + $data[i].scale_type + '" data-parent_id="' + $data[i].parent_id + '" data-is_child="' + $data[i].is_child + '" data-id="' + $data[i].id + '" ' + (($data[i].is_child == 1) ? 'data-appended="false"' : 'data-rating=""') + ' >';

                        if ($data[i].is_child == 1) {

                            $tree += '<i class="fa fa-check text-success"></i>';
                            $tree += '<a class="btn">' + $data[i].value + '</a>';
                        }

                        $tree += $.fn.buildTreeRecur($data, $data[i]['id']);

                        if ($data[i].is_child == 0 || $data[i].is_child == 2) {

                            $tree += '<div class="checkbox text-info text-sm">';
                            $tree += '<label>';
                            $tree += '<input type="checkbox" class="skillcheck" name="skills[]" id="skillcheck-' + $data[i].id + '" data-id="' + $data[i].id + '"';

                            if ($data[i].rating != "") {

                                $tree += ' checked="true"';
                            }

                            $tree += '>';
                            $tree += $data[i].value;
                            $tree += '</label>';
                            $tree += '<div class="rating-f">';
                            $tree += '<select class="skillselect"  name="skills-rating[]" id="skillselect-' + $data[i].id + '" data-id="' + $data[i].id + '">';
                            $tree += $.fn.skillScale($data[i].scale_type, $data[i].rating);
                            $tree += '</select>';
                            $tree += '</div>';
                            $tree += '</div>';
                        }

                        $tree += '</li>';
                    }
                }

                $tree += '</ul>';
                return $tree;
            }

            $.fn.buildTree = function (obj, data) {

                $tree = '';

                $.each(data, function (key, value) {

                    if (!$('li#' + value.id).length) {
                        $tree += '<li id="' + value.id + '" data-value="' + value.value + '" data-scale_type="' + value.scale_type + '" data-parent_id="' + value.parent_id + '" data-is_child="' + value.is_child + '" data-id="' + value.id + '"  data-rating="" data-appended="false">';
                        if (value.is_child == 1) {

                            $tree += '<i class="fa fa-plus text-success"></i>';
                            $tree += '<a class="btn">' + value.value + '</a>';
                        }

                        if (value.is_child == 0 || value.is_child == 2) {

                            $tree += '<div class="checkbox text-info text-sm">';
                            $tree += '<label>';
                            $tree += '<input type="checkbox" class="skillcheck" name="skills[]" id="skillcheck-' + value.id + '" data-id="' + value.id + '">' + value.value;
                            $tree += '</label>';
                            $tree += '<div class="rating-f">';
                            $tree += '<select class="skillselect"  name="skills-rating[]" id="skillselect-' + value.id + '" data-id="' + value.id + '">';
                            $tree += $.fn.skillScale(value.scale_type);
                            $tree += '</select>';
                            $tree += '</div>';
                            $tree += '</div>';
                        }

                        $tree += '</li>';
                    }
                });


                $(obj.selector).attr("data-appended", "true");
                if ($(obj.selector).has('ul').length) {

                    $(obj.selector + ' > ul').append($tree);
                } else {

                    $(obj.selector).append('<ul>' + $tree + '</ul>');
                }

            }

            $.fn.skillScale = function (type, rate) {

                var scale_type = [{"id": "1", "scale": "Novice:Competent:Proficient:Expert:Master", "is_active": "1", "create_at": "2014-01-25 11:40:19"}, {"id": "2", "scale": "0 - 2 yrs exp:2 - 5 yrs exp:5 - 10 yrs exp:10 - 20 yrs exp: 20 plus yrs exp", "is_active": "0", "create_at": "2014-01-26 04:22:49"}, {"id": "4", "scale": "Fair:Good:Very Good:Excellent:Outstanding", "is_active": "1", "create_at": "2014-01-27 10:45:22"}, {"id": "5", "scale": "1 - 5:6 - 10:11 - 50:51 - 200:&gt;200", "is_active": "1", "create_at": "2014-01-28 04:28:17"}, {"id": "6", "scale": "Low:Medium:High:Very High:Extreme", "is_active": "1", "create_at": "2014-01-28 04:28:56"}, {"id": "7", "scale": "&lt;10:10 - 50:50 - 100:100 - 200:&gt;200", "is_active": "1", "create_at": "2014-01-28 04:30:31"}, {"id": "8", "scale": "&lt; 1 Mn:1 - 2 Mn:2 - 5 Mn:5 - 10 Mn:&gt; 10 Mn", "is_active": "1", "create_at": "2014-01-28 04:31:26"}, {"id": "9", "scale": "Experience in compliance:Experience in making improvements:Experience in driving implementation:Experience in making changes:Experience in conceptualising and strategising", "is_active": "1", "create_at": "2014-04-14 11:14:17"}, {"id": "10", "scale": "Mostly compliance:Made improvements:Led small scale implementation:Led large scale implementation:Conceptualised \/ Strategised", "is_active": "1", "create_at": "2014-04-14 11:26:27"}, {"id": "11", "scale": "Compliance:Improvement:Implementation Team:Implementation Head:Strategy", "is_active": "1", "create_at": "2014-04-14 11:31:23"}, {"id": "12", "scale": "Operational Level:Junior Mgmt:Middle Mgmt:Senior Mgmt:CXO Level", "is_active": "1", "create_at": "2014-04-14 11:42:24"}, {"id": "13", "scale": "Making Improvements:Adding Features:Involved in NPD:Driving NPD:Strategy for NPD", "is_active": "1", "create_at": "2014-04-14 11:47:21"}, {"id": "14", "scale": "&lt; 1 Month:1-3 Months:3-12 Months:1-2 Years:&gt;2 Years", "is_active": "1", "create_at": "2014-04-14 11:58:06"}, {"id": "15", "scale": "Level 1:Level 2:Level 3:Level 4:Level 5", "is_active": "1", "create_at": "2014-07-14 10:57:21"}];
                scale_split = scale_type[type].scale.split(':');
                var scale = '<option value=""></option>';
                $.each(scale_split, function (index, value) {

                    if (rate == index) {
                        scale += '<option value="' + index + '" selected="selected">' + value + '</option>';

                    } else {

                        scale += '<option value="' + index + '">' + value + '</option>';
                    }
                });
                return scale;
            }

            $.fn.skillJson = function () {

                $skilljson = [];
                $.each($('input[name="skills[]"]:checkbox:checked').parents('li'), function (index, value) {

                    $skilljson.push($(value).data());
                });

                return JSON.stringify($skilljson.reverse());
            }

            $.fn.skillRating = function () {

                $(document).on('ajaxComplete load ready', function () {

                    $('.skillcheck').on('click', function () {

                        $(this).prop("checked", false);
                        $('#skillselect-' + $(this).data('id')).barrating('clear');
                    });
                    $('.skillselect').barrating('show', {
                        onSelect: function (value, text) {

                            var skillid = $(this).parent().siblings('select.skillselect').data('id');
                            $('li#' + skillid).data('rating', value);
                            $('#skillcheck-' + skillid).prop("checked", true);
                        }
                    });
                });
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
                                    //IYS-Custom modification start - Yuva - 29-12-2014
                                    if ($('#jobapplyform').length) {  //Only for job application validation.
                                        $('#jobapplyform').bootstrapValidator('revalidateField', $this.attr('name'));
                                    }
                                    //IYS-Custom modification end
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
        })($);

        $(function () {
            /*Trigger the required plugins*/
            $json = [{"value": "Engineering", "scale_type": 1, "parent_id": 0, "is_child": 1, "id": 2866844, "rating": "", "appended": false}, {"value": "Earthquake Engineering", "scale_type": 1, "parent_id": 2866844, "is_child": 1, "id": 2872022, "rating": "", "appended": false}, {"value": "Earthquake Resistant Constructions", "scale_type": 1, "parent_id": 2872022, "is_child": 1, "id": 2872088, "rating": "", "appended": false}, {"rating": "3", "value": "Limestone & Sandstone Structures", "scale_type": 1, "parent_id": 2872088, "is_child": 0, "id": 2872094, "appended": false}, {"rating": "1", "value": "Prediction of Earthquake Losses", "scale_type": 1, "parent_id": 2872022, "is_child": 0, "id": 2872085, "appended": false}, {"value": "Seismic Design", "scale_type": 1, "parent_id": 2872022, "is_child": 1, "id": 2872076, "rating": "", "appended": false}, {"rating": "2", "value": "Seismic Design Criteria", "scale_type": 1, "parent_id": 2872076, "is_child": 0, "id": 2872079, "appended": false}, {"value": "Seismic Vibration Control Techniques", "scale_type": 1, "parent_id": 2872022, "is_child": 1, "id": 2872049, "rating": "", "appended": false}, {"rating": "3", "value": "Springs-with-Damper Base Isolator", "scale_type": 1, "parent_id": 2872049, "is_child": 0, "id": 2872070, "appended": false}, {"rating": "1", "value": "Friction Pendulum Bearing", "scale_type": 1, "parent_id": 2872049, "is_child": 0, "id": 2872061, "appended": false}, {"rating": "2", "value": "Dry-Stone Walls Control", "scale_type": 1, "parent_id": 2872049, "is_child": 0, "id": 2872052, "appended": false}, {"value": "Earthquake Engineering Research", "scale_type": 1, "parent_id": 2872022, "is_child": 1, "id": 2872040, "rating": "", "appended": false}, {"rating": "3", "value": "Earthquake Simulation", "scale_type": 1, "parent_id": 2872040, "is_child": 0, "id": 2872043, "appended": false}, {"value": "Seismic Structural Analysis", "scale_type": 1, "parent_id": 2872022, "is_child": 1, "id": 2872031, "rating": "", "appended": false}, {"rating": "4", "value": "Experimental Assessment", "scale_type": 1, "parent_id": 2872031, "is_child": 0, "id": 2872034, "appended": false}, {"value": "Mechanical", "scale_type": 1, "parent_id": 2866844, "is_child": 1, "id": 2867276, "rating": "", "appended": false}, {"value": "Design Process / Activities", "scale_type": 1, "parent_id": 2867276, "is_child": 1, "id": 2867355, "rating": "", "appended": false}, {"rating": "1", "value": "Detailing", "scale_type": 1, "parent_id": 2867355, "is_child": 0, "id": 2867358, "appended": false}, {"value": "Piping", "scale_type": 1, "parent_id": 2866844, "is_child": 1, "id": 2867047, "rating": "", "appended": false}, {"value": "Activities", "scale_type": 1, "parent_id": 2867047, "is_child": 1, "id": 2867053, "rating": "", "appended": false}, {"rating": "2", "value": "Conceptual Design Preparation", "scale_type": 1, "parent_id": 2867053, "is_child": 0, "id": 2867054, "appended": false}, {"value": "Arts, Crafts, Sports", "scale_type": 1, "parent_id": 0, "is_child": 1, "id": 2838516, "rating": "", "appended": false}, {"value": "Craftwork", "scale_type": 1, "parent_id": 2838516, "is_child": 1, "id": 2838805, "rating": "", "appended": false}, {"value": "Type of Craftwork", "scale_type": 1, "parent_id": 2838805, "is_child": 1, "id": 2838806, "rating": "", "appended": false}, {"rating": "3", "value": "Toy Making", "scale_type": 1, "parent_id": 2838806, "is_child": 0, "id": 2838820, "appended": false}, {"rating": "4", "value": "Relief Painting", "scale_type": 1, "parent_id": 2838806, "is_child": 0, "id": 2838818, "appended": false}, {"rating": "1", "value": "Canvas Painting", "scale_type": 1, "parent_id": 2838806, "is_child": 0, "id": 2838809, "appended": false}, {"rating": "2", "value": "Art Glass", "scale_type": 1, "parent_id": 2838806, "is_child": 0, "id": 2838807, "appended": false}, {"value": "Performing Arts", "scale_type": 1, "parent_id": 2838516, "is_child": 1, "id": 2838659, "rating": "", "appended": false}, {"value": "Sub Function/ Area / Specialization", "scale_type": 1, "parent_id": 2838659, "is_child": 1, "id": 2838660, "rating": "", "appended": false}, {"value": "Music", "scale_type": 1, "parent_id": 2838660, "is_child": 1, "id": 2838682, "rating": "", "appended": false}, {"value": "Music Software", "scale_type": 1, "parent_id": 2838682, "is_child": 1, "id": 2838764, "rating": "", "appended": false}, {"rating": "3", "value": "Ardour", "scale_type": 1, "parent_id": 2838764, "is_child": 0, "id": 2838769, "appended": false}, {"rating": "4", "value": "Ableton Live", "scale_type": 1, "parent_id": 2838764, "is_child": 0, "id": 2838765, "appended": false}, {"value": "Singing", "scale_type": 1, "parent_id": 2838682, "is_child": 1, "id": 2838683, "rating": "", "appended": false}, {"rating": "1", "value": "Bass", "scale_type": 1, "parent_id": 2838683, "is_child": 0, "id": 2838686, "appended": false}, {"rating": "2", "value": "Alto", "scale_type": 1, "parent_id": 2838683, "is_child": 0, "id": 2838684, "appended": false}, {"value": "Acting", "scale_type": 1, "parent_id": 2838660, "is_child": 1, "id": 2838661, "rating": "", "appended": false}, {"rating": "3", "value": "Theatre", "scale_type": 1, "parent_id": 2838661, "is_child": 0, "id": 2838664, "appended": false}, {"rating": "4", "value": "Movies", "scale_type": 1, "parent_id": 2838661, "is_child": 0, "id": 2838662, "appended": false}, {"value": "Sports & Fitness", "scale_type": 1, "parent_id": 2838516, "is_child": 1, "id": 2838615, "rating": "", "appended": false}, {"value": "Sports Area", "scale_type": 1, "parent_id": 2838615, "is_child": 1, "id": 2838616, "rating": "", "appended": false}, {"rating": "1", "value": "Basketball", "scale_type": 1, "parent_id": 2838616, "is_child": 0, "id": 2838622, "appended": false}, {"rating": "2", "value": "Adventure Sports", "scale_type": 1, "parent_id": 2838616, "is_child": 0, "id": 2838617, "appended": false}, {"value": "Information Technology", "scale_type": 1, "parent_id": 0, "is_child": 1, "id": 2822824, "rating": "", "appended": false}, {"value": "Tools / Technologies /  Environment", "scale_type": 1, "parent_id": 2822824, "is_child": 1, "id": 2833200, "rating": "", "appended": false}, {"value": "Systems Related", "scale_type": 1, "parent_id": 2833200, "is_child": 1, "id": 2835051, "rating": "", "appended": false}, {"value": "Microcontrollers", "scale_type": 1, "parent_id": 2835051, "is_child": 1, "id": 2835078, "rating": "", "appended": false}, {"value": "Category", "scale_type": 1, "parent_id": 2835078, "is_child": 1, "id": 2835079, "rating": "", "appended": false}, {"rating": "3", "value": "64 Bit", "scale_type": 1, "parent_id": 2835079, "is_child": 0, "id": 2835083, "appended": false}, {"rating": "4", "value": "8 Bit", "scale_type": 1, "parent_id": 2835079, "is_child": 0, "id": 2835080, "appended": false}, {"value": "Engineering Design/Drawing Software/Tools", "scale_type": 1, "parent_id": 2833200, "is_child": 1, "id": 2833435, "rating": "", "appended": false}, {"rating": "1", "value": "Staad-Pro", "scale_type": 1, "parent_id": 2833435, "is_child": 0, "id": 2833436, "appended": false}, {"value": "IT Infrastructure Management", "scale_type": 1, "parent_id": 2822824, "is_child": 1, "id": 2830827, "rating": "", "appended": false}, {"value": "IT Service Management (ITSM)", "scale_type": 1, "parent_id": 2830827, "is_child": 1, "id": 2848940, "rating": "", "appended": false}, {"value": " By Service Strategy", "scale_type": 1, "parent_id": 2848940, "is_child": 1, "id": 2892476, "rating": "", "appended": false}, {"rating": "2", "value": "Demand Management", "scale_type": 1, "parent_id": 2892476, "is_child": 0, "id": 2892506, "appended": false}, {"value": "Financial Management for IT Services", "scale_type": 1, "parent_id": 2892476, "is_child": 1, "id": 2892481, "rating": "", "appended": false}, {"value": "Processes", "scale_type": 1, "parent_id": 2892481, "is_child": 1, "id": 2892482, "rating": "", "appended": false}, {"rating": "3", "value": "Budgeting", "scale_type": 1, "parent_id": 2892482, "is_child": 0, "id": 2892483, "appended": false}, {"value": "Software Testing", "scale_type": 1, "parent_id": 2822824, "is_child": 1, "id": 2830714, "rating": "", "appended": false}, {"value": "Testing Methods", "scale_type": 1, "parent_id": 2830714, "is_child": 1, "id": 2894256, "rating": "", "appended": false}, {"value": "Black Box Testing", "scale_type": 1, "parent_id": 2894256, "is_child": 1, "id": 2894635, "rating": "", "appended": false}, {"value": "Testing Design Techniques", "scale_type": 1, "parent_id": 2894635, "is_child": 1, "id": 2894636, "rating": "", "appended": false}, {"rating": "4", "value": "Equivalence Partitioning", "scale_type": 1, "parent_id": 2894636, "is_child": 0, "id": 2894640, "appended": false}, {"value": "White Box Testing", "scale_type": 1, "parent_id": 2894256, "is_child": 1, "id": 2894257, "rating": "", "appended": false}, {"rating": "1", "value": "Path Testing", "scale_type": 1, "parent_id": 2894257, "is_child": 0, "id": 2894262, "appended": false}, {"rating": "2", "value": "Control Flow Testing ", "scale_type": 1, "parent_id": 2894257, "is_child": 0, "id": 2894258, "appended": false}, {"value": "Testing Activities", "scale_type": 1, "parent_id": 2830714, "is_child": 1, "id": 2830715, "rating": "", "appended": false}, {"rating": "3", "value": "Test Environment Creation", "scale_type": 1, "parent_id": 2830715, "is_child": 0, "id": 2830720, "appended": false}, {"rating": "4", "value": "Bug Fix", "scale_type": 1, "parent_id": 2830715, "is_child": 0, "id": 2830716, "appended": false}, {"value": "Custom Software Applications", "scale_type": 1, "parent_id": 2822824, "is_child": 1, "id": 2822825, "rating": "", "appended": false}, {"value": "Application Platform", "scale_type": 1, "parent_id": 2822825, "is_child": 1, "id": 2859961, "rating": "", "appended": false}, {"value": "Java Technologies", "scale_type": 1, "parent_id": 2859961, "is_child": 1, "id": 2862949, "rating": "", "appended": false}, {"value": "JDBC", "scale_type": 1, "parent_id": 2862949, "is_child": 1, "id": 2862951, "rating": "", "appended": false}, {"rating": "1", "value": "Create Tables", "scale_type": 1, "parent_id": 2862951, "is_child": 0, "id": 2862952, "appended": false}, {"rating": "2", "value": "JAXP", "scale_type": 1, "parent_id": 2862949, "is_child": 0, "id": 2862950, "appended": false}, {"value": "Linux Apache MySQL PHP - LAMP", "scale_type": 1, "parent_id": 2859961, "is_child": 1, "id": 2859967, "rating": "", "appended": false}, {"rating": "3", "value": "PHP", "scale_type": 1, "parent_id": 2859967, "is_child": 2, "id": 2866631, "appended": false}, {"value": "Supply Chain Management", "scale_type": 1, "parent_id": 0, "is_child": 1, "id": 65604, "rating": "", "appended": false}, {"value": "Distribution / Network Planning", "scale_type": 1, "parent_id": 65604, "is_child": 1, "id": 2839532, "rating": "", "appended": false}, {"rating": "4", "value": "Stock Planning for DCs / Warehouses", "scale_type": 1, "parent_id": 2839532, "is_child": 0, "id": 2839536, "appended": false}, {"rating": "0", "value": "Network Planning", "scale_type": 1, "parent_id": 2839532, "is_child": 0, "id": 2839534, "appended": false}, {"value": "Tools / Technologies", "scale_type": 1, "parent_id": 65604, "is_child": 1, "id": 65607, "rating": "", "appended": false}, {"rating": "1", "value": "Sql Server", "scale_type": 1, "parent_id": 65607, "is_child": 0, "id": 2814345, "appended": false}, {"rating": "2", "value": "JD Edwards", "scale_type": 1, "parent_id": 65607, "is_child": 0, "id": 2814340, "appended": false}, {"value": "Pharmaceuticals / Biotech / Life Sciences", "scale_type": 1, "parent_id": 0, "is_child": 1, "id": 54477, "rating": "", "appended": false}, {"rating": "3", "value": "Medical Writing", "scale_type": 1, "parent_id": 54477, "is_child": 0, "id": 2837019, "appended": false}, {"value": "Clinical Trial", "scale_type": 1, "parent_id": 54477, "is_child": 1, "id": 2835346, "rating": "", "appended": false}, {"value": "Activities in Clinical Trials", "scale_type": 1, "parent_id": 2835346, "is_child": 1, "id": 2835352, "rating": "", "appended": false}, {"rating": "4", "value": "Informed Consent", "scale_type": 1, "parent_id": 2835352, "is_child": 0, "id": 2835353, "appended": false}, {"value": "Regulations / Best Practices", "scale_type": 1, "parent_id": 54477, "is_child": 1, "id": 54657, "rating": "", "appended": false}, {"value": "Regulatory Bodies", "scale_type": 1, "parent_id": 54657, "is_child": 1, "id": 54658, "rating": "", "appended": false}, {"rating": "1", "value": "US FDA", "scale_type": 1, "parent_id": 54658, "is_child": 0, "id": 54659, "appended": false}, {"value": "Banking, Financial Services, Insurance", "scale_type": 1, "parent_id": 0, "is_child": 1, "id": 53599, "rating": "", "appended": false}, {"value": "Insurance", "scale_type": 1, "parent_id": 53599, "is_child": 1, "id": 2837146, "rating": "", "appended": false}, {"value": "Insurance Instrument", "scale_type": 1, "parent_id": 2837146, "is_child": 1, "id": 2837183, "rating": "", "appended": false}, {"rating": "2", "value": "Workmen Compensation", "scale_type": 1, "parent_id": 2837183, "is_child": 0, "id": 2837196, "appended": false}, {"rating": "3", "value": "Motor", "scale_type": 1, "parent_id": 2837183, "is_child": 0, "id": 2837191, "appended": false}, {"rating": "4", "value": "Commercial", "scale_type": 1, "parent_id": 2837183, "is_child": 0, "id": 2837187, "appended": false}, {"value": "Principles / Concepts / Regulations", "scale_type": 1, "parent_id": 53599, "is_child": 1, "id": 53620, "rating": "", "appended": false}, {"value": "Banking Regulations", "scale_type": 1, "parent_id": 53620, "is_child": 1, "id": 53622, "rating": "", "appended": false}, {"rating": "1", "value": "Frank Dodd", "scale_type": 1, "parent_id": 53622, "is_child": 0, "id": 53815, "appended": false}, {"rating": "2", "value": "Basel II", "scale_type": 1, "parent_id": 53622, "is_child": 0, "id": 53813, "appended": false}, {"value": "General Management", "scale_type": 1, "parent_id": 0, "is_child": 1, "id": 36719, "rating": "", "appended": false}, {"value": "Business Strategy", "scale_type": 1, "parent_id": 36719, "is_child": 1, "id": 2849578, "rating": "", "appended": false}, {"value": "Corporate Portfolio Analysis", "scale_type": 1, "parent_id": 2849578, "is_child": 1, "id": 2849595, "rating": "", "appended": false}, {"rating": "3", "value": "Mckinsey G.E. Business Screen", "scale_type": 1, "parent_id": 2849595, "is_child": 0, "id": 2849599, "appended": false}, {"rating": "4", "value": "Boston Consulting Group (BCG) Matrix", "scale_type": 1, "parent_id": 2849595, "is_child": 0, "id": 2849596, "appended": false}, {"value": "Sales & Marketing", "scale_type": 1, "parent_id": 0, "is_child": 1, "id": 18865, "rating": "", "appended": false}, {"value": "Market Research, Analytics", "scale_type": 1, "parent_id": 18865, "is_child": 1, "id": 2837977, "rating": "", "appended": false}, {"value": "Market Research Domains", "scale_type": 1, "parent_id": 2837977, "is_child": 1, "id": 2837978, "rating": "", "appended": false}, {"rating": "1", "value": "Customer Attitude Study", "scale_type": 1, "parent_id": 2837978, "is_child": 0, "id": 2837984, "appended": false}, {"rating": "2", "value": "Market Intelligence", "scale_type": 1, "parent_id": 2837978, "is_child": 0, "id": 2837982, "appended": false}, {"rating": "3", "value": "Consumer Trends", "scale_type": 1, "parent_id": 2837978, "is_child": 0, "id": 2837980, "appended": false}, {"rating": "4", "value": "Competition Intelligence", "scale_type": 1, "parent_id": 2837978, "is_child": 0, "id": 2837979, "appended": false}, {"value": "Human Resources (HR)", "scale_type": 1, "parent_id": 0, "is_child": 1, "id": 18860, "rating": "", "appended": false}, {"value": "Recruitment", "scale_type": 1, "parent_id": 18860, "is_child": 1, "id": 2847291, "rating": "", "appended": false}, {"value": "Activities Related To", "scale_type": 1, "parent_id": 2847291, "is_child": 1, "id": 2847402, "rating": "", "appended": false}, {"rating": "1", "value": "Requirement Generation", "scale_type": 1, "parent_id": 2847402, "is_child": 0, "id": 2847433, "appended": false}, {"value": "Sourcing Through", "scale_type": 1, "parent_id": 2847402, "is_child": 1, "id": 2847405, "rating": "", "appended": false}, {"rating": "2", "value": "Advertisement campaigns", "scale_type": 1, "parent_id": 2847405, "is_child": 0, "id": 2847406, "appended": false}, {"value": "Accounts, Corporate Finance", "scale_type": 1, "parent_id": 0, "is_child": 1, "id": 18846, "rating": "", "appended": false}, {"value": "Finance & Accounts Administration", "scale_type": 1, "parent_id": 18846, "is_child": 1, "id": 2837720, "rating": "", "appended": false}, {"value": "Book Keeping", "scale_type": 1, "parent_id": 2837720, "is_child": 1, "id": 2857523, "rating": "", "appended": false}, {"rating": "3", "value": "Asset Tracking", "scale_type": 1, "parent_id": 2857523, "is_child": 0, "id": 2857524, "appended": false}, {"value": "Cash Management", "scale_type": 1, "parent_id": 2837720, "is_child": 1, "id": 2857501, "rating": "", "appended": false}, {"rating": "4", "value": "Cash Book Maintenance", "scale_type": 1, "parent_id": 2857501, "is_child": 0, "id": 2857509, "appended": false}, {"value": "Bank Activities", "scale_type": 1, "parent_id": 2837720, "is_child": 1, "id": 2857491, "rating": "", "appended": false}, {"rating": "1", "value": "Bank Guarantees", "scale_type": 1, "parent_id": 2857491, "is_child": 0, "id": 2857492, "appended": false}, {"value": "Cost Accounting", "scale_type": 1, "parent_id": 18846, "is_child": 1, "id": 2837710, "rating": "", "appended": false}, {"rating": "2", "value": "Variance Analysis", "scale_type": 1, "parent_id": 2837710, "is_child": 0, "id": 2857543, "appended": false}, {"rating": "3", "value": "Product Costing", "scale_type": 1, "parent_id": 2837710, "is_child": 0, "id": 2857539, "appended": false}, {"value": "Project Costing", "scale_type": 1, "parent_id": 2837710, "is_child": 1, "id": 2857535, "rating": "", "appended": false}, {"rating": "4", "value": "Expenditures", "scale_type": 1, "parent_id": 2857535, "is_child": 0, "id": 2857536, "appended": false}, {"value": "Principles / Standards / Regulations", "scale_type": 1, "parent_id": 18846, "is_child": 1, "id": 51544, "rating": "", "appended": false}, {"value": "Financial Statements", "scale_type": 1, "parent_id": 51544, "is_child": 1, "id": 51552, "rating": "", "appended": false}, {"rating": "1", "value": "P&L Statement", "scale_type": 1, "parent_id": 51552, "is_child": 0, "id": 51557, "appended": false}, {"rating": "2", "value": "Balance Sheets", "scale_type": 1, "parent_id": 51552, "is_child": 0, "id": 51553, "appended": false}, {"value": "Accounting standards", "scale_type": 1, "parent_id": 51544, "is_child": 1, "id": 51546, "rating": "", "appended": false}, {"rating": "3", "value": "EU GAAP", "scale_type": 1, "parent_id": 51546, "is_child": 0, "id": 51547, "appended": false}, {"value": "Tools / Technologies", "scale_type": 1, "parent_id": 18846, "is_child": 1, "id": 51538, "rating": "", "appended": false}, {"value": "MS Excel", "scale_type": 1, "parent_id": 51538, "is_child": 1, "id": 2843916, "rating": "", "appended": false}, {"rating": "4", "value": "Basic MS Excel", "scale_type": 1, "parent_id": 2843916, "is_child": 0, "id": 2843924, "appended": false}, {"value": "Accounting softwares", "scale_type": 1, "parent_id": 51538, "is_child": 1, "id": 51712, "rating": "", "appended": false}, {"value": "Exactly Gold", "scale_type": 1, "parent_id": 51712, "is_child": 0, "id": 51723, "rating": "", "appended": false}, {"value": "Money Ware", "scale_type": 1, "parent_id": 51712, "is_child": 0, "id": 51722, "rating": "", "appended": false}, {"value": "Pay Plus", "scale_type": 1, "parent_id": 51712, "is_child": 0, "id": 51721, "rating": "", "appended": false}, {"value": "Ace", "scale_type": 1, "parent_id": 51712, "is_child": 0, "id": 51720, "rating": "", "appended": false}, {"value": "Fact", "scale_type": 1, "parent_id": 51712, "is_child": 0, "id": 51719, "rating": "", "appended": false}, {"value": "QuickBooks", "scale_type": 1, "parent_id": 51712, "is_child": 0, "id": 51715, "rating": "", "appended": false}, {"value": "Oracle Financials", "scale_type": 1, "parent_id": 51712, "is_child": 1, "id": 51714, "rating": "", "appended": false}, {"value": "Financials Centralized Solution Set", "scale_type": 1, "parent_id": 51714, "is_child": 0, "id": 2872680, "rating": "", "appended": false}, {"value": "General Ledger", "scale_type": 1, "parent_id": 51714, "is_child": 0, "id": 2872677, "rating": "", "appended": false}, {"value": "Microsoft Dynamics", "scale_type": 1, "parent_id": 51712, "is_child": 0, "id": 51713, "rating": "", "appended": false}];

            $('*[data-href="http://api.itsyourskills.com/widgets"]').skillEngine({
//                data: $json,
                getSkillJson: function (data) {

                    console.log(data)
                }
            });

            $('input[name=submit]').on('click', function () {
                $.fn.skillJson();

            });
        });
    }
})();
