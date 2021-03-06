import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app'
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserData, User } from './user';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { Customer } from '../customer/Customer';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CustomerService } from '../customer/customer.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<User>;

  userData: Observable<UserData>;
  UserLoggedIn = new BehaviorSubject<string>("Login");


  constructor(public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private custService: CustomerService) {
    //// Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          this.UserLoggedIn.next("Logout");
          this.userData = this.afs.doc<UserData>(`users/${user.uid}`).valueChanges();
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
        this.UserLoggedIn.next("Logout");
        console.log(data);
        userRef.set(data, { merge: true });
      });

  }

  signInRegular(email: string, password: string): any {
    this.UserLoggedIn.next("Logout");
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password).then(
        credential => {

          this.custService.checkIfUserIsCustomer(credential.user.uid).subscribe(
            valid => {
              if (valid == null) {
                this.UserLoggedIn.next("Login");
                alert("Not registered yet, redirecting to registration...");
                this.router.navigate(['/register']);
              }
            })

        }
      ).catch(error => {
        this.UserLoggedIn.next("Login");
        alert("Not registered yet, redirecting to registration...");
        this.router.navigate(['/register']);
      })
  }

  async sendEmailVerification() {
    await this.afAuth.auth.currentUser.sendEmailVerification()
    // this.router.navigate(['admin/verify-email']);
  }

  async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }

  googleLogin() {
    const provider = new auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        const userRef: AngularFirestoreDocument<UserData> = this.afs.doc(`users/${credential.user.uid}`);

        this.afs.collection(`users`, ref => ref.where('uid', "==", credential.user.uid)).snapshotChanges().subscribe(res => {
          if (res.length > 0) {


            this.custService.checkIfUserIsCustomer(credential.user.uid).subscribe(
              valid => {
                if (valid == null) {
                  this.UserLoggedIn.next("Login");
                  console.log("User does not exist");
                  alert("Register first");
                  this.afs.collection(`users`, ref => ref.where('uid', "==", credential.user.uid)).doc(credential.user.uid).delete();
                  this.afAuth.auth.currentUser.delete().then(() => this.router.navigate(['/register']));
                }
              })

            const data: UserData = {
              uid: credential.user.uid,
              email: credential.user.email,
              pswrd: undefined,
              admin: false,
              name: credential.user.displayName,
              displayName: credential.user.displayName
            }
            this.UserLoggedIn.next("Logout");
            userRef.set(data, { merge: true });

          }
          else {
            alert("Register first");
            this.UserLoggedIn.next("Login");
            this.afs.collection(`users`, ref => ref.where('uid', "==", credential.user.uid)).doc(credential.user.uid).delete();
            this.afAuth.auth.currentUser.delete().then(() => this.router.navigate(['/register']));
          }
        });
      })
  }



  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.custService.customer = null;
      this.UserLoggedIn.next("Login");
      this.router.navigate(['/']);
    });
  }

}
