/*
 * Copyright (c) 2026 Eclipse Dirigible contributors
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-FileCopyrightText: Eclipse Dirigible contributors
 * SPDX-License-Identifier: EPL-2.0
 */
blimpkit
  .directive('bkVerticalNav', (classNames) => ({
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      condensed: '<?',
      canScroll: '<?',
    },
    controller: [
      '$scope',
      function ($scope) {
        this.isCondensed = () => $scope.condensed;
        $scope.getClasses = () =>
          classNames('fd-vertical-nav', {
            'fd-vertical-nav--condensed': $scope.condensed === true,
            'fd-vertical-nav--overflow': $scope.canScroll === true,
            'fd-scrollbar': $scope.canScroll === true,
          });
      },
    ],
    template: '<div ng-class="getClasses()" ng-transclude></div>',
  }))
  .directive('bkVerticalNavMainSection', () => ({
    restrict: 'E',
    replace: true,
    transclude: true,
    link: (_scope, _element, attrs) => {
      if (!Object.prototype.hasOwnProperty.call(attrs, 'ariaLabel')) console.error('bk-vertical-nav-main-section error: You must set the "aria-label" attribute');
    },
    template: '<nav class="fd-vertical-nav__main-navigation" ng-transclude></nav>',
  }))
  .directive('bkVerticalNavUtilitySection', () => ({
    restrict: 'E',
    replace: true,
    transclude: true,
    link: (_scope, _element, attrs) => {
      if (!Object.prototype.hasOwnProperty.call(attrs, 'ariaLabel')) console.error('bk-vertical-nav-utility-section error: You must set the "aria-label" attribute');
    },
    template: '<nav class="fd-vertical-nav__utility-section" ng-transclude></nav>',
  }))
  .directive('bkListNavigationItem', (classNames) => ({
    restrict: 'E',
    transclude: true,
    replace: true,
    require: ['^^bkVerticalNav', '?^^bkListNavigationItem', '?^^bkListNavigationItemPopover'],
    scope: {
      indicated: '<?',
      expandable: '<?',
      isExpanded: '=?',
    },
    controller: [
      '$scope',
      function ($scope) {
        this.onIndicated = undefined;
        this.onExpanded = undefined;
        this.subitems = [];

        $scope.toggleExpand = () => {
          $scope.$evalAsync(() => {
            $scope.isExpanded = !$scope.isExpanded;
          });
        };
        this.toggleExpand = $scope.toggleExpand;

        this.getIndicated = () => {
          return $scope.indicated;
        };

        this.setIndicated = () => {
          if (this.onIndicated) {
            for (let i = 0; i < this.subitems.length; i++) {
              if (this.subitems[i]()) {
                this.onIndicated(true);
                return;
              }
            }
            this.onIndicated(false);
          }
        };

        this.setFocusable = (focusable) => {
          $scope.$evalAsync(() => {
            $scope.focusable = focusable;
          });
        };

        $scope.$watch('indicated', () => {
          if (this.onIndicated) this.onIndicated($scope.indicated);
          if ($scope.parentItem) {
            $scope.parentItem.setIndicated();
          }
        });

        $scope.$watch('isExpanded', () => {
          if (this.onExpanded) this.onExpanded($scope.isExpanded);
        });
      },
    ],
    link: (scope, element, attrs, controllers) => {
      let isControl = false;
      scope.focusable = true;
      if (controllers[1]) {
        scope.parentItem = controllers[1];
        scope.parentItem.subitems.push(() => scope.indicated);
      }
      if (controllers[2]) {
        isControl = controllers[2].isControl();
        if (isControl) {
          scope.parentItem.setFocusable(false);
        }
      }

      function isDirectChild(target) {
        for (let i = 0; i < element[0].children.length; i++) {
          if (element[0].children[i] === target) {
            return true;
          }
        }
        return false;
      }

      const onClick = (event) => {
        if (element[0] === event.target || isDirectChild(event.target)) {
          if (isControl) {
            scope.parentItem.toggleExpand();
          } else scope.toggleExpand();
        }
      };

      if (!attrs.ngClick && (attrs.isExpanded !== undefined || isControl)) element.on('click', onClick);

      scope.getClasses = () =>
        classNames('fd-list__navigation-item', {
          'fd-list__navigation-item--condensed': controllers[0].isCondensed() === true,
          'fd-list__navigation-item--indicated': scope.indicated === true,
          'fd-list__navigation-item--expandable': scope.expandable === true,
          'is-expanded': scope.isExpanded === true,
        });

      scope.$on('$destroy', () => {
        element.off('click', onClick);
      });
    },
    template: '<li ng-class="getClasses()" tabindex="{{ focusable ? 0 : -1 }}" ng-transclude></li>',
  }))
  .directive('bkListNavigationItemPopover', (classNames) => ({
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      level: '<',
    },
    controller: [
      '$scope',
      function ($scope) {
        this.isControl = () => {
          return $scope.level === 1;
        };
        $scope.getClasses = () =>
          classNames('fd-popover__body', 'fd-popover__body--no-arrow', {
            'fd-list__navigation-item-popover--first-level': $scope.level === 1,
            'fd-list__navigation-item-popover--second-level': $scope.level === 2,
          });
      },
    ],
    template: '<div ng-class="getClasses()" ng-transclude></div>',
  }))
  .directive('bkListNavigationItemText', () => ({
    restrict: 'A',
    link: (_scope, element) => {
      element.addClass('fd-list__navigation-item-text');
    },
  }))
  .directive('bkListNavigationItemText', () => ({
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<span class="fd-list__navigation-item-text" ng-transclude></span>',
  }))
  .directive('bkListNavigationItemIndicator', () => ({
    restrict: 'E',
    replace: true,
    scope: false,
    require: '^bkListNavigationItem',
    link: (_scope, element, attrs, itemCtrl) => {
      if (!attrs.ngIf && !attrs.ngShow && !attrs.ngHide) {
        itemCtrl.onIndicated = (indicated) => {
          if (indicated) {
            element[0].classList.remove('bk-hidden');
          } else {
            element[0].classList.add('bk-hidden');
          }
        };
        itemCtrl.onIndicated(itemCtrl.getIndicated());
      }
    },
    template: '<span class="fd-list__navigation-item-indicator"></span>',
  }))
  .directive('bkListNavigationItemArrow', (classNames) => ({
    restrict: 'E',
    replace: true,
    require: '^bkListNavigationItem',
    scope: {
      isExpanded: '<?',
    },
    link: (scope, _element, attrs, itemCtrl) => {
      if (!Object.prototype.hasOwnProperty.call(attrs, 'ariaLabel')) console.error('bk-list-navigation-item-arrow error: You must set the "aria-label" attribute');
      if (!attrs.isExpanded) {
        itemCtrl.onExpanded = (expanded) => {
          scope.isExpanded = expanded;
        };
      }
      scope.getClasses = () =>
        classNames('fd-list__navigation-item-arrow', {
          'is-expanded': scope.isExpanded === true,
          'sap-icon--navigation-down-arrow': scope.isExpanded === true,
          'sap-icon--navigation-right-arrow': scope.isExpanded !== true,
        });
    },
    template: '<button ng-class="getClasses()" type="button"></button>',
  }))
  .directive('bkListNavigationItemIcon', (classNames) => ({
    restrict: 'E',
    replace: true,
    scope: {
      glyph: '@?',
      svgPath: '@?',
      iconSize: '@?',
    },
    link: (scope) => {
      if (!scope.glyph && !scope.svgPath) {
        console.error('bk-list-navigation-item-icon error: You must provide a glpyh or an svg icon');
      }
      scope.getClasses = () =>
        classNames('fd-list__navigation-item-icon', {
          [scope.glyph]: scope.glyph && !scope.svgPath,
          'bk-icon--svg-lg': scope.iconSize === 'lg',
          'bk-icon--svg sap-icon': scope.svgPath,
        });
    },
    template: '<i role="presentation" ng-class="getClasses()"><ng-include ng-if="svgPath" src="svgPath"></ng-include></i>',
  }))
  .directive('bkListNavigationGroupHeader', () => ({
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<li role="listitem" class="fd-list__group-header fd-vertical-nav__group-header"><span class="fd-list__title" ng-transclude></span></li>',
  }));
