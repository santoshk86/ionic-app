import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EliteApi {

  private baseUrl = 'https://elite-schedule-app-i4-b6133.firebaseio.com';
  private currentTourney: Observable<any> ;
  constructor(public http: HttpClient) {

  }

  getTournaments() {
    return  this.http.get(`${this.baseUrl}/tournaments.json`);
  }

  getTournamentData(tourneyId): Observable<any> {
    this.currentTourney = this.http.get(`${this.baseUrl}/tournaments-data/${tourneyId}.json`);
    return this.currentTourney;
  }

  getCurrentTourney(): Observable<any> {
   return this.currentTourney;

  }
}
