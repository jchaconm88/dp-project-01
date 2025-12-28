# AppLayout

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.9.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

https://akveo.github.io/eva-icons/#/

ng g c theme/components/header --project app-layout --style scss --skip-tests=true
ng g c theme/components/login --project app-layout --style scss --skip-tests=true
ng g c theme/components/register --project app-layout --style scss --skip-tests=true
ng g c theme/controls/content-detail --project app-layout --style scss --skip-tests=true
ng g c theme/controls/divider --project app-layout --style scss --skip-tests=true
ng g c theme/controls/content-header --project app-layout --style scss --skip-tests=true
ng g c theme/controls/form-field --project app-layout --style scss --skip-tests=true
ng g c theme/controls/content-form --project app-layout --style scss --skip-tests=true
ng g c pages/home --project app-layout --style scss --skip-tests=true
ng g c pages/system/user --project app-layout --style scss --skip-tests=true
ng g c pages/system/user/user-set --project app-layout --style scss --skip-tests=true
ng g c pages/system/user/user-info --project app-layout --style scss --skip-tests=true
ng g c modules/system/pages/role --project app-layout --style scss --skip-tests=true
ng g c modules/system/pages/role/role-set --project app-layout --style scss --skip-tests=true
ng g c modules/system/pages/role/role-info --project app-layout --style scss --skip-tests=true
ng g c pages/system/role/role-detail --project app-layout --style scss --skip-tests=true
ng g c pages/master/material --project app-layout --style scss --skip-tests=true
ng g c pages/master/material/material-set --project app-layout --style scss --skip-tests=true
ng g c pages/master/material/material-info --project app-layout --style scss --skip-tests=true

ng g s core/services/system --project app-layout --skip-tests=true
ng g s core/services/auth --project app-layout --skip-tests=true
ng g s core/services/role-access --project app-layout --skip-tests=true
ng g s core/services/firebase --project app-layout --skip-tests=true

ng g i core/models/user --type=model
