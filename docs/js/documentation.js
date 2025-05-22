const documentation = angular.module('documentation', ['blimpKit']);
documentation.config(($locationProvider) => { $locationProvider.html5Mode({ enabled: true, requireBase: false }) });

// AngularJS filter used in the table pagination
documentation.filter('startFrom', function () {
    return function (input, start) {
        start = +start; // parse to int
        return input.slice(start);
    }
});

// Directive that automatically creates example code
documentation.directive('codeBlock', () => ({
    restrict: 'E',
    transclude: false,
    compile: function (tElement, tAttrs) {
        const pre = document.createElement("pre");
        const code = document.createElement("code");
        code.setAttribute('tabindex', 0);
        if (tAttrs.type === 'js') { // the content is JS code
            code.classList.add('language-js');
            code.textContent = js_beautify(tElement.contents()[0].data);
            tElement.contents()[0].textContent = '';
        } else if (tAttrs.type === 'css') { // the content is CSS code
            code.classList.add('language-css');
            code.textContent = css_beautify(tElement.contents()[0].data);
            tElement.contents()[0].textContent = '';
        } else if (tAttrs.type === 'text-html') { // the content is HTML but in string/encoded form
            code.classList.add('language-html');
            code.textContent = html_beautify(tElement.contents()[0].data);
            tElement.contents()[0].textContent = '';
        } else { // HTML but it allows the HTML to render.
            let htmlAsCode = '';
            for (let key in tElement.contents()) {
                if (tElement.contents()[key].tagName !== 'CODE-BLOCK' && (tElement.contents()[key].nodeType === 1 || tElement.contents()[key].nodeType === 2)) {
                    htmlAsCode += `${tElement.contents()[key].outerHTML}\n`;
                }
            }
            code.classList.add('language-html');
            code.textContent = html_beautify(htmlAsCode).replaceAll('=""', '');
        }
        hljs.highlightElement(code);
        pre.appendChild(code);
        tElement.append(pre);
    },
}));


