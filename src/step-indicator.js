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
blimpkit.directive('bkStepIndicator', (classNames) => ({
  restrict: 'E',
  replace: true,
  scope: {
    steps: '=',
    currentStep: '<',
    iconOnly: '<?',
    type: '@?',
  },
  link: (scope, element) => {
    const isStepCurrent = (index) => {
      return index + 1 === scope.currentStep;
    };
    const isStepCompleted = (index) => {
      return index + 1 < scope.currentStep;
    };
    const observer = new ResizeObserver((entries) => {
      for (let e = 0; e < entries.length; e++) {
        const isStacked = entries[e].contentRect.width < (scope.iconOnly ? 96 : 160) * scope.steps.length;
        if (isStacked !== scope.isStacked) {
          scope.$evalAsync(() => {
            scope.isStacked = isStacked;
          });
        }
      }
    });
    observer.observe(element[0]);

    scope.getConnectorClasses = (index) =>
      classNames('fd-wizard__connector', {
        'fd-wizard__connector--active': isStepCompleted(index),
      });
    scope.getLabelContainerClasses = (step) =>
      classNames('fd-wizard__label-container', {
        'fd-wizard__label-container--optional': !!step.secondaryLabel,
      });
    scope.getStepClasses = (index) =>
      classNames('fd-wizard__step', {
        'fd-wizard__step--upcoming': index + 1 > scope.currentStep,
        'fd-wizard__step--current': isStepCurrent(index),
        'fd-wizard__step--completed': isStepCompleted(index),
        'fd-wizard__step--no-label': scope.iconOnly === true,
        'fd-wizard__step--stacked': scope.isStacked && (index < scope.currentStep - 2 || index >= scope.currentStep),
      });
    scope.getAriaCurrent = (index) => (isStepCurrent(index) ? 'step' : undefined);
    scope.$on('$destroy', () => {
      observer.disconnect();
    });
  },
  template: `<div class="fd-wizard__navigation bk-steps-indicator" ng-class="type === 'bar' ? 'bk-border--bottom' : 'bk-border'">
      <ul class="fd-wizard__progress-bar fd-wizard__progress-bar--sm">
          <li ng-repeat="step in steps track by $index" ng-class="getStepClasses($index)" ng-attr-data-stacked="isStacked">
              <div class="fd-wizard__step-wrapper">
                  <span class="fd-wizard__step-container" tabindex="0" aria-label="{{ step.label }}" ng-attr-aria-current="{{getAriaCurrent($index)}}">
                      <span class="fd-wizard__step-indicator">{{!step.glyph && !step.svg ? $index + 1 : undefined}}
                          <span ng-if="step.svg" class="fd-wizard__icon bk-icon--svg sap-icon" role="presentation" ng-include="step.svg"></span>
                          <i ng-if="step.glyph" class="fd-wizard__icon {{step.glyph}}" role="presentation"></i>
                      </span>
                      <div ng-class="getLabelContainerClasses(step)">
                          <span class="fd-wizard__label">{{ step.label }}</span>
                          <span ng-if="step.secondaryLabel" class="fd-wizard__optional-text">{{ step.secondaryLabel }}</span>
                      </div>
                  </span>
                  <span ng-if="!$last" ng-class="getConnectorClasses(index)"></span>
              </div>
          </li>
      </ul>
  </div>`,
}));
