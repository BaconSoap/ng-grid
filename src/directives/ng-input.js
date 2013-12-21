ngGridDirectives.directive('ngInput', [function() {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ngModel) {
            // Store the initial cell value so we can reset to it if need be
            var oldCellValue;
            var openingSelect2 = false;
            var dereg = scope.$watch('ngModel', function() {
                oldCellValue = ngModel.$modelValue;
                dereg(); // only run this watch once, we don't want to overwrite our stored value when the input changes
            });
            
            elm.bind('keydown', function(evt) {
                switch (evt.keyCode) {
                    case 37: // Left arrow
                    case 38: // Up arrow
                    case 39: // Right arrow
                    case 40: // Down arrow
                        evt.stopPropagation();
                        break;
                    case 27: // Esc (reset to old value)
                        if (!scope.$$phase) {
                            scope.$apply(function() {
                                ngModel.$setViewValue(oldCellValue);
                                elm.blur();
                            });
                        }
                        break;
                    case 13: // Enter (Leave Field)
                        if(scope.enableCellEditOnFocus && scope.totalFilteredItemsLength() - 1 > scope.row.rowIndex && scope.row.rowIndex > 0  || scope.col.enableCellEdit) {
                            elm.blur();
                        }
                        break;
                }

                return true;
            });

            elm.bind('click', function(evt) {
                evt.stopPropagation();
            }); 

            elm.bind('mousedown', function(evt) {
                evt.stopPropagation();
            }); 

            scope.$on('ngGridEventStartCellEdit', function () {
                //if the element is a select2 directive, make sure that it can be used
                if(elm.select2){
                	//give select2 a tick to initialize
                    setTimeout(function(){
                        elm.select2('focus');
                        var closeSelect2 = function(){
                            setTimeout(function(){
                            	elm.trigger('blur');
                            },1);
                        };
                        //when the select2 blur events fire, trigger a normal blur
                        elm.on('select2-close select2-blur', closeSelect2);
                        setTimeout(function(){
                            openingSelect2=false;
                        }, 1);
                    }, 1);
                    openingSelect2 = true;
                }
                elm.focus();
                elm.select();
            });

            angular.element(elm).bind('blur', function () {
            	if(!openingSelect2) {
                	scope.$emit('ngGridEventEndCellEdit');
            	}
            });
        }
    };
}]);
