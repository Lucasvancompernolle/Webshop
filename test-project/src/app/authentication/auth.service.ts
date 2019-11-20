import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app'
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { IUser } from './user';
import { Observable, of } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { Customer } from './Customer';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<IUser>;
  customer: Observable<Customer>;

  UserLoggedIn;

  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private httpService: HttpClient) {

    //// Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<IUser>(`users/${user.uid}`).valueChanges()
        } else {
          return of(null)
        }
      })
    )
  }

  googleLogin() {
    const provider = new auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user)
      })
  }
  private updateUserData(user) {
    // Sets user data to firestore on login

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data: IUser = {
      uid: user.uid,
      email: user.email,
      name: user.displayName
    }

    

    console.log(data.name + ", " + data.email + data.uid);

    return userRef.set(data, { merge: true });

  }

  checkIfUserIsCustomer(uid: string) {
    this.customer = this.httpService.get<Customer>("https://localhost:5001/api/Customers/" + uid, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    });

    if (this.customer !== null) {
      console.log("all Loaded items  = " + JSON.stringify(this.customer));
      return true;
    }
    return false;

  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.customer = null;
      this.router.navigate(['/']);
    });
  }

}
