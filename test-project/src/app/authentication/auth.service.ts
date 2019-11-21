import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app'
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { UserData, User } from './user';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { Customer } from './Customer';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Promise } from 'q';



@Injectable({
  providedIn: 'root'
})
export class AuthService {


  user: Observable<User>;
  customer: Observable<Customer>;
  userData: UserData;

  UserLoggedIn;

  constructor(public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private httpService: HttpClient) {

    //// Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {

        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
        } else {
          return of(null)
        }
      })
    )

  }

  userDetails() {
    return this.afAuth.auth.currentUser;
  }

  createAccount(userData: UserData) {

    return this.afAuth.auth
      .createUserWithEmailAndPassword(userData.email, userData.pswrd);

  }

  signInNewUser(userdata: UserData) {

    return this.afAuth.auth
      .signInWithEmailAndPassword(userdata.email, userdata.pswrd)
      .then((credential) => {
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${credential.user.uid}`);


        const data: UserData = {
          uid: credential.user.uid,
          email: credential.user.email,
          pswrd: userdata.pswrd,
          admin: userdata.admin,
          name: userdata.name,
          displayName: userdata.displayName
        }

        console.log(data);

        userRef.set(data, { merge: true });
      });

  }

  signInRegular(email: string, password: string) : any {

    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password);
      // .then((credential) => {
      //   const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${credential.user.uid}`);
      //   return credential.user.uid;
      //   //this.userData = userRef.collection.prototype;

      // });

  }

  //   async sendEmailVerification() {
  //     await this.afAuth.auth.currentUser.sendEmailVerification()
  //     this.router.navigate(['admin/verify-email']);
  // }

  // async sendPasswordResetEmail(passwordResetEmail: string) {
  //   return await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  // }

  googleLogin() {
    const provider = new auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);

  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${credential.user.uid}`);

        const data: UserData = {
          uid: credential.user.uid,
          email: credential.user.email,
          pswrd: "",
          admin: false,
          name: credential.user.displayName,
          displayName: credential.user.displayName,
        }

        console.log(data);

        userRef.set(data, { merge: true });
      })
  }

  checkIfUserIsCustomer(uid: string) {

    this.customer = this.httpService.get<Customer>("https://localhost:5001/api/Customers/" + uid, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    });

    this.customer.subscribe(data => {
      if (this.customer !== null) {
        console.log("all Loaded items  = " + JSON.stringify(data));
        return true;
      }
      return false;
    });

  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.customer = null;
      this.router.navigate(['/']);
    });
  }

}