// Initialize controller
documentation.controller('DocumentationViewController', function ($scope, $location) {
    // Documentation specific stuff
    $scope.version = angular.module('blimpKit').info().version;
    $scope.theme = 'blimpkit-auto';
    $scope.isTheme = (name) => {
        return $scope.theme === name;
    };
    $scope.setTheme = (theme) => {
        $scope.theme = theme;
    };

    $scope.selectedPage = $location.search().component ?? 'introduction';
    $scope.sidenavOpen = false;
    $scope.sidenavToggle = () => {
        $scope.sidenavOpen = !$scope.sidenavOpen;
    };
    $scope.navItems = [
        {
            id: 'introduction',
            label: 'Introduction'
        },
        {
            label: 'Common'
        },
        {
            id: 'icons',
            label: 'Icons'
        },
        {
            id: 'code',
            label: 'Code'
        },
        {
            id: 'focus',
            label: 'Focus'
        },
        {
            id: 'input-rules',
            label: 'Form Input Rules'
        },
        {
            label: 'Components'
        },
        {
            id: 'avatar',
            label: 'Avatar'
        },
        {
            id: 'bar',
            label: 'Bar'
        },
        {
            id: 'breadcrumb',
            label: 'Breadcrumb'
        },
        {
            id: 'busy-indicator',
            label: 'Busy Indicator'
        },
        {
            id: 'button',
            label: 'Button'
        },
        {
            id: 'badge',
            label: 'Badge'
        },
        {
            id: 'card',
            label: 'Card'
        },
        {
            id: 'dialog',
            label: 'Dialog'
        },
        {
            id: 'checkbox',
            label: 'Checkbox'
        },
        {
            id: 'combobox',
            label: 'ComboBox'
        },
        {
            id: 'fieldset',
            label: 'Field Set'
        },
        {
            id: 'input',
            label: 'Inputs'
        },
        {
            id: 'input-group',
            label: 'Input Group'
        },
        {
            id: 'radio',
            label: 'Radio'
        },
        {
            id: 'icon-tab-bar',
            label: 'Icon Tab Bar'
        },
        {
            id: 'link',
            label: 'Link'
        },
        {
            id: 'list',
            label: 'List'
        },
        {
            id: 'loader',
            label: 'Loader'
        },
        {
            id: 'menu',
            label: 'Menu'
        },
        {
            id: 'message-box',
            label: 'Message Box'
        },
        {
            id: 'message-page',
            label: 'Message Page'
        },
        {
            id: 'message-strip',
            label: 'Message Strip'
        },
        {
            id: 'notification',
            label: 'Notification'
        },
        {
            id: 'object-status',
            label: 'Object Status'
        },
        {
            id: 'pagination',
            label: 'Pagination'
        },
        {
            id: 'panel',
            label: 'Panel'
        },
        {
            id: 'popover',
            label: 'Popover'
        },
        {
            id: 'product-switch',
            label: 'Product Switch'
        },
        {
            id: 'progress-indicator',
            label: 'Progress Indicator'
        },
        {
            id: 'scrollbar',
            label: 'Scrollbar'
        },
        {
            id: 'shellbar',
            label: 'Shellbar'
        },
        {
            id: 'switch',
            label: 'Switch'
        },
        {
            id: 'select',
            label: 'Select'
        },
        {
            id: 'table',
            label: 'Table'
        },
        {
            id: 'tile',
            label: 'Tile'
        },
        {
            id: 'title',
            label: 'Title'
        },
        {
            id: 'token',
            label: 'Token'
        },
        {
            id: 'tool-header',
            label: 'Tool Header'
        },
        {
            id: 'toolbar',
            label: 'Toolbar'
        },
        {
            id: 'upload-collection',
            label: 'Upload collection'
        },
        {
            id: 'vertical-navigation',
            label: 'Vertical Navigation'
        },
        {
            id: 'wizard',
            label: 'Wizard'
        },
        {
            label: 'Common CSS'
        },
        {
            id: 'css-box',
            label: 'Box'
        },
        {
            id: 'css-color',
            label: 'Color'
        },
        {
            id: 'css-grid',
            label: 'Grid'
        },
        {
            id: 'css-text',
            label: 'Text'
        },
        {
            id: 'css-borders',
            label: 'Borders'
        },
        {
            id: 'css-pad-mar',
            label: 'Paddings & Margins'
        },
        {
            id: 'css-size',
            label: 'Width & Height'
        },
    ];

    $scope.title = $scope.navItems.find((nav) => nav.id === $scope.selectedPage)?.label;

    $scope.switchPage = (id, label) => {
        $location.search('component', id);
        $scope.title = label;
        $scope.selectedPage = id;
    };

    if (!$scope.title) {
        $scope.switchPage($scope.navItems[0].id, $scope.navItems[0].label);
    }

    $scope.blimpkitArt = `
                     :=.
               ::.  :==-:::
               -=---==-----:     .....   .%* .%*                          ..    .. -=
           .:------------=-     .%#===#* .%*                              *%  :#*. ==  .%-
        .:-----:::::---====-.   .%*   *# .%* .%+ .%+++*%+=++##: -%=++*%+  *%.+%-   #% =#%*+.
      .-----:::::::-----.       .%#++*#= .%* .%+ :%*   *%:  :%+ -%=   =%- *%##%:   #%  =%-
    .----:::..:::----=:         .%*   =%:.%* .%+ :%+   *%.  :%+ -%+   =%- *%- +%-  #%  =%-
   .---::::::::------:.         .##+++#+ .#* .%+ .%=   +%.  :%+ -%**++#=  *%   =#= *%  :##+:
   ---::::::------::.                                           -%-
   :----------==::.                                             -%-
    .:::::::::..
      '':::''                                                                                   
`;
    // End of documentation specific stuff

    $scope.forms = {
        example: {}
    };
    $scope.focusInput = false;
    $scope.inputs = {
        inputModel: ''
    };
    $scope.inputRulesConfig = {
        excluded: ['forbidden', 'words'],
        patterns: ['^[^/]*$'],
    };

    // Button
    $scope.btnToggleState = true;
    $scope.toggle = () => {
        $scope.btnToggleState = !$scope.btnToggleState;
    };

    $scope.segmentedModel = "middle";
    $scope.segmentedClick = (item) => {
        $scope.segmentedModel = item;
    };

    $scope.splitButtonLabel = "Action";
    $scope.splitButtonClick = () => {
        console.log('split action');
    };
    $scope.splitItemClick = (selected) => {
        $scope.splitButtonAction = selected;
    };

    // Checkbox
    $scope.checkboxes = {
        model: true
    };

    // ComboBox
    $scope.comboboxItems = [
        { value: 1, text: 'Apple' },
        { value: 2, text: 'Pineapple' },
        { value: 3, text: 'Banana' },
        { value: 4, text: 'Kiwi' },
        { value: 5, text: 'Strawberry' }
    ];

    $scope.comboboxItemsEach = [
        { value: 1, text: 'The first one' },
        { value: 2, text: 'The second one' },
        { value: 3, text: 'Each term' },
        { value: 4, text: 'Term each' },
    ];

    $scope.comboboxItemsIcons = [
        { value: 1, svg: './logo/blimpkit-symbolic.svg', text: 'Product 1', secondaryText: '1000 EUR' },
        { value: 2, glyph: 'sap-icon--picture', text: 'Product 2', secondaryText: '750 EUR' },
        { value: 3, glyph: 'sap-icon--laptop', text: 'Product 3', secondaryText: '780 EUR' },
        { value: 4, glyph: 'sap-icon--fridge', text: 'Product 4', secondaryText: '40 EUR' }
    ];

    $scope.multiComboboxItems = [
        { value: 1, text: 'Apple' },
        { value: 2, text: 'Pineapple' },
        { value: 3, text: 'Banana' },
        { value: 4, text: 'Kiwi' },
        { value: 5, text: 'Strawberry' }
    ];
    $scope.combobox = {
        modelReadonlyValue: 1,
        selectedModelValue: null,
        selectedModelValues: [],
        onCBChange: function () {
            console.log($scope.combobox.selectedModelValue);
        },
        onMCBChange: function () {
            console.log($scope.combobox.selectedModelValues);
        }
    };
    $scope.dynamicItems = [
        { value: 0, text: 'Default value 0' },
        { value: 1, text: 'Default value 1' },
        { value: 2, text: 'Default value 2' },
        { value: 3, text: 'Default value 3' },
        { value: 4, text: 'Default value 4' },
        { value: 5, text: 'Default value 5' }
    ];
    let lastInputValue = "";
    function isText(keycode) {
        if (keycode >= 48 && keycode <= 90 || keycode >= 96 && keycode <= 111 || keycode >= 186 && keycode <= 222 || [8, 46, 173].includes(keycode)) return true;
        return false;
    }
    $scope.onComboInputChange = function (event) {
        if (isText(event.which)) {
            if (event.originalEvent.target.value === "") {
                $scope.dynamicItems = [
                    { value: 0, text: 'Default value 0' },
                    { value: 1, text: 'Default value 1' },
                    { value: 2, text: 'Default value 2' },
                    { value: 3, text: 'Default value 3' },
                    { value: 4, text: 'Default value 4' },
                    { value: 5, text: 'Default value 5' },
                ];
            } else if (lastInputValue !== event.originalEvent.target.value) {
                // Back-end stuff
                $scope.dynamicItems.length = 0;
                for (let i = 0; i < event.originalEvent.target.value.length; i++) {
                    $scope.dynamicItems.push({ value: i, text: `Dynamic value ${event.originalEvent.target.value} ${i + 1}` });
                }
            }
            lastInputValue = event.originalEvent.target.value;
        }
    };

    // Inputs
    $scope.stepInputValue = 4;

    // Shellbar
    $scope.isSearchFocused = false;
    $scope.focusSearch = () => {
        $scope.isSearchFocused = true;
    };
    $scope.blurSearch = () => {
        $scope.isSearchFocused = false;
    };

    // Switch Input
    $scope.switch = {
        value: true
    };

    // Icon Tab Bar
    $scope.tabs = [...Array(10).keys()].map(i => ({ label: `Tab label ${i + 1}`, id: `tab_${i + 1}` }));
    $scope.isMoreTabsButtonVisible = (tabs) => tabs.some(x => x.isHidden);
    $scope.selectedTab = 'ti1pan';
    $scope.onTabClose = function (tabId) {
        console.log(tabId);
    };
    $scope.switchTab = function (tabId) {
        $scope.selectedTab = tabId;
    };

    // List
    $scope.fdListItem = { checkboxModel: true };

    // Menu
    $scope.menusShown = false;

    // Message Strip
    $scope.dismissStrip = () => {
        alert("Dismissed");
    };

    // Notification
    $scope.warningSelected = false;
    $scope.isUnread = true;
    $scope.setRead = () => {
        $scope.isUnread = false;
    };
    $scope.notificationClick = () => { $scope.warningSelected = !$scope.warningSelected; };

    // Object Status
    $scope.objectStatusIndicator = 8;

    // Pagination
    $scope.tableWithPaginationItems = [];
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.totalItems = 100;
    for (let i = 0; i < $scope.totalItems; i++) {
        $scope.tableWithPaginationItems.push({
            product: `Item ${i + 1}`,
            price: '$' + (Math.random() * 100).toFixed(2),
            amount: Math.floor(Math.random() * 1000)
        });
    }

    // Select
    $scope.selectSelectedValue = 2;
    $scope.selectReadonlyValue = 2;
    $scope.select = {
        s1: 1,
        s2: 2,
        s3: 1,
        s4: 2,
        s5: 1,
        s6: 2,
        s7: 1,
        s8: 2,
        s9: 1,
        s10: 2,
        s11: 1,
        s12: 2
    };

    $scope.onSelectChange = () => {
        console.log($scope.select.s1);
    };

    // Upload collection
    $scope.filesToUpload = [
        { fileName: 'file1', extension: 'txt', selected: false },
        { fileName: 'file2', extension: 'txt', selected: false },
        { fileName: 'file3', extension: 'txt', selected: false }
    ];

    $scope.removeFileToUpload = function (file) {
        let index = $scope.filesToUpload.indexOf(file);
        if (index >= 0)
            $scope.filesToUpload.splice(index, 1);
    };

    // Vertical Navigation
    $scope.isNavCondensed = true;
    $scope.isIndicated = true;

    // Wizard
    $scope.wizard = {
        currentStep: 1,
        completedSteps: 0,
        stepsCount: 4
    };

    $scope.revert = function (completedStepsCount) {
        $scope.wizard.completedSteps = completedStepsCount;
    };

    $scope.gotoNextStep = function () {
        if ($scope.wizard.currentStep > $scope.wizard.completedSteps) {
            $scope.wizard.completedSteps = $scope.wizard.currentStep;
        }

        if ($scope.wizard.currentStep <= $scope.wizard.stepsCount) {
            $scope.gotoStep($scope.wizard.currentStep + 1);
        }
    };

    $scope.gotoPreviousStep = function () {
        if ($scope.wizard.currentStep > 1) {
            $scope.gotoStep($scope.wizard.currentStep - 1);
        }
    };

    $scope.gotoStep = function (step) {
        $scope.wizard.currentStep = step;
    };

    $scope.getIndicatorGlyph = function (step) {
        return step <= $scope.wizard.completedSteps ? 'sap-icon--accept' : undefined;
    };

    $scope.isLastStep = function () {
        return $scope.wizard.currentStep === $scope.wizard.stepsCount;
    };

    $scope.allStepsCompleted = function () {
        return $scope.wizard.completedSteps >= $scope.wizard.stepsCount;
    };

    // Dialog
    $scope.dialogVisible = false;
    $scope.toggleDialog = function () {
        $scope.dialogVisible = !$scope.dialogVisible;
    };
    $scope.dialogText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur semper malesuada mi id
sollicitudin. Curabitur finibus congue mi quis sodales. Morbi at elementum arcu, a viverra
risus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque quam enim, euismod
auctor feugiat sit amet, congue a neque. Nulla facilisi. Aenean nec purus nibh. Praesent arcu
eros, dapibus quis rhoncus vel, semper vitae nisl. Donec velit tellus, dignissim quis dapibus
quis, mollis at nisi. Nam fermentum justo quam, in commodo velit tempus non. Nullam et eleifend
elit, vitae rhoncus turpis. Vivamus maximus eu tortor ut aliquam. Sed fringilla elit ut posuere
auctor. Aliquam non pellentesque quam. Proin finibus erat volutpat, dapibus purus aliquet,
lacinia nunc.

Morbi auctor porttitor dui. Mauris tincidunt pharetra elit, ut fermentum purus placerat vel.
Vivamus tortor risus, consectetur ac turpis non, auctor varius turpis. Praesent sodales neque
sem, eu fringilla lectus ornare a. Etiam cursus posuere elit, a malesuada lacus suscipit nec.
Nulla malesuada tellus feugiat pharetra lobortis. Aliquam erat volutpat.

Aenean at ante tincidunt, dictum elit vitae, scelerisque turpis. Suspendisse pretium blandit
neque porta pellentesque. Vivamus vitae erat dignissim enim hendrerit cursus. Nulla vel libero
venenatis, finibus diam vitae, euismod arcu. Curabitur eu volutpat nisl, sed tristique erat.
Mauris sed dolor lorem. Curabitur urna mauris, posuere a neque ut, porttitor egestas lectus. Sed
quis sodales mauris, sed convallis quam. Nam lorem nulla, elementum vel nisi eu, viverra tempor
turpis. Sed eget massa vel nibh aliquam auctor. Praesent vulputate blandit odio, eget bibendum
metus. Cras eget tempor felis, nec tempor ligula. Praesent tempor ullamcorper sem, quis
tincidunt dolor venenatis eu. In et tincidunt ex, at mollis erat.

Sed posuere leo id ligula lacinia, quis viverra nunc accumsan. Pellentesque tempus, lacus at
auctor ullamcorper, ipsum neque semper odio, vitae facilisis elit nisi vitae lectus. Praesent
placerat tincidunt metus, ut porttitor tellus aliquam et. Sed dignissim erat ac justo mattis
luctus. Sed euismod sem sapien, mollis consequat risus interdum at. Fusce luctus tortor in
blandit pellentesque. Nunc ut dapibus libero. Cras non sem vel eros eleifend porta. Vestibulum
ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nullam lobortis
sodales fringilla. Maecenas varius ultricies iaculis. Aliquam erat volutpat. Nulla sapien dolor,
varius sit amet diam sit amet, consequat ornare justo.

Vestibulum sagittis in dolor non tempus. In quis neque tortor. Vestibulum suscipit in risus at
ullamcorper. Sed dui tellus, lacinia ac tincidunt eget, scelerisque eu risus. Etiam ac mi
tellus. Nunc felis lorem, malesuada vitae faucibus eu, blandit ac dui. Aenean ut ullamcorper
ante. Fusce urna est, dapibus et iaculis facilisis, ultricies et nibh. Nunc ut congue risus.
Integer id tellus purus. Vestibulum non tempor lectus. Nulla finibus augue blandit dui pretium
luctus.`;

    // Message Box
    $scope.messageBoxVisible = false;
    $scope.messageBoxType = '';
    $scope.toggleMessageBox = function () {
        $scope.messageBoxVisible = !$scope.messageBoxVisible;
    };
});