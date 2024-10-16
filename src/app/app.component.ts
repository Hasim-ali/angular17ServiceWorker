import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwPush, SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'test';
  constructor(swUpdate: SwUpdate, snackBar: MatSnackBar, swPush: SwPush) {

    // commently check when we load the web site
    swUpdate.versionUpdates.subscribe(() => {
      const snack = snackBar.open('New version available', 'Reload');
      snack.onAction().subscribe(() => {
        swUpdate.activateUpdate().then(() => window.location.reload());
      });
    });

    // commently check when we load the web site and reload the web site when new version is avaliable and ready
    swUpdate.versionUpdates.
      pipe(filter(
        (event): event is VersionReadyEvent => event.type === 'VERSION_READY'
      ))
      .subscribe(() => {
        const snack = snackBar.open('New version available', 'Reload');
        snack.onAction().subscribe(() => {
          swUpdate.activateUpdate().then(() => window.location.reload());
        });
      });

    // commently check when we load the web site and reload the web site when new version is avaliable with dynamically
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
          // console.log("default case running")
      }
    });
  }
}
