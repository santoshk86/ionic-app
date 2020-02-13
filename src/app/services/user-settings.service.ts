import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UserSettings {

  constructor(private storage: Storage, private events: Events) { }

  favoriteTeam(team, tournamentId, tournamentName) {
    const item = {
                  team,
                  tournamentId,
                  tournamentName
              };
    this.storage.set(team.id.toString(), JSON.stringify(item));
    this.events.publish('favorites:changed');
    console.log('event published.');
  }

  unfavoriteTeam(team) {
    this.storage.remove(team.id.toString());
    this.events.publish('favorites:changed');
  }

  isfavoriteTeam(teamId: string): Promise<boolean> {
    return this.storage.get(teamId).then(value => value ? true : false);
  }

  getAllFavorites() {
    const results = [];
    this.storage.forEach(data => { results.push(JSON.parse(data)); });
    return results;
  }
}
