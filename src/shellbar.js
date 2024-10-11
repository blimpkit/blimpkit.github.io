/*
 * Copyright (c) 2024 Eclipse Dirigible contributors
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-FileCopyrightText: Eclipse Dirigible contributors
 * SPDX-License-Identifier: EPL-2.0
 */
blimpkit.directive('bkShellbar', (classNames) => {
    /**
     * size: String - Set the horizontal paddings. Possible options are 's', 'm', 'l', 'xl' and 'responsive'.
     */
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
            size: '@?',
        },
        sizes: {
            'xl': 'xl',
            'm': 'm',
            'l': 'l',
            's': 's',
            'responsive': 'responsive-paddings'
        },
        link: function (scope) {
            scope.getClasses = () => classNames('fd-shellbar', {
                [`fd-shellbar--${this.sizes[scope.size]}`]: scope.size && this.sizes[scope.size]
            });
        },
        template: '<div ng-class="getClasses()" style="min-height: var(--fdShellbar_Height);" ng-transclude></div>'
    }
}).directive('bkShellbarGroup', (classNames) => {
    /**
     * position: String - Position of the group. Possible options are 'left', 'center' and 'right'.
     * shrink: boolean - The group will shrink to it's minimum content size if true. If false, it will expand to it's maximum size.
     */
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
            position: '@?',
            shrink: '<?'
        },
        positions: {
            'left': 'product',
            'center': 'center',
            'right': 'actions',
        },
        link: function (scope) {
            scope.getClasses = () => classNames('fd-shellbar__group', {
                [`fd-shellbar__group--${this.positions[scope.position]}`]: scope.position && this.positions[scope.position],
                'fd-shellbar__group--shrink': scope.shrink,
                'fd-shellbar__group--basis-auto': scope.shrink === false,
            })
        },
        template: '<div ng-class="getClasses()" ng-transclude></div>'
    }
}).directive('fdShellbarAction', () => ({
    /**
     * grow: boolean - If the action should grow horizontally.
     */
    restrict: 'A',
    scope: {
        grow: '<?'
    },
    link: function (scope, element) {
        element.addClass('fd-shellbar__action');
        if (scope.grow) element.addClass('fd-shellbar__action--grow');
    },
})).directive('bkShellbarTitle', () => ({
    restrict: 'A',
    link: function (_scope, element) {
        element.addClass('fd-shellbar__title');
    },
})).directive('bkShellbarLogo', () => ({
    restrict: 'A',
    link: function (_scope, element) {
        element.addClass('fd-shellbar__logo');
    },
})).directive('bkShellbarButton', () => ({
    restrict: 'A',
    link: function (_scope, element) {
        element.addClass('fd-shellbar__button');
    },
}));