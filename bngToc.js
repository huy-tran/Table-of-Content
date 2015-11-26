// BngToc Object
var ToC = {

    init: function(options, elem){
        this.elem = elem; // Store DOM version
        this.$elem = $(elem); // Store jQuery version of

        this.settings = $.extend({}, this.defaults, options); // Plugin's settings

        this.headings = this.fetchHeadings(this.$elem, this.settings.selectors); // Store all headings
        this.frag = this.build(this.headings); // Build container and append headings to list
        this.displayToc(this.frag); // Display TOC
        this.position(this.frag); // Positioning TOC when scroll
        return this;
    },
    defaults: {
        selectors: 'h3,h4,h5,h6',
        subSelectors: 'h4,h5',
        top: null
    },
    fetchHeadings: function(container, selectors) {
        var selectorsArr = container.find(selectors),
            id;

        for (var i = 0, len = selectorsArr.length; i < len; i++) {
            selectorsArr[i].id = 'toc_' + i;
        }
        return selectorsArr;
    },
    build: function(headings) {
        var div = $("<div id='bng-toc'><h3>In This Article</h3></div>"),
            ul = $("<ul></ul>").appendTo(div),
            subArr = this.settings.subSelectors.split(','),
            sub = [],
            dynamicItems = "";

        for (var i = 0, len = subArr.length; i < len; i++){
            sub.push(subArr[i].toUpperCase());
        }

        $.each(headings, function(index, elem) {
            if (sub.indexOf(elem.tagName) >= 0) {
                dynamicItems += "<li class='bng-toc-sub'><a class='smoothScroll' href=#" + elem.id + ">" + $(elem).text() + "</a></li>";
            } else {
                dynamicItems += "<li><a class='smoothScroll' href=#" + elem.id + ">" + $(elem).text() + "</a></li>";
            }
        });

        div.children('ul').append(dynamicItems);
        return div;
    },
    position: function(frag) {
        var self = this, // Since we have callback function, self points to TOC Object
            $toc = $('#bng-toc'),
            fragTop = self.settings.top || self.$elem.offset().top, // Initial position
            blogLength = self.$elem.height();
            
        $toc.css('top', fragTop);

        $(window).on('scroll', function() {
            var scrollTop = $(this).scrollTop(),
                tocHeight = $toc.height();

            if (scrollTop < fragTop) {
                $toc.css({
                    position: 'absolute',
                    top: fragTop
                });
            }
            else if (scrollTop > fragTop && scrollTop < blogLength) {
                $toc.css({
                    position: 'fixed',
                    top: 0,
                    height: tocHeight
                });
            } else {
                $toc.css({
                    position: 'absolute',
                    top: blogLength
                });
            }
        });
    },
    displayToc: function(frag) {
        $('body').append(frag);
    }
};
if (typeof Object.create !== 'function') {
    Object.create = function(obj){
        function F(){};
        F.prototype = obj;
        return new F();
    };
}
//Plugin Pattern
(function($, window, document, undefined){
    $.plugin = function(name, object) {
        $.fn[name] = function(options){
            return this.each(function(){
                if (!$.data(this,name)){
                    $.data(this, name, Object.create(object).init(options, this));
                }
            });
        };
    };
    // Create Plugin name and pass main object
    $.plugin('bngToc', ToC)
})(jQuery, window, document);