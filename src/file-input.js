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
blimpkit.directive('bkFileInput', () => ({
  restrict: 'E',
  replace: true,
  transclude: true,
  scope: {
    label: '@?',
    btnAriaLabel: '@?',
    placeholder: '@?',
    state: '@?',
    isReadonly: '<?',
    compact: '<?',
  },
  link: (scope, element) => {
    let transcludedInput;
    scope.files;
    scope.change = () => {
      const files = transcludedInput.files;
      const fileNames = [];

      for (let i = 0; i < files.length; i++) {
        fileNames.push(files[i].name);
      }

      scope.$evalAsync(() => {
        scope.files = fileNames.join(', ');
      });
    };
    scope.$evalAsync(() => {
      const inputs = element.find('input');
      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].getAttribute('type') === 'file') {
          transcludedInput = inputs[i];
          break;
        }
      }
      if (!transcludedInput) {
        throw new Error('bk-file-input must contain a file input');
      }
      transcludedInput.addEventListener('change', scope.change);
    });
    scope.browse = () => {
      transcludedInput.click();
    };
    scope.$on('$destroy', () => {
      transcludedInput.removeEventListener('change', scope.change);
    });
  },
  template: `<div class="fd-file-uploader">
    <div class="fd-file-uploader__container">
        <bk-input title="{{label || 'Select a file'}}" type="text" class="fd-file-uploader__input" compact="compact" state="{{state}}" ng-click="browse()" ng-readonly="isReadonly" autocomplete="off" placeholder="{{placeholder || 'Select a file'}}" ng-value="files"></bk-input>
        <bk-button type="button" label="{{label || 'Browse'}}" aria-label="{{btnAriaLabel || 'Select a file'}}" compact="compact" ng-disabled="isReadonly"></bk-button>
    </div>
    <div class="fd-file-uploader__hidden" aria-live="polite" aria-atomic="true"></div>
    <ng-transclude></ng-transclude>
  </div>`,
}));
