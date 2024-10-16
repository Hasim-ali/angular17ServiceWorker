# Angular Project with Material UI and PWA

This project was generated with Angular CLI version 17.3.0.

## Prerequisites

Before you begin, ensure that you have the following installed on your machine:
- Angular CLI: Check your Angular version by running the following command in the terminal:

```bash
 ng v
 ```

 - Node.js: Check your Node version by running:

```bash
 node -v
 ```

## Setup Steps

- Create a New Angular Project.

- Run the following command to create a new Angular project:
```bash
 ng new project-name
```

- Add Angular Material UI

- Once the project is created, navigate into the project folder:
```bash
 cd project-name
```
- Add Angular Material UI to your project using the following command:
```bash
 ng add @angular/material
```
- Add Angular PWA Support

- To add PWA features, run:
```bash
 ng add @angular/pwa
```
- If you encounter any errors, check the compatible version of @angular/pwa by running:
```bash
 npm v @angular/pwa
```

- Install the compatible version if needed.
## Implement Service Worker Logic

- In your app.component.ts or relevant service file, add the following imports:

```typescript 
import { SwPush, SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
```

- In the constructor of your component or service, add the following logic:
```typescript 
constructor(swUpdate: SwUpdate, snackBar: MatSnackBar, swPush: SwPush) {
  // Listen for version updates and show a snack bar to reload
  swUpdate.versionUpdates.subscribe(() => {
    const snack = snackBar.open('New version available', 'Reload');
    snack.onAction().subscribe(() => {
      swUpdate.activateUpdate().then(() => window.location.reload());
    });
  });

  // Listen for when the new version is ready
  swUpdate.versionUpdates
    .pipe(filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'))
    .subscribe(() => {
      const snack = snackBar.open('New version available', 'Reload');
      snack.onAction().subscribe(() => {
        swUpdate.activateUpdate().then(() => window.location.reload());
      });
    });

  // Dynamically reload the page when the new version is ready
  swUpdate.versionUpdates.subscribe((evt) => {
    switch (evt.type) {
      case 'VERSION_DETECTED':
        console.log(`Downloading new app version: ${evt.version.hash}`);
        break;
      case 'VERSION_READY':
        console.log(`Current app version: ${evt.currentVersion.hash}`);
        console.log(`New app version ready for use: ${evt.latestVersion.hash}`);
        swUpdate.activateUpdate().then(() => {
          console.log('Update activated successfully. Reloading the page.');
          document.location.reload();
        });
        break;
      case 'VERSION_INSTALLATION_FAILED':
        console.log(`Failed to install app version '${evt.version.hash}': ${evt.error}`);
        break;
      default:
        // Handle other cases
    }
  });
}
```

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
